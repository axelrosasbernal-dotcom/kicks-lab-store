/*
  Air Jordan 1 High "Royal Reimagined"
  Perfil lateral, punta a la derecha.
  ViewBox 800×500.

  Capas (de atrás hacia adelante):
  1. Outsole   – azul royal oscuro
  2. Midsole   – blanco
  3. Upper     – negro (cuerpo principal)
  4. Collar    – azul (franja del tobillo)
  5. Toecap    – azul perforado
  6. Swoosh    – azul
  7. Tongue    – azul
  8. Cordones  – negro
  9. Detalles
*/
export default function Jordan1SVG({ style }) {
  const BLUE_DARK   = '#0045a8';
  const BLUE_MID    = '#0055cc';
  const BLUE_LIGHT  = '#1a72f0';
  const BLACK       = '#111111';
  const BLACK_SOFT  = '#1e1e1e';

  return (
    <svg
      viewBox="0 0 800 500"
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      style={{ overflow: 'visible', ...style }}
      fill="none"
    >
      <defs>
        <linearGradient id="g-upper" x1="0%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%"   stopColor={BLACK_SOFT}/>
          <stop offset="100%" stopColor="#050505"/>
        </linearGradient>
        <linearGradient id="g-blue" x1="0%" y1="0%" x2="40%" y2="100%">
          <stop offset="0%"   stopColor={BLUE_LIGHT}/>
          <stop offset="100%" stopColor={BLUE_DARK}/>
        </linearGradient>
        <linearGradient id="g-mid" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#ffffff"/>
          <stop offset="100%" stopColor="#c8c8c8"/>
        </linearGradient>
        <linearGradient id="g-out" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor={BLUE_MID}/>
          <stop offset="100%" stopColor={BLUE_DARK}/>
        </linearGradient>
        <filter id="f-shadow" x="-6%" y="-6%" width="118%" height="125%">
          <feDropShadow dx="0" dy="16" stdDeviation="22"
            floodColor="#000" floodOpacity="0.82"/>
        </filter>
        <filter id="f-blue-glow">
          <feGaussianBlur in="SourceAlpha" stdDeviation="5" result="b"/>
          <feFlood floodColor={BLUE_MID} floodOpacity="0.45" result="c"/>
          <feComposite in="c" in2="b" operator="in" result="s"/>
          <feMerge><feMergeNode in="s"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      <g filter="url(#f-shadow)">

        {/* ══════════════════════════════════════
            1. OUTSOLE  (azul royal)
            ══════════════════════════════════════ */}
        <path
          fill="url(#g-out)"
          d="
            M 88 458
            C 75 458 61 451 57 439
            C 53 427 57 414 70 408
            L 88 403 L 660 394
            C 682 393 702 398 713 408
            C 724 418 722 432 711 440
            C 700 448 679 453 654 453
            L 126 459
            C 104 459 90 459 88 458 Z
          "
        />
        {/* grip lines */}
        <g stroke="rgba(0,20,90,0.4)" strokeWidth="1.6" strokeLinecap="round">
          <line x1="128" y1="443" x2="240" y2="441"/>
          <line x1="258" y1="440" x2="370" y2="438"/>
          <line x1="388" y1="437" x2="490" y2="435"/>
          <line x1="508" y1="434" x2="608" y2="432"/>
        </g>

        {/* ══════════════════════════════════════
            2. MIDSOLE  (blanco)
            ══════════════════════════════════════ */}
        <path
          fill="url(#g-mid)"
          d="
            M 88 403
            L 98 380 L 115 368 L 136 362
            L 660 353
            C 680 352 700 357 712 366
            C 724 375 722 390 710 398
            C 698 406 677 411 652 412
            L 136 421
            C 112 421 97 417 88 410
            L 88 403 Z
          "
        />
        {/* borde superior midsole */}
        <path
          stroke="rgba(255,255,255,0.65)" strokeWidth="1.5" fill="none"
          d="M 98 380 C 260 370 470 360 660 353"
        />
        {/* costura midsole */}
        <path
          stroke="rgba(200,200,200,0.4)" strokeWidth="1" fill="none"
          strokeDasharray="8 6"
          d="M 108 392 C 280 383 480 372 655 363"
        />

        {/* ══════════════════════════════════════
            3. UPPER NEGRO  (cuerpo principal)
            Silhouette completa: talón alto a la izquierda,
            punta baja a la derecha.
            ══════════════════════════════════════ */}
        <path
          fill="url(#g-upper)"
          d="
            M 136 362
            L 127 338 L 118 310 L 110 280 L 104 250
            L 100 220 L 98 190 L 97 160 L 97 130
            C 97 106 102 82 113 62
            C 124 42 140 28 160 22
            C 178 16 197 20 214 32
            C 229 44 240 64 244 88
            C 248 108 246 132 238 154
            L 228 176 L 216 194
            C 208 208 200 224 194 242
            C 188 260 184 278 182 298
            L 180 322 L 178 346 L 176 362
            L 660 353
            L 136 362 Z
          "
        />

        {/* ══════════════════════════════════════
            4. COLLAR AZUL  (franja del tobillo)
            El collar de la J1 Royal es azul en casi
            toda su extensión. Lo dibujamos encima del upper.
            ══════════════════════════════════════ */}
        <path
          fill="url(#g-blue)"
          filter="url(#f-blue-glow)"
          d="
            M 97 188
            C 97 162 102 136 114 114
            C 126 92 142 74 162 62
            C 180 52 200 50 218 60
            C 234 70 246 90 250 114
            C 254 136 248 160 238 180
            L 227 198 L 214 216
            C 205 228 194 238 182 244
            L 168 250
            C 152 254 136 250 122 240
            C 108 230 100 214 97 196
            L 97 188 Z
          "
        />
        {/* highlight del collar azul */}
        <path
          stroke="rgba(255,255,255,0.28)" strokeWidth="2.5" fill="none"
          strokeLinecap="round"
          d="M 162 62 C 185 54 206 56 222 68 C 236 80 244 98 246 118"
        />

        {/* interior negro del collar (el hueco donde entra el pie) */}
        <path
          fill={BLACK}
          d="
            M 118 176
            C 118 156 124 136 136 122
            C 148 108 164 100 182 100
            C 200 100 214 110 224 126
            C 232 142 234 162 228 180
            L 220 196 L 208 208 L 194 215
            L 178 216 L 162 210 L 149 196
            L 138 180 L 132 162
            C 130 150 132 138 138 128
            C 130 140 126 156 126 172
            Z
          "
        />

        {/* ══════════════════════════════════════
            5. TOECAP AZUL  (punta delantera)
            ══════════════════════════════════════ */}
        <path
          fill="url(#g-blue)"
          filter="url(#f-blue-glow)"
          d="
            M 368 278
            C 394 270 424 266 456 268
            C 488 270 518 280 542 296
            C 562 310 574 330 573 350
            C 572 366 562 378 546 385
            L 522 391 L 494 395
            C 471 398 449 399 429 397
            C 408 395 392 388 384 377
            L 381 354
            C 380 330 380 306 384 285
            L 368 278 Z
          "
        />
        {/* shine toecap */}
        <path
          stroke="rgba(255,255,255,0.38)" strokeWidth="2" fill="none"
          strokeLinecap="round"
          d="M 374 278 C 400 270 430 266 460 268 C 488 270 516 279 540 294"
        />
        {/* costura toecap */}
        <path
          stroke="rgba(0,40,140,0.35)" strokeWidth="1.5" fill="none"
          strokeDasharray="4 3"
          d="M 383 276 C 381 302 380 330 383 356"
        />
        {/* perforaciones */}
        {Array.from({ length: 5 }, (_, row) =>
          Array.from({ length: 4 }, (_, col) => {
            const cx = 408 + col * 22;
            const cy = 292 + row * 22;
            if (cx > 556 || cy > 385) return null;
            return (
              <circle key={`p-${row}-${col}`}
                cx={cx} cy={cy} r={3.2}
                fill="rgba(0,25,100,0.5)"
              />
            );
          })
        )}

        {/* ══════════════════════════════════════
            6. SWOOSH AZUL  (Nike logo)
            Comienza bajo en el talón, sube hacia
            la punta. Forma de paloma/check grande.
            ══════════════════════════════════════ */}
        <path
          fill="url(#g-blue)"
          filter="url(#f-blue-glow)"
          d="
            M 168 334
            C 186 344 216 349 254 342
            C 292 335 332 316 373 296
            C 402 281 428 268 448 258
            C 430 271 404 286 372 302
            C 336 320 296 338 256 345
            C 218 352 184 350 165 337
            C 154 330 150 320 155 316
            C 157 313 162 318 168 334 Z
          "
        />

        {/* ══════════════════════════════════════
            7. TONGUE AZUL  (lengüeta)
            ══════════════════════════════════════ */}
        <path
          fill="url(#g-blue)"
          d="
            M 186 112
            C 192 98 202 86 215 80
            C 228 78 242 86 252 100
            C 261 114 264 132 262 152
            L 260 182 L 243 192 L 223 188 L 205 180
            L 186 158 L 186 112 Z
          "
        />
        {/* franja negra centro lengüeta (Nike Air) */}
        <rect
          x="213" y="82" width="16" height="100"
          rx="4" fill="rgba(0,0,0,0.55)"
        />
        {/* texto NIKE AIR simplificado */}
        <g transform="translate(204, 95)" stroke="rgba(255,255,255,0.7)" strokeWidth="1.4"
           strokeLinecap="round" fill="none">
          <line x1="0" y1="0" x2="0"  y2="14"/>
          <line x1="0" y1="0" x2="7"  y2="14"/>
          <line x1="7" y1="14" x2="14" y2="0"/>
          <line x1="14" y1="0" x2="14" y2="14"/>
          <line x1="18" y1="0" x2="18" y2="14"/>
          <line x1="18" y1="0" x2="27" y2="0"/>
          <line x1="18" y1="7" x2="25" y2="7"/>
          <line x1="18" y1="14" x2="27" y2="14"/>
        </g>
        {/* líneas "AIR" debajo */}
        <g transform="translate(206, 120)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2"
           strokeLinecap="round" fill="none">
          <line x1="0"  y1="0" x2="5"  y2="12"/>
          <line x1="5"  y1="12" x2="10" y2="0"/>
          <line x1="14" y1="0" x2="14" y2="12"/>
          <line x1="14" y1="0" x2="21" y2="0"/>
          <line x1="14" y1="6" x2="19" y2="6"/>
          <line x1="25" y1="0" x2="25" y2="12"/>
          <line x1="25" y1="0" x2="33" y2="12"/>
          <line x1="33" y1="12" x2="33" y2="0"/>
        </g>

        {/* ══════════════════════════════════════
            8. CORDONES  (negro)
            ══════════════════════════════════════ */}
        {[
          [203, 194, 225, 198, 242, 196, 272, 194],
          [202, 211, 224, 215, 242, 213, 289, 211],
          [201, 228, 222, 232, 242, 230, 307, 228],
          [200, 245, 221, 249, 242, 247, 326, 245],
          [199, 262, 220, 266, 242, 264, 344, 262],
          [198, 279, 219, 283, 242, 281, 362, 279],
        ].map(([x1, y1, x2, y2, x3, y3, x4, y4], i) => (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={BLACK} strokeWidth="4" strokeLinecap="round"/>
            <line x1={x3} y1={y3} x2={x4} y2={y4}
              stroke={BLACK} strokeWidth="4" strokeLinecap="round"/>
          </g>
        ))}
        {/* vertical central */}
        <line x1="234" y1="194" x2="234" y2="279"
          stroke="rgba(0,0,0,0.55)" strokeWidth="3" strokeLinecap="round"/>

        {/* Ojales */}
        {[194, 211, 228, 245, 262, 279].map((y, i) => (
          <g key={i}>
            <circle cx="218" cy={y + 2} r="5.5"
              fill="#0a0a0a" stroke="#3a3a3a" strokeWidth="1.2"/>
            <circle cx="248" cy={y}     r="5.5"
              fill="#0a0a0a" stroke="#3a3a3a" strokeWidth="1.2"/>
          </g>
        ))}

        {/* ══════════════════════════════════════
            9. DETALLES FINALES
            ══════════════════════════════════════ */}

        {/* tirador del talón */}
        <path
          stroke="rgba(255,255,255,0.28)" strokeWidth="3"
          strokeLinecap="round" strokeLinejoin="round" fill="none"
          d="M 87 310 L 82 334 L 96 334 L 96 310"
        />

        {/* costura punteada collar-talón */}
        <path
          stroke="rgba(255,255,255,0.08)" strokeWidth="2" fill="none"
          strokeDasharray="5 4"
          d="M 166 26 C 172 55 174 90 170 126 C 166 158 157 188 148 218"
        />

        {/* borde highlight collar superior */}
        <path
          stroke="rgba(255,255,255,0.15)" strokeWidth="2.5" fill="none"
          strokeLinecap="round"
          d="M 162 22 C 182 16 200 20 216 32 C 230 44 240 64 242 88"
        />

        {/* Wing logo simplificado (lateral del talón) */}
        <g transform="translate(120, 270)" opacity="0.22"
           stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none">
          <path d="M0,0 C-6,-10 -17,-13 -22,-9 C-17,-5 -11,0 -6,7 C-3,12 -1,16 0,20"/>
          <path d="M0,0 C6,-10 17,-13 22,-9 C17,-5 11,0 6,7 C3,12 1,16 0,20"/>
        </g>

      </g>
    </svg>
  );
}
