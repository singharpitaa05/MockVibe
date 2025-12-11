// FLOATING STATS BADGES COMPONENT
import { useEffect } from 'react';

const FloatingStatsBadges = () => {
  // Prevent multiple instances from rendering (singleton guard).
  if (typeof window !== 'undefined') {
    if (window.__MockVibe_FloatingStatsBadge_Mounted) return null;
    window.__MockVibe_FloatingStatsBadge_Mounted = true;
  }

  // Clear the mounted flag on unmount so the component can be remounted if needed.
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined') {
        window.__MockVibe_FloatingStatsBadge_Mounted = false;
      }
    };
  }, []);
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top-Right Badge - Setup Time */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8 lg:top-12 lg:right-12 animate-float pointer-events-auto">
        <div className="bg-white/80 backdrop-blur-lg ring-1 ring-blue-50 border border-blue-200/40 rounded-lg sm:rounded-xl md:rounded-2xl px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 shadow-md sm:shadow-lg md:shadow-xl shadow-indigo-200/40 hover:shadow-indigo-300/50 transition-shadow duration-300">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-linear-to-br from-emerald-50 to-emerald-100 rounded-md flex items-center justify-center text-xs sm:text-sm md:text-base text-emerald-700 shrink-0">
              ⚡
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs md:text-sm font-semibold text-gray-900 truncate">Setup: 1 Min</p>
              <p className="text-[8px] sm:text-[10px] md:text-xs text-gray-600 truncate">Instant start</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom-Left Badge - Avg Session */}
      <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 md:bottom-8 md:left-8 lg:bottom-12 lg:left-12 animate-float z-50 pointer-events-auto" style={{ animationDelay: '0.2s' }}>
        <div className="bg-white/80 backdrop-blur-lg ring-1 ring-blue-50 border border-blue-200/40 rounded-lg sm:rounded-xl md:rounded-2xl px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 shadow-md sm:shadow-lg md:shadow-xl shadow-indigo-200/40 hover:shadow-indigo-300/50 transition-shadow duration-300">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-linear-to-br from-blue-50 to-blue-100 rounded-md flex items-center justify-center text-xs sm:text-sm md:text-base text-blue-700 shrink-0">
              ⏱️
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs md:text-sm font-semibold text-gray-900 truncate">18 min avg</p>
              <p className="text-[8px] sm:text-[10px] md:text-xs text-gray-600 truncate">Quick session</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom-Right Badge - Answer Accuracy */}
      <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 lg:bottom-12 lg:right-12 animate-float pointer-events-auto" style={{ animationDelay: '0.4s' }}>
        <div className="bg-white/80 backdrop-blur-lg ring-1 ring-blue-50 border border-blue-200/40 rounded-lg sm:rounded-xl md:rounded-2xl px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 shadow-md sm:shadow-lg md:shadow-xl shadow-indigo-200/40 hover:shadow-indigo-300/50 transition-shadow duration-300">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-linear-to-br from-yellow-50 to-yellow-100 rounded-md flex items-center justify-center text-xs sm:text-sm md:text-base text-yellow-800 shrink-0">
              ⭐
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs md:text-sm font-semibold text-gray-900 truncate">97% Accuracy</p>
              <p className="text-[8px] sm:text-[10px] md:text-xs text-gray-600 truncate">AI Feedback</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingStatsBadges;
