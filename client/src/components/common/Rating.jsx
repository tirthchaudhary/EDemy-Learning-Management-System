import React, { useEffect, useState } from 'react';

const Rating = ({ initialRating, onRate }) => {
  const [rating, setRating] = useState(initialRating || 0);
  const [hover, setHover] = useState(0); // Tracks star hover state for micro-interactions

  const handleRating = (value) => {
    setRating(value);
    if (onRate) {
      onRate(value);
    }
  };

  useEffect(() => {
    setRating(initialRating || 0);
  }, [initialRating]);

  return (
    <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-100/80 px-3 py-1.5 rounded-xl w-fit">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        
        // Highlights stars if they are currently hovered or selected as a rating value
        const isHighlighted = starValue <= (hover || rating);

        return ( // 👈 FIXED: Added missing return statement
          <button
            key={index}
            type="button" // Prevents form submission triggers inside forms
            onClick={() => handleRating(starValue)}
            onMouseEnter={() => setHover(starValue)}
            onMouseLeave={() => setHover(0)}
            className={`cursor-pointer text-2xl sm:text-3xl transition-all duration-150 transform hover:scale-115 active:scale-95 focus:outline-none select-none ${
              isHighlighted 
                ? 'text-amber-400 drop-shadow-[0_1px_3px_rgba(250,204,21,0.25)]' 
                : 'text-slate-300 hover:text-slate-400'
            }`}
            aria-label={`Rate ${starValue} out of 5 stars`}
          >
            &#9733;
          </button>
        );
      })}
      
      {/* Optional real-time rating score readout */}
      {(rating > 0 || hover > 0) && (
        <span className="text-xs font-bold text-slate-500 pl-2 min-w-[2.5rem] text-center transition-opacity duration-150">
          {hover || rating} / 5
        </span>
      )}
    </div>
  );
};

export default Rating;