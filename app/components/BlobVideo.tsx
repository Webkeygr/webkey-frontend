'use client';

export default function BlobVideo({ videoSrc }: { videoSrc: string }) {
  return (
    <div className="relative w-full aspect-video max-w-5xl mx-auto">
      <div
        className="absolute inset-0 overflow-hidden shadow-2xl"
        style={{
          clipPath:
            "ellipse(40% 40% at 50% 50%)",
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