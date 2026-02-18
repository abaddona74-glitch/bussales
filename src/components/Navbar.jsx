import React from 'react';

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-4 py-3 bg-[#0C73FE] text-white">
      <div className="flex items-center gap-8">
        <div className="text-2xl font-bold flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                <path d="M4.5 3.75a3 3 0 00-3 3v.75h21v-.75a3 3 0 00-3-3h-15z" />
                <path fillRule="evenodd" d="M22.5 9.75h-21v7.5a3 3 0 003 3h15a3 3 0 003-3v-7.5zm-18 3.75a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" clipRule="evenodd" />
            </svg>
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
