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

            {/* Features Section */}
            <section className="py-16 bg-white border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-extrabold text-slate-900">Why Students Trust SafeRent</h2>
                        <p className="mt-4 text-lg text-slate-500">We verify every landlord so you don't get scammed.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow">
                            <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-6">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Verified Listings</h3>
                            <p className="text-slate-500 leading-relaxed">Every property is personally checked by our admin team before it goes live on the platform.</p>
                        </div>
                        <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow">
                            <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-6">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">No Agent Fees</h3>
                            <p className="text-slate-500 leading-relaxed">Connect directly with landlords. Save the big commission fees (Agency & Legal) usually charged by agents.</p>
                        </div>
                        <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow">
                            <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-6">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Near Your Campus</h3>
                            <p className="text-slate-500 leading-relaxed">Filter homes by your university (UI, Poly, Lead City, etc.) to find the closest options.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 bg-slate-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-extrabold text-white">How It Works</h2>
                        <p className="mt-4 text-emerald-400 font-medium text-lg">Get your key in 3 simple steps</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-8 left-1/6 right-1/6 h-0.5 bg-slate-700 -z-10"></div>

                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg shadow-emerald-500/50 text-white">1</div>
                            <h3 className="text-xl font-bold mb-3">Search</h3>
                            <p className="text-slate-400 leading-relaxed px-4">Select your university and browse verified photos, prices, and amenities.</p>
                        </div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg shadow-emerald-500/50 text-white">2</div>
                            <h3 className="text-xl font-bold mb-3">Unlock</h3>
                            <p className="text-slate-400 leading-relaxed px-4">Pay a tiny fee (₦1,000) to get the landlord's direct phone number instantly.</p>
                        </div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg shadow-emerald-500/50 text-white">3</div>
                            <h3 className="text-xl font-bold mb-3">Move In</h3>
                            <p className="text-slate-400 leading-relaxed px-4">Call the landlord, inspect the place, pay securely, and move in!</p>
                        </div>
                    </div>
                </div>
            </section>

            <main id="listings" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4 border-b border-slate-200 pb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900">Available Hostels</h2>
                        <p className="text-slate-500 mt-2 text-lg">Top-rated student accommodation for you</p>
                    </div>

                    <div className="w-full md:w-auto">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Filter by School</label>
                        <select
                            value={selectedUniversity}
                            onChange={(e) => setSelectedUniversity(e.target.value)}
                            className="w-full md:w-72 px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white shadow-sm font-medium"
                        >
                            <option value="All">All Universities (Ibadan)</option>
                            {universities.map(uni => (
                                <option key={uni.id} value={uni.id}>{uni.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-32">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
                    </div>
                ) : listings.length === 0 ? (
                    <div className="text-center py-32 bg-white rounded-3xl border border-slate-100 shadow-sm">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                        </div>
                        <p className="text-xl font-medium text-slate-900 mb-2">No listings found for this university.</p>
                        <p className="text-slate-500 mb-6">Be the first to list a property here!</p>
                        {user ? (
                            <a href="/create-listing" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-500/30 transition-all">
                                List a property
                            </a>
                        ) : (
                            <a href="/signup" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-500/30 transition-all">
                                Join to List
                            </a>
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
