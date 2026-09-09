export default function Logo({ className = "brand__logo" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <circle cx="32" cy="32" r="32" fill="#0e7490" />
      <path d="M32 13 C27 20 23 26 23 33 C23 39 27 43 32 43 C37 43 41 39 41 33 C41 26 37 20 32 13 Z" fill="#fff" />
      <path d="M32 13 C24 18 18 24 16.5 31 C22 31 28 29 32 13 Z" fill="#fff" opacity="0.72" />
      <path d="M32 13 C40 18 46 24 47.5 31 C42 31 36 29 32 13 Z" fill="#fff" opacity="0.72" />
      <path d="M16 47 C24 43 40 43 48 47" stroke="#7dd3fc" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}
