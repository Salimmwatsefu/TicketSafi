import React, { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';

export const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted
    const consent = localStorage.getItem('yadi-tickets-cookie-consent');
    
    // If not, show the banner after a polite 2-second delay
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('yadi-tickets-cookie-consent', 'true');
    setIsVisible(false);
  };

  const handleClose = () => {
    // Optional: You can choose to not set the cookie here so it asks again next session,
    // or set a 'declined' flag. For simplicity, we just close it.
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] max-w-sm w-[calc(100%-3rem)] animate-slide-up">
      {/* Glassmorphism Container */}
      <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl flex flex-col gap-4">
        
        {/* Header & Close */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-full text-primary">
                <Cookie className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-sm">We use cookies</h4>
          </div>
          <button 
            onClick={handleClose}
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Minimal Text */}
        <p className="text-xs text-zinc-400 leading-relaxed">
          We use essential cookies to make Yadi Tickets work and improve your experience. 
          By clicking accept, you agree to our use of cookies.
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button 
            onClick={handleAccept}
            className="flex-1 py-2.5 px-4 bg-white text-black text-xs font-bold rounded-lg hover:bg-zinc-200 transition-colors shadow-lg"
          >
            Accept All
          </button>
          <button 
            onClick={handleClose}
            className="flex-1 py-2.5 px-4 bg-white/5 border border-white/10 text-white text-xs font-bold rounded-lg hover:bg-white/10 transition-colors"
          >
            Decline
          </button>
        </div>

      </div>
    </div>
  );
};