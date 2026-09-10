export default function AdminLoading() {
  return (
    <div className="flex min-h-screen bg-neutral-950">
      {/* Sidebar skeleton placeholder */}
      <div className="w-64 bg-black border-r border-white/5 p-6 flex flex-col gap-4 hidden md:flex flex-shrink-0">
        <div className="h-6 w-32 bg-neutral-900 rounded animate-pulse" />
        <div className="h-3 w-20 bg-neutral-900/60 rounded animate-pulse" />
        <div className="mt-6 space-y-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-10 w-full bg-neutral-900/40 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="flex-1 p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/5">
          <div className="space-y-2">
            <div className="h-7 w-48 bg-neutral-900 rounded-lg animate-pulse" />
            <div className="h-4 w-32 bg-neutral-900/60 rounded animate-pulse" />
          </div>
          <div className="h-10 w-32 bg-neutral-900 rounded-lg animate-pulse" />
        </div>

        {/* Stats / Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-28 bg-neutral-900/40 border border-white/5 rounded-xl p-5 space-y-3 animate-pulse"
            >
              <div className="h-4 w-20 bg-neutral-800 rounded" />
              <div className="h-8 w-16 bg-neutral-800 rounded" />
            </div>
          ))}
        </div>

        {/* Table / List skeleton */}
        <div className="bg-neutral-900/20 border border-white/5 rounded-xl p-6 space-y-4">
          <div className="h-5 w-40 bg-neutral-800 rounded animate-pulse" />
          <div className="space-y-3 pt-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-14 bg-neutral-900/40 border border-white/5 rounded-lg flex items-center justify-between px-4 animate-pulse"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-neutral-800" />
                  <div className="h-4 w-36 bg-neutral-800 rounded" />
                </div>
                <div className="h-4 w-20 bg-neutral-800 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
