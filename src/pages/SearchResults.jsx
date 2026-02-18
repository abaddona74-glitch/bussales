import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import TicketModal from '../components/TicketModal';

const API_URL = import.meta.env.VITE_API_URL || '';

const formatPrice = (price) => {
  return new Intl.NumberFormat('uz-UZ').format(price);
};

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const to = searchParams.get('to') || 'Manzil';
  const from = searchParams.get('from') || 'Toshkent';

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState(null);

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/api/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
        if (!res.ok) throw new Error('Reyslar topilmadi');
        const data = await res.json();
        setTrips(data);
      } catch (err) {
        setError(err.message);
        setTrips([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, [from, to]);

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

      {loading && (
        <p className="text-gray-500 mb-8">Yuklanmoqda...</p>
      )}

      {error && (
        <p className="text-red-500 mb-8">{error}</p>
      )}

      {!loading && !error && (
        <p className="text-gray-500 mb-8">Topilgan reyslar: {trips.length} ta</p>
      )}

      <div className="space-y-4">
        {trips.map((trip, index) => (
          <div key={trip.id} className={`bg-white rounded-xl shadow border border-gray-100 p-6 hover:shadow-lg transition-shadow ${index > 0 ? 'opacity-90' : ''}`}>
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div className="flex gap-4 items-center">
                <div className={`w-12 h-12 ${index === 0 ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-600'} rounded-full flex items-center justify-center`}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M4.5 3.75a3 3 0 00-3 3v.75h21v-.75a3 3 0 00-3-3h-15z" />
                    <path fillRule="evenodd" d="M22.5 9.75h-21v7.5a3 3 0 003 3h15a3 3 0 003-3v-7.5zm-18 3.75a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-bold text-xl">{trip.departureTime}</span>
                    <span className="text-gray-400 text-sm">———— {trip.duration} ————</span>
                    <span className="font-bold text-xl">{trip.arrivalTime}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 gap-4">
                    <span>{trip.fromStation}</span>
                    <span>{trip.toStation}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-2 text-right border-t md:border-t-0 pt-4 md:pt-0">
                <span className="text-2xl font-bold text-blue-600">{formatPrice(trip.price)} so'm</span>
                <button 
                  onClick={() => setSelectedTrip(trip)}
                  className="bg-[#FF7F00] hover:bg-[#ff8c1a] text-white font-medium py-2 px-6 rounded-lg transition-colors w-full md:w-auto"
                >
                  Tanlash
                </button>
              </div>
            </div>
          </div>
        ))}

        {!loading && !error && trips.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">Bu yo'nalish bo'yicha reyslar topilmadi</p>
          </div>
        )}
      </div>

      {/* Ticket Modal */}
      {selectedTrip && (
        <TicketModal trip={selectedTrip} onClose={() => setSelectedTrip(null)} />
      )}
    </div>
  );
};

export default SearchResults;
