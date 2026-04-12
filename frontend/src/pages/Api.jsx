import React, { useState } from 'react';

const Api = () => {
    const [activeTab, setActiveTab] = useState('javascript');
    const baseUrl = "https://sarin-ms-content-mod.hf.space";

    const getCodeSnippet = () => {
        if (activeTab === 'curl') {
            return `curl -X POST "${baseUrl}/predict" \\
  -H "Content-Type: application/json" \\
  -d '{"text": "You are absolutely worthless."}'`;
        } else if (activeTab === 'python') {
            return `import requests

url = "${baseUrl}/predict"
payload = {"text": "Great work on the project, keep it up!"}

response = requests.post(url, json=payload)
print(response.json())
# Output: {'label': 'CLEAN', 'confidence': 100.0, 'processing_time_ms': 14.86}`;
        } else if (activeTab === 'javascript') {
            return `const checkContent = async () => {
  const response = await fetch("${baseUrl}/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: "I hate all of you idiots, go away." })
  });
  
  const data = await response.json();
  console.log(data);
};`;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-16 px-4 sm:px-6 lg:px-8 font-manrope">
            <div className="max-w-5xl w-full">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">API Reference</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Integrate our high-speed, DistilBERT-powered toxicity classification engine directly into your applications.
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:shadow-md transition-shadow">
                    <div>
                        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2 font-mono">Base URL</h2>
                        <code className="text-lg text-blue-700 bg-blue-50 px-4 py-2 rounded-lg inline-block border border-blue-100 shadow-sm">{baseUrl}</code>
                    </div>
                    <div className="mt-6 sm:mt-0 flex gap-3">
                        <span className="px-4 py-1.5 bg-green-50 text-green-700 text-sm font-bold rounded-full border border-green-200 flex items-center gap-2 shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            ACTIVE
                        </span>
                        <span className="px-4 py-1.5 bg-gray-50 text-gray-700 text-sm font-bold rounded-full border border-gray-200 shadow-sm">
                            v1.0.0
                        </span>
                    </div>
                </div>

                <div className="space-y-10">
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="border-b border-gray-200 bg-gray-50/50 p-6 px-8 flex items-center gap-4">
                            <span className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm font-bold shadow-sm">POST</span>
                            <h3 className="text-2xl font-bold text-gray-900">/predict</h3>
                        </div>

                        <div className="p-8">
                            <p className="text-gray-600 mb-8 text-lg">
                                Analyzes a given string of text and returns a classification label indicating whether the content is safe or toxic, alongside AI confidence scores and execution metrics.
                            </p>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                <div>
                                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Request Payload</h4>
                                    <div className="bg-[#0d1117] p-5 rounded-2xl shadow-inner border border-gray-800 relative group">
                                        <div className="absolute top-0 right-0 px-3 py-1 bg-gray-800 text-gray-400 text-xs rounded-bl-lg rounded-tr-xl">JSON</div>
                                        <pre className="text-[#e6edf3] text-sm overflow-x-auto font-mono">
                                            <code>{`{
  "text": "Your text here" // string, 1-1000 characters
}`}</code>
                                        </pre>
                                    </div>

                                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 mt-8">Success Response <span className="text-green-500 lowercase normal-case tracking-normal ml-2 font-mono bg-green-50 px-2 rounded">200 OK</span></h4>
                                    <div className="bg-[#0d1117] p-5 rounded-2xl shadow-inner border border-gray-800 relative group">
                                        <div className="absolute top-0 right-0 px-3 py-1 bg-gray-800 text-gray-400 text-xs rounded-bl-lg rounded-tr-xl">JSON</div>
                                        <pre className="text-[#e6edf3] text-sm overflow-x-auto font-mono">
                                            <code>{`{
  "label": "CLEAN", // or "TOXIC"
  "confidence": 99.8,
  "processing_time_ms": 14.5
}`}</code>
                                        </pre>
                                    </div>
                                </div>

                                <div className="flex flex-col">
                                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Code Snippets</h4>

                                    <div className="flex space-x-2 mb-4 bg-gray-100 p-1.5 rounded-xl self-start w-full">
                                        <button
                                            onClick={() => setActiveTab('javascript')}
                                            className={`flex-1 px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'javascript' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200/50'}`}
                                        >
                                            Node.js
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('python')}
                                            className={`flex-1 px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'python' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200/50'}`}
                                        >
                                            Python
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('curl')}
                                            className={`flex-1 px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'curl' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200/50'}`}
                                        >
                                            cURL
                                        </button>
                                    </div>

                                    <div className="bg-[#0d1117] p-6 rounded-2xl shadow-inner border border-gray-800 flex-grow flex flex-col">
                                        <pre className="text-[#e6edf3] text-sm overflow-x-auto font-mono flex-grow">
                                            <code>{getCodeSnippet()}</code>
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                            <div>
                                <div className="flex items-center gap-4 mb-3">
                                    <span className="bg-teal-500 text-white px-3 py-1 rounded-md text-sm font-bold shadow-sm">GET</span>
                                    <h3 className="text-2xl font-bold text-gray-900">/health</h3>
                                </div>
                                <p className="text-gray-600 text-lg">
                                    Ping the service to check API availability.
                                </p>
                            </div>
                            <div className="bg-[#0d1117] p-5 rounded-2xl shadow-inner border border-gray-800 w-full md:w-auto min-w-[250px]">
                                <pre className="text-[#e6edf3] text-sm overflow-x-auto font-mono text-center">
                                    <code>{`{ "status": "ok" }`}</code>
                                </pre>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Api;
