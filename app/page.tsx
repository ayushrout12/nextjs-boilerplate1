export default function Home() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontFamily: 'system-ui'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '48px' }}>🌸 TryLotus.dev</h1>
        <p style={{ fontSize: '20px', marginTop: '20px' }}>Your AI Website Builder is Coming Soon!</p>
        <p style={{ marginTop: '40px' }}>Check back in a few minutes...</p>
      </div>
    </div>
  )
}
