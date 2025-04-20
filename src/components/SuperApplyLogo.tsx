
import React from "react";

export function SuperApplyLogo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Shield Shape */}
      <path
        d="M50 0C33.33 13.33 16.67 20 0 20v40c0 22 15 42.33 50 60 35-17.67 50-38 50-60V20c-16.67 0-33.33-6.67-50-20z"
        fill="url(#shield-gradient)"
      />
      
      {/* Dynamic S-shaped lines with arrow */}
      <path
        d="M30 40C40 40 40 55 50 55C60 55 60 70 70 70L75 65"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
      />
      
      {/* Arrow head */}
      <path
        d="M68 58L75 65L82 58"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Grid pattern */}
      <path
        d="M40 80C60 65 70 45 70 45"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1"
        strokeDasharray="2 2"
      />
      <path
        d="M30 70C50 60 60 40 60 40"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1"
        strokeDasharray="2 2"
      />
      
      {/* Gradient definitions */}
      <defs>
        <linearGradient
          id="shield-gradient"
          x1="0"
          y1="0"
          x2="100"
          y2="120"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#003366" />
          <stop offset="100%" stopColor="#FF6B35" />
        </linearGradient>
      </defs>
    </svg>
  );
}
