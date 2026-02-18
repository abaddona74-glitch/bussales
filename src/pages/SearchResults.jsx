import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const to = searchParams.get('to') || 'Manzil';
  const from = searchParams.get('from') || 'Toshkent';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button 
        onClick={() => navigate('/')}
        className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Ortga
      </button>

      <h1 className="text-2xl font-bold mb-2">{from} &rarr; {to}</h1>
      <p className="text-gray-500 mb-8">Topilgan reyslar: 3 ta</p>

      <div className="space-y-4">
        {/* Sample Result Card 1 */}
        <div className="bg-white rounded-xl shadow border border-gray-100 p-6 hover:shadow-lg transition-shadow">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div className="flex gap-4 items-center">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path d="M4.5 3.75a3 3 0 00-3 3v.75h21v-.75a3 3 0 00-3-3h-15z" />
                        <path fillRule="evenodd" d="M22.5 9.75h-21v7.5a3 3 0 003 3h15a3 3 0 003-3v-7.5zm-18 3.75a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" clipRule="evenodd" />
                    </svg>
                </div>
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <span className="font-bold text-xl">08:00</span>
                        <span className="text-gray-400 text-sm">———— 4s 30m ————</span>
                        <span className="font-bold text-xl">12:30</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>{from} Avtovokzal</span>
                        <span>{to} Markaz</span>
                    </div>
                </div>
            </div>
            
            <div className="flex flex-col items-end gap-2 text-right border-t md:border-t-0 pt-4 md:pt-0">
                <span className="text-2xl font-bold text-blue-600">55 000 so'm</span>
                <button className="bg-[#FF7F00] hover:bg-[#ff8c1a] text-white font-medium py-2 px-6 rounded-lg transition-colors w-full md:w-auto">
                    Tanlash
                </button>
            </div>
          </div>
        </div>

        {/* Sample Result Card 2 */}
        <div className="bg-white rounded-xl shadow border border-gray-100 p-6 hover:shadow-lg transition-shadow opacity-90">
             <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div className="flex gap-4 items-center">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-600">
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path d="M4.5 3.75a3 3 0 00-3 3v.75h21v-.75a3 3 0 00-3-3h-15z" />
                        <path fillRule="evenodd" d="M22.5 9.75h-21v7.5a3 3 0 003 3h15a3 3 0 003-3v-7.5zm-18 3.75a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" clipRule="evenodd" />
                    </svg>
                </div>
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <span className="font-bold text-xl">14:00</span>
                        <span className="text-gray-400 text-sm">———— 5s 00m ————</span>
                        <span className="font-bold text-xl">19:00</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>{from} Janubiy</span>
                        <span>{to} </span>
                    </div>
                </div>
            </div>
            
            <div className="flex flex-col items-end gap-2 text-right border-t md:border-t-0 pt-4 md:pt-0">
                <span className="text-2xl font-bold text-blue-600">60 000 so'm</span>
                <button className="bg-[#FF7F00] hover:bg-[#ff8c1a] text-white font-medium py-2 px-6 rounded-lg transition-colors w-full md:w-auto">
                    Tanlash
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
