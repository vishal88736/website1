export function Monogram({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 44 42"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 12L14.5 31L23 12M20.5 31L29 12L37.5 31M24 23H34"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
