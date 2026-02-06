import React, { useState } from 'react';

const Hero = () => {
    const [search, setSearch] = useState('');

    return (
        <div className="relative bg-white overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-orange-50 to-white hidden lg:block"></div>

            <div className="max-w-7xl mx-auto">
                <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">

                    <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                        <div className="sm:text-center lg:text-left">
                            <h1 className="text-4xl tracking-tight font-extrabold text-slate-900 sm:text-5xl md:text-6xl">
                                <span className="block xl:inline">Find your next hostel</span>{' '}
                                <span className="block text-orange-500 xl:inline">without the stress.</span>
                            </h1>
                            <p className="mt-3 text-base text-slate-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                SafeRent connects students in Ibadan with verified landlords. No agents, no scams, just secure housing near your campus.
                            </p>
                            <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                <div className="rounded-md shadow">
                                    <a href="#listings" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-orange-600 hover:bg-orange-700 md:py-4 md:text-lg transition-all shadow-lg shadow-orange-500/30">
                                        Browse Hostels
                                    </a>
                                </div>
                                <div className="mt-3 sm:mt-0 sm:ml-3">
                                    <a href="/signup" className="w-full flex items-center justify-center px-8 py-3 border border-slate-200 text-base font-medium rounded-xl text-slate-700 bg-white hover:bg-slate-50 md:py-4 md:text-lg transition-all">
                                        List a Property
                                    </a>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                <img
                    className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
                    src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"
                    alt="Modern student hostel"
                />
            </div>
        </div>
    );
};

export default Hero;
