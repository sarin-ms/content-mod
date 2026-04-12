import React from "react";
const InputBox = ({ value, onChange, onKeyDown, textareaRef, analyze }) => {

    function handleFileUpload() {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = ".txt";
        fileInput.click();

        fileInput.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    onChange({ target: { value: e.target.result } });
                };
                reader.readAsText(file);
            }

        };
    }

    return (
        <div className="w-full max-w-4xl rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden flex flex-col font-manrope">
            <textarea
                ref={textareaRef}
                value={value}
                onChange={onChange}
                onKeyDown={onKeyDown}
                placeholder="Paste or type any text to check for toxic content"
                rows={7}
                className="w-full p-6 text-gray-700 bg-white placeholder-gray-400/80 resize-none outline-none text-[15px]"
            />

            <div className="bg-[#f8f9fa] px-6 py-4 flex items-center justify-between border-t border-gray-50">
                <div className="flex items-center gap-5 text-gray-400">
                    <button onClick={handleFileUpload} className="hover:text-gray-600 transition-colors hover:cursor-pointer">
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                        </svg>

                    </button>
                    <button className="hover:text-gray-600 transition-colors hover:cursor-pointer">
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="2" y1="12" x2="22" y2="12"></line>
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                        </svg>
                    </button>
                </div>

                <button
                    onClick={() => analyze()}
                    className="flex items-center gap-2 bg-[#0059ff] text-white font-semibold text-sm tracking-wide px-6 py-2.5 rounded-lg hover:bg-blue-600 transition-colors shadow-sm hover:cursor-pointer hover:bg-blue-700"
                >
                    ANALYZE TEXT
                </button>
            </div>
        </div>
    );
};

export default InputBox;
