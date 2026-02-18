import React from 'react';
import { FaBus } from 'react-icons/fa';

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-4 py-3 bg-[#0C73FE] text-white">
      <div className="flex items-center gap-8">
        <div className="text-2xl font-bold flex items-center gap-2">
            <FaBus className="w-8 h-8" />
            <span>bussales</span>
        </div>
      </div>
      <div className="flex items-center gap-6 text-sm font-medium">
        <a href="#" className="flex items-center gap-1 hover:text-blue-100 opacity-90 hover:opacity-100">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            Profil
        </a>
        <a href="#" className="hidden sm:block hover:text-blue-100 opacity-90 hover:opacity-100">Yo'lovchi</a>
        <a href="#" className="hidden sm:block hover:text-blue-100 opacity-90 hover:opacity-100">Podderjka</a>
        <button className="border border-white/30 rounded px-2 py-1 text-xs hover:bg-white/10 uppercase">
            UZS · RU
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
