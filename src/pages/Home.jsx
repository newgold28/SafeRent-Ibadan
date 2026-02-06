import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import PropertyCard from '../components/PropertyCard';
import PaymentModal from '../components/PaymentModal';

const Home = () => {
    const { user } = useAuth();
    const [listings, setListings] = useState([]);
    const [unlockedListings, setUnlockedListings] = useState([]);
    const [savedListings, setSavedListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPropertyForPayment, setSelectedPropertyForPayment] = useState(null);
    const [universities, setUniversities] = useState([]);

    // Filters
    const [selectedUniversity, setSelectedUniversity] = useState('All');
    const [priceRange, setPriceRange] = useState('All');
    const [category, setCategory] = useState('All');
    const [bedrooms, setBedrooms] = useState('All'); // Roommate Matching

    const fetchUniversities = async () => {
        const { data } = await supabase.from('universities').select('*');
        if (data) setUniversities(data);
    };

    const fetchUserData = async () => {
        if (!user) {
            setUnlockedListings([]);
            setSavedListings([]);
            return;
        }

        // Unlocked
        const { data: unlockedData } = await supabase.from('unlocked_listings').select('property_id').eq('user_id', user.id);
        if (unlockedData) setUnlockedListings(unlockedData.map(i => i.property_id));

        // Saved
        const { data: savedData } = await supabase.from('saved_properties').select('property_id').eq('user_id', user.id);
        if (savedData) setSavedListings(savedData.map(i => i.property_id));
    };

    const fetchListings = async () => {
        try {
            setLoading(true);
            let query = supabase
                .from('properties')
                .select('*, universities(name)')
                .eq('status', 'approved') // Only approved
                .order('is_featured', { ascending: false })
                .order('created_at', { ascending: false });

            // Apply University Filter
            if (selectedUniversity !== 'All') {
                query = query.eq('university_id', selectedUniversity);
            }

            // Apply Category Filter
            if (category !== 'All') {
                query = query.eq('category', category);
            }

            // Apply Bedrooms Filter
            if (bedrooms !== 'All') {
                query = query.eq('bedrooms', parseInt(bedrooms));
            }

            // Apply Price Filter (Client-side filtering is easier for ranges unless using RPC)
            // We will fetch and then filter JS side for simplicity in MVP

            const { data, error } = await query;
            if (error) throw error;

            // JS Filter for Price
            let filteredData = data || [];
            if (priceRange !== 'All') {
                const [min, max] = priceRange.split('-').map(Number);
                filteredData = filteredData.filter(item => {
                    if (max) return item.price >= min && item.price <= max;
                    return item.price >= min; // 500000+ case
                });
            }

            setListings(filteredData);
        } catch (err) {
            console.error('Error fetching listings:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUniversities();
    }, []);

    useEffect(() => {
        fetchListings();
    }, [selectedUniversity, category, priceRange, bedrooms]);

    useEffect(() => {
        fetchUserData();
    }, [user]);

    const handleUnlockClick = (propertyId) => {
        setSelectedPropertyForPayment(propertyId);
    };

    const handleSaveClick = async (propertyId) => {
        if (!user) return alert("Please login to save properties.");

        if (savedListings.includes(propertyId)) {
            // Unsave
            await supabase.from('saved_properties').delete().eq('user_id', user.id).eq('property_id', propertyId);
            setSavedListings(savedListings.filter(id => id !== propertyId));
        } else {
            // Save
            await supabase.from('saved_properties').insert([{ user_id: user.id, property_id: propertyId }]);
            setSavedListings([...savedListings, propertyId]);
        }
    };

    const handlePaymentSuccess = () => {
        fetchUserData();
        alert("Listing Unlocked! Contact details are now visible.");
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <Hero />

            <main id="listings" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                {/* Search & Filters */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm mb-12">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">Find your perfect place</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* University */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">University / Area</label>
                            <select
                                value={selectedUniversity}
                                onChange={(e) => setSelectedUniversity(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 bg-white"
                            >
                                <option value="All">All Universities (Ibadan)</option>
                                {universities.map(uni => (
                                    <option key={uni.id} value={uni.id}>{uni.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Price Range */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">My Budget (Yearly)</label>
                            <select
                                value={priceRange}
                                onChange={(e) => setPriceRange(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 bg-white"
                            >
                                <option value="All">Any Price</option>
                                <option value="0-100000">Under ₦100k</option>
                                <option value="100000-300000">₦100k - ₦300k</option>
                                <option value="300000-500000">₦300k - ₦500k</option>
                                <option value="500000">Above ₦500k</option>
                            </select>
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 bg-white"
                            >
                                <option value="All">Any Type</option>
                                <option value="Hostel">Hostel</option>
                                <option value="Self Con">Self Con</option>
                                <option value="Flat">Flat</option>
                            </select>
                        </div>

                        {/* Roommate Matching (Bedrooms) */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Rooms (Matching)</label>
                            <select
                                value={bedrooms}
                                onChange={(e) => setBedrooms(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 bg-white"
                            >
                                <option value="All">Any Size</option>
                                <option value="1">1 Bedroom (Solo)</option>
                                <option value="2">2 Bedrooms (Shared)</option>
                                <option value="3">3 Bedrooms (Group)</option>
                                <option value="4">4+ Bedrooms</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Results */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                    </div>
                ) : listings.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
                        <p className="text-xl font-medium text-slate-900 mb-2">No results found.</p>
                        <p className="text-slate-500">Try adjusting your filters.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {listings.map((listing) => (
                            <PropertyCard
                                key={listing.id}
                                id={listing.id}
                                title={listing.title}
                                price={listing.price}
                                location={listing.location}
                                image={listing.image_url}
                                type={listing.category}
                                landlord_phone={listing.landlord_phone}
                                isUnlocked={unlockedListings.includes(listing.id) || (user && user.id === listing.owner_id)}
                                isSaved={savedListings.includes(listing.id)}
                                is_featured={listing.is_featured}
                                onUnlock={handleUnlockClick}
                                onSave={handleSaveClick}
                            />
                        ))}
                    </div>
                )}
            </main>

            {selectedPropertyForPayment && (
                <PaymentModal
                    propertyId={selectedPropertyForPayment}
                    amount={1000}
                    onClose={() => setSelectedPropertyForPayment(null)}
                    onSuccess={handlePaymentSuccess}
                />
            )}
        </div>
    );
};

export default Home;
