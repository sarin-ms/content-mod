import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="bg-white py-3">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between relative">
                    <div className="font-manrope text-black text-2xl font-bold pb-2">Content Moderation</div>
                    <div className="absolute left-1/2 -translate-x-1/2">
                        <ul className="flex gap-6 pb-2 navbar-links">
                            <li className="group relative text-black cursor-pointer transition-colors duration-300">
                                <Link to="/">Home</Link>
                                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                            </li>
                            <li className="group relative text-black cursor-pointer transition-colors duration-300">
                                <Link to="/safety-standards">Safety Standards</Link>
                                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                            </li>
                            <li className="group relative text-black cursor-pointer transition-colors duration-300">
                                <Link to="/api">API</Link>
                                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            {/* <div className="w-full h-1 bg-black/70"></div> */}
        </nav>

    );
};

export default Navbar;