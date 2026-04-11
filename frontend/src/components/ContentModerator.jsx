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
    return (
        <h1>Hello World</h1>
    )
}

export default ContentModerator;    