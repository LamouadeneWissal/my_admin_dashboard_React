import React from 'react';

const StatCard = ({ title, value, icon, color = 'blue' }) => {
  // Define colors for different states
  const colorVariants = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      icon: 'text-blue-500',
      border: 'border-blue-100',
      iconBg: 'bg-blue-100'
    },
    green: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      icon: 'text-green-500',
      border: 'border-green-100',
      iconBg: 'bg-green-100'
    },
    red: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      icon: 'text-red-500',
      border: 'border-red-100',
      iconBg: 'bg-red-100'
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      icon: 'text-purple-500', 
      border: 'border-purple-100',
      iconBg: 'bg-purple-100'
    }
  };

  const variant = colorVariants[color] || colorVariants.blue;

  return (
    <div className={`group relative overflow-hidden rounded-xl border ${variant.border} bg-white p-6 shadow-card hover:shadow-card-hover transition-all duration-300 transform hover:-translate-y-1`}>
      <div className="absolute top-0 right-0 w-20 h-20 -mr-6 -mt-6 opacity-10 rounded-full bg-gradient-to-br from-transparent to-current transition-opacity group-hover:opacity-20" style={{ color: `rgb(var(--${color}-500))` }}></div>
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium text-gray-500">{title}</h3>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${variant.iconBg} shadow-sm group-hover:scale-105 transition-transform duration-300`}>
          <span className={`text-2xl ${variant.icon}`}>{icon}</span>
        </div>
      </div>
      <div className="mt-4 relative z-10">
        <p className="text-3xl font-bold text-gray-800">{value}</p>
        <div className="mt-4 h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
          <div 
            className={`h-1.5 rounded-full bg-${color}-500`} 
            style={{ width: `${Math.min(Math.max((parseInt(value) * 5), 15), 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
