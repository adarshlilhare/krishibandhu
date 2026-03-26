"use client";

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, Leaf, Sprout, CloudSun, BarChart3, Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    if (pathname === '/') return null;

    const navItems = [
        { name: 'Home', href: '/dashboard', icon: Sprout },
        { name: 'Disease Detection', href: '/disease-detection', icon: Leaf },
        { name: 'Crop Advisory', href: '/crop-advisory', icon: CloudSun },
        { name: 'Market Insights', href: '/market-insights', icon: BarChart3 },
    ];

    return (
        <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-green-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/dashboard" className="flex-shrink-0 flex items-center gap-2">
                            <div className="bg-green-600 p-1.5 rounded-lg">
                                <Leaf className="h-6 w-6 text-white" />
                            </div>
                            <span className="font-bold text-xl text-green-800 tracking-tight">KrishiBandhu</span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="flex items-center gap-1.5 text-gray-600 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                <item.icon className="h-4 w-4" />
                                {item.name}
                            </Link>
                        ))}
                        <button className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors shadow-sm">
                            <Mic className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-green-600 hover:text-green-800 focus:outline-none"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-b border-green-100 overflow-hidden"
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="flex items-center gap-2 text-gray-600 hover:text-green-600 hover:bg-green-50 block px-3 py-2 rounded-md text-base font-medium"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <item.icon className="h-5 w-5" />
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
