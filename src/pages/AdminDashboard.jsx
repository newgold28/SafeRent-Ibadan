import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import Navbar from '../components/Navbar';

const AdminDashboard = () => {
    const [pendingListings, setPendingListings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPendingListings = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('properties')
                .select('*')
                .eq('status', 'pending')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setPendingListings(data || []);
        } catch (err) {
            console.error('Error fetching pending listings:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingListings();
    }, []);

    const handleAction = async (id, action) => {
        try {
            if (action === 'approve') {
                const { error } = await supabase
                    .from('properties')
                    .update({ status: 'approved', verified: true })
                    .eq('id', id);
                if (error) throw error;
                alert("Listing Approved!");
            } else if (action === 'reject') {
                const { error } = await supabase
                    .from('properties')
                    .update({ status: 'rejected' }) // Or .delete() if you prefer strict cleanup
                    .eq('id', id);
                if (error) throw error;
                alert("Listing Rejected.");
            }
            fetchPendingListings();
        } catch (err) {
            alert("Error: " + err.message);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <h1 className="text-3xl font-bold text-slate-900 mb-8">Admin Dashboard - Pending Verifications</h1>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                    </div>
                ) : pendingListings.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
                        <p className="text-slate-500 text-lg">No pending listings. Good job!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {pendingListings.map((listing) => (
                            <div key={listing.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col md:flex-row">
                                <div className="w-full md:w-1/3 h-48 md:h-auto relative">
                                    <img src={listing.image_url} alt={listing.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="p-6 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900">{listing.title}</h3>
                                        <p className="text-slate-500 text-sm mb-2">{listing.location}</p>
                                        <p className="font-bold text-orange-600">₦{listing.price.toLocaleString()}</p>
                                        <div className="mt-4 bg-slate-50 p-3 rounded-lg text-sm text-slate-600">
                                            <p><strong>Phone:</strong> {listing.landlord_phone}</p>
                                            <p><strong>Category:</strong> {listing.category}</p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-3 mt-6">
                                        <button
                                            onClick={() => handleAction(listing.id, 'approve')}
                                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-bold transition-colors"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleAction(listing.id, 'reject')}
                                            className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-2 rounded-lg font-bold transition-colors"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
