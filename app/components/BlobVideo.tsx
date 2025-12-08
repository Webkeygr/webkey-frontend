'use client';

export default function BlobVideo({ videoSrc }: { videoSrc: string }) {
  return (
    <div className="relative w-full aspect-video max-w-5xl mx-auto">
      <div
        className="absolute inset-0 overflow-hidden shadow-2xl"
        style={{
          clipPath:
            "polygon(86% 23%, 86% 23%, 84% 22%, 84% 21%, 84% 19%, 84% 15%, 82% 12%, 81% 11%, 80% 11%, 77% 11%, 74% 13%, 72% 15%, 71% 17%, 70% 19%, 68% 21%, 65% 21%, 62% 19%, 60% 17%, 56% 13%, 51% 11%, 50% 11%, 45% 11%, 43% 11%, 38% 12%, 34% 13%, 31% 13%, 27% 15%, 25% 15%, 22% 14%, 14% 15%, 12% 19%, 9% 26%, 8% 30%, 7% 35%, 4% 39%, 4% 42%, 3% 48%, 3% 52%, 3% 57%, 3% 60%, 5% 66%, 6% 70%, 9% 73%, 12% 77%, 14% 78%, 19% 79%, 21% 79%, 25% 79%, 28% 79%, 31% 78%, 36% 75%, 39% 74%, 44% 71%, 47% 69%, 53% 67%, 54% 67%, 56% 66%, 65% 64%, 65% 64%, 72% 65%, 72% 66%, 78% 69%, 82% 69%, 84% 68%, 87% 66%, 93% 63%, 94% 61%, 94% 56%, 94% 52%, 94% 49%, 95% 44%, 95% 43%, 93% 38%, 92% 35%, 89% 31%, 87% 28%, 86% 26%, 86% 24%)",
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