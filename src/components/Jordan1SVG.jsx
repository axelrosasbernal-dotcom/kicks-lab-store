import React from 'react';

/* Air Jordan 1 High "Royal Reimagined" – Black / Royal Blue
   Perfil lateral, punta hacia la derecha. ViewBox 580 × 420. */
export default function Jordan1SVG({ style }) {
  return (
    <svg
      viewBox="0 0 580 420"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', overflow: 'visible', ...style }}
      fill="none"
    >
      <defs>
        {/* ── Gradientes ── */}
        <linearGradient id="j-upper" x1="0%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#1a1a1a" />
          <stop offset="100%" stopColor="#060606" />
        </linearGradient>
        <linearGradient id="j-blue-panel" x1="0%" y1="0%" x2="60%" y2="100%">
          <stop offset="0%" stopColor="#1878e8" />
          <stop offset="100%" stopColor="#0a52c4" />
        </linearGradient>
        <linearGradient id="j-blue-collar" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e85f0" />
          <stop offset="100%" stopColor="#0b5fd8" />
        </linearGradient>
        <linearGradient id="j-midsole" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f4f4f4" />
          <stop offset="100%" stopColor="#cccccc" />
        </linearGradient>
        <linearGradient id="j-outsole" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0e5ed4" />
          <stop offset="100%" stopColor="#083fa8" />
        </linearGradient>
        <linearGradient id="j-toe-shine" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
          <stop offset="60%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        {/* ── Filtros ── */}
        <filter id="j-shadow" x="-8%" y="-8%" width="120%" height="130%">
          <feDropShadow dx="0" dy="14" stdDeviation="20" floodColor="#000" floodOpacity="0.8" />
        </filter>
        <filter id="j-blue-glow" x="-10%" y="-10%" width="130%" height="130%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur" />
          <feFlood floodColor="#1461d4" floodOpacity="0.4" result="color" />
          <feComposite in="color" in2="blur" operator="in" result="shadow" />
          <feMerge><feMergeNode in="shadow" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <g filter="url(#j-shadow)">

        {/* ════════════════════════════════
            OUTSOLE  (azul royal oscuro)
            ════════════════════════════════ */}
        <path
          d="
            M 82 392
            C 70 392 56 385 52 374
            C 48 363 52 351 64 346
            L 80 341 L 464 333
            C 484 332 503 337 513 347
            C 523 357 521 371 509 378
            C 497 385 477 390 452 390
            L 122 393
            C 100 393 86 393 82 392 Z
          "
          fill="url(#j-outsole)"
        />
        {/* Textura grip del outsole */}
        <g stroke="rgba(0,0,80,0.35)" strokeWidth="1.4" strokeLinecap="round">
          <line x1="120" y1="376" x2="220" y2="374" />
          <line x1="238" y1="373" x2="338" y2="371" />
          <line x1="356" y1="370" x2="440" y2="368" />
          <line x1="458" y1="367" x2="504" y2="366" />
        </g>

        {/* ════════════════════════════════
            MIDSOLE  (blanco)
            ════════════════════════════════ */}
        <path
          d="
            M 80 341
            L 90 318 L 106 306 L 124 300
            L 464 292
            C 482 291 500 296 510 305
            C 520 314 518 327 507 334
            C 496 341 478 345 454 346
            L 124 354
            C 102 354 88 349 80 342
            L 80 341 Z
          "
          fill="url(#j-midsole)"
        />
        {/* Borde superior midsole */}
        <path
          d="M 90 318 C 200 310 360 300 464 292"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth="1.5"
          fill="none"
        />

        {/* ════════════════════════════════
            UPPER PRINCIPAL  (cuerpo negro)
            ════════════════════════════════ */}
        {/*
          Silhouette completa del upper, de atrás hacia adelante.
          El collar sube alto a la izquierda, la punta es baja a la derecha.
        */}
        <path
          d="
            M 124 300
            L 116 280 L 108 256 L 102 230
            L 97 204 L 94 178 L 92 152 L 91 126
            C 91 102 95 80 104 62
            C 113 44 127 32 144 26
            C 160 20 178 24 194 35
            C 208 46 218 63 222 84
            C 225 100 223 120 216 138
            L 207 158 L 196 174
            C 189 186 182 200 178 215
            C 174 230 170 246 168 263
            L 166 282 L 165 300
            L 464 292
            L 124 300 Z
          "
          fill="url(#j-upper)"
        />

        {/* ════════════════════════════════
            PANEL AZUL COLLAR (franja azul encima del collar)
            ════════════════════════════════ */}
        {/*
          En la Jordan 1 Royal, la tira/strap superior del collar es azul.
          Es la banda horizontal que rodea la apertura del tobillo.
        */}
        <path
          d="
            M 92 140
            C 92 122 96 104 104 88
            C 112 72 124 58 140 48
            C 154 38 170 34 186 36
            C 200 38 212 46 220 60
            L 225 82
            C 228 96 226 112 220 128
            L 212 148
            C 208 158 202 170 196 180
            L 192 192
            L 180 188
            C 172 186 163 181 156 174
            C 148 166 143 154 142 140
            L 140 126
            C 138 114 140 100 144 88
            L 148 78
            C 140 88 134 102 130 118
            L 128 140
            C 126 154 128 168 133 178
            C 124 168 116 155 110 140
            C 104 125 100 108 100 90
            L 92 140 Z
          "
          fill="url(#j-blue-collar)"
          opacity="0"
        />

        {/* ── Collar strap azul (la tira visible) ── */}
        <path
          d="
            M 91 132
            C 91 114 96 92 108 74
            C 120 56 138 44 158 38
            C 174 33 190 36 204 46
            C 216 56 224 72 226 90
            C 228 106 224 124 216 138
            L 205 158
            L 195 174
            C 188 186 181 200 177 215
            C 173 229 170 245 168 262

            L 158 260
            C 160 244 163 228 167 213
            C 171 198 178 184 186 171
            L 197 155
            L 206 135
            C 212 120 214 104 211 89
            C 208 74 200 61 188 52
            C 176 43 161 40 147 44
            C 132 49 119 60 110 75
            C 101 90 97 108 97 128
            Z
          "
          fill="url(#j-blue-collar)"
        />

        {/* Highlight en collar azul */}
        <path
          d="M 156 38 C 174 34 192 37 206 48 C 218 58 226 74 228 92"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />

        {/* ════════════════════════════════
            PANEL NEGRO (zona media, entre collar y punta)
            ════════════════════════════════ */}
        {/* El cuerpo principal ya está dibujado arriba como j-upper */}

        {/* ════════════════════════════════
            TOECAP AZUL  (punta delantera perforada)
            ════════════════════════════════ */}
        <path
          d="
            M 346 230
            C 370 223 398 219 426 221
            C 453 223 478 232 496 246
            C 513 260 521 278 519 296
            C 517 312 507 324 493 330
            L 472 336 L 446 340
            C 424 342 403 342 385 340
            C 367 338 354 332 348 323
            L 346 300
            C 345 278 345 256 348 237
            L 346 230 Z
          "
          fill="url(#j-blue-panel)"
          filter="url(#j-blue-glow)"
        />

        {/* Shine en punta azul */}
        <path
          d="M 350 230 C 374 223 402 219 428 221 C 452 223 476 231 493 244"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />

        {/* Perforaciones en toecap */}
        {[0, 1, 2, 3, 4].map(row =>
          [0, 1, 2, 3].map(col => {
            const x = 374 + col * 18;
            const y = 242 + row * 18;
            if (x > 510 || y > 328) return null;
            return (
              <circle key={`p${row}-${col}`}
                cx={x} cy={y} r={2.8}
                fill="rgba(0,30,100,0.45)"
              />
            );
          })
        )}

        {/* Costura del toecap */}
        <path
          d="M 350 228 C 349 252 348 278 350 304"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="4 3"
        />

        {/* ════════════════════════════════
            SWOOSH  (azul royal sobre cuerpo negro)
            ════════════════════════════════ */}
        {/*
          En la Jordan 1, el swoosh es grande. Empieza bajo en el talón
          y sube hacia la punta. El swoosh es azul en esta versión.
        */}
        <path
          d="
            M 160 270
            C 176 278 204 283 238 277
            C 272 271 308 254 343 235
            C 366 221 388 209 405 199
            C 388 212 366 226 338 242
            C 308 259 274 274 242 280
            C 210 286 181 285 160 275
            C 148 269 144 262 148 258
            C 150 255 154 259 160 270 Z
          "
          fill="url(#j-blue-panel)"
          filter="url(#j-blue-glow)"
        />

        {/* ════════════════════════════════
            LENGÜETA  (azul con "NIKE AIR")
            ════════════════════════════════ */}
        <path
          d="
            M 181 106
            C 186 93 194 82 204 76
            C 214 73 224 77 232 87
            C 240 97 244 111 244 126
            L 243 152 L 229 160 L 212 157 L 196 148 L 179 128
            L 181 106 Z
          "
          fill="url(#j-blue-panel)"
        />
        {/* Franja negra en centro de lengüeta */}
        <path
          d="M 207 78 L 208 154"
          stroke="rgba(0,0,0,0.45)"
          strokeWidth="10"
          strokeLinecap="round"
        />
        {/* Texto NIKE (simplificado como líneas) */}
        <g transform="translate(195, 95)" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round">
          <line x1="0" y1="0" x2="0" y2="12" />
          <line x1="0" y1="0" x2="6" y2="12" />
          <line x1="6" y1="12" x2="12" y2="0" />
          <line x1="12" y1="0" x2="12" y2="12" />
          <line x1="14" y1="0" x2="14" y2="12" />
          <line x1="14" y1="0" x2="20" y2="0" />
          <line x1="14" y1="6" x2="18" y2="6" />
        </g>

        {/* ════════════════════════════════
            CORDONES  (negros)
            ════════════════════════════════ */}
        {[
          [198, 160, 220, 164, 232, 162, 260, 160],
          [197, 175, 218, 179, 232, 177, 274, 175],
          [196, 190, 217, 194, 232, 192, 290, 190],
          [196, 205, 216, 209, 232, 207, 306, 205],
          [196, 220, 215, 224, 232, 222, 322, 220],
        ].map(([x1, y1, x2, y2, x3, y3, x4, y4], i) => (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#111" strokeWidth="3" strokeLinecap="round" />
            <line x1={x3} y1={y3} x2={x4} y2={y4}
              stroke="#111" strokeWidth="3" strokeLinecap="round" />
          </g>
        ))}
        {/* Vertical entre cordones */}
        <line x1="226" y1="160" x2="226" y2="220"
          stroke="rgba(0,0,0,0.5)" strokeWidth="2.5" strokeLinecap="round" />

        {/* Ojales */}
        {[160, 175, 190, 205, 220].map((y, i) => (
          <g key={i}>
            <circle cx="212" cy={y + 2} r="4.2"
              stroke="rgba(80,80,80,0.5)" strokeWidth="1.2" fill="rgba(20,20,20,0.6)" />
            <circle cx="238" cy={y} r="4.2"
              stroke="rgba(80,80,80,0.5)" strokeWidth="1.2" fill="rgba(20,20,20,0.6)" />
          </g>
        ))}

        {/* ════════════════════════════════
            COSTURA PANELES (línea punteada divisoria)
            ════════════════════════════════ */}
        <path
          d="M 156 42 C 162 70 165 104 160 136 C 156 165 148 192 140 220"
          stroke="rgba(255,255,255,0.09)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="5 4"
        />

        {/* ════════════════════════════════
            TIRADOR TALÓN
            ════════════════════════════════ */}
        <path
          d="M 86 275 L 82 294 L 93 294 L 93 275"
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* ════════════════════════════════
            HIGHLIGHT SUPERIOR (brillo en borde del upper)
            ════════════════════════════════ */}
        <path
          d="
            M 148 26 C 165 20 182 24 196 36
            C 210 48 219 66 222 86
          "
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />

      </g>
    </svg>
  );
}
