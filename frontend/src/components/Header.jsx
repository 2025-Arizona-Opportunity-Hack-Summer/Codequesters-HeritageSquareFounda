import React from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const Header = ({ driveFolderUrl, setDriveFolderUrl, onBlur, isReady }) => {
  return (
    <header className="relative backdrop-blur-md bg-heritage-green/80 border-b border-heritage-off-white/10 shadow-lg">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-heritage-green/50 to-heritage-green/30"></div>
      
      <div className="relative p-4 text-center space-y-3">
        {/* Logo and Title Row */}
        <div className="flex items-center justify-center gap-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img 
              src="/square-phx.webp" 
              alt="The Square PHX Logo"
              className="h-12 w-12 object-contain drop-shadow-lg"
            />
          </div>
          
          {/* Title */}
          <div className="text-left">
            <h1 className="font-serif text-2xl sm:text-3xl text-heritage-off-white font-bold tracking-wide leading-tight">
              The Square PHX
            </h1>
            <p className="text-heritage-off-white/80 text-sm font-light tracking-wider -mt-1">
              AI Assistant
            </p>
          </div>
        </div>

        {/* Updated Input Area */}
        <div className="max-w-sm mx-auto">
          {/* This new flex container aligns the input and the icon */}
          <div className="flex items-center justify-center gap-2">
            <div className="relative group flex-1">
              <input
                type="text"
                value={driveFolderUrl}
                onChange={(e) => setDriveFolderUrl(e.target.value)}
                onBlur={onBlur}
                placeholder="Paste Google Drive Folder Link..."
                className="
                  w-full p-3 bg-heritage-off-white/10 backdrop-blur-sm
                  text-heritage-off-white placeholder:text-heritage-off-white/50
                  border border-heritage-off-white/20 rounded-lg text-sm
                  focus:outline-none focus:ring-2 focus:ring-heritage-gold/50 focus:border-heritage-gold/50
                  transition-all duration-300 text-center font-medium
                  group-hover:bg-heritage-off-white/15
                "
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-heritage-gold/0 via-heritage-gold/5 to-heritage-gold/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
            
            {/* The checkmark is now outside the input's container */}
            {isReady && (
              <div className="flex-shrink-0">
                <CheckCircleIcon className="w-6 h-6 text-green-400" />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;