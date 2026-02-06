import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import PropertyCard from '../components/PropertyCard'; // Use PropertyCard

const StudentDashboard = () => {
    const { user } = useAuth();
    const [unlockedListings, setUnlockedListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUnlocked = async () => {
            if (!user) return;
            // Join unlocked_listings with properties
            const { data, error } = await supabase
                .from('unlocked_listings')
                .select(`
                    property_id,
                    properties (*)
                `)
                .eq('user_id', user.id);

            if (data) {
                // Flatten the structure
                setUnlockedListings(data.map(item => item.properties));
            }
            setLoading(false);
        };
        fetchUnlocked();
    }, [user]);

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <h1 className="text-3xl font-bold text-slate-900 mb-8">My Unlocked Contacts</h1>

                {loading ? (
                    <div className="text-center">Loading...</div>
                ) : unlockedListings.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
                        <p className="text-slate-500 text-lg">You haven't paid for any contacts yet.</p>
                        <a href="/" className="text-orange-600 hover:underline mt-2 inline-block">Find a hostel to unlock</a>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {unlockedListings.map(listing => (
                            <PropertyCard
                                key={listing.id}
                                {...listing}
                                image={listing.image_url}
                                type={listing.category}
                                isUnlocked={true} // Always unlocked here
                                onUnlock={() => { }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
