export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="h-8 w-64 bg-gray-700 rounded animate-pulse mb-2" />
          <div className="h-4 w-full bg-gray-700 rounded animate-pulse" />
        </div>

        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-lg border border-gray-700"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-gray-700 rounded-full animate-pulse" />
                    <div className="h-6 w-32 bg-gray-700 rounded animate-pulse" />
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-4 w-20 bg-gray-700 rounded animate-pulse" />
                    <div className="h-4 w-24 bg-gray-700 rounded animate-pulse" />
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="h-4 w-full bg-gray-700 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-gray-700 rounded animate-pulse" />
                <div className="h-4 w-1/2 bg-gray-700 rounded animate-pulse" />
              </div>

              <div className="mt-4 flex items-center gap-4">
                <div className="h-8 w-24 bg-gray-700 rounded animate-pulse" />
                <div className="h-8 w-24 bg-gray-700 rounded animate-pulse" />
                <div className="h-8 w-24 bg-gray-700 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 