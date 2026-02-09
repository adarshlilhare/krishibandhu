import Link from 'next/link';
import { Leaf, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-green-900 text-white pt-12 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Leaf className="h-6 w-6 text-green-400" />
                            <span className="font-bold text-xl tracking-tight">KrishiBandhu</span>
                        </div>
                        <p className="text-green-200 text-sm">
                            Empowering farmers with AI-driven insights for a sustainable and prosperous future.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-green-200 text-sm">
                            <li><Link href="/disease-detection" className="hover:text-white transition-colors">Disease Detection</Link></li>
                            <li><Link href="/crop-advisory" className="hover:text-white transition-colors">Crop Advisory</Link></li>
                            <li><Link href="/market-insights" className="hover:text-white transition-colors">Market Insights</Link></li>
                            <li><Link href="/weather" className="hover:text-white transition-colors">Weather Alerts</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
                        <ul className="space-y-2 text-green-200 text-sm">
                            <li className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                <span>+91 1800-123-4567</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                <span>support@krishibandhu.in</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <span>New Delhi, India</span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-lg mb-4">Newsletter</h3>
                        <p className="text-green-200 text-sm mb-4">Subscribe for latest agricultural updates.</p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-green-800 text-white px-3 py-2 rounded-md text-sm w-full focus:outline-none focus:ring-1 focus:ring-green-400"
                            />
                            <button className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                                Join
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-green-800 mt-12 pt-8 text-center text-green-400 text-sm">
                    <p>&copy; {new Date().getFullYear()} KrishiBandhu. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
