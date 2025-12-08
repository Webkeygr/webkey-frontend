'use client';

export default function BlobVideo({ videoSrc }: { videoSrc: string }) {
  return (
    <div className="relative w-full aspect-video max-w-5xl mx-auto">
      <div
        className="absolute inset-0 overflow-hidden shadow-2xl"
        style={{
          clipPath:
            "polygon(5% 0%, 95% 0%, 100% 20%, 100% 80%, 92% 100%, 8% 100%, 0% 80%, 0% 20%)",
          transform: "rotate(-1deg) scale(1.02)"
        }}
      >
        <video
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}