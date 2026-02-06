import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import Navbar from '../components/Navbar';

const AdminDashboard = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'approved'

    const fetchListings = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('properties')
                .select('*')
                .eq('status', activeTab)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setListings(data || []);
        } catch (err) {
            console.error('Error fetching listings:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchListings();
    }, [activeTab]);

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
                    .update({ status: 'rejected' })
                    .eq('id', id);
                if (error) throw error;
                alert("Listing Rejected.");
            }
            fetchListings();
        } catch (err) {
            alert("Error: " + err.message);
        }
    };

    const toggleFeatured = async (id, currentStatus) => {
        try {
            const { error } = await supabase
                .from('properties')
                .update({ is_featured: !currentStatus })
                .eq('id', id);
            if (error) throw error;
            setListings(listings.map(l => l.id === id ? { ...l, is_featured: !currentStatus } : l));
        } catch (err) {
            alert("Error: " + err.message);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <h1 className="text-3xl font-bold text-slate-900 mb-8">Admin Property Manager</h1>

                {/* Tabs */}
                <div className="flex space-x-4 mb-8 border-b border-slate-200">
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`pb-4 px-2 font-medium text-lg transition-all ${activeTab === 'pending' ? 'border-b-2 border-orange-600 text-orange-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Pending Review
                    </button>
                    <button
                        onClick={() => setActiveTab('approved')}
                        className={`pb-4 px-2 font-medium text-lg transition-all ${activeTab === 'approved' ? 'border-b-2 border-orange-600 text-orange-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Approved Listings
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                    </div>
                ) : listings.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
                        <p className="text-slate-500 text-lg">No {activeTab} listings found.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {listings.map((listing) => (
                            <div key={listing.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col md:flex-row relative">
                                {listing.is_featured && (
                                    <div className="absolute top-2 left-2 z-10 bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">FEATURED</div>
                                )}
                                <div className="w-full md:w-1/3 h-48 md:h-auto relative">
                                    <img src={listing.image_url} alt={listing.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="p-6 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900">{listing.title}</h3>
                                        <p className="text-slate-500 text-sm mb-2">{listing.location}</p>
                                        <p className="font-bold text-orange-600">₦{listing.price.toLocaleString()}</p>
                                    </div>

                                    <div className="mt-6 flex flex-wrap gap-3">
                                        {activeTab === 'pending' ? (
                                            <>
                                                <button
                                                    onClick={() => handleAction(listing.id, 'approve')}
                                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-sm transition-colors"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleAction(listing.id, 'reject')}
                                                    className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-bold text-sm transition-colors"
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => toggleFeatured(listing.id, listing.is_featured)}
                                                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${listing.is_featured ? 'bg-orange-600 text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                                >
                                                    {listing.is_featured ? '★ Featured' : '☆ Feature Listing'}
                                                </button>
                                                <button
                                                    onClick={() => handleAction(listing.id, 'reject')}
                                                    className="px-4 py-2 text-slate-400 hover:text-red-600 text-sm"
                                                >
                                                    Demote to Pending
                                                </button>
                                            </>
                                        )}
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
