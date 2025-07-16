import React from 'react';

const TailwindTest = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-3">
        <div className="md:flex">
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">Tailwind Test Component</div>
            <p className="mt-2 text-slate-500">If you can see this card with styling, Tailwind CSS is working correctly!</p>
            <div className="mt-4">
              <span className="inline-block bg-blue-500 text-white px-4 py-2 rounded">Blue Button</span>
              <span className="inline-block bg-green-500 text-white px-4 py-2 rounded ml-2">Green Button</span>
              <span className="inline-block bg-red-500 text-white px-4 py-2 rounded ml-2">Red Button</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TailwindTest;
