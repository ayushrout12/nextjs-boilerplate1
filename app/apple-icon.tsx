import { ImageResponse } from 'next/og'
import { readFile } from 'fs/promises'
import { join } from 'path'

export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

export default async function AppleIcon() {
  const imageData = await readFile(join(process.cwd(), 'public', 'lotus-icon.jpg'))
  const base64 = imageData.toString('base64')
  const dataUrl = `data:image/jpeg;base64,${base64}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '36px',
          overflow: 'hidden',
        }}
      >
        <img
          src={dataUrl}
          alt="Lotus"
          width={180}
          height={180}
          style={{ objectFit: 'cover' }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
}
