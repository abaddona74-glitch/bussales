import React, { useState, useRef, useEffect } from 'react';
import { FaBus } from 'react-icons/fa';

const fakePassengers = [
  { id: 1, name: 'Ismoilov Javohir Tursunovich', payment: 'cash' },
  { id: 2, name: 'Karimov Sardor Anvarovich', payment: 'click' },
  { id: 3, name: 'Rahimova Dilnoza Baxtiyorovna', payment: 'payme' },
  { id: 4, name: 'Toshmatov Behruz Ilhomovich', payment: 'uzum' },
  { id: 5, name: 'Abdullayev Sherzod Rustamovich', payment: 'cash' },
  { id: 6, name: 'Mirzayeva Nodira Kamoliddinovna', payment: 'click' },
  { id: 7, name: 'Xolmatov Otabek Dilmurodovich', payment: 'payme' },
  { id: 8, name: 'Yusupova Madina Farhodovna', payment: 'uzum' },
  { id: 9, name: 'Nazarov Dostonbek Ulug\'bekovich', payment: 'cash' },
  { id: 10, name: 'Ergasheva Zulfiya Toxirovna', payment: 'click' },
  { id: 11, name: 'Umarov Jasur Erkinovich', payment: 'payme' },
  { id: 12, name: 'Qodirov Azizbek Murodovich', payment: 'cash' },
  { id: 13, name: 'Sultonova Sevara Bakhodirovna', payment: 'uzum' },
  { id: 14, name: 'Raxmatullayev Botir Nematovich', payment: 'click' },
  { id: 15, name: 'Hasanova Gulnora Shavkatovna', payment: 'payme' },
];

const paymentBadge = (type) => {
  const styles = {
    cash: { bg: 'bg-green-100 text-green-700', label: 'Naqd' },
    click: { bg: 'bg-blue-100 text-blue-700', label: 'Click' },
    payme: { bg: 'bg-cyan-100 text-cyan-700', label: 'Payme' },
    uzum: { bg: 'bg-purple-100 text-purple-700', label: 'Uzum' },
  };
  const s = styles[type] || styles.cash;
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.bg}`}>
      {s.label}
    </span>
  );
};

const Navbar = () => {
  const [showPassengers, setShowPassengers] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowPassengers(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

        {/* Yo'lovchilar dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowPassengers(!showPassengers)}
            className="flex items-center gap-1 hover:text-blue-100 opacity-90 hover:opacity-100"
          >
            Yo'lovchilar
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-3.5 h-3.5 transition-transform ${showPassengers ? 'rotate-180' : ''}`}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>

          {showPassengers && (
            <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                <h3 className="text-gray-800 font-semibold text-sm">Yo'lovchilar ro'yxati</h3>
                <p className="text-gray-400 text-xs">{fakePassengers.length} ta yo'lovchi</p>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {fakePassengers.map((p, idx) => (
                  <div 
                    key={p.id} 
                    className={`flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors ${idx < fakePassengers.length - 1 ? 'border-b border-gray-50' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                        {p.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </div>
                      <div>
                        <p className="text-gray-800 text-sm font-medium">{p.name}</p>
                      </div>
                    </div>
                    {paymentBadge(p.payment)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <a href="#" className="hidden sm:block hover:text-blue-100 opacity-90 hover:opacity-100">Podderjka</a>
        <button className="hidden sm:block border border-white/30 rounded px-2 py-1 text-xs hover:bg-white/10 uppercase">
            UZS · RU
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
