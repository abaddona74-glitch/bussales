import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';

const Home = () => {
  const navigate = useNavigate();
  const [popularRoutes, setPopularRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoute, setSelectedRoute] = useState(null); // Modaldagi tanlangan route

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/popular-routes`)
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

  const handleCardClick = (route) => {
    // navigate(`/search?to=${route.to}`); ESKI logic
    setSelectedRoute(route); // YANGI: Modalni ochish
  };

  const closeModal = () => {
      setSelectedRoute(null);
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
                    onClick={() => handleCardClick(route)}
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

      {/* MODAL WINDOW */}
      {selectedRoute && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={closeModal}>
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
                  
                  {/* Header */}
                  <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
                      <div>
                          <h3 className="text-2xl font-bold">{selectedRoute.from} &rarr; {selectedRoute.to}</h3>
                          <p className="text-blue-100 mt-1">{selectedRoute.frequency}</p>
                      </div>
                      <button onClick={closeModal} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                      </button>
                  </div>

                  {/* Body */}
                  <div className="p-6 space-y-6">
                      
                      {/* Description & Arrival */}
                      <div className="grid md:grid-cols-2 gap-6">
                          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                              <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                                  📍 Yetib borish manzili
                              </h4>
                              <p className="text-gray-600">{selectedRoute.arrivalLocation || "Markaziy Avtovokzal"}</p>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                              <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                                  ℹ️ Yo'nalish haqida
                              </h4>
                              <p className="text-gray-600">{selectedRoute.description || "Qulay va havfsiz sayohat."}</p>
                          </div>
                      </div>

                      {/* Video Section */}
                      {selectedRoute.videoUrl && (
                          <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                              <div className="aspect-video w-full">
                                  <iframe 
                                      className="w-full h-full"
                                      src={selectedRoute.videoUrl} 
                                      title="Destination Video"
                                      frameBorder="0"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                      allowFullScreen
                                  ></iframe>
                              </div>
                          </div>
                      )}

                      {/* Action Button */}
                      <button 
                          onClick={() => navigate(`/search?to=${selectedRoute.to}`)}
                          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                      >
                          Chiptalarni ko'rish ({selectedRoute.price.toLocaleString()} so'm dan)
                      </button>
                  </div>

              </div>
          </div>
      )}
    </>
  );
};

export default Home;
