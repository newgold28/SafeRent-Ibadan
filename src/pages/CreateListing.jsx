import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const CreateListing = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [universities, setUniversities] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        location: '',
        category: 'Hostel',
        university_id: '',
        landlord_phone: '',
        description: '',
        bedrooms: 1,
        bathrooms: 1,
        amenities: '', // comma separated
        image: null
    });

    useEffect(() => {
        if (!user) navigate('/login');
        const fetchUniversities = async () => {
            const { data } = await supabase.from('universities').select('*');
            if (data) setUniversities(data);
        };
        fetchUniversities();
    }, [user, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Upload Image
            const file = formData.image;
            if (!file) throw new Error("Please upload an image");

            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('property-images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('property-images')
                .getPublicUrl(filePath);


            // 2. Insert Data
            const { error: insertError } = await supabase
                .from('properties')
                .insert([{
                    title: formData.title,
                    price: formData.price,
                    location: formData.location,
                    category: formData.category,
                    university_id: formData.university_id, // Save University ID
                    landlord_phone: formData.landlord_phone,
                    description: formData.description, // New Field
                    bedrooms: formData.bedrooms, // New Field
                    bathrooms: formData.bathrooms, // New Field
                    amenities: formData.amenities, // New Field
                    image_url: publicUrl,
                    owner_id: user.id,
                    status: 'pending' // Admin must approve
                }]);

            if (insertError) throw insertError;

            alert("Listing created! It is PENDING approval by admin.");
            navigate('/dashboard/landlord');

        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-white py-8 px-10 shadow-xl rounded-3xl border border-slate-100">
                    <h1 className="text-3xl font-bold text-center text-slate-900 mb-8">Post a Property</h1>
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Property Title</label>
                            <input required name="title" onChange={handleChange} className="mt-1 block w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-orange-500 focus:border-orange-500" placeholder="e.g. Luxury Flat near UI Gate" />
                        </div>

                        {/* Description - New */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Description</label>
                            <textarea required name="description" rows="4" onChange={handleChange} className="mt-1 block w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-orange-500 focus:border-orange-500" placeholder="Describe the house... is it tiled? running water? etc." />
                        </div>

                        {/* Price & Location */}
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Price (₦ / Year)</label>
                                <input required type="number" name="price" onChange={handleChange} className="mt-1 block w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-orange-500 focus:border-orange-500" placeholder="150000" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Location/Area</label>
                                <input required name="location" onChange={handleChange} className="mt-1 block w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-orange-500 focus:border-orange-500" placeholder="e.g. Agbowo" />
                            </div>
                        </div>

                        {/* University - New */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Nearest University</label>
                            <select required name="university_id" onChange={handleChange} className="mt-1 block w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-orange-500 focus:border-orange-500 bg-white">
                                <option value="">Select University</option>
                                {universities.map(uni => (
                                    <option key={uni.id} value={uni.id}>{uni.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Amenities & Details - New */}
                        <div className="grid grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Bedrooms</label>
                                <input required type="number" name="bedrooms" defaultValue={1} onChange={handleChange} className="mt-1 block w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-orange-500 focus:border-orange-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Bathrooms</label>
                                <input required type="number" name="bathrooms" defaultValue={1} onChange={handleChange} className="mt-1 block w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-orange-500 focus:border-orange-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Category</label>
                                <select name="category" onChange={handleChange} className="mt-1 block w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-orange-500 focus:border-orange-500 bg-white">
                                    <option value="Hostel">Hostel</option>
                                    <option value="Flat">Flat</option>
                                    <option value="Self Con">Self Con</option>
                                </select>
                            </div>
                        </div>

                        {/* Amenities Text */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Amenities (comma separated)</label>
                            <input name="amenities" onChange={handleChange} className="mt-1 block w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-orange-500 focus:border-orange-500" placeholder="e.g. Water, Security, Gen, Wardrobe" />
                        </div>

                        {/* Contact & Image */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Landlord Phone Number</label>
                            <input required name="landlord_phone" onChange={handleChange} className="mt-1 block w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-orange-500 focus:border-orange-500" placeholder="080..." />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">Property Image</label>
                            <input required type="file" accept="image/*" onChange={handleFileChange} className="mt-1 block w-full text-slate-500 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100" />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Uploading...' : 'Submit for Review'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateListing;
