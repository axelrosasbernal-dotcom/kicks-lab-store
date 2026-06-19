/*
  Air Jordan 1 High "Royal Reimagined"
  Perfil lateral — punta mirando a la DERECHA.
  ViewBox 800×500.

  Anatomía del zapato de atrás (izq) hacia adelante (der):
    HEEL (talón)  →  COLLAR (tobillo azul)  →  LACE (cordones)  →  VAMP  →  TOECAP (punta azul)
  Capas de abajo hacia arriba:
    outsole → midsole → upper negro → collar azul → apertura negra → tongue → swoosh → toecap → cordones → detalles
*/
export default function Jordan1SVG({ style }) {
  return (
    <svg
      viewBox="0 0 800 500"
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      fill="none"
      style={{ overflow: 'visible', ...style }}
    >
      <defs>
        <linearGradient id="gs" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#0055d4" />
          <stop offset="100%" stopColor="#001e80" />
        </linearGradient>
        <linearGradient id="gm" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#f8f8f8" />
          <stop offset="100%" stopColor="#c2c2c2" />
        </linearGradient>
        <linearGradient id="gk" x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0%"   stopColor="#242424" />
          <stop offset="100%" stopColor="#040404" />
        </linearGradient>
        <linearGradient id="gb" x1="0" y1="0" x2="0.45" y2="1">
          <stop offset="0%"   stopColor="#2080ff" />
          <stop offset="100%" stopColor="#0038b8" />
        </linearGradient>
        <filter id="drp" x="-6%" y="-6%" width="118%" height="128%">
          <feDropShadow dx="0" dy="20" stdDeviation="24"
            floodColor="#000" floodOpacity="0.88" />
        </filter>
      </defs>

      <g filter="url(#drp)">

        {/* ══════ OUTSOLE (azul real, lo más abajo) ══════ */}
        <path fill="url(#gs)" d="
          M 84 464
          C 76 456 74 444 84 436
          L 110 422 L 140 414
          L 690 400
          C 716 398 740 406 750 422
          C 760 438 752 456 734 464
          C 718 472 694 476 662 476
          L 102 476
          C 90 476 82 470 84 464 Z"/>
        {/* grip lines */}
        <g stroke="rgba(0,16,80,0.45)" strokeWidth="1.8" strokeLinecap="round">
          <line x1="148" y1="452" x2="248" y2="450" />
          <line x1="268" y1="449" x2="368" y2="447" />
          <line x1="388" y1="445" x2="488" y2="443" />
          <line x1="508" y1="442" x2="608" y2="440" />
        </g>

        {/* ══════ MIDSOLE (blanco) ══════ */}
        <path fill="url(#gm)" d="
          M 140 414
          L 150 393 L 164 379 L 184 369
          L 690 355
          C 716 353 740 359 750 373
          C 760 387 752 403 734 411
          C 716 419 692 423 662 424
          L 184 438
          C 158 438 142 428 140 418 Z"/>
        <path stroke="rgba(210,210,210,0.4)" strokeWidth="1.5" strokeDasharray="7 5" fill="none"
          d="M 158 428 C 340 416 520 405 670 394" />
        <path stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" fill="none"
          d="M 152 382 C 340 370 520 359 672 348" />

        {/* ══════ UPPER NEGRO ══════
            Traza la silueta COMPLETA del zapato:
            — Sube por el talón (izquierda)
            — Rodea el collar (arriba-izquierda)
            — Desciende en diagonal hacia la punta (vamp slope)
            — Rodea la punta (derecha)
            — Cierra por la base (midsole top)
        ══════════════════════════════ */}
        <path fill="url(#gk)" d="
          M 184 369
          L 172 330 L 160 288 L 150 244
          L 144 198 L 141 152 L 143 108
          C 147 76  162 50  186 32
          C 208 14  236  6  266  8
          C 295  10 320 26  337 54
          C 353 80  357 114 349 148
          L 339 182  L 326 214
          C 360 202  406 208  464 228
          C 538 254  614 292  672 330
          C 698 344  720 356  740 368
          C 752 376  756 388  750 400
          C 744 412  728 420  704 424
          L 662 430
          L 690 355
          L 184 369 Z"/>

        {/* ══════ COLLAR PANEL AZUL ══════ */}
        <path fill="url(#gb)" d="
          M 140 202
          C 140 162 152 124 176 98
          C 200 72 232 56 268 52
          C 303 48 335 64 354 94
          C 371 122 373 158 360 188
          L 344 222 L 321 248
          C 300 268 274 282 244 287
          L 212 291 L 180 281
          C 154 270 136 248 140 218 Z"/>
        {/* highlight collar */}
        <path stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none"
          d="M 268 52 C 300 52 328 68 344 96 C 360 124 362 158 350 188" />

        {/* ══════ APERTURA DEL COLLAR (hueco negro) ══════ */}
        <ellipse cx="252" cy="200" rx="90" ry="118" fill="#050505" />

        {/* ══════ TONGUE (lengüeta azul) ══════ */}
        <path fill="url(#gb)" d="
          M 228 108
          C 240 84 258 70 280 68
          C 300 66 318 82 330 108
          L 342 148 L 338 190
          L 314 216 L 282 228 L 250 216
          L 226 192 L 218 162 Z"/>
        {/* franja center tongue */}
        <rect x="265" y="70" width="20" height="146" rx="6" fill="rgba(0,0,0,0.5)" />

        {/* ══════ SWOOSH AZUL ══════
            Empieza bajo-izquierda (cerca del talón),
            sube hacia el centro, termina apuntando a la punta.
        ══════════════════════════ */}
        <path fill="url(#gb)" d="
          M 182 365
          C 214 382 262 388 318 375
          C 374 362 436 334 504 304
          C 556 280 604 260 644 246
          C 612 264 562 288 506 316
          C 446 348 382 378 320 392
          C 264 404 212 397 182 380
          C 162 368 156 350 168 342
          C 172 338 180 348 182 365 Z"/>

        {/* ══════ TOECAP AZUL (punta delantera) ══════ */}
        <path fill="url(#gb)" d="
          M 576 340
          C 604 326 638 318 674 319
          C 710 320 737 337 752 360
          C 767 382 765 408 752 426
          C 739 442 717 452 688 456
          L 648 462 L 606 464
          C 574 464 550 455 534 441
          C 518 427 516 408 527 390
          L 542 364 Z"/>
        {/* costura toecap */}
        <path stroke="rgba(255,255,255,0.08)" strokeWidth="2"
          strokeDasharray="4 3" fill="none"
          d="M 574 338 C 570 366 570 396 577 418" />
        {/* perforaciones toecap */}
        {Array.from({ length: 3 }, (_, row) =>
          Array.from({ length: 4 }, (_, col) => (
            <circle key={`p${row}-${col}`}
              cx={610 + col * 26} cy={342 + row * 28} r={5}
              fill="rgba(0,10,68,0.65)" />
          ))
        )}

        {/* ══════ CORDONES ══════ */}
        {[0, 1, 2, 3, 4, 5].map(i => {
          const y = 232 + i * 26;
          return (
            <g key={i}>
              <circle cx={258} cy={y} r={8} fill="#131313" stroke="#424242" strokeWidth="1.5" />
              <circle cx={294} cy={y} r={8} fill="#131313" stroke="#424242" strokeWidth="1.5" />
              <line x1={258} y1={y} x2={294 + i * 14} y2={y}
                stroke="#0c0c0c" strokeWidth="5" strokeLinecap="round" />
            </g>
          );
        })}
        {/* tira vertical central */}
        <line x1="276" y1="230" x2="276" y2="358"
          stroke="rgba(0,0,0,0.7)" strokeWidth="4" />

        {/* ══════ TIRADOR DEL TALÓN ══════ */}
        <path stroke="rgba(255,255,255,0.24)" strokeWidth="4"
          fill="none" strokeLinecap="round"
          d="M 138 326 L 128 360 L 156 360 L 156 326" />

        {/* ══════ HIGHLIGHTS FINALES ══════ */}
        <path stroke="rgba(255,255,255,0.13)" strokeWidth="2.5" fill="none"
          d="M 266 8 C 296 6 322 22 338 52 C 356 82 360 118 350 152" />
        <path stroke="rgba(255,255,255,0.05)" strokeWidth="2"
          strokeDasharray="5 4" fill="none"
          d="M 310 8 C 306 46 303 90 301 136 C 299 178 302 220 307 256" />

      </g>
    </svg>
  );
}
