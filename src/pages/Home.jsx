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
                .select('*, universities(name), reviews(rating)')
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

            {/* Why SafeRent Section */}
            <section className="bg-white py-20 border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Why Students Trust SafeRent</h2>
                        <p className="text-slate-500 text-lg max-w-2xl mx-auto">We're changing how student housing works in Ibadan, making it safer, cheaper, and faster.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-xl transition-all">
                            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04kM12 20.944a11.955 11.955 0 01-8.618-3.04A12.02 12.02 0 013 9c0 behavior: 'smooth' -5.591 3.824-10.29 9-11.622 5.176 1.332 9 6.03 9 11.622 0 behavior: 'smooth' 1.04-.233 2.008-.682 2.944a11.952 11.952 0 01-6.882 9.506z"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Verified Listings</h3>
                            <p className="text-slate-600">Every property is manually checked by our team. No fake photos or non-existent houses.</p>
                        </div>

                        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-xl transition-all">
                            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2 behavior: 'smooth' m0 2v.466 behavior: 'smooth' m2.52 1.159c.029.01.058.022.087.036 behavior: 'smooth' M12 6c1.657 0 3-.895 3-2s-1.343-2-3-2-3 .895-3 2 1.343 2 3 2 behavior: 'smooth' m0-2V1 behavior: 'smooth' m-2.52 1.159c-.029-.01-.058-.022-.087-.036behavior: 'smooth' "></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 22V12m0 0l-4 4m4-4l4 4m-4-12V2behavior: 'smooth' "></path></svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Zero Agent Fees</h3>
                            <p className="text-slate-600">Stop paying ₦50,000 to "agents" just to see a room. Only pay ₦1,000 to unlock direct landlord contact.</p>
                        </div>

                        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-xl transition-all">
                            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7behavior: 'smooth' m10 0v-2c0-.656-.126-1.283-.356-1.857behavior: 'smooth' M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857behavior: 'smooth' m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Roommate Finder</h3>
                            <p className="text-slate-600">Find other students in your school to split the rent with. Rent a flat and share costs easily.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it Works Section */}
            <section className="bg-slate-50 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">How to Get Started</h2>
                        <p className="text-slate-500 text-lg">Four simple steps to your next campus home.</p>
                    </div>

                    <div className="relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2"></div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                            {[
                                { step: "1", title: "Search", desc: "Filter by your university and budget." },
                                { step: "2", title: "Preview", desc: "Check photos, ratings, and amenities." },
                                { step: "3", title: "Unlock", desc: "Pay a tiny ₦1,000 fee to see the landlord number." },
                                { step: "4", title: "Connect", desc: "Call the landlord and book your room!" }
                            ].map((item, idx) => (
                                <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center">
                                    <div className="w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-6 shadow-lg shadow-orange-500/20">
                                        {item.step}
                                    </div>
                                    <h4 className="font-bold text-slate-900 mb-2">{item.title}</h4>
                                    <p className="text-sm text-slate-500">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Listings Section */}
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
                        {listings.map((listing) => {
                            const avgRating = listing.reviews?.length > 0
                                ? (listing.reviews.reduce((acc, r) => acc + r.rating, 0) / listing.reviews.length).toFixed(1)
                                : null;

                            return (
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
                                    rating={avgRating}
                                    reviewCount={listing.reviews?.length || 0}
                                    onUnlock={handleUnlockClick}
                                    onSave={handleSaveClick}
                                />
                            );
                        })}
                    </div>
                )}
            </main>

            {
                selectedPropertyForPayment && (
                    <PaymentModal
                        propertyId={selectedPropertyForPayment}
                        amount={1000}
                        onClose={() => setSelectedPropertyForPayment(null)}
                        onSuccess={handlePaymentSuccess}
                    />
                )
            }
        </div >
    );
};

export default Home;
