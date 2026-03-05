import { School, GraduationCap } from "lucide-react";

interface UniversitySelectionProps {
    onSelect: (university: string) => void;
}

const universities = [
    {
        id: "University of British Columbia",
        name: "UNIVERSITY OF BRITISH COLUMBIA",
        shortName: "UBC",
        code: "UBC_SEC_01",
    },
    {
        id: "Simon Fraser University",
        name: "SIMON FRASER UNIVERSITY",
        shortName: "SFU",
        code: "SFU_SEC_02",
    },
    {
        id: "University of Victoria",
        name: "UNIVERSITY OF VICTORIA",
        shortName: "UVIC",
        code: "UVIC_SEC_03",
    },
    {
        id: "British Columbia Institute of Technology",
        name: "BRITISH COLUMBIA INSTITUTE OF TECHNOLOGY",
        shortName: "BCIT",
        code: "BCIT_SEC_04",
    },
    {
        id: "University of Northern British Columbia",
        name: "UNIVERSITY OF NORTHERN BRITISH COLUMBIA",
        shortName: "UNBC",
        code: "UNBC_SEC_05",
    },
    {
        id: "Thompson Rivers University",
        name: "THOMPSON RIVERS UNIVERSITY",
        shortName: "TRU",
        code: "TRU_SEC_06",
    },
];

export default function UniversitySelection({
    onSelect,
}: UniversitySelectionProps) {
    return (
        <div className="w-full max-w-5xl mx-auto px-4">
            <div className="mb-6 text-center">
                <div className="accent-glow block w-10 h-[2px] bg-[var(--accent-hero)] mb-4 mx-auto"></div>
                <h2 className="font-display text-2xl font-black text-[var(--text-primary)] leading-tight mb-2 uppercase">
                    INSTITUTIONAL_DIRECTORY
                </h2>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--text-primary)] opacity-40">
                    Phase 00 :: Registry Identifier
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--border-subtle)] border border-[var(--border-subtle)]">
                {universities.map((uni) => (
                    <button
                        key={uni.id}
                        onClick={() => onSelect(uni.id)}
                        className="group relative bg-[var(--bg-primary)] p-6 text-left transition-all hover:bg-[var(--text-primary)]/5"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-2 border border-[var(--border-subtle)] group-hover:border-[var(--text-primary)] transition-colors">
                                <School size={16} className="text-[var(--text-primary)]" />
                            </div>
                            <span className="text-[9px] font-bold tracking-widest text-[var(--accent-hero)] uppercase">
                                Verified Institution
                            </span>
                        </div>

                        <h3 className="text-xl font-display font-black text-[var(--text-primary)] leading-tight mb-2 tracking-tight">
                            {uni.name}
                        </h3>

                        <div className="flex items-center gap-2 mt-4">
                            <span className="px-2 py-0.5 border border-[var(--accent-hero)] text-[var(--accent-hero)] text-[8px] font-black tracking-widest uppercase">
                                {uni.shortName}
                            </span>
                            <span className="text-[9px] font-bold text-[var(--text-primary)]/40 uppercase tracking-[0.1em]">
                                View Available Awards
                            </span>
                        </div>

                        {/* Hover Indicator */}
                        <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[var(--accent-hero)] group-hover:w-full transition-all duration-500 ease-out" />
                    </button>
                ))}

                {/* Placeholder for other universities */}
                <div className="p-6 bg-[var(--bg-primary)]/50 flex flex-col justify-center items-center gap-2 border-2 border-dashed border-[var(--border-subtle)] m-px">
                    <GraduationCap className="text-[var(--text-primary)]/10" size={24} />
                    <p className="text-[9px] font-black uppercase tracking-[0.1em] text-[var(--text-primary)]/20 text-center">
                        Extended Registry<br />Deployment Pending
                    </p>
                </div>
            </div>

            <div className="mt-12 flex justify-between items-center opacity-20">
                <div className="text-[9px] font-black tracking-[0.4em] uppercase">SYSTEM_DIR_V.032</div>
                <div className="text-[9px] font-black tracking-[0.4em] uppercase">CONNECTED // LOCAL_SECURE</div>
            </div>
        </div>
    );
}
