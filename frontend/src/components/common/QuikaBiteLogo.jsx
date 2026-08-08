export default function QuikaBiteLogo({
  className = "",
  showText = true,
  size = "md",
}) {
  const dims = {
    sm: { box: "h-10 w-10", text: "text-lg", sub: "hidden" },
    md: { box: "h-14 w-14", text: "text-2xl", sub: "text-[9px]" },
    lg: { box: "h-24 w-24", text: "text-4xl", sub: "text-xs" },
    xl: { box: "h-40 w-40", text: "text-6xl", sub: "text-sm" },
  }[size];
  return (
    <div
      className={`flex items-center gap-3 select-none ${className}`}
      id="Quikabite-logo-component"
    >
      {/* SVG Logo Graphic */}
      <div
        className={`${dims.box} shrink-0 relative`}
        id="Quikabite-svg-graphic"
      >
        <svg
          viewBox="0 0 500 500"
          className="w-full h-full drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* 1. LEFT SPEED LINES (Quick delivery representation) */}
          <path
            d="M 50 215 L 140 215"
            stroke="#00712D"
            strokeWidth="16"
            strokeLinecap="round"
          />
          <path
            d="M 20 245 L 150 245"
            stroke="#D20000"
            strokeWidth="16"
            strokeLinecap="round"
          />
          <path
            d="M 50 275 L 160 275"
            stroke="#F1B400"
            strokeWidth="16"
            strokeLinecap="round"
          />
          <path
            d="M 80 305 L 140 305"
            stroke="#F1B400"
            strokeWidth="16"
            strokeLinecap="round"
          />

          {/* 2. MAIN GREEN CIRCLE "Q" (outer radius 115, inner radius 60, centered at 265, 275) */}
          {/* We do a mask or a filled compound path. Since we have a white center, we can lay a white circle on top. */}
          <circle cx="265" cy="275" r="115" fill="#00712D" />
          <circle cx="265" cy="275" r="60" fill="#FFFFFF" />

          {/* 3. BITE MARK OUT CUTOUT (White circle overlapping the top-right of the green circle) */}
          <circle cx="345" cy="195" r="45" fill="#FFFFFF" />
          {/* Bite bite bite - multiple small bites along the edge for realistic bite effect */}
          <circle cx="310" cy="170" r="15" fill="#FFFFFF" />
          <circle cx="368" cy="225" r="15" fill="#FFFFFF" />

          {/* Bite ripples / ridges (Red stroke bite contour) */}
          <path
            d="M 292 172 C 305 185, 312 215, 350 226"
            stroke="#D20000"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />

          {/* 4. SPLASHES / DROPLETS flying from the bite */}
          {/* Droplet 1: Green */}
          <path
            d="M 390 145 C 385 130, 410 110, 412 125 C 414 140, 395 160, 390 145 Z"
            fill="#00712D"
          />
          {/* Droplet 2: Orange/Yellow */}
          <path
            d="M 425 180 C 420 170, 445 155, 446 168 C 447 181, 430 190, 425 180 Z"
            fill="#F1B400"
          />
          {/* Droplet 3: Red */}
          <path
            d="M 405 220 C 400 215, 425 200, 427 210 C 429 220, 410 225, 405 220 Z"
            fill="#D20000"
          />

          {/* 5. CHEF'S HAT (Mounted on top-left of the Q circle, around 170, 150) */}
          <g id="chef-hat">
            {/* White puffs with green outline */}
            <path
              d="M 125 145 
                 C 110 140, 95 105, 125 80 
                 C 155 55, 195 30, 215 50
                 C 235 30, 275 60, 255 105
                 C 275 110, 275 150, 245 155 
                 Z"
              fill="#FFFFFF"
              stroke="#00712D"
              strokeWidth="14"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {/* Chef Hat Base Striped Band */}
            <path
              d="M 152 135 L 234 95"
              stroke="#00712D"
              strokeWidth="24"
              strokeLinecap="round"
            />
            {/* White filler inside band */}
            <path
              d="M 154 134 L 232 96"
              stroke="#FFFFFF"
              strokeWidth="16"
              strokeLinecap="round"
            />
            {/* Yellow and Red stripes on the hat band */}
            <path d="M 170 126 L 195 114" stroke="#F1B400" strokeWidth="6" />
            <path d="M 195 114 L 218 103" stroke="#D20000" strokeWidth="6" />
          </g>

          {/* 6. MUSTACHE / TAIL OF THE Q (Bottom-right wavy ribbon) */}
          <path
            d="M 310 325 
               C 335 325, 370 340, 400 310 
               C 360 360, 310 360, 270 340 
               Z"
            fill="#00712D"
            stroke="#00712D"
            strokeWidth="4"
            strokeLinejoin="round"
          />

          {/* 7. SMILEY FACE inside the inner circle */}
          {/* Left Eye: Solid circle */}
          <circle cx="235" cy="265" r="8.5" fill="#00712D" />

          {/* Right Eye: Cute Wink Arc */}
          <path
            d="M 268 260 Q 280 252 292 265"
            stroke="#00712D"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
          />

          {/* Smiling Mouth */}
          <path
            d="M 222 288 Q 262 322 298 288"
            stroke="#00712D"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
          />

          {/* Tongue sticking out, licking lip */}
          <path
            d="M 268 298 
               C 265 315, 290 320, 292 298 
               Z"
            fill="#D20000"
          />
        </svg>
      </div>

      {/* Brand Text Branding */}
      {showText && (
        <div className="flex flex-col text-left" id="Quikabite-brand-text">
          <h1
            className="font-display font-black tracking-tight leading-none text-gray-900"
            style={{ fontSize: "1.25em" }}
          >
            <span className="text-[#00712D]">Quicka</span>
            <span className="text-[#D20000] relative">
              Bite
              {/* Little leaf on top of 'i' of Bite */}
              <span className="absolute -top-1 left-2.5 text-[#00712D] text-[10px] select-none">
                🍃
              </span>
            </span>
          </h1>
          <p
            className={`font-black uppercase tracking-widest text-[#00712D] ${dims.sub}`}
            style={{ letterSpacing: "0.12em" }}
          >
            Quick, Tasty & Always Fresh
          </p>
        </div>
      )}
    </div>
  );
}
