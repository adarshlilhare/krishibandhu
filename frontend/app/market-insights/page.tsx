"use client";

import { useState } from 'react';
import { Loader2, TrendingUp, PackageSearch, Globe, ShieldCheck, MapPin, Store, Landmark, Truck, Mic, MicOff } from 'lucide-react';
import CursorEffect from '@/components/CursorEffect';
import { useAuth } from '@/components/AuthContext';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function MarketInsights() {
    const { user } = useAuth();
    const { isListening, startListening, stopListening, isSupported } = useSpeechRecognition();
    const [activeField, setActiveField] = useState<string | null>(null);

    const handleVoice = (fieldName: string) => {
        if (isListening && activeField === fieldName) {
            stopListening();
            setActiveField(null);
            return;
        }
        setActiveField(fieldName);
        startListening((text) => {
            setPredictForm(prev => ({ ...prev, [fieldName]: text }));
            setActiveField(null);
        });
    };
    const [predictForm, setPredictForm] = useState({
        cropName: '',
        origin: '',
        country: '',
        destinationRegion: '',
        transportMode: 'small_truck',
        exportPort: 'mumbai',
        quality: 'standard',
    });
    const [result, setResult] = useState<any>(null);
    const [isPredicting, setIsPredicting] = useState(false);

    const handlePredictSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPredicting(true);
        try {
            const res = await fetch("/api/price-fetcher", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(predictForm)
            });
            
            if (!res.ok) throw new Error("API failed");
            const data = await res.json();
            if (data.status === "success") {
                setResult(data);
                // Save to Firestore
                if (user) {
                    try {
                        await addDoc(collection(db, 'users', user.uid, 'history'), {
                            type: 'market_insights',
                            input: predictForm,
                            result: data,
                            timestamp: new Date().toISOString(),
                        });
                    } catch (e) { /* silently fail */ }
                }
            } else {
                console.error("API failed:", data.message);
            }
        } catch (error) {
            console.error("Error predicting price:", error);
        } finally {
            setIsPredicting(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setPredictForm({ ...predictForm, [e.target.name]: e.target.value });
    };

    const isDomestic = predictForm.country.toLowerCase().trim() === 'india' || predictForm.country.toLowerCase().trim() === 'bharat';

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <CursorEffect />
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Live Market Pricing</h1>
                <p className="text-gray-600 text-lg">Real-time global crop valuation and localized hauling distance logs.</p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden max-w-5xl mx-auto">
                <div className="bg-green-700 p-8 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-2">Advanced Trade Logistics Engine</h2>
                        <p className="text-green-100 text-lg">Calculate highly precise regional transit costs, port export fees, and mandi yields dynamically.</p>
                    </div>
                    <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
                </div>
                
                <div className="p-8 md:p-10">
                    <form onSubmit={handlePredictSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Crop Name</label>
                            <div className="relative">
                                <input required type="text" name="cropName" value={predictForm.cropName} onChange={handleInputChange} className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none !text-black !bg-white placeholder:!text-gray-400 font-medium transition-all" placeholder="e.g. Wheat" />
                                {isSupported && <button type="button" onClick={() => handleVoice('cropName')} className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-all ${isListening && activeField === 'cropName' ? 'bg-red-500 text-white animate-pulse' : 'text-gray-400 hover:text-green-600 hover:bg-green-50'}`}>{isListening && activeField === 'cropName' ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}</button>}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Origin / Farm Locality</label>
                            <div className="relative">
                                <input required type="text" name="origin" value={predictForm.origin} onChange={handleInputChange} className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none !text-black !bg-white placeholder:!text-gray-400 font-medium transition-all" placeholder="Your Village/Tehsil" />
                                {isSupported && <button type="button" onClick={() => handleVoice('origin')} className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-all ${isListening && activeField === 'origin' ? 'bg-red-500 text-white animate-pulse' : 'text-gray-400 hover:text-green-600 hover:bg-green-50'}`}>{isListening && activeField === 'origin' ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}</button>}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Destination Country</label>
                            <div className="relative">
                                <input required type="text" name="country" value={predictForm.country} onChange={handleInputChange} className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none !text-black !bg-white placeholder:!text-gray-400 font-medium transition-all" placeholder="e.g. India, USA" />
                                {isSupported && <button type="button" onClick={() => handleVoice('country')} className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-all ${isListening && activeField === 'country' ? 'bg-red-500 text-white animate-pulse' : 'text-gray-400 hover:text-green-600 hover:bg-green-50'}`}>{isListening && activeField === 'country' ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}</button>}
                            </div>
                        </div>

                        {isDomestic && (
                            <div className="space-y-2 lg:col-span-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                <label className="text-sm font-bold text-emerald-700">Sale Region / Target Market</label>
                                <input required type="text" name="destinationRegion" value={predictForm.destinationRegion} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border-2 border-emerald-200 focus:ring-2 focus:ring-emerald-500 outline-none !text-black !bg-emerald-50/50 placeholder:!text-emerald-800 font-medium transition-all" placeholder="Target Selling Market or Tehsil" />
                            </div>
                        )}

                        {isDomestic ? (
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Transportation Mode</label>
                                <select name="transportMode" value={predictForm.transportMode} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none !text-black !bg-white font-medium cursor-pointer">
                                    <option value="tractor">Farm Tractor</option>
                                    <option value="small_truck">Small Truck / LCV</option>
                                    <option value="heavy_truck">Heavy Freight Truck</option>
                                    <option value="train">Cargo Train</option>
                                </select>
                            </div>
                        ) : (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                <label className="text-sm font-bold text-blue-800">Exporting Port in India</label>
                                <select name="exportPort" value={predictForm.exportPort} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 focus:ring-2 focus:ring-blue-500 outline-none !text-black !bg-blue-50/50 font-medium cursor-pointer">
                                    <option value="mumbai">Mumbai Port (e.g., to Oman, UAE)</option>
                                    <option value="kandla">Kandla Port (Middle East / Global)</option>
                                    <option value="chennai">Chennai Port (SE Asia)</option>
                                    <option value="kolkata">Kolkata Port (Asia Pacific)</option>
                                    <option value="cochin">Cochin Port (Europe / US)</option>
                                </select>
                            </div>
                        )}
                        
                        <div className={`space-y-2 ${!isDomestic ? 'md:col-span-1 lg:col-span-2' : 'md:col-span-1 lg:col-span-2'}`}>
                            <label className="text-sm font-bold text-gray-700">Crop Quality Grade</label>
                            <select name="quality" value={predictForm.quality} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none !text-black !bg-white font-medium cursor-pointer">
                                <option value="premium">Premium / Export Quality</option>
                                <option value="standard">Standard / Market Grade</option>
                                <option value="low">Low / Below Average</option>
                            </select>
                        </div>
                        
                        <div className="md:col-span-2 lg:col-span-3 pt-4">
                            <button type="submit" disabled={isPredicting} className="bg-green-700 hover:bg-green-800 text-white font-bold py-4 px-10 rounded-2xl transition-all shadow-md hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-3 w-full justify-center text-lg active:scale-[0.98]">
                                {isPredicting ? <Loader2 className="w-6 h-6 animate-spin" /> : "Simulate Distance & Fetch Yields"} 
                            </button>
                        </div>
                    </form>

                    {/* Results Presentation */}
                    {result && (
                        <div className="mt-8 bg-[#f8faf9] rounded-2xl border border-green-100 p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            
                            {result.is_comparison ? (
                                // INDIA MSP VS OPEN MARKET COMPARISON
                                <div>
                                    <div className="mb-8 text-center">
                                        <h3 className="text-gray-500 font-bold uppercase tracking-wider mb-4"><MapPin className="w-4 h-4 inline mr-1 -mt-1"/>{result.message}</h3>
                                        <div className="inline-block bg-green-100 border border-green-200 text-green-900 font-bold px-6 py-4 rounded-xl text-lg shadow-sm">
                                            💡 {result.recommendation}
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Open Market Card */}
                                        <div className={`bg-white p-6 rounded-2xl border-2 transition-all ${result.options.open_market.net_profit > result.options.govt_msp.net_profit ? 'border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.15)] ring-4 ring-green-50' : 'border-gray-100 shadow-sm opacity-80'}`}>
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-blue-100 p-2.5 rounded-xl"><Store className="w-6 h-6 text-blue-700" /></div>
                                                    <h4 className="text-xl font-bold text-gray-900">Local Market</h4>
                                                </div>
                                                {result.options.open_market.net_profit > result.options.govt_msp.net_profit && (
                                                    <span className="bg-green-100 text-green-700 text-xs font-black uppercase px-2 py-1 rounded-md">Best Yield</span>
                                                )}
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex justify-between text-gray-600">
                                                    <span>Open Market Rate:</span>
                                                    <span className="font-semibold text-gray-900">₹{result.options.open_market.gross_price.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between text-red-500 font-medium pb-2">
                                                    <span>Hauling ({result.options.open_market.distance_km}km):</span>
                                                    <span>- ₹{result.options.open_market.transport_cost.toFixed(2)}</span>
                                                </div>
                                                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                                                    <span className="font-bold text-gray-900">Net Profit</span>
                                                    <span className="text-2xl font-black text-green-700">₹{result.options.open_market.net_profit.toFixed(2)}</span>
                                                </div>
                                                <p className="text-xs text-gray-400 text-right mt-1">/quintal</p>
                                            </div>
                                        </div>

                                        {/* Govt MSP Card */}
                                        <div className={`bg-white p-6 rounded-2xl border-2 transition-all ${result.options.govt_msp.net_profit > result.options.open_market.net_profit ? 'border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.15)] ring-4 ring-green-50' : 'border-gray-100 shadow-sm opacity-80'}`}>
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-orange-100 p-2.5 rounded-xl"><Landmark className="w-6 h-6 text-orange-700" /></div>
                                                    <h4 className="text-xl font-bold text-gray-900">Govt Mandi (MSP)</h4>
                                                </div>
                                                {result.options.govt_msp.net_profit > result.options.open_market.net_profit && (
                                                    <span className="bg-green-100 text-green-700 text-xs font-black uppercase px-2 py-1 rounded-md">Best Yield</span>
                                                )}
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex justify-between text-gray-600">
                                                    <span>Guaranteed MSP:</span>
                                                    <span className="font-semibold text-gray-900">₹{result.options.govt_msp.gross_price.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between text-red-500 font-medium pb-2">
                                                    <span>Transit to Mandi ({result.options.govt_msp.distance_km}km):</span>
                                                    <span>- ₹{result.options.govt_msp.transport_cost.toFixed(2)}</span>
                                                </div>
                                                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                                                    <span className="font-bold text-gray-900">Net Profit</span>
                                                    <span className="text-2xl font-black text-green-700">₹{result.options.govt_msp.net_profit.toFixed(2)}</span>
                                                </div>
                                                <p className="text-xs text-gray-400 text-right mt-1">/quintal</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                // INTERNATIONAL EXPORT UI
                                <div>
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                                        <div>
                                            <h3 className="text-blue-800 font-extrabold text-lg md:text-xl uppercase tracking-wider mb-2"><Globe className="w-5 h-5 inline mr-2 -mt-1"/>{result.message}</h3>
                                        </div>
                                        <div className="text-right bg-blue-50 border border-blue-200 px-6 py-3 rounded-2xl">
                                            <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-1">Estimated Net Profit</p>
                                            <div className="text-3xl md:text-4xl font-black text-blue-900">
                                                {result.symbol}{result.price.toFixed(2)} <span className="text-blue-600/50 text-base font-bold tracking-normal">/qtl</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-white rounded-2xl border-2 border-blue-100 p-6 md:p-8 shadow-sm transition-all hover:shadow-md">
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center text-lg md:text-xl">
                                                <span className="font-bold text-gray-700 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-green-500"/> Gross Export Market Value:</span>
                                                <span className="font-black text-gray-900">{result.symbol}{result.breakdown.gross_price.toFixed(2)}</span>
                                            </div>
                                            
                                            <hr className="border-gray-100 my-4" />
                                            <div className="pl-2 md:pl-7 space-y-3">
                                                <div className="flex justify-between text-red-500 font-medium text-sm md:text-base border-b border-gray-50 pb-2">
                                                    <span className="flex items-center gap-2">Origin Port Transit:</span>
                                                    <span>- {result.symbol}{result.breakdown.transit_to_port.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between text-red-500 font-medium text-sm md:text-base border-b border-gray-50 pb-2">
                                                    <span className="flex items-center gap-2">Export Duty (15%):</span>
                                                    <span>- {result.symbol}{result.breakdown.export_tax.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between text-red-500 font-medium text-sm md:text-base border-b border-gray-50 pb-2">
                                                    <span className="flex items-center gap-2">Ocean Freight:</span>
                                                    <span>- {result.symbol}{result.breakdown.international_shipping.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between text-red-500 font-medium text-sm md:text-base pb-2">
                                                    <span className="flex items-center gap-2">Foreign Inland Logistics ({result.breakdown.foreign_inland_km}km):</span>
                                                    <span>- {result.symbol}{result.breakdown.transit_foreign_inland.toFixed(2)}</span>
                                                </div>
                                            </div>
                                            <hr className="border-gray-100 my-4" />
                                            
                                            <div className="flex justify-between items-center text-xl md:text-2xl pt-2">
                                                <span className="font-black text-gray-900">Final Net Profit</span>
                                                <span className="font-black text-green-600">{result.symbol}{result.price.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
