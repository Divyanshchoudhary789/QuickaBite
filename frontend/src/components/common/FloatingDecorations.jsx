import React from "react";

export default function FloatingDecorations() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none opacity-20"
      id="floating-spice-decorations"
    >
      {/* Basil/Mint Leaf SVG top-left */}
      <div className="absolute top-[15%] left-[5%] w-16 h-16 text-emerald-600/40 animate-drift-1">
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-full h-full"
        >
          <path d="M17 8C8 8 4 12 4 17C4 18.1 4.9 19 6 19C11 19 15 15 15 10C15 9.1 14.1 8 13 8H17Z" />
          <path d="M12 2C5 2 2 5 2 9C2 10.1 2.9 11 4 11C9 11 12 8 12 4C12 3.1 11.1 2 10 2H12Z" />
        </svg>
      </div>
      {/* Chili Pepper SVG mid-right */}
      <div className="absolute top-[45%] right-[6%] w-12 h-12 text-red-500/30 animate-drift-2">
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-full h-full"
        >
          <path d="M19.5 3C18.5 3 17.5 3.5 16.7 4.3C13.8 7.2 9.5 9 5 9C4.4 9 4 9.4 4 10C4 15.5 8.5 20 14 20C14.6 20 15 19.6 15 19C15 14.5 16.8 10.2 19.7 7.3C20.5 6.5 21 5.5 21 4.5C21 3.7 20.3 3 19.5 3Z" />
        </svg>
      </div>
      {/* Star Anise SVG bottom-left */}
      <div className="absolute bottom-[22%] left-[4%] w-14 h-14 text-amber-800/25 animate-drift-3">
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-full h-full"
        >
          <path d="M12 2L14 8L20 8L15 12L17 18L12 14L7 18L9 12L4 8L10 8Z" />
        </svg>
      </div>
      {/* Mint leaf bottom-right */}
      <div className="absolute bottom-[10%] right-[10%] w-14 h-14 text-emerald-600/30 animate-drift-1">
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-full h-full"
        >
          <path d="M12 2C5 2 2 5 2 9C2 10.1 2.9 11 4 11C9 11 12 8 12 4C12 3.1 11.1 2 10 2H12Z" />
        </svg>
      </div>
      {/* Star Sparkle top-right */}
      <div className="absolute top-[8%] right-[18%] w-8 h-8 text-brand-orange/30 animate-drift-3">
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-full h-full"
        >
          <path d="M12 2L13.5 10.5L22 12L13.5 13.5L12 22L10.5 13.5L2 12L10.5 10.5Z" />
        </svg>
      </div>
    </div>
  );
}
