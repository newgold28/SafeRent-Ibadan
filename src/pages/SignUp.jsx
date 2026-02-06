import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { signUp } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            // Pass role as metadata
            const { error } = await signUp(email, password, { role });
            if (error) throw error;
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-slate-900">Create an account</h2>
                    <p className="mt-2 text-sm text-slate-600">Join the SafeRent community</p>
                </div>

                {error && <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm text-center">{error}</div>}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="flex gap-4 mb-6">
                        <button
                            type="button"
                            onClick={() => setRole('student')}
                            className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-all ${role === 'student' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}
                        >
                            Student
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('landlord')}
                            className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-all ${role === 'landlord' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}
                        >
                            Landlord / Agent
                        </button>
                    </div>

                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-slate-300 placeholder-slate-500 text-slate-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-slate-300 placeholder-slate-500 text-slate-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 shadow-lg shadow-orange-500/30 transition-all disabled:opacity-70"
                        >
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </div>
                </form>

                <div className="text-center mt-4">
                    <p className="text-sm text-slate-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-orange-600 hover:text-orange-500">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
