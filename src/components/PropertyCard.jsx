import React from 'react';
import { Link } from 'react-router-dom';

const PropertyCard = ({ id, image, price, location, title, type = "Hostel", landlord_phone, isUnlocked = false, onUnlock, isSaved = false, onSave, is_featured = false }) => {
    return (
        <div className={`group bg-white rounded-2xl border overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full relative ${is_featured ? 'border-orange-200 ring-1 ring-orange-100' : 'border-slate-100'}`}>
            {/* Featured Badge */}
            {is_featured && (
                <div className="absolute top-4 left-4 z-20">
                    <span className="px-3 py-1 bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg border border-orange-400 flex items-center gap-1 animate-pulse">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                        Featured
                    </span>
                </div>
            )}

            {/* Save Button */}
            <button
                onClick={(e) => {
                    e.preventDefault();
                    if (onSave) onSave(id);
                }}
                className={`absolute top-4 right-4 z-20 p-2 rounded-full shadow-md backdrop-blur transition-all ${isSaved ? 'bg-orange-500 text-white' : 'bg-white/90 text-slate-400 hover:text-orange-500'}`}
            >
                <svg className="w-5 h-5" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
            </button>

            <Link to={`/property/${id}`} className="relative h-64 overflow-hidden shrink-0 block">
                <div className={`absolute left-4 z-10 transition-all ${is_featured ? 'top-14' : 'top-4'}`}>
                    <span className="px-3 py-1 bg-white/90 backdrop-blur text-xs font-bold text-slate-800 rounded-full shadow-sm">
                        {type}
                    </span>
                </div>
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent h-24"></div>
                <div className="absolute bottom-4 left-4 text-white">
                    <p className="font-bold text-lg">₦{(price?.toLocaleString() || '0')}<span className="text-sm font-normal opacity-90">/yr</span></p>
                </div>
            </Link>

            <div className="p-5 flex flex-col flex-grow">
                <Link to={`/property/${id}`} className="block">
                    <h3 className="text-lg font-bold text-slate-900 mb-1 truncate hover:text-orange-600 transition-colors">{title}</h3>
                </Link>
                <div className="flex items-center text-slate-500 text-sm mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                    {location}
                </div>

                <div className="mt-auto">
                    {isUnlocked ? (
                        <div className="w-full py-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 font-medium flex items-center justify-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                            </svg>
                            {landlord_phone}
                        </div>
                    ) : (
                        <button
                            onClick={() => onUnlock(id)}
                            className="w-full py-3 rounded-xl border border-slate-200 text-slate-600 font-medium hover:border-orange-500 hover:text-orange-500 transition-colors flex items-center justify-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                            </svg>
                            Front ₦1,000 for Contact
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PropertyCard;
