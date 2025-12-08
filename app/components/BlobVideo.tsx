'use client';

export default function BlobVideo({ videoSrc }: { videoSrc: string }) {
  return (
    <div className="relative my-12 max-w-5xl w-full">
      <div 
        className="relative aspect-video overflow-hidden shadow-2xl"
        style={{
          clipPath: "polygon(8% 0%, 92% 0%, 100% 15%, 100% 85%, 90% 100%, 10% 100%, 0% 85%, 0% 15%)",
          transform: "rotate(-1deg)"
        }}
      >
        <video
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
      </div>
    </div>
  );
}