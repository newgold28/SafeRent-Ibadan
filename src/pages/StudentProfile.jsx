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
        is_looking_for_roommate: false,
        roommate_bio: '',
        budget_range: '',
        agency_name: '',
        role: ''
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
                    is_looking_for_roommate: data.is_looking_for_roommate || false,
                    roommate_bio: data.roommate_bio || '',
                    budget_range: data.budget_range || '',
                    agency_name: data.agency_name || '',
                    role: data.role || ''
                });
            } else if (!error) {
                // Handle new user with no profile yet
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
                                {profile.role !== 'student'
                                    ? "This will be shown as your primary contact on property listings."
                                    : "Landlords/Agents use this to contact you if you provide it."
                                }
                            </p>
                        </div>

                        {/* Agency Name - Only for Agents */}
                        {profile.role === 'agent' && (
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Agency name</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 transition-all"
                                    value={profile.agency_name}
                                    onChange={(e) => setProfile({ ...profile, agency_name: e.target.value })}
                                    placeholder="e.g. Reliable Homes Ltd"
                                />
                            </div>
                        )}

                        {/* University - Only for students */}
                        {profile.role === 'student' && (
                            <>
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

                                <div className="pt-6 border-t border-slate-100">
                                    <h3 className="text-lg font-bold text-slate-900 mb-4">Roommate Finder Status</h3>

                                    <div className="flex items-center gap-3 mb-6">
                                        <button
                                            type="button"
                                            onClick={() => setProfile({ ...profile, is_looking_for_roommate: !profile.is_looking_for_roommate })}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${profile.is_looking_for_roommate ? 'bg-orange-600' : 'bg-slate-200'}`}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${profile.is_looking_for_roommate ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </button>
                                        <span className="text-sm font-medium text-slate-700">Looking for a Roommate</span>
                                    </div>

                                    {profile.is_looking_for_roommate && (
                                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">My Budget (Yearly)</label>
                                                <select
                                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 transition-all bg-white"
                                                    value={profile.budget_range}
                                                    onChange={(e) => setProfile({ ...profile, budget_range: e.target.value })}
                                                >
                                                    <option value="">Select a range</option>
                                                    <option value="Under ₦100k">Under ₦100k</option>
                                                    <option value="₦100k - ₦300k">₦100k - ₦300k</option>
                                                    <option value="₦300k - ₦500k">₦300k - ₦500k</option>
                                                    <option value="Above ₦500k">Above ₦500k</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">Short Bio</label>
                                                <textarea
                                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 transition-all h-24 resize-none"
                                                    placeholder="E.g. I'm a clean and quiet 200L student looking for a shared apartment near UI. I'm fine with pets."
                                                    value={profile.roommate_bio}
                                                    onChange={(e) => setProfile({ ...profile, roommate_bio: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
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
