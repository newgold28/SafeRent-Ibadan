import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import PropertyCard from '../components/PropertyCard';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [unlockedListings, setUnlockedListings] = useState([]);
    const [savedListings, setSavedListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('unlocked');

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;

            // Fetch Unlocked
            const { data: unlocked } = await supabase
                .from('unlocked_listings')
                .select(`property_id, properties (*)`)
                .eq('user_id', user.id);

            let unlockedIds = [];
            if (unlocked) {
                setUnlockedListings(unlocked.map(i => i.properties));
                unlockedIds = unlocked.map(i => i.property_id);
            }

            // Fetch Saved
            const { data: saved } = await supabase
                .from('saved_properties')
                .select(`property_id, properties (*)`)
                .eq('user_id', user.id);

            if (saved) setSavedListings(saved.map(i => i.properties));

            setLoading(false);
        };
        fetchData();
    }, [user, activeTab]);

    // Helper to check if a property is unlocked
    const isPropertyUnlocked = (id) => {
        return unlockedListings.some(u => u.id === id);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold text-slate-900 mb-8">My Dashboard</h1>

                {/* Tabs */}
                <div className="flex space-x-4 mb-8 border-b border-slate-200">
                    <button
                        onClick={() => setActiveTab('unlocked')}
                        className={`pb-4 px-2 font-medium text-lg ${activeTab === 'unlocked' ? 'border-b-2 border-orange-600 text-orange-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Unlocked Contacts ({unlockedListings.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('saved')}
                        className={`pb-4 px-2 font-medium text-lg ${activeTab === 'saved' ? 'border-b-2 border-orange-600 text-orange-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Saved Hostels ({savedListings.length})
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-20">Loading...</div>
                ) : (
                    <div>
                        {activeTab === 'unlocked' ? (
                            unlockedListings.length === 0 ? (
                                <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
                                    <p className="text-slate-500 text-lg">No unlocked contacts yet.</p>
                                    <a href="/" className="text-orange-600 hover:underline mt-2 inline-block">Find a hostel</a>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {unlockedListings.map(listing => (
                                        <PropertyCard
                                            key={listing.id}
                                            {...listing}
                                            image={listing.image_url}
                                            type={listing.category}
                                            isUnlocked={true}
                                            onUnlock={() => { }}
                                        />
                                    ))}
                                </div>
                            )
                        ) : (
                            savedListings.length === 0 ? (
                                <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
                                    <p className="text-slate-500 text-lg">No saved hostels yet.</p>
                                    <a href="/" className="text-orange-600 hover:underline mt-2 inline-block">Browse listings</a>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {savedListings.map(listing => (
                                        <PropertyCard
                                            key={listing.id}
                                            {...listing}
                                            image={listing.image_url}
                                            type={listing.category}
                                            isUnlocked={isPropertyUnlocked(listing.id)}
                                            onUnlock={(id) => window.location.href = `/property/${id}`}
                                            isSaved={true}
                                            onSave={null}
                                        />
                                    ))}
                                </div>
                            )
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
