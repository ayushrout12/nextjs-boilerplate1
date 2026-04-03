export default function PreviewPanel({ code }: { code: string }) {
  return (
    <div className="w-1/2 h-screen bg-white">
      <iframe
        srcDoc={code}
        className="w-full h-full border-none"
      />
    </div>
  )
}
