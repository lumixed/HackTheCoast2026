import {
    ArrowRight,
    Award,
    Sparkles,
    Zap,
    TrendingUp,
    PenTool,
    UserCircle,
    Globe
} from "lucide-react";
import UniversitySelection from "./components/UniversitySelection";
import { motion } from "framer-motion";

interface HomePageProps {
    onNavigate: (university: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
    return (
        <div className="relative min-h-screen bg-[var(--bg-primary)] overflow-hidden">
            {/* Design System Overlays */}
            <div className="grain-overlay" />
            <div className="grid-pattern absolute inset-0 opacity-20 pointer-events-none" />

            {/* Technical Header */}
            <header className="fixed top-0 left-0 w-full z-50 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <img
                        src="/logo-transparent.png"
                        alt="AwardScope"
                        className="h-10 w-auto dark:invert-0 invert"
                    />
                    <div className="hidden md:flex items-center gap-8 text-[10px] uppercase tracking-[0.3em] font-bold opacity-60">
                        <a href="#features" className="hover:text-[var(--accent-hero)] transition-colors">Methodology</a>
                        <a href="#how-it-works" className="hover:text-[var(--accent-hero)] transition-colors">Framework</a>
                        <a href="#get-started" className="hover:text-[var(--accent-hero)] transition-colors underline decoration-[var(--accent-hero)] decoration-2">Access Portal</a>
                    </div>
                    <button className="text-[10px] border border-[var(--text-primary)] px-4 py-2 uppercase tracking-[0.2em] font-black hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] transition-all">
                        Log In
                    </button>
                </div>
            </header>

            <main className="relative pt-24 pb-12 px-6 max-w-7xl mx-auto">
                {/* Hero Section */}
                <section className="grid lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-3 mb-8"
                        >
                            <div className="h-[1px] w-12 bg-[var(--text-primary)] opacity-30" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">
                                2026 Academic Season
                            </span>
                        </motion.div>

                        <h1 className="text-4xl md:text-6xl font-black leading-[0.9] tracking-tighter mb-6 perspective-text">
                            <motion.span
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: "circOut" }}
                                className="block"
                            >
                                DEMOCRATIZING
                            </motion.span>
                            <motion.span
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.1, ease: "circOut" }}
                                className="block text-stroke"
                            >
                                ACADEMIC
                            </motion.span>
                            <motion.span
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2, ease: "circOut" }}
                                className="block relative"
                            >
                                CAPITAL
                                <span className="absolute -right-8 top-0 text-xl font-mono text-[var(--accent-hero)] accent-glow">*</span>
                            </motion.span>
                        </h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-base md:text-lg font-medium leading-relaxed opacity-70 mb-8 max-w-xl"
                        >
                            AwardScope leverages proprietary neural matching to connect BC students with non-dilutive funding, bypassing traditional scholarship gatekeepers.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="flex flex-wrap gap-4"
                        >
                            <a href="#get-started" className="btn-scope-fill group">
                                Initialize Search
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </a>
                            <a href="#features" className="btn-scope">
                                System Specs
                            </a>
                        </motion.div>
                    </div>

                    {/* Technical Visual Side */}
                    <div className="relative">
                        <div className="aspect-square border border-[var(--border-subtle)] relative overflow-hidden group">
                            <div
                                className="absolute inset-0 bg-cover bg-center grayscale opacity-80 group-hover:grayscale-0 transition-all duration-1000"
                                style={{ backgroundImage: "url('/premium_abstract_texture_1772686097891.png')" }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent" />

                            {/* Floating Technical UI */}
                            <motion.div
                                animate={{ y: [0, -15, 0] }}
                                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-10 right-10 border border-[var(--text-primary)] bg-[var(--bg-primary)] p-6 w-64 shadow-2xl"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="text-[10px] uppercase font-bold tracking-widest opacity-50">Active_Metric</div>
                                    <Sparkles className="h-4 w-4 text-[var(--accent-hero)]" />
                                </div>
                                <div className="text-2xl font-black mb-2">$50,000</div>
                                <div className="text-[10px] uppercase tracking-widest font-bold opacity-60 mb-6">Aggregate Match Potential</div>
                                <div className="space-y-2">
                                    <div className="h-1 bg-[var(--accent-hero)] w-full" />
                                    <div className="h-1 bg-[var(--text-primary)] w-[40%] opacity-20" />
                                </div>
                            </motion.div>

                            <div className="absolute bottom-10 left-10 text-[10px] uppercase font-bold tracking-[0.4em] opacity-40">
                                [ STATUS: READY ]
                            </div>
                        </div>
                    </div>
                </section>

                {/* Partners Marquee */}
                <section className="mt-16 py-6 border-y border-[var(--border-subtle)] overflow-hidden">
                    <div className="flex animate-marquee whitespace-nowrap gap-20">
                        {["UBC", "SFU", "UVIC", "BCIT", "CAPILANO", "UNBC", "TRU", "KPU"].map((uni) => (
                            <span key={uni} className="text-4xl font-black opacity-10 tracking-widest hover:opacity-100 transition-opacity cursor-default">
                                {uni}
                            </span>
                        ))}
                        {/* Duplicate for seamless loop */}
                        {["UBC", "SFU", "UVIC", "BCIT", "CAPILANO", "UNBC", "TRU", "KPU"].map((uni) => (
                            <span key={`dup-${uni}`} className="text-4xl font-black opacity-10 tracking-widest hover:opacity-100 transition-opacity cursor-default">
                                {uni}
                            </span>
                        ))}
                    </div>
                </section>

                {/* Features Bento */}
                <section id="features" className="mt-16 grid md:grid-cols-12 gap-6">
                    <div className="md:col-span-8 scope-card group">
                        <div className="text-[var(--accent-hero)] mb-8">
                            <PenTool size={40} />
                        </div>
                        <h3 className="text-2xl font-black mb-4">Essay Neural-Architect</h3>
                        <p className="text-lg opacity-60 mb-8 max-w-xl">
                            Our proprietary LLM framework analyzes award rubrics to generate high-conversion essay structures and semantic hooks customized to your academic trajectory.
                        </p>
                        <div className="flex gap-4 font-mono text-[10px] uppercase opacity-40">
                            <span>* Context Aware</span>
                            <span>* Rubric Optimized</span>
                            <span>* Zero Hallucination</span>
                        </div>
                    </div>

                    <div className="md:col-span-4 scope-card bg-[var(--text-primary)] text-[var(--bg-primary)]">
                        <Zap size={32} className="text-[var(--accent-hero)] mb-6" />
                        <h3 className="text-2xl font-bold mb-4">Instant Verification</h3>
                        <p className="text-sm opacity-60">
                            Real-time eligibility cross-referencing against the BC Student Awards Database. 100% Precision.
                        </p>
                    </div>

                    <div className="md:col-span-4 scope-card">
                        <TrendingUp size={32} className="mb-6" />
                        <h3 className="text-2xl font-bold mb-4">Smart Filtering</h3>
                        <p className="text-sm opacity-60">
                            Heuristic sorting eliminates noise, presenting only valid funding opportunities.
                        </p>
                    </div>

                    <div className="md:col-span-8 scope-card group flex items-center justify-between">
                        <div>
                            <h3 className="text-3xl font-black mb-2">Global Reach</h3>
                            <p className="opacity-60">Accessing grants beyond institutional boundaries.</p>
                        </div>
                        <Globe size={48} className="opacity-10 group-hover:rotate-45 transition-transform duration-1000" />
                    </div>
                </section>

                {/* Methodology / How it Works */}
                <section id="how-it-works" className="mt-20">
                    <div className="mb-10 text-center">
                        <h2 className="text-3xl font-black tracking-tighter mb-4">THE FRAMEWORK</h2>
                        <div className="h-1 w-20 bg-[var(--accent-hero)] mx-auto accent-glow" />
                    </div>

                    <div className="grid md:grid-cols-3 gap-1px bg-[var(--border-subtle)] border border-[var(--border-subtle)]">
                        {[
                            { step: "01", title: "Ingestion", desc: "Define your academic and demographic parameters within our secure portal.", icon: <UserCircle /> },
                            { step: "02", title: "Analysis", desc: "Our engine executes a deep search across national and private award databases.", icon: <Sparkles /> },
                            { step: "03", title: "Execution", desc: "Deploy AI-assisted applications for maximum funding probability.", icon: <Award /> }
                        ].map((item, i) => (
                            <div key={i} className="bg-[var(--bg-primary)] p-12 transition-colors hover:bg-[var(--accent-hero)] group">
                                <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-8 block group-hover:text-white group-hover:opacity-100">Phase {item.step}</span>
                                <h3 className="text-2xl font-black mb-4 group-hover:text-white">{item.title}</h3>
                                <p className="opacity-60 text-sm group-hover:text-white group-hover:opacity-100">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Final CTA Portal */}
                <section id="get-started" className="mt-16 border-4 border-[var(--text-primary)] p-6 md:p-8 relative overflow-hidden">
                    <div className="grid-pattern absolute inset-0 opacity-10" />
                    <div className="relative z-10 text-center max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-6 italic uppercase">
                            INITIALIZE <br /> PORTAL ACCESS
                        </h2>
                        <p className="text-lg opacity-60 mb-12">
                            Select your institution to begin the credentialization and matching process.
                        </p>
                        <div className="bg-[var(--bg-primary)] p-6 border border-[var(--border-subtle)]">
                            <UniversitySelection onSelect={onNavigate} />
                        </div>
                    </div>
                    {/* Decorative Technical Labels */}
                    <div className="absolute top-4 left-4 text-[8px] font-bold opacity-20 uppercase tracking-[0.5em]">SECURE_PORTAL_V1</div>
                    <div className="absolute bottom-4 right-4 text-[8px] font-mono opacity-20 uppercase tracking-[0.5em]">©2026 AwardScope</div>
                </section>
            </main>

            {/* Micro Footer */}
            <footer className="border-t border-[var(--border-subtle)] py-12 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:row items-center justify-between gap-8 opacity-40 text-[10px] uppercase font-bold tracking-widest">
                    <span>Precision Academic Funding</span>
                    <div className="flex gap-10">
                        <span>Privacy</span>
                        <span>Terms</span>
                        <span>System Status</span>
                    </div>
                    <span>Built for BC Students</span>
                </div>
            </footer>
        </div>
    );
}



