import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

const Navbar = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        if (user) {
            checkAdmin();
            // Check Metadata for role
            setUserRole(user.user_metadata?.role || 'student');
        }
    }, [user]);

    const checkAdmin = async () => {
        const { data } = await supabase
            .from('admins')
            .select('id')
            .eq('id', user.id)
            .maybeSingle();

        if (data) setIsAdmin(true);
    };

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    return (
        <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/">
                            <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">SafeRent</span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">Find Homes</Link>

                        {/* Conditional Links based on Role */}
                        {user && userRole === 'landlord' && (
                            <Link to="/dashboard/landlord" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">Dashboard</Link>
                        )}
                        {user && userRole === 'student' && (
                            <Link to="/dashboard/student" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">My Properties</Link>
                        )}

                        {isAdmin && (
                            <Link to="/admin" className="text-red-600 hover:text-red-700 font-bold transition-colors border border-red-200 bg-red-50 px-3 py-1 rounded-lg">Admin Panel</Link>
                        )}
                    </div>

                    <div className="flex items-center space-x-4">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-orange-400 to-amber-600 flex items-center justify-center text-white font-bold shadow-md hidden sm:flex">
                                    {(user?.email?.charAt(0).toUpperCase() || 'U')}
                                </div>
                                <Link to="/dashboard/profile" className="text-slate-600 hover:text-slate-900 font-medium px-3 py-2 transition-colors">
                                    Profile
                                </Link>
                                <button
                                    onClick={handleSignOut}
                                    className="text-slate-600 hover:text-slate-900 font-medium px-3 py-2 transition-colors"
                                >
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link to="/login">
                                    <button className="text-slate-600 hover:text-slate-900 font-medium px-3 py-2 transition-colors">
                                        Log In
                                    </button>
                                </Link>
                                <Link to="/signup">
                                    <button className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-slate-900/10">
                                        Sign Up
                                    </button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
