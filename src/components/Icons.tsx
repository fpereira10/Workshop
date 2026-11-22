import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement> & { size?: number };

const base = (size = 20): SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
});

export const ChevronRight = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M10 6l6 6-6 6" /></svg>
);
export const ChevronLeft = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M14 6l-6 6 6 6" /></svg>
);
export const ChevronDown = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M7 10l5 5 5-5" /></svg>
);
export const Plus = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M12 5v14M5 12h14" /></svg>
);
export const Minus = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M5 12h14" /></svg>
);
export const Close = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M6 6l12 12M18 6L6 18" /></svg>
);
export const Check = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
);
export const Dots = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p} fill="currentColor" stroke="none">
    <circle cx="5.5" cy="12" r="1.8" /><circle cx="12" cy="12" r="1.8" /><circle cx="18.5" cy="12" r="1.8" />
  </svg>
);
export const Play = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p} fill="currentColor" stroke="none"><path d="M8 5.5v13l11-6.5z" /></svg>
);
export const Pause = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p} fill="currentColor" stroke="none">
    <rect x="6.5" y="5" width="4" height="14" rx="1.2" /><rect x="13.5" y="5" width="4" height="14" rx="1.2" />
  </svg>
);
export const NoteLines = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M5 7h14M5 12h14M5 17h9" /></svg>
);
export const Pin = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M9 4h6l-1 6 3 3H7l3-3zM12 13v7" /></svg>
);
export const Pencil = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4" /></svg>
);
export const Trash = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12" /></svg>
);
export const Drop = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M12 3.5s6 6.4 6 10.5a6 6 0 01-12 0c0-4.1 6-10.5 6-10.5z" /></svg>
);
export const MicOff = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M9 9v2a3 3 0 005 2.2M15 10V6a3 3 0 00-5.6-1.5M5.5 11a6.5 6.5 0 0010.6 5M18.5 11a6.4 6.4 0 01-.5 2.4M12 17.5V21M4 4l16 16" />
  </svg>
);
