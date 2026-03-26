"use client";

import { useState } from 'react';
import { Sprout, CloudSun, MapPin, Droplets, Loader2, CheckCircle, Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CursorEffect from '@/components/CursorEffect';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

export default function CropAdvisory() {
    const { isListening, startListening, stopListening, isSupported } = useSpeechRecognition();
    const [activeField, setActiveField] = useState<string | null>(null);
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

    const handleVoiceInput = (fieldName: string) => {
        if (isListening && activeField === fieldName) {
            stopListening();
            setActiveField(null);
            return;
        }
        setActiveField(fieldName);
        startListening((text) => {
            const num = text.replace(/[^0-9.]/g, '');
            if (num) {
                setFormData(prev => ({ ...prev, [fieldName]: num }));
            }
            setActiveField(null);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);
        try {
            const res = await fetch('/api/crop-advisory', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!res.ok) throw new Error('API request failed');
            const data = await res.json();
            setResult(data);
        } catch (error) {
            console.error(error);
            alert("An error occurred while fetching recommendations. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const fields = [
        { name: 'nitrogen', label: 'Nitrogen (N)', placeholder: 'e.g. 90', colSpan: '' },
        { name: 'phosphorus', label: 'Phosphorus (P)', placeholder: 'e.g. 42', colSpan: '' },
        { name: 'potassium', label: 'Potassium (K)', placeholder: 'e.g. 43', colSpan: '' },
        { name: 'temperature', label: 'Temperature (°C)', placeholder: 'e.g. 20', colSpan: '' },
        { name: 'humidity', label: 'Humidity (%)', placeholder: 'e.g. 82', colSpan: '' },
        { name: 'ph', label: 'pH Level', placeholder: 'e.g. 6.5', colSpan: '' },
        { name: 'rainfall', label: 'Rainfall (mm)', placeholder: 'e.g. 200', colSpan: 'sm:col-span-2' },
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <CursorEffect />
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Smart Crop Advisory</h1>
                <p className="text-gray-600">Get personalized crop recommendations based on your soil and weather conditions.</p>
                {isSupported && (
                    <p className="text-xs text-green-600 mt-2 flex items-center justify-center gap-1">
                        <Mic className="w-3 h-3" /> Voice input available — click the mic icon next to any field
                    </p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {fields.map((field) => (
                                    <div key={field.name} className={field.colSpan}>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                name={field.name}
                                                required
                                                step={field.name === 'ph' ? '0.1' : undefined}
                                                className="w-full px-4 py-2 pr-12 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                                placeholder={field.placeholder}
                                                value={(formData as any)[field.name]}
                                                onChange={handleChange}
                                            />
                                            {isSupported && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleVoiceInput(field.name)}
                                                    className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-all ${
                                                        isListening && activeField === field.name
                                                            ? 'bg-red-500 text-white animate-pulse'
                                                            : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                                                    }`}
                                                    title={isListening && activeField === field.name ? 'Listening...' : 'Speak value'}
                                                >
                                                    {isListening && activeField === field.name ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-green-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-green-700 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <><Loader2 className="h-5 w-5 animate-spin" /> Analyzing Soil Data...</>
                                ) : (
                                    <><Sprout className="h-5 w-5" /> Get Recommendation</>
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
                                    <div className="bg-green-800 p-2 rounded-lg shrink-0"><CloudSun className="h-5 w-5 text-green-400" /></div>
                                    <p className="text-sm">Optimized for local weather patterns and climate change.</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="bg-green-800 p-2 rounded-lg shrink-0"><Droplets className="h-5 w-5 text-green-400" /></div>
                                    <p className="text-sm">Maximize yield by matching crops to soil nutrient levels.</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="bg-green-800 p-2 rounded-lg shrink-0"><MapPin className="h-5 w-5 text-green-400" /></div>
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
