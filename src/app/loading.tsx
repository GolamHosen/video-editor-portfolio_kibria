export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-white animate-spin" />
        <span className="text-neutral-600 text-xs font-mono tracking-widest uppercase animate-pulse">
          Loading...
        </span>
      </div>
    </div>
  );
}
