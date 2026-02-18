import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
    const navigate = useNavigate();
    const [from, setFrom] = useState('Toshkent');
    const [to, setTo] = useState('');
    const [date, setDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [passengers, setPassengers] = useState(1);

    return (
        <div className="bg-[#0C73FE] min-h-[500px] flex flex-col items-center pt-16 px-4 pb-20 text-white relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>

            <h1 className="text-3xl md:text-5xl font-bold text-center mb-10 z-10 max-w-4xl leading-tight">
                Bu yerda arzozon avtobus chiptalari sotiladi
            </h1>
            
            {/* Tabs - Only Avtobuslar for bussales */}
            <div className="flex gap-1 bg-black/20 p-1 rounded-xl mb-6 z-10 backdrop-blur-sm">
                <button className="flex items-center gap-2 px-6 py-2 bg-white text-blue-600 rounded-lg font-medium shadow-sm transition-all hover:bg-blue-50 cursor-default">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                       <path d="M4.5 3.75a3 3 0 00-3 3v.75h21v-.75a3 3 0 00-3-3h-15z" />
                       <path fillRule="evenodd" d="M22.5 9.75h-21v7.5a3 3 0 003 3h15a3 3 0 003-3v-7.5zm-18 3.75a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" clipRule="evenodd" />
                    </svg>
                    Avtobuslar
                </button>
            </div>

            {/* Search Form */}
            <div className="w-full max-w-6xl bg-[#FF7F00] sm:bg-white rounded-2xl p-1 z-10 shadow-xl flex flex-col md:flex-row gap-[1px]">
                
                {/* From Input */}
                <div className="relative flex-1 group bg-white rounded-t-xl md:rounded-l-xl md:rounded-tr-none p-0 hover:z-10 focus-within:z-10">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 font-medium text-xs tracking-wider uppercase">
                    </div>
                    <input 
                        type="text" 
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        placeholder="Qayerdan"
                        className="w-full h-16 pl-4 pr-12 rounded-t-xl md:rounded-l-xl md:rounded-tr-none text-gray-800 font-medium text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF7F00] transition-shadow"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-xs bg-gray-100 px-1 rounded">TAS</span>
                </div>

                {/* To Input */}
                <div className="relative flex-1 group bg-white p-0 hover:z-10 focus-within:z-10 md:border-l border-gray-100">
                    <input 
                        type="text" 
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        placeholder="Qayerga"
                        className="w-full h-16 pl-4 pr-4 text-gray-800 font-medium text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF7F00] transition-shadow"
                    />
                </div>

                {/* Date Input */}
                <div className="relative flex-1 group bg-white p-0 hover:z-10 focus-within:z-10 md:border-l border-gray-100">
                    <input 
                        type={date ? "date" : "text"}
                        onFocus={(e) => e.target.type = "date"}
                        onBlur={(e) => !date && (e.target.type = "text")}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        placeholder="Qachon"
                        className="w-full h-16 pl-4 pr-4 text-gray-800 font-medium text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF7F00] transition-shadow bg-transparent"
                    />
                </div>

                 {/* Return Date Input */}
                <div className="relative flex-1 group bg-white p-0 hover:z-10 focus-within:z-10 md:border-l border-gray-100 hidden lg:block">
                    <input 
                        type={returnDate ? "date" : "text"}
                        onFocus={(e) => e.target.type = "date"}
                        onBlur={(e) => !returnDate && (e.target.type = "text")}
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        placeholder="Qaytish"
                        className="w-full h-16 pl-4 pr-4 text-gray-800 font-medium text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF7F00] transition-shadow bg-transparent"
                    />
                </div>

                {/* Passengers Input */}
                <div className="relative w-full md:w-auto md:min-w-[180px] group bg-white p-0 hover:z-10 focus-within:z-10 md:border-l border-gray-100">
                    <select 
                        value={passengers}
                        onChange={(e) => setPassengers(e.target.value)}
                        className="w-full h-16 pl-4 pr-8 text-gray-800 font-medium text-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[#FF7F00] transition-shadow appearance-none cursor-pointer"
                    >
                        <option value={1}>1 yo'lovchi</option>
                        <option value={2}>2 yo'lovchi</option>
                        <option value={3}>3 yo'lovchi</option>
                        <option value={4}>4 yo'lovchi</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                    </div>
                </div>

                {/* Search Button */}
                <button 
                    onClick={() => navigate(`/search?from=${from}&to=${to}`)}
                    className="bg-[#FF7F00] hover:bg-[#ff8c1a] text-white font-bold text-lg px-8 py-4 md:rounded-r-xl md:rounded-bl-none rounded-b-xl transition-colors md:w-auto w-full whitespace-nowrap shadow-lg md:shadow-none z-20"
                >
                    Chiptalarni topish
                </button>
            </div>
            
        </div>
    );
};

export default Hero;
