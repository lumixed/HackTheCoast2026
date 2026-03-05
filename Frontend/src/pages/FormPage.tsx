import { useState } from "react";
import StudentForm from "../components/StudentForm";
import Results from "../components/Results";
import { StudentFormData, MatchResult } from "../types";
import axios from "axios";
import { useEffect } from "react";

interface MatchResponse {
    totalMatches: number;
    matches: MatchResult[];
    categorized: {
        perfect: MatchResult[];
        good: MatchResult[];
        partial: MatchResult[];
    };
}

interface FormPageProps {
    selectedUniversity: string;
    onBack: () => void;
}

export default function FormPage({
    selectedUniversity,
    onBack,
}: FormPageProps) {
    const [matches, setMatches] = useState<MatchResult[] | null>(null);
    const [categorized, setCategorized] = useState<{
        perfect: MatchResult[];
        good: MatchResult[];
        partial: MatchResult[];
    } | null>(null);
    const [studentData, setStudentData] = useState<StudentFormData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleFormSubmit = async (formData: StudentFormData) => {
        setLoading(true);
        setError(null);

        try {
            const defaultUrl = import.meta.env.PROD ? "" : "http://localhost:3001";
            const apiUrl = import.meta.env.VITE_API_URL || defaultUrl;

            const response = await axios.post<MatchResponse>(
                `${apiUrl}/api/match`,
                formData
            );

            setMatches(response.data.matches);
            setCategorized(response.data.categorized);
            setStudentData(formData);
        } catch (err) {
            console.error("Error fetching matches:", err);
            if (axios.isAxiosError(err)) {
                setError(
                    `Failed to find matches: ${err.message}. ${err.response?.data?.error || ""
                    }`
                );
            } else {
                setError("Failed to find matches. Please try again (Unknown Error).");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setMatches(null);
        setCategorized(null);
        setStudentData(null);
        setError(null);
    };

    return (
        <div className="min-h-screen relative bg-[var(--bg-primary)] overflow-x-hidden text-[var(--text-primary)]">
            {/* Design System Overlays */}
            <div className="grain-overlay" />
            <div className="grid-pattern absolute inset-0 opacity-20 pointer-events-none" />

            <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border-subtle)]">
                <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                    <div
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={onBack}
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-display font-black tracking-tight group-hover:text-[var(--accent-hero)] transition-colors">
                                AWARD<span className="text-stroke text-transparent">SCOPE</span>
                            </span>
                            <div className="px-2 py-0.5 border border-[var(--accent-hero)] text-[var(--accent-hero)] text-[10px] font-bold tracking-widest uppercase">
                                {selectedUniversity || 'PORTAL'}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onBack}
                        className="btn-scope flex items-center gap-2"
                    >
                        <span>BACK TO DIRECTORY</span>
                    </button>
                </div>
            </header>

            <main className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto z-10">
                {error && (
                    <div className="max-w-3xl mx-auto mb-12">
                        <div className="bg-red-500/10 border border-red-500/30 text-red-500 px-6 py-4 font-bold text-sm tracking-tight flex items-center gap-3">
                            <span className="accent-glow block w-2 h-2 rounded-full bg-red-500"></span>
                            ERROR :: {error.toUpperCase()}
                        </div>
                    </div>
                )}

                {matches === null || categorized === null || studentData === null ? (
                    <div className="max-w-4xl mx-auto">
                        <StudentForm
                            university={selectedUniversity}
                            onSubmit={handleFormSubmit}
                            loading={loading}
                        />
                    </div>
                ) : (
                    <div className="animate-reveal">
                        <Results
                            matches={matches}
                            categorized={categorized}
                            studentData={studentData}
                            onReset={handleReset}
                        />
                    </div>
                )}
            </main>

            <footer className="relative z-10 py-12 border-t border-[var(--border-subtle)] bg-[var(--bg-primary)]">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div>
                        <span className="text-sm font-display font-black tracking-tight">
                            AWARD<span className="text-stroke text-transparent opacity-50">SCOPE</span>
                        </span>
                        <p className="text-[10px] font-bold text-[var(--text-primary)]/40 mt-1 uppercase tracking-widest">
                            Financial Aid Intelligence Engine v1.0
                        </p>
                    </div>

                    <div className="flex gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-primary)]/60">
                        <a href="#" className="hover:text-[var(--accent-hero)] transition-colors">Documentation</a>
                        <a href="#" className="hover:text-[var(--accent-hero)] transition-colors">Infrastructure</a>
                        <a href="#" className="hover:text-[var(--accent-hero)] transition-colors">Privacy Protcol</a>
                    </div>

                    <div className="text-[10px] font-bold text-[var(--text-primary)]/40 uppercase tracking-widest">
                        © 2024 AS_TECH_RES
                    </div>
                </div>
            </footer>
        </div>
    );
}
