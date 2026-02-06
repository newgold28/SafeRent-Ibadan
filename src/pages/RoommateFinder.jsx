import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const RoommateFinder = () => {
    const { user } = useAuth();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [universities, setUniversities] = useState([]);
    const [selectedUniversity, setSelectedUniversity] = useState('All');

    useEffect(() => {
        fetchUniversities();
        fetchStudents();
    }, [selectedUniversity]);

    const fetchUniversities = async () => {
        const { data } = await supabase.from('universities').select('*');
        if (data) setUniversities(data);
    };

    const fetchStudents = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from('profiles')
                .select('*, universities(name)')
                .eq('role', 'student')
                .eq('is_looking_for_roommate', true)
                .order('updated_at', { ascending: false });

            if (selectedUniversity !== 'All') {
                query = query.eq('university_id', selectedUniversity);
            }

            const { data, error } = await query;
            if (error) throw error;

            // Filter out the current user from the list
            setStudents(data?.filter(s => s.id !== user?.id) || []);
        } catch (err) {
            console.error('Error fetching students:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="mb-12">
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Find a Roommate</h1>
                    <p className="text-slate-600 text-lg max-w-2xl">
                        Connect with fellow students looking to share a hostel and split rent.
                        Safety first: Always meet in public places!
                    </p>
                </div>

                {/* Filters */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm mb-12 flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex-1">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Filter by University</label>
                        <select
                            value={selectedUniversity}
                            onChange={(e) => setSelectedUniversity(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 bg-white"
                        >
                            <option value="All">All Universities</option>
                            {universities.map(uni => (
                                <option key={uni.id} value={uni.id}>{uni.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl md:w-1/3">
                        <p className="text-orange-800 text-sm font-medium">Looking for a roommate yourself?</p>
                        <Link to="/dashboard/profile" className="text-orange-600 text-sm font-bold hover:underline">Update your status in profile →</Link>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                    </div>
                ) : students.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
                        <p className="text-xl font-medium text-slate-900 mb-2">No roommates found yet.</p>
                        <p className="text-slate-500 text-sm">Be the first to post your profile!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {students.map((student) => (
                            <div key={student.id} className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full border-t-4 border-t-orange-500">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-orange-400 to-amber-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                        {student.full_name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                        <h3 className="font-extrabold text-xl text-slate-900">{student.full_name || 'Anonymous Student'}</h3>
                                        <p className="text-orange-600 font-bold text-sm uppercase tracking-wider">{student.universities?.name}</p>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Expected Budget</span>
                                    <div className="inline-block bg-slate-900 text-white px-3 py-1 rounded-lg font-bold text-sm">
                                        {student.budget_range || 'Contact for info'}
                                    </div>
                                </div>

                                <div className="mb-8 flex-grow">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">About Me</span>
                                    <p className="text-slate-600 leading-relaxed italic">
                                        "{student.roommate_bio || 'No bio provided.'}"
                                    </p>
                                </div>

                                <a
                                    href={`tel:${student.phone_number}`}
                                    className="w-full py-4 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl font-bold hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-orange-500/20"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                    Call to Connect
                                </a>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default RoommateFinder;
