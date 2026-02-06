import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const StudentProfile = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [universities, setUniversities] = useState([]);
    const [profile, setProfile] = useState({
        full_name: '',
        phone_number: '',
        university_id: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;

            // Fetch Universities
            const { data: uniData } = await supabase.from('universities').select('*');
            if (uniData) setUniversities(uniData);

            // Fetch Profile
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .maybeSingle();

            if (data) {
                setProfile({
                    full_name: data.full_name || '',
                    phone_number: data.phone_number || '',
                    university_id: data.university_id || '',
                });
            } else if (!error) {
                // If profile doesn't exist yet but user is logged in
                // (Trigger should have created it, but good to handle)
            }
            setLoading(false);
        };
        fetchData();
    }, [user]);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    ...profile,
                    updated_at: new Date().toISOString(),
                });

            if (error) throw error;
            alert('Profile updated successfully!');
        } catch (err) {
            console.error('Error updating profile:', err);
            alert('Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">My Profile</h1>
                    <p className="text-slate-500 mb-8">Manage your personal information and preferences.</p>

                    <form onSubmit={handleSave} className="space-y-6">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 transition-all"
                                value={profile.full_name}
                                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                placeholder="Your full name"
                            />
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                            <input
                                type="tel"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 transition-all"
                                value={profile.phone_number}
                                onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
                                placeholder="080 1234 5678"
                            />
                            <p className="mt-1 text-xs text-slate-400">
                                {user?.user_metadata?.role === 'landlord'
                                    ? "This will be shown as your primary contact on property listings."
                                    : "Landlords use this to contact you if you provide it."
                                }
                            </p>
                        </div>

                        {/* University - Only for students */}
                        {user?.user_metadata?.role !== 'landlord' && (
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Your University</label>
                                <select
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 transition-all bg-white"
                                    value={profile.university_id}
                                    onChange={(e) => setProfile({ ...profile, university_id: e.target.value })}
                                >
                                    <option value="">Select your university</option>
                                    {universities.map(uni => (
                                        <option key={uni.id} value={uni.id}>{uni.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 transition-all flex items-center justify-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    Saving...
                                </>
                            ) : 'Update Profile'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;
