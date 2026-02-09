"use client";

import { motion } from 'framer-motion';
import { Scan, Globe, Sprout } from 'lucide-react';

export default function VisualStats() {
    return (
        <section className="py-20 bg-black/50 backdrop-blur-lg border-y border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">

                    {/* Module 1: AI Scan */}
                    <div className="group relative h-48 rounded-2xl bg-white/5 border border-white/10 overflow-hidden flex flex-col items-center justify-center hover:bg-white/10 transition-colors">
                        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
                        <motion.div
                            animate={{ y: [-20, 20, -20] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            className="absolute w-full h-1 bg-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.5)]"
                        />
                        <div className="relative z-10 p-4 rounded-full bg-black/50 border border-green-500/30 mb-4">
                            <Scan className="w-8 h-8 text-green-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">AI Diagnostics</h3>
                        <p className="text-xs text-green-400 uppercase tracking-widest">Active Scanning</p>
                    </div>

                    {/* Module 2: Global Network */}
                    <div className="group relative h-48 rounded-2xl bg-white/5 border border-white/10 overflow-hidden flex flex-col items-center justify-center hover:bg-white/10 transition-colors">
                        <div className="absolute inset-0 flex items-center justify-center opacity-20">
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="w-32 h-32 rounded-full border border-green-500"
                            />
                            <motion.div
                                animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
                                transition={{ duration: 3, delay: 0.5, repeat: Infinity }}
                                className="absolute w-32 h-32 rounded-full border border-green-500"
                            />
                        </div>
                        <div className="relative z-10 p-4 rounded-full bg-black/50 border border-green-500/30 mb-4">
                            <Globe className="w-8 h-8 text-green-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">Farmer Network</h3>
                        <p className="text-xs text-green-400 uppercase tracking-widest">Connected Globally</p>
                    </div>

                    {/* Module 3: Growth Engine */}
                    <div className="group relative h-48 rounded-2xl bg-white/5 border border-white/10 overflow-hidden flex flex-col items-center justify-center hover:bg-white/10 transition-colors">
                        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-green-500/10 to-transparent" />
                        <motion.div
                            initial={{ height: "0%" }}
                            whileInView={{ height: "60%" }}
                            transition={{ duration: 2, ease: "easeOut" }}
                            className="absolute bottom-0 w-1 bg-green-500/50"
                        />
                        <div className="relative z-10 p-4 rounded-full bg-black/50 border border-green-500/30 mb-4">
                            <Sprout className="w-8 h-8 text-green-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">Yield Optimization</h3>
                        <p className="text-xs text-green-400 uppercase tracking-widest">Growth Accelerated</p>
                    </div>

                </div>
            </div>
        </section>
    );
}
