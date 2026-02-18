import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';

const Home = () => {
  const navigate = useNavigate();
  const [popularRoutes, setPopularRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/popular-routes')
      .then(res => res.json())
      .then(data => {
        setPopularRoutes(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching popular routes:', err);
        setLoading(false);
      });
  }, []);

  const handleCardClick = (destination) => {
    navigate(`/search?to=${destination}`);
  };

  return (
    <>
      <Hero />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Mashhur yo'nalishlar</h2>
        
        {loading ? (
             <div className="text-center py-12 text-gray-500">Yuklanmoqda...</div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularRoutes.length > 0 ? (
            popularRoutes.map((route) => (
                <div 
                    key={route.id}
                    onClick={() => handleCardClick(route.to)}
                    className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer border border-gray-100 group"
                >
                    <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg group-hover:text-blue-600 transition-colors">{route.from} &rarr; {route.to}</h3>
                    {route.tag && (
                         <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">{route.tag}</span>
                    )}
                    </div>
                    <p className="text-gray-500 text-sm mb-4">{route.frequency}</p>
                    <div className="flex justify-between items-center">
                    <span className="font-bold text-blue-600 text-xl">{route.price.toLocaleString()} so'm</span>
                    <span className="text-sm text-gray-400">dan boshlab</span>
                    </div>
                </div>
            ))
          ) : (
            <div className="col-span-3 text-center text-gray-500">
               Hozircha mashhur yo'nalishlar topilmadi.
            </div>
          )}
        </div>
        )}
      </div>
    </>
  );
};

export default Home;
