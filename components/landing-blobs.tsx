// SVG background blobs for hero and benefits
export const HeroBlobs = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" aria-hidden="true" focusable="false">
    <defs>
      <radialGradient id="blobGradient" cx="50%" cy="50%" r="80%" fx="50%" fy="50%">
        <stop offset="0%" stopColor="#0fa36b" stopOpacity="0.18" />
        <stop offset="100%" stopColor="#0b1f17" stopOpacity="0.08" />
      </radialGradient>
    </defs>
    <ellipse cx="30%" cy="40%" rx="340" ry="180" fill="url(#blobGradient)" />
    <ellipse cx="70%" cy="60%" rx="260" ry="120" fill="url(#blobGradient)" />
  </svg>
)

export const BenefitsBlobs = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" aria-hidden="true" focusable="false">
    <defs>
      <radialGradient id="benefitGradient" cx="50%" cy="50%" r="80%" fx="50%" fy="50%">
        <stop offset="0%" stopColor="#0fa36b" stopOpacity="0.12" />
        <stop offset="100%" stopColor="#0b1f17" stopOpacity="0.04" />
      </radialGradient>
    </defs>
    <ellipse cx="80%" cy="20%" rx="180" ry="80" fill="url(#benefitGradient)" />
    <ellipse cx="20%" cy="80%" rx="120" ry="60" fill="url(#benefitGradient)" />
  </svg>
)
