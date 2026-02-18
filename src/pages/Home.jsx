import React from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';

const Home = () => {
  const navigate = useNavigate();

  const handleCardClick = (destination) => {
    navigate(`/search?to=${destination}`);
  };

  return (
    <>
      <Hero />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Mashhur yo'nalishlar</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            onClick={() => handleCardClick('Samarqand')}
            className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer border border-gray-100 group"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg group-hover:text-blue-600 transition-colors">Toshkent &rarr; Samarqand</h3>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">Arzon</span>
            </div>
            <p className="text-gray-500 text-sm mb-4">Har kuni 12 ta reys</p>
            <div className="flex justify-between items-center">
              <span className="font-bold text-blue-600 text-xl">55 000 so'm</span>
              <span className="text-sm text-gray-400">dan boshlab</span>
            </div>
          </div>
          
          <div 
             onClick={() => handleCardClick('Buxoro')}
             className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer border border-gray-100 group"
          >
             <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg group-hover:text-blue-600 transition-colors">Toshkent &rarr; Buxoro</h3>
            </div>
            <p className="text-gray-500 text-sm mb-4">Har kuni 8 ta reys</p>
            <div className="flex justify-between items-center">
              <span className="font-bold text-blue-600 text-xl">85 000 so'm</span>
              <span className="text-sm text-gray-400">dan boshlab</span>
            </div>
          </div>

          <div 
             onClick={() => handleCardClick('Xiva')}
             className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer border border-gray-100 group"
          >
             <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg group-hover:text-blue-600 transition-colors">Toshkent &rarr; Xiva</h3>
            </div>
            <p className="text-gray-500 text-sm mb-4">Haftada 4 kun</p>
            <div className="flex justify-between items-center">
              <span className="font-bold text-blue-600 text-xl">120 000 so'm</span>
              <span className="text-sm text-gray-400">dan boshlab</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
