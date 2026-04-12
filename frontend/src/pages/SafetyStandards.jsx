import React from 'react';

const SafetyStandards = () => {
    const standards = [
        {
            title: "Toxicity & Harassment",
            description: "We strictly flag abusive, toxic, and insulting language. Content that degrades, intimidates, or directly attacks individuals based on their beliefs or characteristics violates our core safety standard.",
            color: "bg-red-50 text-red-700 border-red-200",
        },
        {
            title: "Hate Speech & Identity",
            description: "Our engine detects and flags identity-based attacks. Any content promoting violence, discrimination, or hate toward marginalized groups based on race, gender, religion, or sexual orientation is classified as highly toxic.",
            color: "bg-orange-50 text-orange-700 border-orange-200",
        },
        {
            title: "Threats & Violence",
            description: "Explicit threats of physical harm, incitement of violence, and aggressive intent are flagged immediately. User safety is paramount, and violent ideologies are suppressed.",
            color: "bg-purple-50 text-purple-700 border-purple-200",
        },
        {
            title: "Obscenity & Vulgarity",
            description: "While we support open expression, severe profanity, sexually explicit text, and inappropriate obscenities are categorized to help platforms maintain professional or age-appropriate environments.",
            color: "bg-blue-50 text-blue-700 border-blue-200",
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-16 px-4 sm:px-6 lg:px-8 font-manrope">
            <div className="max-w-5xl w-full">

                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">Safety Standards</h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Our AI moderation engine is trained on the Jigsaw Toxicity dataset to rigorously identify and flag content that violates community safety. We believe in fostering healthy, respectful digital environments.
                    </p>
                </div>

                {/* Moderation Philosophy Card */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-10 mb-12 flex flex-col md:flex-row items-center gap-10 hover:shadow-md transition-shadow">
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Moderation Philosophy</h2>
                        <p className="text-gray-600 mb-4">
                            Machine learning models shouldn't just be black boxes. We strive for transparency in our classification labels. By utilizing fine-tuned DistilBERT models, we balance extreme precision with blazing fast computational speeds.
                        </p>
                        <p className="text-gray-600">
                            Our primary label classifies texts into <span className="font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">CLEAN</span> or <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">TOXIC</span>. Beneath the hood, the AI is observing confidence thresholds across multiple sub-dimensions.
                        </p>
                    </div>
                </div>

                {/* Standards Grid */}
                <div className="mb-10 text-center">
                    <h2 className="text-3xl font-bold text-gray-900">What We Flag</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {standards.map((std, idx) => (
                        <div key={idx} className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow flex flex-col">
                            <div className="flex items-center gap-4 mb-4">
                                <h3 className="text-xl font-bold text-gray-900">{std.title}</h3>
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                                {std.description}
                            </p>
                        </div>
                    ))}
                </div>
                <div className="mt-16 text-center border-t border-gray-200 pt-10">
                    <p className="text-gray-500 text-sm">
                        Please note: No AI model is 100% perfect. Contextual nuances and sarcasm can occasionally lead to false flags. These standards dictate our baseline definitions for toxicity integration.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SafetyStandards;
