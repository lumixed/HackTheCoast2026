import { useState } from "react";
import { motion } from "framer-motion";
import { MatchResult, AIAnalysis, StudentFormData } from "../types";
import AnalysisModal from "./AnalysisModal";
import EssayArchitectModal from "./EssayArchitectModal";
import axios from "axios";
import {
    ChevronRight,
    BarChart2,
    PenTool,
    Loader2,
} from "lucide-react";
interface ResultsProps {
    matches: MatchResult[];
    categorized: {
        perfect: MatchResult[];
        good: MatchResult[];
        partial: MatchResult[];
    };
    studentData: StudentFormData;
    onReset: () => void;
}

const Results: React.FC<ResultsProps> = ({
    matches,
    categorized,
    studentData,
    onReset,
}) => {
    const [analyses, setAnalyses] = useState<Record<string, AIAnalysis>>({});
    const [loadingAnalysis, setLoadingAnalysis] = useState<
        Record<string, boolean>
    >({});
    const [selectedAnalysis, setSelectedAnalysis] = useState<AIAnalysis | null>(
        null
    );
    const [essayGuide, setEssayGuide] = useState<{
        guide: any;
        match: MatchResult;
    } | null>(null);
    const [loadingEssay, setLoadingEssay] = useState<Record<string, boolean>>({});
    const [analyzingAll, setAnalyzingAll] = useState(false);

    const formatAmount = (amount: number | string): string => {
        if (typeof amount === "string") return amount;
        return `$${amount.toLocaleString()}`;
    };

    const analyzeAward = async (awardId: string) => {
        if (analyses[awardId]) {
            setSelectedAnalysis(analyses[awardId]);
            return;
        }

        setLoadingAnalysis((prev) => ({ ...prev, [awardId]: true }));

        try {
            const defaultUrl = import.meta.env.PROD ? "" : "http://localhost:3001";
            const apiUrl = import.meta.env.VITE_API_URL || defaultUrl;
            const response = await axios.post<AIAnalysis>(
                `${apiUrl}/api/analyze-chance`,
                {
                    studentData,
                    awardId,
                }
            );

            const analysis = response.data;
            setAnalyses((prev) => ({ ...prev, [awardId]: analysis }));
            setSelectedAnalysis(analysis);
        } catch (error) {
            console.error("Error analyzing award:", error);
        } finally {
            setLoadingAnalysis((prev) => ({ ...prev, [awardId]: false }));
        }
    };

    const analyzeTopMatches = async () => {
        setAnalyzingAll(true);
        const topAwards = matches.slice(0, 5);

        for (const match of topAwards) {
            if (!analyses[match.award.id]) {
                setLoadingAnalysis((prev) => ({ ...prev, [match.award.id]: true }));
                try {
                    const defaultUrl = import.meta.env.PROD
                        ? ""
                        : "http://localhost:3001";
                    const apiUrl = import.meta.env.VITE_API_URL || defaultUrl;
                    const response = await axios.post<AIAnalysis>(
                        `${apiUrl}/api/analyze-chance`,
                        {
                            studentData,
                            awardId: match.award.id,
                        }
                    );
                    setAnalyses((prev) => ({ ...prev, [match.award.id]: response.data }));
                } catch (error) {
                    console.error("Error analyzing award:", error);
                } finally {
                    setLoadingAnalysis((prev) => ({ ...prev, [match.award.id]: false }));
                }
            }
        }
        setAnalyzingAll(false);
    };

    const generateEssay = async (match: MatchResult) => {
        const awardId = match.award.id;
        if (loadingEssay[awardId]) return;

        setLoadingEssay((prev) => ({ ...prev, [awardId]: true }));

        try {
            const defaultUrl = import.meta.env.PROD ? "" : "http://localhost:3001";
            const apiUrl = import.meta.env.VITE_API_URL || defaultUrl;
            const response = await axios.post(
                `${apiUrl}/api/generate-essay`,
                {
                    studentData,
                    awardId,
                }
            );

            setEssayGuide({ guide: response.data, match });
        } catch (error) {
            console.error("Error generating essay:", error);
        } finally {
            setLoadingEssay((prev) => ({ ...prev, [awardId]: false }));
        }
    };

    const renderMatchCard = (matchResult: MatchResult) => {
        const { award, matchScore, matchReasons, missingRequirements } =
            matchResult;
        const isLoading = loadingAnalysis[award.id];
        const isEssayLoading = loadingEssay[award.id];

        return (
            <motion.div
                key={award.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="scope-card group relative p-10 hover:border-[var(--text-primary)] transition-all"
            >
                <div className="flex justify-between items-start mb-10 relative z-10">
                    <div className="flex-1">
                        <h3 className="text-2xl font-display font-black text-[var(--text-primary)] leading-tight mb-4">
                            {award.name}
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            <div className="px-3 py-1 border border-[var(--border-subtle)] text-[10px] font-bold uppercase tracking-widest text-[var(--text-primary)]/60">
                                {award.type}
                            </div>
                            <div className={`px-3 py-1 border border-[var(--accent-hero)] text-[10px] font-bold uppercase tracking-widest bg-[var(--accent-hero)] dark:text-black text-white`}>
                                MATCH PROBABILITY: {matchScore}%
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-display font-black text-[var(--text-primary)]">
                            {formatAmount(award.amount)}
                        </div>
                        {award.applicationDeadline && (
                            <div className="text-[10px] font-bold text-[var(--text-primary)]/40 mt-2 uppercase tracking-widest">
                                DEADLINE // {award.applicationDeadline}
                            </div>
                        )}
                    </div>
                </div>

                <p className="text-lg text-[var(--text-primary)]/70 mb-12 leading-relaxed max-w-2xl">
                    {award.description}
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-12">
                    {matchReasons.length > 0 && (
                        <div className="p-6 bg-[var(--text-primary)] text-[var(--bg-primary)]">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-[var(--accent-hero)]">
                                Eligibility Profile Match
                            </h4>
                            <ul className="space-y-3">
                                {matchReasons.map((reason, idx) => (
                                    <li key={idx} className="text-xs font-bold leading-relaxed opacity-80 border-b border-white/10 pb-2 last:border-0 uppercase tracking-tight">
                                        {reason}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {missingRequirements.length > 0 && (
                        <div className="p-6 border border-red-500/20">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-red-500">
                                Potential Requirement Gaps
                            </h4>
                            <ul className="space-y-3">
                                {missingRequirements.map((req, idx) => (
                                    <li key={idx} className="text-xs font-bold leading-relaxed opacity-40 uppercase tracking-tight">
                                        {req}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="flex justify-between items-center border-t border-[var(--border-subtle)] pt-8">
                    <div className="flex gap-4">
                        <button
                            onClick={() => analyzeAward(award.id)}
                            disabled={isLoading}
                            className="btn-scope flex items-center gap-2"
                        >
                            {isLoading ? <Loader2 size={12} className="animate-spin" /> : <BarChart2 size={12} />}
                            Probability Analysis
                        </button>
                        <button
                            onClick={() => generateEssay(matchResult)}
                            disabled={isEssayLoading}
                            className="btn-scope flex items-center gap-2"
                        >
                            {isEssayLoading ? <Loader2 size={12} className="animate-spin" /> : <PenTool size={12} />}
                            Essay Architect
                        </button>
                    </div>

                    {award.sourceUrl && (
                        <a
                            href={award.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-black uppercase tracking-widest hover:text-[var(--accent-hero)] transition-colors flex items-center gap-2"
                        >
                            Original Source <ChevronRight size={12} />
                        </a>
                    )}
                </div>
            </motion.div>
        );
    };



    return (
        <div className="max-w-6xl mx-auto">
            <div className="scope-card p-8 mb-10 relative overflow-hidden transition-all duration-500 group">
                <div className="flex flex-col md:flex-row justify-between items-end gap-12 relative z-10">
                    <div>
                        <div className="accent-glow block w-10 h-[2px] bg-[var(--accent-hero)] mb-6"></div>
                        <h2 className="font-display text-5xl font-black text-[var(--text-primary)] leading-none mb-4">
                            ELIGIBLE<br />
                            <span className="text-stroke text-transparent">MATCHES_</span>
                        </h2>
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--text-primary)] opacity-40">
                            Scan complete // {matches.length} Results Found
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={analyzeTopMatches}
                            disabled={analyzingAll}
                            className="btn-scope-fill flex items-center gap-3"
                        >
                            {analyzingAll ? (
                                <>
                                    <Loader2 className="animate-spin" /> RUNNING_ANALYSIS...
                                </>
                            ) : (
                                <>
                                    <BarChart2 size={16} /> Analyze Key Matches
                                </>
                            )}
                        </button>
                        <button
                            onClick={onReset}
                            className="btn-scope"
                        >
                            Start New Search
                        </button>
                    </div>
                </div>

                {matches.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--border-subtle)] mt-10 border border-[var(--border-subtle)]">
                        <div className="p-6 bg-[var(--bg-primary)]">
                            <div className="text-4xl font-display font-black text-[var(--text-primary)] mb-2">
                                {categorized.perfect.length}
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
                                Top Matches
                            </div>
                        </div>
                        <div className="p-6 bg-[var(--bg-primary)]">
                            <div className="text-4xl font-display font-black text-[var(--text-primary)] mb-2">
                                {categorized.good.length}
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
                                Strong Matches
                            </div>
                        </div>
                        <div className="p-6 bg-[var(--bg-primary)]">
                            <div className="text-4xl font-display font-black text-[var(--text-primary)] mb-2">
                                {categorized.partial.length}
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
                                All Candidates
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {matches.length === 0 ? (
                <div className="scope-card p-24 text-center">
                    <div className="text-[var(--text-primary)]/20 text-7xl mb-10 font-display font-black">0 RESULTS</div>
                    <h3 className="text-2xl font-display font-black text-[var(--text-primary)] mb-4">
                        NO AWARDS FOUND
                    </h3>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-primary)] opacity-40 max-w-sm mx-auto leading-loose">
                        Search parameters yielded zero results from the current database.
                        Re-adjusting verification parameters is recommended.
                    </p>
                </div>
            ) : (
                <div className="space-y-16 pb-20">
                    {categorized.perfect.length > 0 && (
                        <div>
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-12 h-[2px] bg-[var(--accent-hero)]"></div>
                                <h3 className="text-2xl font-display font-black text-[var(--text-primary)] tracking-tight uppercase">
                                    SECTION_01 // Optimal Matches
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 gap-12">
                                {categorized.perfect.map(renderMatchCard)}
                            </div>
                        </div>
                    )}

                    {categorized.good.length > 0 && (
                        <div>
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-12 h-[2px] bg-[var(--text-primary)] opacity-20"></div>
                                <h3 className="text-2xl font-display font-black text-[var(--text-primary)] tracking-tight uppercase">
                                    SECTION_02 // High Probability
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 gap-12">
                                {categorized.good.map(renderMatchCard)}
                            </div>
                        </div>
                    )}

                    {categorized.partial.length > 0 && (
                        <div>
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-12 h-[2px] bg-[var(--text-primary)] opacity-10"></div>
                                <h3 className="text-2xl font-display font-black text-[var(--text-primary)] tracking-tight uppercase">
                                    SECTION_03 // Potential Candidates
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 gap-12">
                                {categorized.partial.map(renderMatchCard)}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Analysis Modal */}
            {selectedAnalysis && (
                <AnalysisModal
                    analysis={selectedAnalysis}
                    onClose={() => setSelectedAnalysis(null)}
                />
            )}

            {/* Essay Architect Modal */}
            {essayGuide && (
                <EssayArchitectModal
                    guide={essayGuide.guide}
                    match={essayGuide.match}
                    onClose={() => setEssayGuide(null)}
                />
            )}
        </div>
    );
};

export default Results;