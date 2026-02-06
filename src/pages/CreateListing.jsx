import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const CreateListing = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [universities, setUniversities] = useState([]);

    const [formData, setFormData] = useState({
        title: '',
        price: '',
        category: 'Hostel',
        location: '',
        landlord_phone: '',
        university_id: ''
    });

    useEffect(() => {
        const fetchUniversities = async () => {
            const { data } = await supabase.from('universities').select('*');
            if (data) setUniversities(data);
        };
        fetchUniversities();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setError("You must be logged in to list a property.");
            return;
        }

        // Security Audit: Input Validation
        if (parseFloat(formData.price) <= 0) {
            setError("Price must be a positive number.");
            return;
        }
        const phoneRegex = /^[0-9]{10,15}$/;
        if (!phoneRegex.test(formData.landlord_phone)) {
            setError("Please enter a valid phone number (digits only).");
            return;
        }

        if (!imageFile) {
            setError("Please upload an image of the property.");
            return;
        }

        if (!formData.university_id) {
            setError("Please select a university.");
            return;
        }

        // Size check (client-side)
        if (imageFile.size > 5 * 1024 * 1024) {
            setError("Image size must be less than 5MB.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // 1. Upload Image
            const fileExt = imageFile.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${user.id}/${fileName}`; // Security: Use user ID in path

            const { error: uploadError } = await supabase.storage
                .from('property-images')
                .upload(filePath, imageFile, {
                    upsert: false // Security: Prevent overwriting
                });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('property-images')
                .getPublicUrl(filePath);

            // 2. Insert into Database
            const { error: insertError } = await supabase
                .from('properties')
                .insert([{
                    title: formData.title.trim(), // Sanitize
                    price: parseFloat(formData.price),
                    category: formData.category,
                    location: formData.location.trim(),
                    image_url: publicUrl,
                    landlord_phone: formData.landlord_phone.trim(),
                    owner_id: user.id,
                    status: 'pending', // explictly set status
                    university_id: parseInt(formData.university_id) // link to university
                }]);

            if (insertError) throw insertError;

            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
                    <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
                        <h1 className="text-2xl font-bold text-slate-800">List Your Property</h1>
                        <p className="text-slate-500 mt-1">Fill in the details below to reach thousands of students.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Closest University</label>
                                <select
                                    name="university_id"
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white"
                                    value={formData.university_id}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select a University...</option>
                                    {universities.map(uni => (
                                        <option key={uni.id} value={uni.id}>{uni.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Property Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    placeholder="e.g. Luxury Flat in Yaba"
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                    value={formData.title}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Price (in Naira)</label>
                                <input
                                    type="number"
                                    name="price"
                                    required
                                    placeholder="e.g. 150000"
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                    value={formData.price}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                                <select
                                    name="category"
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white"
                                    value={formData.category}
                                    onChange={handleChange}
                                >
                                    <option>Hostel</option>
                                    <option>Self Con</option>
                                    <option>Flat</option>
                                    <option>Single Room</option>
                                </select>
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Location/Address</label>
                                <input
                                    type="text"
                                    name="location"
                                    required
                                    placeholder="e.g. Behind Unilag Back Gate"
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                    value={formData.location}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Landlord Phone (Hidden until unlocked)</label>
                                <input
                                    type="tel"
                                    name="landlord_phone"
                                    required
                                    placeholder="e.g. 08012345678"
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                    value={formData.landlord_phone}
                                    onChange={handleChange}
                                />
                                <p className="text-xs text-slate-400 mt-1">Students will pay ₦1,000 to reveal this.</p>
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Property Image</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-lg hover:bg-slate-50 transition-colors">
                                    <div className="space-y-1 text-center">
                                        <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <div className="flex text-sm text-slate-600">
                                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none">
                                                <span>Upload a file</span>
                                                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-slate-500">PNG, JPG, GIF up to 5MB</p>
                                        {imageFile && (
                                            <p className="text-sm font-semibold text-emerald-600 mt-2">Selected: {imageFile.name}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-orange-500/30 text-base font-bold text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Publishing...' : 'Publish Listing'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateListing;
