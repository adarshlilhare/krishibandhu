"use client";

import { motion } from 'framer-motion';

const stats = [
    { label: "Active Farmers", value: "10K+", delay: 0 },
    { label: "Diseases Detected", value: "50K+", delay: 0.1 },
    { label: "Accuracy Rate", value: "98.5%", delay: 0.2 },
    { label: "Crops Supported", value: "100+", delay: 0.3 },
];

export default function StatsSection() {
    return (
        <section className="py-20 bg-black/50 backdrop-blur-lg border-y border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: stat.delay }}
                            viewport={{ once: true }}
                            className="text-center"
                        >
                            <h3 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 mb-2">
                                {stat.value}
                            </h3>
                            <p className="text-green-400 font-medium uppercase tracking-wider text-sm">
                                {stat.label}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
