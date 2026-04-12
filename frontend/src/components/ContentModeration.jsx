import { useState, useRef } from "react";
import InputBox from "./InputBox";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

const EXAMPLES = [
    { label: "Safe", text: "Thanks for the detailed explanation, really helped me understand the concept." },
    { label: "Toxic", text: "You are absolutely worthless and nobody wants you here." },
    { label: "Safe", text: "Could you point me to some good resources on machine learning?" },
    { label: "Toxic", text: "I hate all of you idiots, go die in a fire." },
];

const CATEGORIES = [
    { key: "toxic", label: "Toxic" },
    { key: "severe_toxic", label: "Severe" },
    { key: "obscene", label: "Obscene" },
    { key: "threat", label: "Threat" },
    { key: "insult", label: "Insult" },
    { key: "identity_hate", label: "Identity hate" },
];

function ConfidenceBar({ value, color }) {
    return (
        <div style={{ height: 6, background: "#e5e7eb", borderRadius: 99, overflow: "hidden" }}>
            <div
                style={{
                    height: "100%",
                    width: `${Math.round(value)}%`,
                    background: color,
                    borderRadius: 99,
                    transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)",
                }}
            />
        </div>
    );
}

function ResultCard({ result }) {
    const isToxic = result.label === "toxic";
    return (
        <div
            style={{
                border: `1.5px solid ${isToxic ? "#fca5a5" : "#86efac"}`,
                borderRadius: 16,
                padding: "20px 24px",
                background: isToxic ? "#fff7f7" : "#f0fdf4",
                marginTop: 20,
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div
                    style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: isToxic ? "#fee2e2" : "#dcfce7",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        {isToxic ? (
                            <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        ) : (
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        )}
                    </svg>
                </div>
                <div>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: 16, color: isToxic ? "#991b1b" : "#166534" }}>
                        {isToxic ? "Toxic content detected" : "Content looks clean"}
                    </p>
                    <p style={{ margin: 0, fontSize: 13, color: isToxic ? "#b91c1c" : "#15803d" }}>
                        {result.confidence}% confidence
                    </p>
                </div>
            </div>

            <ConfidenceBar value={result.confidence} color={isToxic ? "#f87171" : "#4ade80"} />

            {result.categories && (
                <div style={{ marginTop: 16 }}>
                    <p style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 500, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        Category breakdown
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                        {CATEGORIES.map(({ key, label }) => {
                            const val = Math.round((result.categories[key] || 0) * 100);
                            return (
                                <div key={key}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                                        <span style={{ fontSize: 12, color: "#6b7280" }}>{label}</span>
                                        <span style={{ fontSize: 12, fontWeight: 500, color: val > 50 ? "#dc2626" : "#374151" }}>{val}%</span>
                                    </div>
                                    <ConfidenceBar value={val} color={val > 50 ? "#f87171" : "#d1d5db"} />
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

function HistoryItem({ item, onClick }) {
    const isToxic = item.result.label === "toxic";
    return (
        <button
            onClick={() => onClick(item)}
            className="w-full text-left bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
        >
            <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${isToxic ? "bg-red-400" : "bg-green-400"}`} />
            <span className="text-[13.5px] text-gray-700 overflow-hidden whitespace-nowrap text-ellipsis flex-1 font-medium">
                {item.text}
            </span>
            <span className="text-[12px] font-bold text-gray-400 shrink-0">{item.result.confidence}%</span>
        </button>
    );
}

function ContentModerator() {
    const [text, setText] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [history, setHistory] = useState([]);
    const [charCount, setCharCount] = useState(0);
    const textareaRef = useRef(null);

    const MAX_CHARS = 1000;

    const analyze = async (inputText) => {
        const target = inputText ?? text;
        if (!target.trim() || loading) return;

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const res = await fetch(`${API}/predict`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: target }),
            });

            if (!res.ok) throw new Error(`Server error: ${res.status}`);
            const data = await res.json();
            setResult(data);
            setHistory((prev) => {
                const newText = target.slice(0, 80);
                const filtered = prev.filter(item => item.text !== newText);
                return [{ text: newText, result: data }, ...filtered].slice(0, 6);
            });
        } catch (err) {
            setError(err.message || "Could not reach the API. Is your FastAPI server running?");
        } finally {
            setLoading(false);
        }
    };

    const handleTextChange = (e) => {
        const val = e.target.value.slice(0, MAX_CHARS);
        setText(val);
        setCharCount(val.length);
        if (result) setResult(null);
    };

    const loadExample = (example) => {
        setText(example.text);
        setCharCount(example.text.length);
        setResult(null);
        textareaRef.current?.focus();
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) analyze();
    };

    return (
        <div className="min-h-screen bg-gray-50 font-manrope text-gray-900 pb-20 overflow-x-hidden">
            <div className="max-w-[1240px] mx-auto px-6 py-6">
                <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_0.9fr] gap-12 lg:gap-20">

                    <div className="flex flex-col">

                        <div className="mb-10">
                            <h1 className="text-[2.6rem] md:text-[3rem] leading-[1.05] font-bold mb-5 tracking-tight text-gray-900">
                                Content <span className="text-[#0059ff]">Moderation</span> Tool for Modern Communities.
                            </h1>
                            <p className="text-gray-500 text-[16px] max-w-xl leading-relaxed">
                                A tool to detect toxic content in text.
                            </p>
                        </div>

                        <div className="w-full z-10 relative">
                            <InputBox
                                value={text}
                                onChange={handleTextChange}
                                onKeyDown={handleKeyDown}
                                textareaRef={textareaRef}
                                analyze={analyze}
                            />
                        </div>

                        <div className="mt-4 flex flex-col gap-4">
                            <div className="flex items-center gap-2 text-gray-500 font-medium">
                                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                    <path d="M9 3v8.5a.5.5 0 0 1-.15.35l-4.5 4.5A2.5 2.5 0 0 0 6 21h12a2.5 2.5 0 0 0 1.65-4.3l-4.5-4.5a.5.5 0 0 1-.15-.35V3" />
                                    <path d="M6 3h12" />
                                </svg>
                                <span className="text-sm tracking-wide">Try Example Prompts</span>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {EXAMPLES.map((ex, i) => {
                                    const isToxic = ex.label === "Toxic";
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => loadExample(ex)}
                                            className={`px-4 py-2 rounded-md text-xs font-bold transition-all ${isToxic
                                                ? "bg-[#ffeded] text-[#e84c4c] hover:bg-red-200/60"
                                                : "bg-[#e2edff] text-[#4d7ef2] hover:bg-blue-200/60"
                                                } hover:cursor-pointer`}
                                        >
                                            {ex.label} example {Math.floor(i / 2) + 1}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {error && (
                            <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-800">
                                {error}
                            </div>
                        )}
                        {result && (
                            <div className="w-full">
                                <ResultCard result={result} />
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-6 w-full max-w-[420px]">
                        <div className="bg-[#f2f4f7] rounded-xl p-7 flex flex-col shadow-sm border border-gray-100">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="bg-primary text-white p-1.5 rounded-[14px] flex items-center justify-center">
                                    <img src="/ai.png" alt="ai" width={48} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-[800] text-gray-900 text-[17px] leading-tight">Model Info</span>
                                    <span className="text-[#64748b] text-[15px]">Production v1.0.0</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-[22px] border-b border-gray-200/80 pb-7 mb-7">
                                <div className="flex justify-between items-center text-[13px]">
                                    <span className="text-[#64748b] font-semibold text-sm">Architecture</span>
                                    <span className="text-gray-900 font-bold text-sm">DistilBERT</span>
                                </div>
                                <div className="flex justify-between items-center text-[13px]">
                                    <span className="text-[#64748b] font-semibold text-sm">Dataset</span>
                                    <span className="text-gray-900 font-bold text-sm">Jigsaw</span>
                                </div>
                                <div className="flex justify-between items-center text-[13px]">
                                    <span className="text-[#64748b] font-semibold text-sm">Format</span>
                                    <span className="text-gray-900 font-bold text-sm">ONNX</span>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center text-[13px] mb-3">
                                        <span className="text-[#64748b] font-semibold text-sm">F1 Score</span>
                                        <span className="text-primary font-bold text-sm">~0.87</span>
                                    </div>
                                    <div className="w-full bg-[#e2e8f0] rounded-full h-[5px]">
                                        <div className="bg-primary h-[5px] rounded-full" style={{ width: "87%" }}></div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#e4efff] text-[#0059ff] rounded-xl p-4 flex justify-between items-center mb-1">
                                <div className="flex items-center gap-2 font-[800]">
                                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12 6 12 12 16 14" />
                                    </svg>
                                    Latency
                                </div>
                                <span className="font-[800] text-[15px]">~50ms</span>
                            </div>

                            {/* <button className="w-full bg-white hover:bg-gray-50 text-gray-700 font-bold text-sm py-3.5 rounded-xl border border-gray-200 transition-colors shadow-sm cursor-pointer">
                                View Documentation
                            </button> */}
                        </div>

                        {history.length > 0 && (
                            <div className="flex flex-col gap-3 mt-2">
                                <h3 className="text-[12px] font-[800] text-gray-400 uppercase tracking-widest pl-1">Recent History</h3>
                                <div className="flex flex-col gap-[10px]">
                                    {history.map((item, i) => (
                                        <HistoryItem
                                            key={i}
                                            item={item}
                                            onClick={(h) => {
                                                handleTextChange({ target: { value: h.text } });
                                                setResult(h.result);
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContentModerator;    