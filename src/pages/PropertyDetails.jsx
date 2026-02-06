import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import PaymentModal from '../components/PaymentModal';

const PropertyDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [showPayment, setShowPayment] = useState(false);

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                // Fetch property details
                const { data, error } = await supabase
                    .from('properties')
                    .select('*, universities(name)')
                    .eq('id', id)
                    .single();

                if (error) throw error;
                setProperty(data);

                // Check unlock status
                if (user) {
                    if (data.owner_id === user.id) {
                        setIsUnlocked(true);
                    } else {
                        const { data: unlockedData } = await supabase
                            .from('unlocked_listings')
                            .select('*')
                            .eq('user_id', user.id)
                            .eq('property_id', id)
                            .single();
                        if (unlockedData) setIsUnlocked(true);
                    }
                }
            } catch (err) {
                console.error("Error fetching property:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();
    }, [id, user]);

    const handleUnlockSuccess = () => {
        setIsUnlocked(true);
        setShowPayment(false);
        alert("Contact Unlocked!");
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div></div>;
    if (!property) return <div className="text-center py-20">Property not found.</div>;

    const amenitiesList = property.amenities ? property.amenities.split(',') : [];

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                    {/* Image Header */}
                    <div className="relative h-96 w-full">
                        <img
                            src={property.image_url}
                            alt={property.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-6 left-6">
                            <button onClick={() => navigate(-1)} className="bg-white/90 backdrop-blur px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-white transition-colors">
                                ← Back
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 p-8 md:p-12">
                        {/* Main Info */}
                        <div className="lg:col-span-2 space-y-8">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full uppercase tracking-wide">
                                        {property.category}
                                    </span>
                                    <span className="text-slate-500 text-sm font-medium flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                        {property.location}
                                    </span>
                                </div>
                                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">{property.title}</h1>
                                <p className="text-slate-500 text-lg">Near {property.universities?.name}</p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-slate-100">
                                <div className="text-center p-4 bg-slate-50 rounded-2xl">
                                    <span className="block text-2xl font-bold text-slate-900">{property.bedrooms}</span>
                                    <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Bedrooms</span>
                                </div>
                                <div className="text-center p-4 bg-slate-50 rounded-2xl">
                                    <span className="block text-2xl font-bold text-slate-900">{property.bathrooms}</span>
                                    <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Bathrooms</span>
                                </div>
                                <div className="text-center p-4 bg-slate-50 rounded-2xl">
                                    <span className="block text-2xl font-bold text-slate-900">Yes</span>
                                    <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Verified</span>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-4">Description</h3>
                                <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                                    {property.description || "No description provided."}
                                </p>
                            </div>

                            {amenitiesList.length > 0 && (
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-4">Amenities</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {amenitiesList.map((amenity, idx) => (
                                            <span key={idx} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium text-sm">
                                                {amenity.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar / Action Card */}
                        <div className="lg:col-span-1">
                            <div className="bg-white p-6 rounded-3xl border-2 border-slate-100 sticky top-24 shadow-xl shadow-slate-100/50">
                                <span className="text-slate-500 text-sm font-medium">Rent per year</span>
                                <div className="text-4xl font-extrabold text-slate-900">₦{(property.price?.toLocaleString() || '0')}</div>
                            </div>

                            {isUnlocked ? (
                                <div className="space-y-4">
                                    <div className="p-4 bg-green-50 border border-green-100 rounded-2xl">
                                        <p className="text-green-800 font-bold mb-1">Landlord Contact:</p>
                                        <p className="text-2xl font-mono text-green-900 tracking-wider select-all">{property.landlord_phone}</p>
                                    </div>
                                    <button className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                        Call Landlord
                                    </button>
                                    <p className="text-center text-slate-400 text-sm">Make sure to mention you found them on SafeRent!</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <button
                                        onClick={() => user ? setShowPayment(true) : navigate('/login')}
                                        className="w-full py-4 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 group"
                                    >
                                        <svg className="w-5 h-5 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                        Unlock Phone Number
                                    </button>
                                    <p className="text-center text-slate-400 text-xs">
                                        Pay a one-time fee of ₦1,000 to get direct contact access.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
        </div>
            </main >

    { showPayment && (
        <PaymentModal
            propertyId={id}
            amount={1000}
            onClose={() => setShowPayment(false)}
            onSuccess={handleUnlockSuccess}
        />
    )}
        </div >
    );
};

export default PropertyDetails;
