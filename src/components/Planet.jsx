import { useId, useState } from "react";

const palettes = [
  ["#f0d5ab", "#9d8457", "#2d3224"],
  ["#a8e4e0", "#387d82", "#0f2538"],
  ["#ddbfff", "#8c67ab", "#261c46"],
  ["#c7f879", "#658c3b", "#182c20"],
  ["#f6b897", "#af624e", "#362228"],
  ["#a8b8ff", "#56558a", "#1b203b"],
];
export function Planet({ variant = 0, imageUrl, className = "" }) {
  const id = useId().replace(/:/g, "");
  const [failed, setFailed] = useState(false);
  const colors = palettes[variant % palettes.length];
  return (
    <span
      className={`celestial-body planet-type-${variant % 6} ${className}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 220 220" className="planet-sphere">
        <defs>
          <radialGradient id={`${id}-base`} cx="28%" cy="23%" r="77%">
            <stop stopColor={colors[0]} />
            <stop offset=".5" stopColor={colors[1]} />
            <stop offset="1" stopColor={colors[2]} />
          </radialGradient>
          <radialGradient id={`${id}-shade`} cx="29%" cy="24%" r="74%">
            <stop offset=".15" stopColor="#fff" stopOpacity=".13" />
            <stop offset=".5" stopColor="#000" stopOpacity="0" />
            <stop offset=".86" stopColor="#020807" stopOpacity=".55" />
            <stop offset="1" stopColor="#020807" stopOpacity=".97" />
          </radialGradient>
          <filter id={`${id}-terrain`} x="0" y="0" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency={variant % 2 ? ".024 .06" : ".018 .11"}
              numOctaves="4"
              seed={variant + 11}
            />
            <feColorMatrix type="saturate" values="0" />
            <feBlend in="SourceGraphic" mode="soft-light" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <clipPath id={`${id}-clip`}>
            <circle cx="110" cy="110" r="96" />
          </clipPath>
        </defs>
        <circle
          cx="110"
          cy="110"
          r="97"
          fill="none"
          stroke={colors[0]}
          strokeOpacity=".3"
        />
        <circle
          cx="110"
          cy="110"
          r="96"
          fill={`url(#${id}-base)`}
          filter={`url(#${id}-terrain)`}
        />
        {!failed && /^https:\/\//.test(imageUrl || "") && (
          <image
            href={imageUrl}
            width="220"
            height="220"
            preserveAspectRatio="xMidYMid slice"
            clipPath={`url(#${id}-clip)`}
            onError={() => setFailed(true)}
            opacity=".65"
          />
        )}
        <circle cx="110" cy="110" r="96" fill={`url(#${id}-shade)`} />
      </svg>
      {variant % 2 === 1 && <span className="planet-ring" />}
    </span>
  );
}
export function AlienMark() {
  return (
    <svg viewBox="0 0 100 110" fill="none" aria-hidden="true">
      <path
        d="M50 6C24 6 7 23 10 45c3 23 28 53 40 59 12-6 37-36 40-59C93 23 76 6 50 6Z"
        fill="currentColor"
      />
      <path
        d="M20 42c17-2 25 6 25 24-15 0-23-8-25-24Zm60 0C63 40 55 48 55 66c15 0 23-8 25-24Z"
        fill="#08100b"
      />
      <path
        d="M44 82h12"
        stroke="#08100b"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
