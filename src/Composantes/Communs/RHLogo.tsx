import React from 'react';

export const RHLogo = ({ size = 64 }: { size?: number }) => (
  <div 
    className="relative flex items-center justify-center overflow-hidden rounded-2xl shadow-lg"
    style={{ 
      width: size, 
      height: size, 
      background: 'linear-gradient(135deg, #FF007A 0%, #7000FF 50%, #00D1FF 100%)' 
    }}
  >
    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
    <span className="text-white font-black italic tracking-tighter" style={{ fontSize: size * 0.4 }}>RH</span>
    <div className="absolute bottom-1 right-1 opacity-80">
      <div className="w-2 h-2 bg-white rounded-full blur-[1px]" />
    </div>
  </div>
);
