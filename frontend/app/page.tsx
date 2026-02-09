"use client";

import { Leaf, ShieldCheck, TrendingUp, CloudSun, Zap, Brain, Smartphone } from 'lucide-react';
import Hero from '@/components/Hero';
import FeatureCard from '@/components/FeatureCard';
import VisualStats from '@/components/VisualStats';
import CursorEffect from '@/components/CursorEffect';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-green-500/30">
      <CursorEffect />

      <Hero />

      <VisualStats />

      {/* Features Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-green-900/10 -skew-y-3 transform origin-top-left scale-110" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Advanced <span className="text-green-400">Intelligence</span> for Your Farm
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-400 max-w-2xl mx-auto"
            >
              Our neural networks process millions of data points to provide you with accurate, actionable insights.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={ShieldCheck}
              title="Disease Detection"
              description="Computer vision algorithms identify plant pathologies with 98.5% accuracy in milliseconds."
              delay={0}
            />
            <FeatureCard
              icon={Leaf}
              title="Crop Advisory"
              description="Soil analysis and climate modeling to recommend the perfect crops for your specific conditions."
              delay={0.1}
            />
            <FeatureCard
              icon={TrendingUp}
              title="Market Intelligence"
              description="Predictive analytics for market prices to help you sell at the optimal time."
              delay={0.2}
            />
            <FeatureCard
              icon={CloudSun}
              title="Hyper-local Weather"
              description="Micro-climate forecasting to plan irrigation and harvesting with precision."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Tech/How it Works Section */}
      <section className="py-24 bg-gradient-to-b from-black to-green-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Powered by <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Next-Gen Technology</span>
              </h2>
              <p className="text-lg text-gray-400 leading-relaxed">
                KrishiBandhu isn't just an app; it's a sophisticated agricultural operating system. We combine satellite imagery, IoT sensor data, and deep learning models to create a digital twin of your farm.
              </p>

              <div className="space-y-4">
                {[
                  { icon: Brain, text: "Deep Learning Models" },
                  { icon: Zap, text: "Real-time Processing" },
                  { icon: Smartphone, text: "Offline-First Architecture" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <item.icon className="w-6 h-6 text-green-400" />
                    <span className="font-semibold text-white">{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full" />
              <div className="relative glass-card p-8 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl">
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-40 rounded-2xl bg-green-500/10 animate-pulse" />
                  <div className="h-40 rounded-2xl bg-green-500/5" />
                  <div className="h-40 rounded-2xl bg-green-500/5" />
                  <div className="h-40 rounded-2xl bg-green-500/10 animate-pulse delay-75" />
                </div>
                <div className="mt-6 text-center">
                  <p className="text-sm text-green-400 font-mono">PROCESSING FARM DATA...</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-green-600/10" />
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold mb-8"
          >
            Ready to <span className="text-green-500">Transform</span> Your Harvest?
          </motion.h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-12 py-5 bg-green-500 text-black font-bold text-xl rounded-full shadow-[0_0_30px_rgba(34,197,94,0.4)] hover:shadow-[0_0_50px_rgba(34,197,94,0.6)] transition-all"
          >
            Get Started Now
          </motion.button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 bg-black">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500">
          <p>© 2024 KrishiBandhu AI. Engineering the future of food.</p>
        </div>
      </footer>
    </div>
  );
}
