import React, { useState } from 'react';
import { FaWater, FaHamburger, FaCandyCane, FaBolt, FaTimes, FaMoneyBillWave } from 'react-icons/fa';

const paymentMethods = [
  {
    id: 'uzum',
    name: 'Uzum',
    color: '#7B2BFC',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <circle cx="12" cy="12" r="10" fill="#7B2BFC"/>
        <text x="12" y="16" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">U</text>
      </svg>
    ),
  },
  {
    id: 'payme',
    name: 'Payme',
    color: '#00CCCC',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <circle cx="12" cy="12" r="10" fill="#00CCCC"/>
        <text x="12" y="16" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">P</text>
      </svg>
    ),
  },
  {
    id: 'click',
    name: 'Click',
    color: '#00AAFF',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <circle cx="12" cy="12" r="10" fill="#00AAFF"/>
        <text x="12" y="16" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">C</text>
      </svg>
    ),
  },
  {
    id: 'cash',
    name: 'Naqd',
    color: '#22C55E',
    icon: <FaMoneyBillWave className="w-6 h-6 text-green-500" />,
  },
];

const includedItems = [
  { icon: <FaWater className="w-5 h-5 text-blue-500" />, name: 'Suv (0.5L)', nameRu: 'Вода' },
  { icon: <FaHamburger className="w-5 h-5 text-orange-500" />, name: 'Sendvich (ikki qavatli)', nameRu: 'Сендвич двойной' },
  { icon: <FaCandyCane className="w-5 h-5 text-pink-500" />, name: 'Shokolad', nameRu: 'Шоколад' },
  { icon: <FaBolt className="w-5 h-5 text-yellow-500" />, name: 'Energetik ichimlik', nameRu: 'Энергетик' },
];

const formatPrice = (price) => {
  return new Intl.NumberFormat('uz-UZ').format(price);
};

const TicketModal = ({ trip, onClose }) => {
  const [selectedPayment, setSelectedPayment] = useState(null);

  if (!trip) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#0C73FE] text-white p-6 rounded-t-2xl relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
          >
            <FaTimes className="w-4 h-4" />
          </button>
          <h2 className="text-xl font-bold mb-1">{trip.from} → {trip.to}</h2>
          <p className="text-blue-100 text-sm">Chipta ma'lumotlari</p>
        </div>

        {/* Trip Details */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{trip.departureTime}</p>
              <p className="text-sm text-gray-500">{trip.fromStation}</p>
              <p className="text-xs text-gray-400 mt-1">Ketish vaqti</p>
            </div>
            <div className="flex-1 mx-4 flex flex-col items-center">
              <span className="text-xs text-gray-400 mb-1">{trip.duration}</span>
              <div className="w-full h-0.5 bg-gray-200 relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-orange-500 rounded-full"></div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{trip.arrivalTime}</p>
              <p className="text-sm text-gray-500">{trip.toStation}</p>
              <p className="text-xs text-gray-400 mt-1">Borish vaqti</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between bg-blue-50 rounded-lg p-3">
            <div>
              <p className="text-sm text-gray-600">Avtobus</p>
              <p className="font-medium">{trip.busModel}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">O'rindiqlar</p>
              <p className="font-medium">{trip.seats} ta</p>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">Bilet narxi:</span>
            <span className="text-3xl font-bold text-blue-600">{formatPrice(trip.price)} so'm</span>
          </div>
        </div>

        {/* Included Items */}
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            🎁 Yo'lga nima kiradi (bilet narxiga):
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {includedItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                  {item.icon}
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-800">{item.name}</p>
                  <p className="text-xs text-gray-400">{item.nameRu}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-3">💳 To'lov usulini tanlang:</h3>
          <div className="grid grid-cols-4 gap-3">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedPayment(method.id)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                  selectedPayment === method.id
                    ? 'border-blue-500 bg-blue-50 shadow-md scale-105'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="w-10 h-10 flex items-center justify-center">
                  {method.icon}
                </div>
                <span className="text-xs font-medium text-gray-700">{method.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Buy Button */}
        <div className="p-6">
          <button
            disabled={!selectedPayment}
            className={`w-full py-3 rounded-xl font-bold text-lg transition-all ${
              selectedPayment
                ? 'bg-[#FF7F00] hover:bg-[#ff8c1a] text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {selectedPayment ? `${formatPrice(trip.price)} so'm — Sotib olish` : "To'lov usulini tanlang"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketModal;
