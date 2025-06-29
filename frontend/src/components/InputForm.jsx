import React, { useState } from 'react';
import { PaperAirplaneIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';

const InputForm = ({ input, setInput, handleSubmit, isLoading, isChatDisabled }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <footer className="backdrop-blur-md bg-heritage-green/80 border-t border-heritage-off-white/10 shadow-lg">
      <div className="p-4 sm:p-6">
        {isChatDisabled && (
          <div className="flex items-center justify-center gap-2 mb-4 p-3 bg-heritage-gold/20 rounded-lg border border-heritage-gold/30">
            <ExclamationTriangleIcon className="w-5 h-5 text-heritage-gold" />
            <span className="text-heritage-off-white/90 text-sm font-medium">
              Please enter a Google Drive Folder ID above to begin chatting
            </span>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex items-end gap-3 max-w-4xl mx-auto">
          <div className={`
            flex-1 relative transition-all duration-300
            ${isFocused ? 'transform scale-[1.02]' : ''}
          `}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder={isChatDisabled ? "Enter Folder ID above to begin..." : "Ask a question about Heritage Square... (Press Enter to send)"}
              rows={1}
              className={`
                w-full p-4 pr-12 resize-none
                bg-heritage-off-white/95 backdrop-blur-sm
                text-heritage-green placeholder:text-heritage-green/60
                border-2 rounded-2xl font-medium
                focus:outline-none transition-all duration-300
                ${isFocused 
                  ? 'border-heritage-gold/70 shadow-lg shadow-heritage-gold/20' 
                  : 'border-heritage-off-white/30 hover:border-heritage-off-white/50'
                }
                ${isChatDisabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              disabled={isLoading || isChatDisabled}
              style={{ minHeight: '3.5rem', maxHeight: '8rem' }}
            />
            
            {/* Character count (optional) */}
            {input.length > 100 && (
              <div className="absolute bottom-1 right-16 text-xs text-heritage-green/60">
                {input.length}/500
              </div>
            )}
          </div>

          {/* Send Button */}
          <button
            type="submit"
            className={`
              relative p-4 rounded-2xl transition-all duration-300 transform
              ${isLoading || isChatDisabled || !input.trim()
                ? 'bg-heritage-off-white/50 text-heritage-green/50 cursor-not-allowed scale-95' 
                : 'bg-gradient-to-br from-heritage-gold to-heritage-gold/80 text-heritage-green shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
              }
            `}
            disabled={isLoading || isChatDisabled || !input.trim()}
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-heritage-green/30 border-t-heritage-green rounded-full animate-spin" />
            ) : (
              <PaperAirplaneIcon className="w-6 h-6" />
            )}
          </button>
        </form>

        {/* Helpful Tips */}
        <div className="mt-3 text-center">
          <p className="text-heritage-off-white/60 text-xs">
            💡 Tip: Press <kbd className="px-1 py-0.5 bg-heritage-off-white/20 rounded text-heritage-off-white/80">Enter</kbd> to send, <kbd className="px-1 py-0.5 bg-heritage-off-white/20 rounded text-heritage-off-white/80">Shift + Enter</kbd> for new line
          </p>
        </div>
      </div>
    </footer>
  );
};

export default InputForm;