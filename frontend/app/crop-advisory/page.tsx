"use client";

import { useState } from 'react';
import { Sprout, CloudSun, MapPin, Droplets, Loader2, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import CursorEffect from '@/components/CursorEffect';

export default function CropAdvisory() {
    const [formData, setFormData] = useState({
        nitrogen: '',
        phosphorus: '',
        potassium: '',
        temperature: '',
        humidity: '',
        ph: '',
        rainfall: ''
    });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Pointing to backend proxy
            const response = await axios.post('http://localhost:5000/api/ml/crop-advisory', formData);
            setResult(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <CursorEffect />
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Smart Crop Advisory</h1>
                <p className="text-gray-600">Get personalized crop recommendations based on your soil and weather conditions.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nitrogen (N)</label>
                                    <input
                                        type="number"
                                        name="nitrogen"
                                        required
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                        placeholder="e.g. 90"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phosphorus (P)</label>
                                    <input
                                        type="number"
                                        name="phosphorus"
                                        required
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                        placeholder="e.g. 42"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Potassium (K)</label>
                                    <input
                                        type="number"
                                        name="potassium"
                                        required
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                        placeholder="e.g. 43"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Temperature (°C)</label>
                                    <input
                                        type="number"
                                        name="temperature"
                                        required
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                        placeholder="e.g. 20"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Humidity (%)</label>
                                    <input
                                        type="number"
                                        name="humidity"
                                        required
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                        placeholder="e.g. 82"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">pH Level</label>
                                    <input
                                        type="number"
                                        name="ph"
                                        step="0.1"
                                        required
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                        placeholder="e.g. 6.5"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Rainfall (mm)</label>
                                    <input
                                        type="number"
                                        name="rainfall"
                                        required
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                        placeholder="e.g. 200"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-green-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-green-700 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" /> Analyzing Soil Data...
                                    </>
                                ) : (
                                    <>
                                        <Sprout className="h-5 w-5" /> Get Recommendation
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="md:col-span-1">
                    <div className="bg-green-900 text-white rounded-2xl p-6 h-full relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold mb-4">Why use AI Advisory?</h3>
                            <ul className="space-y-4 text-green-100">
                                <li className="flex items-start gap-3">
                                    <div className="bg-green-800 p-2 rounded-lg shrink-0">
                                        <CloudSun className="h-5 w-5 text-green-400" />
                                    </div>
                                    <p className="text-sm">Optimized for local weather patterns and climate change.</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="bg-green-800 p-2 rounded-lg shrink-0">
                                        <Droplets className="h-5 w-5 text-green-400" />
                                    </div>
                                    <p className="text-sm">Maximize yield by matching crops to soil nutrient levels.</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="bg-green-800 p-2 rounded-lg shrink-0">
                                        <MapPin className="h-5 w-5 text-green-400" />
                                    </div>
                                    <p className="text-sm">Region-specific insights for better market value.</p>
                                </li>
                            </ul>
                        </div>
                        <Sprout className="absolute -bottom-8 -right-8 h-48 w-48 text-green-800 opacity-50" />
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 bg-green-50 border border-green-200 rounded-2xl p-8 text-center"
                    >
                        <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full mb-4">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Recommended Crops</h2>
                        <p className="text-gray-600 mb-6">{result.reason}</p>

                        <div className="flex flex-wrap justify-center gap-4">
                            {result.recommended_crops.map((crop: string, idx: number) => (
                                <span key={idx} className="bg-white text-green-800 px-6 py-3 rounded-full font-bold text-lg shadow-sm border border-green-100">
                                    {crop}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
