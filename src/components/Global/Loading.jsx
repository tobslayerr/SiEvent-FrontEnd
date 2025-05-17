import React from 'react';

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-4 border-blue-300 border-t-transparent animate-spin"></div>
        <div className="absolute inset-4 rounded-full bg-blue-100"></div>
      </div>
    </div>
  );
};

export default Loading;
