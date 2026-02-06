import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

const ReviewSection = ({ propertyId, onReviewSubmitted }) => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('reviews')
                .select('*, profiles(full_name)')
                .eq('property_id', propertyId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setReviews(data || []);
        } catch (err) {
            console.error('Error fetching reviews:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [propertyId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return alert("Please login to leave a review.");

        setSubmitting(true);
        try {
            const { error } = await supabase
                .from('reviews')
                .upsert({
                    property_id: propertyId,
                    user_id: user.id,
                    rating,
                    comment,
                    created_at: new Date().toISOString()
                });

            if (error) throw error;

            alert("Review submitted!");
            setComment('');
            fetchReviews();
            if (onReviewSubmitted) onReviewSubmitted();
        } catch (err) {
            alert(err.message === 'duplicate key value violates unique constraint "reviews_user_id_property_id_key"'
                ? "You have already reviewed this property."
                : "Error submitting review: " + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : 0;

    return (
        <div className="mt-16 border-t border-slate-100 pt-16">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Student Reviews</h2>
                    <div className="flex items-center gap-4 text-slate-500">
                        <div className="flex items-center text-orange-500 font-bold text-xl">
                            <span className="mr-1">★</span>
                            {averageRating}
                        </div>
                        <span>•</span>
                        <span>{reviews.length} total reviews</span>
                    </div>
                </div>

                {!user && (
                    <p className="text-slate-500 bg-slate-50 px-4 py-2 rounded-lg text-sm border border-slate-100">
                        Log in to share your experience with this hostel.
                    </p>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Form */}
                <div className="lg:col-span-1">
                    {user ? (
                        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm sticky top-24">
                            <h3 className="font-bold text-slate-900 mb-4">Leave a Review</h3>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((num) => (
                                        <button
                                            key={num}
                                            type="button"
                                            onClick={() => setRating(num)}
                                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${rating >= num ? 'bg-orange-500 text-white shadow-lg' : 'bg-slate-100 text-slate-400 opacity-50'}`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Comment</label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Tell others about the water, electricity, and the landlord's behavior..."
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 transition-all h-32 resize-none"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center"
                            >
                                {submitting ? 'Submitting...' : 'Post Review'}
                            </button>
                        </form>
                    ) : null}
                </div>

                {/* List */}
                <div className="lg:col-span-2 space-y-6">
                    {loading ? (
                        <div className="flex justify-center py-10">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                        </div>
                    ) : reviews.length === 0 ? (
                        <div className="text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                            <p className="text-slate-400">Be the first to review this property!</p>
                        </div>
                    ) : (
                        reviews.map((r) => (
                            <div key={r.id} className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                                            {r.profiles?.full_name?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">{r.profiles?.full_name || 'Anonymous Student'}</p>
                                            <p className="text-xs text-slate-400">{new Date(r.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex text-orange-500 text-sm font-bold">
                                        {"★".repeat(r.rating)}
                                        <span className="text-slate-200">{"★".repeat(5 - r.rating)}</span>
                                    </div>
                                </div>
                                <p className="text-slate-600 leading-relaxed italic">"{r.comment}"</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewSection;
