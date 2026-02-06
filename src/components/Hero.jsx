import React from 'react';

const Hero = () => {
    return (
        <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight mb-8">
                    Find your next hostel <br className="hidden sm:block" />
                    <span className="bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">near campus</span>
                </h1>
                <p className="mt-4 text-xl text-slate-600 max-w-2xl mx-auto mb-10">
                    Secure, affordable, and verified student housing. Browse hundreds of hostels close to your university.
                </p>
                <div className="flex justify-center max-w-xl mx-auto">
                    <div className="w-full relative flex items-center">
                        <input
                            type="text"
                            placeholder="Search by school or location..."
                            className="w-full px-6 py-4 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/40 focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-lg placeholder:text-slate-400"
                        />
                        <button className="absolute right-2 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-xl transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Background decoration */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
            </div>
        </div>
    );
};

export default Hero;
