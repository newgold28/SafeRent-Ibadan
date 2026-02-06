import React, { useState } from 'react';
import { PaystackButton } from 'react-paystack';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

const PaymentModal = ({ propertyId, amount, onClose, onSuccess }) => {
    const { user } = useAuth();
    const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
    const [error, setError] = useState(null);

    const componentProps = {
        email: user?.email,
        amount: amount * 100, // Paystack expects amount in kobo
        metadata: {
            name: user?.email || 'Student',
            phone: '',
        },
        publicKey,
        text: "Pay Now", // Not used as we invoke button manually or style it
        onSuccess: async (reference) => {
            try {
                // Record the unlock in database
                const { error: dbError } = await supabase
                    .from('unlocked_listings')
                    .insert([{
                        user_id: user.id,
                        property_id: propertyId
                    }]);

                if (dbError) throw dbError;

                onSuccess();
                onClose();
            } catch (err) {
                console.error("Error unlocking listing:", err);
                setError("Payment successful but verification failed. Please contact support.");
            }
        },
        onClose: () => alert("Transaction cancelled"),
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6 18 18" />
                    </svg>
                </button>

                <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                        </svg>
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Unlock Contact Details</h3>
                    <p className="text-slate-600 mb-8">
                        Pay <span className="font-bold text-slate-900">₦{(amount).toLocaleString()}</span> to reveal this landlord's phone number and contact them directly.
                    </p>

                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    {!user && <p className="text-red-500 text-sm mb-4">Please log in to make a payment.</p>}

                    {user ? (
                        <PaystackButton
                            {...componentProps}
                            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold text-lg hover:shadow-lg hover:shadow-orange-500/30 transition-all transform active:scale-95"
                        />
                    ) : (
                        <button disabled className="w-full py-3.5 px-6 rounded-xl bg-slate-200 text-slate-400 font-bold cursor-not-allowed">
                            Log in to Pay
                        </button>
                    )}

                    <p className="text-xs text-slate-400 mt-4 flex justify-center items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                            <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" />
                        </svg>
                        Secure payment via Paystack
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
