import Image from "next/image";

export default function LotusLogo() {
  return (
    <div style={{ marginBottom: "20px" }}>
      <Image
        src="/lotus.png"
        alt="Lotus Logo"
        width={80}
        height={80}
        priority
        style={{
          display: "block",
          margin: "0 auto"
        }}
      />
    </div>
  );
}
