import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ListingCard from '../components/ListingCard';
import PaymentModal from '../components/PaymentModal';

const Home = () => {
    const { user } = useAuth();
    const [listings, setListings] = useState([]);
    const [unlockedListings, setUnlockedListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPropertyForPayment, setSelectedPropertyForPayment] = useState(null);
    const [universities, setUniversities] = useState([]);
    const [selectedUniversity, setSelectedUniversity] = useState('All');

    const fetchUniversities = async () => {
        const { data } = await supabase.from('universities').select('*');
        if (data) setUniversities(data);
    };

    const fetchListings = async () => {
        try {
            setLoading(true);
            let query = supabase
                .from('properties')
                .select('*, universities(name)') // Join with university name
                .order('created_at', { ascending: false });

            if (selectedUniversity !== 'All') {
                query = query.eq('university_id', selectedUniversity);
            }

            const { data, error } = await query;

            if (error) throw error;
            setListings(data || []);
        } catch (err) {
            console.error('Error fetching listings:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchUnlockedStatus = async () => {
        if (!user) {
            setUnlockedListings([]);
            return;
        }
        try {
            const { data, error } = await supabase
                .from('unlocked_listings')
                .select('property_id')
                .eq('user_id', user.id);

            if (error) throw error;
            setUnlockedListings(data.map(item => item.property_id));
        } catch (err) {
            console.error("Error fetching unlocked status:", err);
        }
    };

    useEffect(() => {
        fetchUniversities();
    }, []);

    useEffect(() => {
        fetchListings();
    }, [selectedUniversity]); // Re-fetch when filter changes

    useEffect(() => {
        fetchUnlockedStatus();
    }, [user]);

    const handleUnlockClick = (propertyId) => {
        setSelectedPropertyForPayment(propertyId);
    };

    const handlePaymentSuccess = () => {
        fetchUnlockedStatus(); // Refresh status
        alert("Listing Unlocked! Contact details are now visible.");
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <Hero />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Featured Hostels</h2>
                        <p className="text-slate-500 mt-1">Top-rated student accommodation for you</p>
                    </div>

                    <div className="w-full md:w-auto">
                        <select
                            value={selectedUniversity}
                            onChange={(e) => setSelectedUniversity(e.target.value)}
                            className="w-full md:w-64 px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white shadow-sm"
                        >
                            <option value="All">All Universities (Ibadan)</option>
                            {universities.map(uni => (
                                <option key={uni.id} value={uni.id}>{uni.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                    </div>
                ) : listings.length === 0 ? (
                    <div className="text-center py-20 text-slate-500">
                        <p className="text-lg mb-2">No listings found for this university.</p>
                        {user ? (
                            <a href="/create-listing" className="text-orange-600 font-bold hover:underline">List a property here!</a>
                        ) : (
                            <p>Be the first to list a property!</p>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {listings.map((listing) => (
                            <ListingCard
                                key={listing.id}
                                id={listing.id}
                                title={listing.title}
                                price={listing.price}
                                location={listing.location}
                                image={listing.image_url}
                                type={listing.category}
                                landlord_phone={listing.landlord_phone}
                                isUnlocked={unlockedListings.includes(listing.id) || (user && user.id === listing.owner_id)}
                                onUnlock={handleUnlockClick}
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
