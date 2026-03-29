export default function PreviewPanel({ code }) {
  return (
    <div className="w-1/2 h-screen bg-white">
      <iframe
        srcDoc={code}
        className="w-full h-full border-none"
      />
    </div>
  )
}
