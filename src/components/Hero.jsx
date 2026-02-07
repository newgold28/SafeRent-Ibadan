import React, { useState } from 'react';

const Hero = () => {
    const [search, setSearch] = useState('');

    return (
        <div className="relative bg-white pt-16 pb-20 lg:pt-24 lg:pb-32 overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-orange-50 rounded-full blur-3xl opacity-50"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-sm font-bold mb-6 animate-pulse">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                            </span>
                            Live in Ibadan
                        </div>
                        <h1 className="text-4xl tracking-tight font-extrabold text-slate-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
                            <span className="block">Your next campus home</span>
                            <span className="block text-orange-600">waiting for you.</span>
                        </h1>
                        <p className="mt-6 text-base text-slate-500 sm:text-xl lg:text-lg xl:text-xl leading-relaxed">
                            Join 2,000+ students in Ibadan who found their perfect hostels via SafeRent.
                            Verified properties, direct landlord contacts, and zero agent stress.
                        </p>

                        <div className="mt-10 sm:flex sm:justify-center lg:justify-start gap-4">
                            <a href="#listings" className="flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-2xl text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 w-full sm:w-auto">
                                Start Searching
                            </a>
                            <a href="/roommates" className="flex items-center justify-center px-8 py-4 border-2 border-orange-600 text-lg font-bold rounded-2xl text-orange-600 bg-white hover:bg-orange-50 transition-all w-full sm:w-auto">
                                Find Roommates
                            </a>
                        </div>

                        {/* Social Proof */}
                        <div className="mt-10 flex items-center gap-4 text-slate-400">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">UI</div>
                                ))}
                            </div>
                            <span className="text-sm font-medium">Trusted by students from UI, LCU, Poly...</span>
                        </div>
                    </div>

                    <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
                        <div className="relative mx-auto w-full rounded-3xl shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-transform duration-500">
                            <img
                                className="w-full h-[500px] object-cover"
                                src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                                alt="Modern student living space"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
                            <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 text-white">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="flex text-orange-400">★★★★★</div>
                                    <span className="text-sm font-bold">4.9/5 Rating</span>
                                </div>
                                <p className="text-sm font-medium">"Found a flat near UI within 2 days. The landlord was very professional!" - Tunde, UI Student</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
