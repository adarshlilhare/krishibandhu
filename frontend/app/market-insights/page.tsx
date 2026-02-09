"use client";

import { useState } from 'react';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Search, MapPin, Filter } from 'lucide-react';

const MOCK_MARKET_DATA = [
    { crop: "Wheat", price: 2125, change: 2.5, location: "Azadpur Mandi, Delhi" },
    { crop: "Rice (Basmati)", price: 3850, change: -1.2, location: "Karnal Mandi, Haryana" },
    { crop: "Mustard", price: 5450, change: 0.8, location: "Jaipur Mandi, Rajasthan" },
    { crop: "Potato", price: 1200, change: 5.4, location: "Agra Mandi, UP" },
    { crop: "Tomato", price: 2800, change: -3.1, location: "Kolar Mandi, Karnataka" },
    { crop: "Onion", price: 1850, change: 1.5, location: "Lasalgaon Mandi, Maharashtra" },
];

export default function MarketInsights() {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredData = MOCK_MARKET_DATA.filter(item =>
        item.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Market Insights</h1>
                    <p className="text-gray-600">Real-time mandi prices and market trends across India.</p>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-grow md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search crop or mandi..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="bg-white border border-gray-300 p-2.5 rounded-lg hover:bg-gray-50 text-gray-600">
                        <Filter className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredData.map((item, idx) => (
                    <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{item.crop}</h3>
                                <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                                    <MapPin className="h-3 w-3" />
                                    {item.location}
                                </div>
                            </div>
                            <div className={`flex items-center gap-1 px-2 py-1 rounded text-sm font-medium ${item.change >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {item.change >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                                {Math.abs(item.change)}%
                            </div>
                        </div>

                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Current Price</p>
                                <p className="text-2xl font-bold text-gray-900">₹{item.price}<span className="text-sm font-normal text-gray-500">/quintal</span></p>
                            </div>
                            <div className="bg-gray-50 p-2 rounded-lg">
                                <TrendingUp className="h-5 w-5 text-gray-600" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
