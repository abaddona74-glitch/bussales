import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const cities = [
    "Toshkent",
    "Toshkent viloyati",
    "Samarqand",
    "Buxoro",
    "Xiva",
    "Navoiy",
    "Nukus"
];

const Hero = () => {
    const navigate = useNavigate();
    const [from, setFrom] = useState('Toshkent');
    const [to, setTo] = useState('');
    const [date, setDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [passengers, setPassengers] = useState(1);
    const [isLocating, setIsLocating] = useState(false);
    
    // New state for dropdown and class
    const [isPassengerDropdownOpen, setIsPassengerDropdownOpen] = useState(false);
    const [travelClass, setTravelClass] = useState('ekonom'); // ekonom, business, comfort

    // Placeholder function for locating user
    // Since we don't have a backend to reverse geocode, we will simulate this or use a simple heuristic
    // For now, we'll try to get coordinates and mock the "nearest city" logic
    // In a real app, you would send lat/long to a server which returns the city name
    const handleLocation = (type) => { // type is 'from' or 'to'
        if (!navigator.geolocation) {
           alert("Sizning brauzeringiz joylashuvni aniqlashni qo'llab-quvvatlamaydi.");
           return;
        }

        setIsLocating(true);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                // Mock logic: randomly pick a city close to "Toshkent" or just pick a random supported city
                // Real logic would be: fetch(`https://api.map.com/reverse?lat=${latitude}&lon=${longitude}`)
                
                // For demonstration, let's pretend we calculated the nearest supported city.
                // We'll just pick a city that is NOT the other selected city.
                // In production, use a proper reverse geocoding service.
                
                // Simulating a "found" city after a small delay
                setTimeout(() => {
                   const availableCities = cities.filter(c => c !== (type === 'from' ? to : from));
                   if (availableCities.length > 0) {
                      // Just picking the first one or logic based on coords
                      // Let's pretend user is always in Toshkent for this demo if available
                      let detectedCity = availableCities.find(c => c === "Toshkent") || availableCities[0];

                      if (type === 'from') setFrom(detectedCity);
                      else setTo(detectedCity);
                   } else {
                      alert("Afsuski, bizning avtobuslar bu hududda qatnamaydi.");
                   }
                   setIsLocating(false);
                }, 1000);
            },
            (error) => {
                console.error("Error getting location:", error);
                alert("Joylashuvni aniqlab bo'lmadi. Iltimos, qo'lda tanlang.");
                setIsLocating(false);
            }
        );
    };

    return (
        <div className="bg-[#0C73FE] min-h-[500px] flex flex-col items-center pt-16 px-4 pb-20 text-white relative" onClick={() => setIsPassengerDropdownOpen(false)}>
            {/* Background elements */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay overflow-hidden"></div>

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
                <div className="relative flex-1 group bg-white rounded-t-xl md:rounded-l-xl md:rounded-tr-none p-2 hover:z-10 focus-within:z-10 flex flex-col justify-center">
                    <label className="text-xs text-gray-500 font-medium ml-3 mb-[-5px] block">Qayerdan</label>
                    <div className="relative">
                        <select 
                            value={from}
                            onChange={(e) => {
                                if (e.target.value === 'location') {
                                    handleLocation('from');
                                } else {
                                    setFrom(e.target.value);
                                }
                            }}
                            className="w-full h-10 pl-3 pr-12 bg-transparent text-gray-800 font-bold text-lg focus:outline-none appearance-none cursor-pointer"
                        >
                            <option value="" disabled hidden>Shaharni tanlang</option>
                            <option value="location" className="text-blue-600 font-bold">📍 Mening joylashuvim</option>
                            {cities.filter(city => city !== to).map((city) => (
                                <option key={city} value={city}>
                                    {city}
                                </option>
                            ))}
                        </select>
                         <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* To Input */}
                <div className="relative flex-1 group bg-white p-2 hover:z-10 focus-within:z-10 md:border-l border-gray-100 flex flex-col justify-center">
                     <label className="text-xs text-gray-500 font-medium ml-3 mb-[-5px] block">Qayerga</label>
                    <div className="relative">
                        <select 
                            value={to}
                            onChange={(e) => {
                                 if (e.target.value === 'location') {
                                    handleLocation('to');
                                } else {
                                    setTo(e.target.value);
                                }
                            }}
                            className="w-full h-10 pl-3 pr-12 bg-transparent text-gray-800 font-bold text-lg focus:outline-none appearance-none cursor-pointer"
                        >
                            <option value="" disabled hidden>Shaharni tanlang</option>
                            <option value="location" className="text-blue-600 font-bold">📍 Mening joylashuvim</option>
                            {cities.filter(city => city !== from).map((city) => (
                                <option key={city} value={city}>
                                    {city}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Date Input */}
                <div className="relative flex-1 group bg-white p-2 hover:z-10 focus-within:z-10 md:border-l border-gray-100 flex flex-col justify-center">
                    <label className="text-xs text-gray-500 font-medium ml-3 mb-[-5px] block">Qachon</label>
                    <input 
                        type={date ? "date" : "text"}
                        onFocus={(e) => e.target.type = "date"}
                        onBlur={(e) => !date && (e.target.type = "text")}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        placeholder="Sanani tanlang"
                        className="w-full h-10 pl-3 pr-4 text-gray-800 font-bold text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF7F00] transition-shadow bg-transparent"
                    />
                </div>

                 {/* Return Date Input */}
                <div className="relative flex-1 group bg-white p-2 hover:z-10 focus-within:z-10 md:border-l border-gray-100 flex flex-col justify-center">
                     <label className="text-xs text-gray-500 font-medium ml-3 mb-[-5px] block">Qaytish</label>
                    <input 
                        type={returnDate ? "date" : "text"}
                        onFocus={(e) => e.target.type = "date"}
                        onBlur={(e) => !returnDate && (e.target.type = "text")}
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        placeholder="Kerak emas"
                        className="w-full h-10 pl-3 pr-4 text-gray-800 font-bold text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF7F00] transition-shadow bg-transparent"
                    />
                     {returnDate && (
                        <button 
                            onClick={() => setReturnDate('')}
                            className="absolute right-2 top-1/2 text-gray-400 hover:text-red-500 text-xs"
                            title="Bekor qilish"
                        >
                            ✕
                        </button>
                    )}
                </div>

                {/* Passengers Input & Class (Custom Dropdown) */}
                <div className="relative w-full md:w-auto md:min-w-[200px] group bg-white p-2 hover:z-10 focus-within:z-10 md:border-l border-gray-100 flex flex-col justify-center">
                    <label className="text-xs text-gray-500 font-medium ml-3 mb-[-5px] block">Yo'lovchilar</label>
                    <div 
                        className="w-full h-10 pl-3 pr-8 flex items-center text-gray-800 font-bold text-lg cursor-pointer select-none"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsPassengerDropdownOpen(!isPassengerDropdownOpen);
                        }}
                    >
                        <span className="truncate">
                             {passengers} yo'lovchi, {travelClass === 'ekonom' ? 'Eko' : 'Kom'}
                        </span>
                        <div className="absolute right-2 top-1/2 pointer-events-none">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-4 h-4 text-gray-400 transition-transform ${isPassengerDropdownOpen ? 'rotate-180' : ''}`}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                        </div>
                    </div>

                    {/* Dropdown Menu */}
                    {isPassengerDropdownOpen && (
                        <div 
                            className="absolute top-full left-0 right-0 md:min-w-[280px] md:right-auto mt-2 bg-white rounded-xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 border border-blue-100"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="font-bold text-gray-800 mb-3">Yo'lovchilar soni</h3>
                            
                            {/* Passengers Counter */}
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <div className="font-medium text-gray-700">Kattalar</div>
                                    <div className="text-xs text-gray-400">12 yosh va undan katta</div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button 
                                        onClick={() => setPassengers(Math.max(1, passengers - 1))}
                                        className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${passengers <= 1 ? 'border-gray-200 text-gray-300 bg-gray-50' : 'border-blue-100 text-blue-600 hover:bg-blue-50'}`}
                                        disabled={passengers <= 1}
                                    >
                                        −
                                    </button>
                                    <span className="font-bold text-lg w-4 text-center">{passengers}</span>
                                    <button 
                                        onClick={() => setPassengers(Math.min(9, passengers + 1))}
                                        className="w-8 h-8 rounded-full flex items-center justify-center border border-blue-100 text-blue-600 hover:bg-blue-50 transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="h-px bg-gray-100 my-3"></div>

                            <h3 className="font-bold text-gray-800 mb-3">Klass turi</h3>
                            
                            {/* Class Selection */}
                            <div className="space-y-2">
                                <label className="flex items-center justify-between cursor-pointer group p-2 rounded-lg hover:bg-gray-50">
                                    <span className="text-gray-700 font-medium">Ekonom</span>
                                    <input 
                                        type="radio" 
                                        name="travelClass" 
                                        value="ekonom"
                                        checked={travelClass === 'ekonom'}
                                        onChange={() => setTravelClass('ekonom')}
                                        className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                                    />
                                </label>
                                <label className="flex items-center justify-between cursor-pointer group p-2 rounded-lg hover:bg-gray-50">
                                    <span className="text-gray-700 font-medium">Komfort</span>
                                    <input 
                                        type="radio" 
                                        name="travelClass" 
                                        value="comfort"
                                        checked={travelClass === 'comfort'}
                                        onChange={() => setTravelClass('comfort')}
                                        className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                                    />
                                </label>
                            </div>
                        </div>
                    )}
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
