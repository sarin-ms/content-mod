import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="bg-white py-4 shadow-sm relative z-50 font-manrope">
            <div className="container mx-auto px-4 md:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    <div className="text-black text-2xl font-extrabold tracking-tight">
                        <Link to="/">Content Moderation</Link>
                    </div>

                    <div className="hidden md:block">
                        <ul className="flex gap-8 items-center navbar-links font-bold">
                            <li className="group relative text-gray-600 hover:text-black cursor-pointer transition-colors duration-300">
                                <Link to="/" className="py-2">Home</Link>
                                <span className="absolute left-0 -bottom-1 w-0 h-[3px] bg-blue-600 transition-all duration-300 group-hover:w-full rounded-full"></span>
                            </li>
                            <li className="group relative text-gray-600 hover:text-black cursor-pointer transition-colors duration-300">
                                <Link to="/safety-standards" className="py-2">Safety Standards</Link>
                                <span className="absolute left-0 -bottom-1 w-0 h-[3px] bg-blue-600 transition-all duration-300 group-hover:w-full rounded-full"></span>
                            </li>
                            <li className="group relative text-gray-600 hover:text-black cursor-pointer transition-colors duration-300">
                                <Link to="/api" className="py-2">API</Link>
                                <span className="absolute left-0 -bottom-1 w-0 h-[3px] bg-blue-600 transition-all duration-300 group-hover:w-full rounded-full"></span>
                            </li>
                        </ul>
                    </div>

                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleMenu}
                            className="text-gray-600 hover:text-black focus:outline-none p-2 rounded-md hover:bg-gray-100 transition-colors"
                            aria-label="Toggle menu"
                        >
                            <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                {isMenuOpen ? (
                                    <path d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-xl py-2 px-4 flex flex-col gap-2 z-50">
                        <Link
                            to="/"
                            className="text-gray-700 font-bold hover:text-blue-600 transition-colors w-full p-3 rounded-xl hover:bg-blue-50"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            to="/safety-standards"
                            className="text-gray-700 font-bold hover:text-blue-600 transition-colors w-full p-3 rounded-xl hover:bg-blue-50"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Safety Standards
                        </Link>
                        <Link
                            to="/api"
                            className="text-gray-700 font-bold hover:text-blue-600 transition-colors w-full p-3 rounded-xl hover:bg-blue-50"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            API
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;