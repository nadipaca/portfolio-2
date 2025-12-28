export default function SectionSkeleton({ lines = 3 }) {
  return (
    <div className="py-16 bg-slate-900 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-10 bg-slate-800/50 rounded-lg w-64 mx-auto mb-8"></div>
        <div className="space-y-4">
          {Array.from({ length: lines }).map((_, i) => (
            <div key={i} className="h-24 bg-slate-800/30 rounded-xl"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

