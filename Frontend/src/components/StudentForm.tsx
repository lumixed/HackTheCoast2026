import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronRight,
    ChevronLeft,
    Check,
    Loader2,
    BarChart2,
    Zap,
    Globe,
    User,
    HeartHandshake,
    DollarSign,
    Users
} from "lucide-react";
import { StudentFormData } from "../types";

interface StudentFormProps {
    university: string;
    onSubmit: (data: StudentFormData) => void;
    loading: boolean;
}

const steps = [
    {
        id: 1,
        title: "ACADEMIC",
        icon: <BarChart2 size={16} />,
        description: "Phase 01",
    },
    {
        id: 2,
        title: "PERSONAL",
        icon: <User size={16} />,
        description: "Phase 02",
    },
    {
        id: 3,
        title: "FINANCIAL",
        icon: <DollarSign size={16} />,
        description: "Phase 03",
    },
    {
        id: 4,
        title: "AFFILIATIONS",
        icon: <Users size={16} />,
        description: "Phase 04",
    },
];

const StudentForm: React.FC<StudentFormProps> = ({
    university,
    onSubmit,
    loading,
}) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<StudentFormData>({
        university,
        faculty: "",
        year: 1,
        program: "",
        gpa: 0,
        campus: "Vancouver",
        citizenshipStatus: "Canadian Citizen",
        indigenousStatus: false,
        hasDisability: false,
        hasStudentLoan: false,
        hasFinancialNeed: false,
        gender: "",
        affiliations: {},
        formerYouthInCare: false,
        partTimeStudent: false,
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;

        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData((prev) => ({
                ...prev,
                [name]: checked,
            }));
        } else if (name === "year") {
            setFormData((prev) => ({
                ...prev,
                [name]: parseInt(value) || 1,
            }));
        } else if (type === "number") {
            let val = parseFloat(value) || 0;
            if (name === "gpa" && val > 4.33) {
                val = 4.33;
            }
            setFormData((prev) => ({
                ...prev,
                [name]: val,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const [isStepChanging, setIsStepChanging] = useState(false);

    const handleTransition = (callback: () => void) => {
        if (isStepChanging) return;
        setIsStepChanging(true);
        callback();
        setTimeout(() => setIsStepChanging(false), 500);
    };

    const nextStep = () => {
        handleTransition(() => {
            if (currentStep < steps.length) {
                setCurrentStep((prev) => prev + 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        });
    };

    const prevStep = () => {
        handleTransition(() => {
            if (currentStep > 1) {
                setCurrentStep((prev) => prev - 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isStepChanging) return;

        if (currentStep < steps.length) {
            nextStep();
        } else {
            onSubmit(formData);
        }
    };

    const SelectionCard = ({
        title,
        description,
        checked,
        onChange,
        icon,
    }: {
        title: string;
        description?: string;
        checked: boolean;
        onChange: () => void;
        icon?: React.ReactNode;
    }) => (
        <div
            onClick={onChange}
            className={`cursor-pointer border p-6 transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-full
        ${checked
                    ? "bg-[var(--accent-hero)] border-[var(--accent-hero)] dark:text-black text-white"
                    : "bg-transparent border-[var(--border-subtle)] hover:border-[var(--text-primary)]"
                }`}
        >
            <div className="flex justify-between items-start mb-8">
                <div className={`p-2 border ${checked ? "border-black/20" : "border-[var(--border-subtle)]"}`}>
                    {icon}
                </div>
                <div className={`w-4 h-4 border ${checked ? "border-black bg-black" : "border-[var(--border-subtle)]"} flex items-center justify-center`}>
                    {checked && <Check size={10} strokeWidth={4} className="text-[var(--accent-hero)]" />}
                </div>
            </div>
            <div>
                <h4 className="font-display font-black text-xl uppercase tracking-tight mb-2">
                    {title}
                </h4>
                {description && (
                    <p className={`text-[10px] font-bold uppercase tracking-widest leading-relaxed ${checked ? "opacity-70" : "opacity-40"}`}>
                        {description}
                    </p>
                )}
            </div>
        </div>
    );

    const pageVariants = {
        initial: {
            opacity: 0,
            y: 20,
        },
        animate: {
            opacity: 1,
            y: 0,
        },
        exit: {
            opacity: 0,
            y: -20,
        },
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-4 relative z-10 font-sans">
            <div className="mb-10 grid grid-cols-4 gap-4">
                {steps.map((step) => {
                    const isCompleted = currentStep > step.id;
                    const isCurrent = currentStep === step.id;

                    return (
                        <div
                            key={step.id}
                            className={`relative border-t-2 pt-4 transition-all duration-500
                ${isCurrent || isCompleted ? "border-[var(--accent-hero)]" : "border-[var(--border-subtle)]"}
              `}
                        >
                            <div className="flex justify-between items-center mb-1">
                                <span className={`text-[10px] font-bold tracking-[0.2em] font-sans
                  ${isCurrent || isCompleted ? "text-[var(--accent-hero)]" : "text-[var(--text-primary)]/30"}
                `}>
                                    {step.description}
                                </span>
                                {isCompleted && <Check size={10} className="text-[var(--accent-hero)]" />}
                            </div>
                            <h3 className={`text-sm font-display font-black tracking-tight
                ${isCurrent || isCompleted ? "text-[var(--text-primary)]" : "text-[var(--text-primary)]/20"}
              `}>
                                {step.title}
                            </h3>
                        </div>
                    );
                })}
            </div>

            <motion.div
                className="scope-card bg-transparent relative isolate transition-colors duration-300"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
                <div className="absolute -left-12 top-0 bottom-0 w-8 border-r border-[var(--border-subtle)] hidden xl:flex flex-col justify-between py-10">
                    <div className="text-[10px] font-bold rotate-90 origin-left text-[var(--accent-hero)]">SYS_FORM_READY</div>
                    <div className="text-[10px] font-bold rotate-90 origin-left opacity-20 whitespace-nowrap">0x88291_002</div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="p-8 min-h-[400px]"
                    >
                        {currentStep === 1 && (
                            <div className="space-y-8">
                                <div className="mb-8 relative">
                                    <div className="accent-glow block w-10 h-[2px] bg-[var(--accent-hero)] mb-6"></div>
                                    <h2 className="font-display text-5xl font-black text-[var(--text-primary)] leading-none mb-4">
                                        ACADEMIC<br />
                                        <span className="text-stroke text-transparent">PROFILE_</span>
                                    </h2>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--text-primary)] opacity-40">
                                        Phase 01 :: Identity Verification & Eligibility Parameters
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-4 group">
                                        <label className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-widest block opacity-40">
                                            01 / CAMPUS_LOCATION
                                        </label>
                                        <div className="relative">
                                            <select
                                                name="campus"
                                                value={formData.campus}
                                                onChange={handleChange}
                                                className="w-full h-16 bg-transparent border-b border-[var(--border-subtle)] focus:border-[var(--accent-hero)] transition-all outline-none font-display text-2xl font-black text-[var(--text-primary)] appearance-none cursor-pointer"
                                            >
                                                <option value="Vancouver">Vancouver Main</option>
                                                <option value="Okanagan">Okanagan Satellite</option>
                                            </select>
                                            <ChevronRight className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 opacity-20 rotate-90" />
                                        </div>
                                    </div>

                                    <div className="space-y-4 group">
                                        <label className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-widest block opacity-40">
                                            02 / ACADEMIC_YEAR
                                        </label>
                                        <div className="relative">
                                            <select
                                                name="year"
                                                value={formData.year}
                                                onChange={handleChange}
                                                className="w-full h-16 bg-transparent border-b border-[var(--border-subtle)] focus:border-[var(--accent-hero)] transition-all outline-none font-display text-2xl font-black text-[var(--text-primary)] appearance-none cursor-pointer"
                                            >
                                                {[1, 2, 3, 4, 5].map((y) => (
                                                    <option key={y} value={y}>
                                                        YEAR_0{y}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronRight className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 opacity-20 rotate-90" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 group">
                                    <label className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-widest block opacity-40">
                                        03 / FACULTY_SPECIALIZATION
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="faculty"
                                            value={formData.faculty}
                                            onChange={handleChange}
                                            className="w-full h-16 bg-transparent border-b border-[var(--border-subtle)] focus:border-[var(--accent-hero)] transition-all outline-none font-display text-2xl font-black text-[var(--text-primary)] appearance-none cursor-pointer"
                                        >
                                            <option value="">SELECT_INPUT_EXPECTED...</option>
                                            {[
                                                "Arts",
                                                "Science",
                                                "Engineering",
                                                "Forestry",
                                                "Medicine",
                                                "Dentistry",
                                                "Law",
                                                "Graduate Studies",
                                                "Commerce/Sauder",
                                                "Education",
                                                "Land and Food Systems",
                                                "Kinesiology",
                                            ]
                                                .sort()
                                                .map((f) => (
                                                    <option key={f} value={f}>
                                                        {f.toUpperCase()}
                                                    </option>
                                                ))}
                                        </select>
                                        <ChevronRight className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 opacity-20 rotate-90" />
                                    </div>
                                </div>

                                <div className="space-y-4 group">
                                    <label className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-widest block opacity-40">
                                        04 / AGGREGATE_GPA_METRIC
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            name="gpa"
                                            value={formData.gpa || ""}
                                            onChange={handleChange}
                                            min="0"
                                            max="4.33"
                                            step="0.01"
                                            placeholder="0.00 / 4.33"
                                            className="w-full h-16 bg-transparent border-b border-[var(--border-subtle)] focus:border-[var(--accent-hero)] transition-all outline-none font-display text-5xl font-black text-[var(--text-primary)] placeholder:opacity-10"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="space-y-12">
                                <div className="mb-16 relative">
                                    <div className="accent-glow block w-10 h-[2px] bg-[var(--accent-hero)] mb-6"></div>
                                    <h2 className="font-display text-7xl font-black text-[var(--text-primary)] leading-none mb-4">
                                        PERSONAL<br />
                                        <span className="text-stroke text-transparent">IDENTIFIER_</span>
                                    </h2>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--text-primary)] opacity-40">
                                        Phase 02 :: Demographic Mapping & Access Credentials
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-4 group">
                                        <label className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-widest block opacity-40">
                                            01 / CITIZENSHIP_STATUS
                                        </label>
                                        <div className="relative">
                                            <select
                                                name="citizenshipStatus"
                                                value={formData.citizenshipStatus}
                                                onChange={handleChange}
                                                className="w-full h-14 bg-transparent border-b border-[var(--border-subtle)] focus:border-[var(--accent-hero)] transition-all outline-none font-display text-xl font-black text-[var(--text-primary)] appearance-none cursor-pointer"
                                            >
                                                <option value="Canadian Citizen">CAN_CITIZEN</option>
                                                <option value="Permanent Resident">PERM_RESIDENT</option>
                                                <option value="Refugee">REFUGEE_PROTECTED</option>
                                                <option value="International">INTL_STUDENT</option>
                                            </select>
                                            <ChevronRight className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 opacity-20 rotate-90" />
                                        </div>
                                    </div>

                                    <div className="space-y-4 group">
                                        <label className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-widest block opacity-40">
                                            02 / GENDER_IDENTITY
                                        </label>
                                        <div className="relative">
                                            <select
                                                name="gender"
                                                value={formData.gender || ""}
                                                onChange={handleChange}
                                                className="w-full h-14 bg-transparent border-b border-[var(--border-subtle)] focus:border-[var(--accent-hero)] transition-all outline-none font-display text-xl font-black text-[var(--text-primary)] appearance-none cursor-pointer"
                                            >
                                                <option value="">UNSPECIFIED...</option>
                                                <option value="Male">MALE</option>
                                                <option value="Female">FEMALE</option>
                                                <option value="Non-binary">NON_BINARY</option>
                                                <option value="Two-Spirit">TWO_SPIRIT</option>
                                            </select>
                                            <ChevronRight className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 opacity-20 rotate-90" />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10">
                                    <SelectionCard
                                        title="INDIGENOUS_STAT"
                                        description="FIRST_NATIONS / METIS / INUIT_ANC"
                                        checked={formData.indigenousStatus}
                                        onChange={() => setFormData(p => ({ ...p, indigenousStatus: !p.indigenousStatus }))}
                                        icon={<Globe size={20} />}
                                    />
                                    <SelectionCard
                                        title="DISABILITY_ID"
                                        description="PERMANENT / CHRONIC_HEALTH_CONDITION"
                                        checked={formData.hasDisability}
                                        onChange={() => setFormData(p => ({ ...p, hasDisability: !p.hasDisability }))}
                                        icon={<HeartHandshake size={20} />}
                                    />
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="space-y-12">
                                <div className="mb-16 relative">
                                    <div className="accent-glow block w-10 h-[2px] bg-[var(--accent-hero)] mb-6"></div>
                                    <h2 className="font-display text-7xl font-black text-[var(--text-primary)] leading-none mb-4">
                                        FINANCIAL<br />
                                        <span className="text-stroke text-transparent">LIQUIDITY_</span>
                                    </h2>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--text-primary)] opacity-40">
                                        Phase 03 :: Need-Based Assessment & Resource Allocation
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <SelectionCard
                                        title="STUDENT_LOAN"
                                        description="GOVT_FUNDING_ACTIVE_STATUS"
                                        checked={formData.hasStudentLoan}
                                        onChange={() => setFormData(p => ({ ...p, hasStudentLoan: !p.hasStudentLoan }))}
                                        icon={<DollarSign size={20} />}
                                    />
                                    <SelectionCard
                                        title="FINANCIAL_NEED"
                                        description="DEMONSTRATED_RESOURCE_GAP"
                                        checked={formData.hasFinancialNeed}
                                        onChange={() => setFormData(p => ({ ...p, hasFinancialNeed: !p.hasFinancialNeed }))}
                                        icon={<Zap size={20} />}
                                    />
                                    <SelectionCard
                                        title="YOUTH_IN_CARE"
                                        description="FORMER_GOVT_PROTECTION_STATUS"
                                        checked={formData.formerYouthInCare || false}
                                        onChange={() => setFormData(p => ({ ...p, formerYouthInCare: !p.formerYouthInCare }))}
                                        icon={<User size={20} />}
                                    />
                                    <SelectionCard
                                        title="ENROLLMENT_TYPE"
                                        description="PART_TIME_COURSE_LOAD_PARAM"
                                        checked={formData.partTimeStudent || false}
                                        onChange={() => setFormData(p => ({ ...p, partTimeStudent: !p.partTimeStudent }))}
                                        icon={<Loader2 size={20} />}
                                    />
                                </div>
                            </div>
                        )}

                        {currentStep === 4 && (
                            <div className="space-y-12">
                                <div className="mb-16 relative">
                                    <div className="accent-glow block w-10 h-[2px] bg-[var(--accent-hero)] mb-6"></div>
                                    <h2 className="font-display text-7xl font-black text-[var(--text-primary)] leading-none mb-4">
                                        NETWORK<br />
                                        <span className="text-stroke text-transparent">AFFILIATIONS_</span>
                                    </h2>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--text-primary)] opacity-40">
                                        Phase 04 :: Organizational Ties & Community Membership
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--border-subtle)] border border-[var(--border-subtle)]">
                                    {[
                                        { key: "alphaGammaDelta", label: "AGD_MEMBER" },
                                        { key: "canadianArmedForces", label: "CAF_VETERAN" },
                                        { key: "chineseAncestry", label: "CHINESE_ANC" },
                                        { key: "iranianHeritage", label: "PERSIAN_HERITAGE" },
                                        { key: "swedishHeritage", label: "SWEDISH_ALUM" },
                                        { key: "ilwu", label: "ILWU_UNION" },
                                        { key: "ufcw", label: "UFCW_LOCAL" },
                                        { key: "beemCreditUnion", label: "BEEM_MEMBER" },
                                        { key: "sikhCommunity", label: "SIKH_NETWORK" },
                                        { key: "pipingIndustry", label: "UA_170_TRADE" },
                                        { key: "royalCanadianLegion", label: "ROYAL_LEGION" },
                                        { key: "knightsPythias", label: "KNIGHTS_PYTHIAS" },
                                    ].map((item) => {
                                        const affiliationKey = item.key as keyof typeof formData.affiliations;
                                        const isSelected = formData.affiliations[affiliationKey] || false;

                                        return (
                                            <div
                                                key={item.key}
                                                onClick={() => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        affiliations: {
                                                            ...prev.affiliations,
                                                            [affiliationKey]: !isSelected,
                                                        },
                                                    }));
                                                }}
                                                className={`cursor-pointer p-6 bg-[var(--bg-primary)] transition-all flex items-center justify-between group
                          ${isSelected ? "bg-[var(--accent-hero)]" : "hover:bg-[var(--text-primary)]/5"}`}
                                            >
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${isSelected ? "dark:text-black text-white" : "text-[var(--text-primary)]/40"}`}>
                                                    {item.label}
                                                </span>
                                                {isSelected && <Check size={12} strokeWidth={4} className="dark:text-black text-white" />}
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="mt-12 bg-[var(--text-primary)] p-8">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent-hero)] mb-2">SYSTEM_NOTICE_229</p>
                                    <p className="text-xs font-bold text-[var(--bg-primary)] opacity-60 leading-relaxed uppercase tracking-tight">
                                        MOST AWARDS ARE PRIMARILY BASED ON ACADEMIC MERIT OR DEMONSTRATED FINANCIAL NEED. AFFILIATIONS SERVE AS SECONDARY MATCH CRITERIA. ZERO-SELECTION IS A VALID STATE.
                                    </p>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                <div className="p-12 border-t border-[var(--border-subtle)] flex justify-between items-center relative z-20">
                    {currentStep > 1 ? (
                        <button
                            type="button"
                            onClick={prevStep}
                            disabled={isStepChanging}
                            className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 hover:opacity-100 transition-all flex items-center gap-2 group"
                        >
                            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                            Return
                        </button>
                    ) : (
                        <div />
                    )}

                    {currentStep < steps.length ? (
                        <button
                            type="button"
                            onClick={nextStep}
                            disabled={isStepChanging}
                            className="btn-scope-fill"
                        >
                            PROCEED_TO_NEXT_PHASE
                        </button>
                    ) : (
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={loading || isStepChanging}
                            className="btn-scope-fill flex items-center gap-3"
                        >
                            {loading ? "INITIALIZING_ANALYSIS..." : "FINALIZE_VERIFICATION"}
                        </button>
                    )}
                </div>
            </motion.div >

            <div className="mt-10 flex justify-between items-center px-4">
                <p className="text-[10px] font-black tracking-[0.3em] text-[var(--text-primary)] opacity-20 uppercase">
                    Encryption :: Active / AES-256
                </p>
                <p className="text-[10px] font-black tracking-[0.3em] text-[var(--text-primary)] opacity-20 uppercase">
                    Local Processing Only
                </p>
            </div>
        </div >
    );
};

export default StudentForm;
