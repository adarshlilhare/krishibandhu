"use client";

import Link from 'next/link';
import { Leaf, ShieldCheck, TrendingUp, ArrowRight } from 'lucide-react';
import CursorEffect from '@/components/CursorEffect';

export default function ServicesPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-green-500/30 font-sans py-24 relative overflow-hidden">
            <CursorEffect />
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20 z-0 pointer-events-none" />
            
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">Select a <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Service</span></h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">Choose from our suite of AI-powered agricultural tools to optimize your harvest and maximize global market returns.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Disease Detection */}
                    <Link href="/disease-detection" className="group relative glass-card p-10 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden block animate-in fade-in slide-in-from-bottom-12 duration-700 delay-100 fill-mode-both">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative z-10 flex flex-col items-center text-center h-full">
                            <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                                <ShieldCheck className="w-10 h-10 text-green-400" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-4 group-hover:text-green-400 transition-colors">Disease Detection</h2>
                            <p className="text-gray-400 leading-relaxed mb-8 flex-grow">Instantly identify plant pathologies and receive expert remedies via computer vision algorithms.</p>
                            <div className="flex items-center gap-2 text-green-500 font-bold group-hover:translate-x-2 transition-transform">
                                Launch Tool <ArrowRight className="w-5 h-5" />
                            </div>
                        </div>
                    </Link>

                    {/* Crop Advisory */}
                    <Link href="/crop-advisory" className="group relative glass-card p-10 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden block animate-in fade-in slide-in-from-bottom-12 duration-700 delay-200 fill-mode-both">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative z-10 flex flex-col items-center text-center h-full">
                            <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                                <Leaf className="w-10 h-10 text-emerald-400" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors">Crop Advisory</h2>
                            <p className="text-gray-400 leading-relaxed mb-8 flex-grow">Provide regional metrics to receive perfectly tailored agricultural deployment recommendations.</p>
                            <div className="flex items-center gap-2 text-emerald-500 font-bold group-hover:translate-x-2 transition-transform">
                                Launch Tool <ArrowRight className="w-5 h-5" />
                            </div>
                        </div>
                    </Link>

                    {/* Market Insights */}
                    <Link href="/market-insights" className="group relative glass-card p-10 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden block animate-in fade-in slide-in-from-bottom-12 duration-700 delay-300 fill-mode-both">
                        <div className="absolute inset-0 bg-gradient-to-br from-teal-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative z-10 flex flex-col items-center text-center h-full">
                            <div className="w-20 h-20 rounded-full bg-teal-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-teal-500/20 shadow-[0_0_30px_rgba(20,184,166,0.2)]">
                                <TrendingUp className="w-10 h-10 text-teal-400" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-4 group-hover:text-teal-400 transition-colors">Market Insights</h2>
                            <p className="text-gray-400 leading-relaxed mb-8 flex-grow">Estimate intelligent global market pricing, export constraints, and shipping costs seamlessly.</p>
                            <div className="flex items-center gap-2 text-teal-500 font-bold group-hover:translate-x-2 transition-transform">
                                Launch Tool <ArrowRight className="w-5 h-5" />
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
