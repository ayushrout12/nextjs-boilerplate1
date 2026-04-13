import { ImageResponse } from 'next/og'

export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

export default async function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 100 100"
          fill="none"
        >
          {/* Center petal */}
          <ellipse cx="50" cy="45" rx="12" ry="25" fill="#e8a4b8" />
          <ellipse cx="50" cy="45" rx="8" ry="20" fill="#f0b8c8" />
          
          {/* Left petals */}
          <ellipse cx="32" cy="50" rx="10" ry="22" fill="#d4829a" transform="rotate(-25 32 50)" />
          <ellipse cx="20" cy="55" rx="8" ry="18" fill="#c97a92" transform="rotate(-45 20 55)" />
          
          {/* Right petals */}
          <ellipse cx="68" cy="50" rx="10" ry="22" fill="#d4829a" transform="rotate(25 68 50)" />
          <ellipse cx="80" cy="55" rx="8" ry="18" fill="#c97a92" transform="rotate(45 80 55)" />
          
          {/* Inner details */}
          <ellipse cx="50" cy="55" rx="6" ry="10" fill="#f5c4d4" />
          
          {/* Center dots */}
          <circle cx="45" cy="60" r="2" fill="#d4829a" />
          <circle cx="50" cy="58" r="2" fill="#d4829a" />
          <circle cx="55" cy="60" r="2" fill="#d4829a" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
