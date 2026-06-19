import React from 'react';

export default function Jordan1SVG({ style }) {
  return (
    <svg
      viewBox="0 0 520 380"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', overflow: 'visible', ...style }}
      fill="none"
    >
      <defs>
        <linearGradient id="j1-upper" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e1e1e" />
          <stop offset="100%" stopColor="#060606" />
        </linearGradient>
        <linearGradient id="j1-toe" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f5f5f5" />
          <stop offset="100%" stopColor="#d0d0d0" />
        </linearGradient>
        <linearGradient id="j1-mid" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#eeeeee" />
          <stop offset="100%" stopColor="#bdbdbd" />
        </linearGradient>
        <linearGradient id="j1-out" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#141414" />
          <stop offset="100%" stopColor="#020202" />
        </linearGradient>
        <linearGradient id="j1-swoosh-g" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
          <stop offset="100%" stopColor="rgba(255,255,255,1)" />
        </linearGradient>
        <filter id="j1-drop" x="-5%" y="-5%" width="115%" height="120%">
          <feDropShadow dx="0" dy="10" stdDeviation="16" floodColor="#000" floodOpacity="0.75" />
        </filter>
        <filter id="j1-inner-shadow">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
          <feOffset dx="2" dy="3" result="offset" />
          <feComposite in="SourceGraphic" in2="offset" operator="over" />
        </filter>
      </defs>

      <g filter="url(#j1-drop)">

        {/* ── OUTSOLE ── */}
        <path
          d="
            M 76 362
            C 64 362 52 356 48 346
            C 44 336 48 324 60 318
            L 76 314
            L 444 306
            C 464 305 482 310 492 319
            C 502 328 500 341 489 348
            C 478 355 460 360 436 360
            L 116 363
            C 94 363 80 363 76 362 Z
          "
          fill="url(#j1-out)"
        />

        {/* ── MIDSOLE ── */}
        <path
          d="
            M 76 314
            L 86 294
            L 100 284
            L 118 278
            L 444 270
            C 462 269 480 274 490 283
            C 500 292 498 305 487 312
            C 476 319 458 324 436 325
            L 116 332
            C 96 332 82 328 76 321
            L 76 314 Z
          "
          fill="url(#j1-mid)"
        />

        {/* Midsole side highlight */}
        <path
          d="M 86 294 C 200 286 340 280 444 270"
          stroke="rgba(255,255,255,0.55)"
          strokeWidth="1.5"
          fill="none"
        />

        {/* ── MAIN BLACK UPPER ── */}
        <path
          d="
            M 118 278
            L 112 260 L 105 238 L 100 214
            L 96 190 L 93 166 L 91 142
            L 90 118
            C 89 96 93 76 102 58
            C 111 40 126 28 144 22
            C 160 16 177 20 192 30
            C 205 40 214 56 218 76
            C 221 93 219 112 213 130
            L 205 150 L 196 166
            C 190 178 185 192 181 207
            C 177 222 174 238 172 255
            L 170 270
            L 170 278
            L 444 270
            L 118 278 Z
          "
          fill="url(#j1-upper)"
        />

        {/* ── COLLAR TOP HIGHLIGHT ── */}
        <path
          d="
            M 144 22 C 160 17 176 20 190 30
            C 203 40 212 56 216 75
          "
          stroke="rgba(255,255,255,0.14)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />

        {/* ── COLLAR INNER PADDING (visible from side) ── */}
        <path
          d="
            M 148 26
            C 162 21 177 24 188 34
            C 197 43 200 58 198 73
            L 194 90
            C 189 106 180 118 168 124
            C 160 129 152 128 145 122
            C 137 115 133 103 133 89
            C 133 72 138 50 148 26 Z
          "
          fill="white"
          opacity="0.12"
        />

        {/* ── BACK HEEL PANEL SEAM ── */}
        <path
          d="M 156 30 C 162 60 164 95 160 130 C 156 162 148 192 140 220"
          stroke="rgba(255,255,255,0.09)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="5 4"
        />

        {/* ── TOE CAP (white front panel) ── */}
        <path
          d="
            M 344 218
            C 368 212 396 208 424 210
            C 450 212 474 220 490 234
            C 506 248 512 266 510 282
            C 508 296 499 308 486 314
            L 466 319
            L 440 322
            C 420 324 400 325 382 324
            C 365 323 352 319 347 312
            L 346 290
            C 345 270 345 250 348 232
            L 344 218 Z
          "
          fill="url(#j1-toe)"
        />

        {/* Toe cap top shine */}
        <path
          d="
            M 348 218 C 370 212 398 209 426 211
            C 450 213 472 220 488 233
          "
          stroke="rgba(255,255,255,0.55)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />

        {/* Toe cap seam (left edge of white) */}
        <path
          d="M 348 218 C 347 240 346 268 347 294"
          stroke="rgba(160,160,160,0.35)"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="4 3"
        />

        {/* Perforations on toe cap */}
        {[0, 1, 2, 3].map(row =>
          [0, 1, 2, 3].map(col => (
            <circle
              key={`${row}-${col}`}
              cx={388 + col * 17}
              cy={232 + row * 17}
              r={2.8}
              fill="rgba(140,140,140,0.32)"
            />
          ))
        )}

        {/* ── SWOOSH ── */}
        <path
          d="
            M 158 262
            C 174 270 202 274 235 268
            C 268 262 303 246 336 228
            C 360 214 382 202 399 192
            C 384 205 362 219 336 235
            C 306 252 274 267 244 273
            C 215 279 188 278 167 270
            C 155 264 150 257 155 254
            C 157 252 160 255 158 262 Z
          "
          fill="url(#j1-swoosh-g)"
        />

        {/* ── TONGUE ── */}
        <path
          d="
            M 178 100
            C 183 88 190 78 200 72
            C 210 69 220 73 228 82
            C 236 91 240 104 240 118
            L 239 144
            L 226 151
            L 210 148
            L 195 140
            L 178 120
            L 178 100 Z
          "
          fill="#181818"
        />
        {/* Tongue center stripe (Nike branding) */}
        <rect x="201" y="74" width="13" height="68" rx="2" fill="white" opacity="0.5" />
        {/* Tongue stitching edges */}
        <path
          d="M 180 105 C 182 92 188 80 198 74"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1.5"
          fill="none"
        />

        {/* ── LACES ── */}
        {[
          [197, 151, 218, 155, 230, 153, 258, 151],
          [196, 165, 217, 169, 230, 167, 272, 165],
          [196, 179, 216, 183, 230, 181, 286, 179],
          [196, 193, 216, 197, 230, 195, 300, 193],
          [196, 207, 216, 211, 230, 209, 313, 207],
        ].map(([x1, y1, x2, y2, x3, y3, x4, y4], i) => (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.88)" strokeWidth="2.5" strokeLinecap="round" />
            <line x1={x3} y1={y3} x2={x4} y2={y4} stroke="rgba(255,255,255,0.88)" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        ))}

        {/* Lace center vertical */}
        <line x1="224" y1="151" x2="224" y2="207" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round" />

        {/* Eyelets */}
        {[151, 165, 179, 193, 207].map((y, i) => (
          <g key={i}>
            <circle cx="211" cy={y + 2} r="3.8" stroke="rgba(200,200,200,0.22)" strokeWidth="1.2" fill="rgba(0,0,0,0.3)" />
            <circle cx="236" cy={y} r="3.8" stroke="rgba(200,200,200,0.22)" strokeWidth="1.2" fill="rgba(0,0,0,0.3)" />
          </g>
        ))}

        {/* ── HEEL PULL TAB ── */}
        <path
          d="M 82 268 L 78 285 L 88 285 L 88 268"
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* ── OUTSOLE GRIP LINES ── */}
        <g stroke="rgba(40,40,40,0.9)" strokeWidth="1.8" fill="none" strokeLinecap="round">
          <line x1="115" y1="350" x2="210" y2="348" />
          <line x1="228" y1="347" x2="320" y2="346" />
          <line x1="338" y1="345" x2="420" y2="344" />
          <line x1="438" y1="343" x2="485" y2="342" />
        </g>

        {/* ── VAMP/INSTEP HIGHLIGHT ── */}
        <path
          d="
            M 172 270
            C 185 262 210 255 245 252
            C 280 249 318 249 350 250
          "
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />

        {/* ── JORDAN WING LOGO (near ankle, simplified) ── */}
        <g transform="translate(180, 232)" opacity="0.22" fill="white">
          <path d="M 0 0 C -7 -10 -18 -12 -22 -8 C -17 -5 -12 0 -7 6 C -4 10 -2 14 0 18" />
          <path d="M 0 0 C 7 -10 18 -12 22 -8 C 17 -5 12 0 7 6 C 4 10 2 14 0 18" />
        </g>

      </g>
    </svg>
  );
}
