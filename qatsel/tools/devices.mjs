// Target displays (verified against manufacturer spec sheets, Oct 2026).
export const DEVICES = [
  { id: 'iphone-18-pro-max', label: 'iPhone 18 Pro Max', w: 1320, h: 2868, live: true },
  { id: 'iphone-18-pro', label: 'iPhone 18 Pro', w: 1206, h: 2622, live: true },
  { id: 'iphone-duo-pro-max', label: 'iPhone 18 Pro Max — duo pair', w: 2640, h: 2868, duo: true, live: true },
  { id: 'iphone-duo-pro', label: 'iPhone 18 Pro — duo pair', w: 2412, h: 2622, duo: true },
  { id: 'galaxy-z-fold-8-main', label: 'Galaxy Z Fold 8 — main display', w: 1848, h: 2448, loop: true },
  { id: 'galaxy-z-fold-8-cover', label: 'Galaxy Z Fold 8 — cover display', w: 1248, h: 1972, loop: true },
  { id: 'macbook-pro-16', label: 'MacBook Pro 16"', w: 3456, h: 2234, loop: true },
  { id: 'macbook-pro-14', label: 'MacBook Pro 14"', w: 3024, h: 1964 },
  { id: 'macbook-air-15', label: 'MacBook Air 15"', w: 2880, h: 1864 },
  { id: 'macbook-air-13', label: 'MacBook Air 13"', w: 2560, h: 1664 },
  // square master: survives rotation and parallax on iPad Pro 13" (2752x2064) and 11" (2420x1668)
  { id: 'ipad-pro', label: 'iPad Pro 13" / 11" (rotation-safe square)', w: 2752, h: 2752, live: true },
  { id: 'ultrawide', label: 'Ultrawide 3440×1440', w: 3440, h: 1440, loop: true },
];

export const DESIGNS = [
  { n: 1, slug: 'I-GHOST' },
  { n: 2, slug: 'II-ILLUSION' },
  { n: 3, slug: 'III-WIELDER' },
  { n: 4, slug: 'IV-SAVED' },
];
