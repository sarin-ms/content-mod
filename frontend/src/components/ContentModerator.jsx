import { useState, useRef } from "react";

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
            style={{
                width: "100%",
                textAlign: "left",
                background: "none",
                border: "0.5px solid #e5e7eb",
                borderRadius: 10,
                padding: "10px 12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 10,
            }}
        >
            <div
                style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: isToxic ? "#f87171" : "#4ade80",
                    flexShrink: 0,
                }}
            />
            <span style={{ fontSize: 13, color: "#374151", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", flex: 1 }}>
                {item.text}
            </span>
            <span style={{ fontSize: 11, color: "#9ca3af", flexShrink: 0 }}>{item.result.confidence}%</span>
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
            setHistory((prev) => [{ text: target.slice(0, 80), result: data }, ...prev].slice(0, 6));
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
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px 24px", fontFamily: "system-ui, sans-serif" }}>
            <div style={{ marginBottom: 32 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: "#111827", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: "#111827" }}>Content Moderator</h1>
                </div>
                <p style={{ margin: 0, fontSize: 14, color: "#6b7280" }}>
                    Powered by DistilBERT fine-tuned on the Jigsaw dataset · F1 ≈ 0.87
                </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: 20, alignItems: "start" }}>
                <div>
                    <div style={{ position: "relative" }}>
                        <textarea
                            ref={textareaRef}
                            value={text}
                            onChange={handleTextChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Paste or type any text to check for toxic content..."
                            style={{
                                width: "100%",
                                minHeight: 140,
                                padding: "14px 16px",
                                paddingBottom: 36,
                                fontSize: 14,
                                lineHeight: 1.6,
                                border: "1px solid #d1d5db",
                                borderRadius: 12,
                                resize: "vertical",
                                outline: "none",
                                fontFamily: "inherit",
                                color: "#111827",
                                background: "#fff",
                                boxSizing: "border-box",
                            }}
                        />
                        <div style={{ position: "absolute", bottom: 10, right: 12, display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 11, color: charCount > MAX_CHARS * 0.9 ? "#ef4444" : "#9ca3af" }}>
                                {charCount}/{MAX_CHARS}
                            </span>
                        </div>
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, margin: "10px 0 14px" }}>
                        <span style={{ fontSize: 12, color: "#9ca3af", alignSelf: "center" }}>Try:</span>
                        {EXAMPLES.map((ex, i) => (
                            <button
                                key={i}
                                onClick={() => loadExample(ex)}
                                style={{
                                    fontSize: 12,
                                    padding: "4px 10px",
                                    border: "0.5px solid #e5e7eb",
                                    borderRadius: 99,
                                    background: "white",
                                    cursor: "pointer",
                                    color: "#374151",
                                }}
                            >
                                {ex.label} example {Math.floor(i / 2) + 1}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => analyze()}
                        disabled={loading || !text.trim()}
                        style={{
                            width: "100%",
                            padding: "12px 0",
                            background: loading || !text.trim() ? "#e5e7eb" : "#111827",
                            color: loading || !text.trim() ? "#9ca3af" : "white",
                            border: "none",
                            borderRadius: 10,
                            fontSize: 14,
                            fontWeight: 500,
                            cursor: loading || !text.trim() ? "not-allowed" : "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                            transition: "background 0.15s",
                        }}
                    >
                        {loading ? (
                            <>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 0.8s linear infinite" }}>
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="32" strokeDashoffset="12" />
                                </svg>
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                                    <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                Analyze text
                                <span style={{ fontSize: 11, opacity: 0.6 }}>⌘↵</span>
                            </>
                        )}
                    </button>

                    {error && (
                        <div style={{ marginTop: 14, padding: "12px 14px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, fontSize: 13, color: "#991b1b" }}>
                            {error}
                        </div>
                    )}

                    {result && <ResultCard result={result} />}
                </div>

                <div>
                    <div style={{ background: "#f9fafb", borderRadius: 12, padding: "14px 16px", marginBottom: 14 }}>
                        <p style={{ margin: "0 0 12px", fontSize: 11, fontWeight: 500, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>Model info</p>
                        {[
                            { label: "Architecture", value: "DistilBERT" },
                            { label: "Dataset", value: "Jigsaw" },
                            { label: "F1 score", value: "~0.87" },
                            { label: "Format", value: "ONNX" },
                            { label: "Latency", value: "~50ms" },
                        ].map(({ label, value }) => (
                            <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                                <span style={{ fontSize: 12, color: "#9ca3af" }}>{label}</span>
                                <span style={{ fontSize: 12, fontWeight: 500, color: "#374151" }}>{value}</span>
                            </div>
                        ))}
                    </div>

                    {history.length > 0 && (
                        <div>
                            <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 500, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>Recent</p>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                {history.map((item, i) => (
                                    <HistoryItem
                                        key={i}
                                        item={item}
                                        onClick={(h) => {
                                            setText(h.text);
                                            setCharCount(h.text.length);
                                            setResult(h.result);
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

export default ContentModerator;    