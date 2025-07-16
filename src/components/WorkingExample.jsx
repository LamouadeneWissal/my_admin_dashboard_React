import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; // Make sure this has the Tailwind directives

function TailwindExample() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">React + Tailwind CSS</h1>
        <p className="text-gray-700 mb-6">
          This is a React component styled with Tailwind CSS processed through PostCSS.
        </p>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h2 className="font-semibold text-blue-800 mb-2">Feature One</h2>
            <p className="text-blue-600 text-sm">This box should have blue styling</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h2 className="font-semibold text-green-800 mb-2">Feature Two</h2>
            <p className="text-green-600 text-sm">This box should have green styling</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors">
            Primary Button
          </button>
          
          <button className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 font-medium py-2 px-4 rounded transition-colors">
            Secondary Button
          </button>
        </div>
      </div>
    </div>
  );
}

// Only run this code if this file is the entry point
if (window.location.pathname.includes('working-example')) {
  createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <TailwindExample />
    </React.StrictMode>
  );
}

export default TailwindExample;
