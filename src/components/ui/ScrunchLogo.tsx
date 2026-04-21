export function ScrunchLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 40"
      fill="none"
      className={className}
    >
      <circle cx="20" cy="20" r="18" fill="#7c3aed" />
      <path
        d="M14 10c3 0 4 3 1 5s-3 5 0 7 4 3 1 5-3 5 0 7"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M21 8c3 0 4 3 1 5s-3 5 0 7 4 3 1 5-3 5 0 7"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M28 10c3 0 4 3 1 5s-3 5 0 7 4 3 1 5-3 5 0 7"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}
