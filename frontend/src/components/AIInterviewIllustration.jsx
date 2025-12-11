// AI Interview Illustration Component
// Displays a mock interview window with avatar, controls, and feedback panel

const AIInterviewIllustration = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Outer backdrop / card boundary */}
      <div className="absolute inset-0 rounded-3xl -z-10 bg-linear-to-br from-blue-50 via-blue-100 to-indigo-50 opacity-90 ring-1 ring-blue-100/40"></div>

      {/* Main card with shadow and stronger subtle boundary */}
      <div className="relative bg-linear-to-br from-white via-blue-50 to-indigo-50 rounded-3xl p-8 shadow-2xl ring-1 ring-indigo-100/30 border-2 border-blue-100/25 overflow-visible w-full h-full">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-linear-to-br from-blue-200/18 to-transparent rounded-full blur-2xl -mr-20 -mt-20 opacity-90"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-linear-to-tr from-indigo-200/18 to-transparent rounded-full blur-2xl -ml-16 -mb-16 opacity-90"></div>

        {/* LIVE Badge */}
        <div className="absolute top-6 left-6 z-20">
          <div className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg animate-pulse">
            <span className="inline-block w-2 h-2 bg-white rounded-full animate-pulse"></span>
            LIVE
          </div>
        </div>

        {/* Top-Right Badge - Setup Time */}
        <div className="absolute top-8 right-6 z-30 animate-float">
          <div className="bg-white/80 backdrop-blur-lg ring-1 ring-blue-50 border border-blue-200/40 rounded-xl px-4 py-3 shadow-lg shadow-indigo-200/40 hover:shadow-indigo-300/50 transition-shadow duration-300">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-linear-to-br from-emerald-50 to-emerald-100 rounded-md flex items-center justify-center text-base text-emerald-700 shrink-0">
                ⚡
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">Setup: 1 Min</p>
                <p className="text-xs text-gray-600 truncate">Instant start</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom-Left Badge - Avg Session */}
        <div className="absolute bottom-8 left-6 z-30 animate-float" style={{ animationDelay: '0.2s' }}>
          <div className="bg-white/80 backdrop-blur-lg ring-1 ring-blue-50 border border-blue-200/40 rounded-xl px-4 py-3 shadow-lg shadow-indigo-200/40 hover:shadow-indigo-300/50 transition-shadow duration-300">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-linear-to-br from-blue-50 to-blue-100 rounded-md flex items-center justify-center text-base text-blue-700 shrink-0">
                ⏱️
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">18 min avg</p>
                <p className="text-xs text-gray-600 truncate">Quick session</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom-Right Badge - Answer Accuracy */}
        <div className="absolute bottom-8 right-6 z-30 animate-float" style={{ animationDelay: '0.4s' }}>
          <div className="bg-white/80 backdrop-blur-lg ring-1 ring-blue-50 border border-blue-200/40 rounded-xl px-4 py-3 shadow-lg shadow-indigo-200/40 hover:shadow-indigo-300/50 transition-shadow duration-300">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-linear-to-br from-yellow-50 to-yellow-100 rounded-md flex items-center justify-center text-base text-yellow-800 shrink-0">
                ⭐
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">97% Accuracy</p>
                <p className="text-xs text-gray-600 truncate">AI Feedback</p>
              </div>
            </div>
          </div>
        </div>

        {/* Interview Window Header */}
        <div className="absolute top-8 left-8 right-2 z-10">
          <div className="bg-linear-to-r from-blue-600 to-indigo-600 rounded-t-2xl px-6 py-3 flex items-center justify-between">
            <div className="text-white font-semibold text-base">MockVibe Interview</div>
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-yellow-300 rounded-full"></div>
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            </div>
          </div>

          {/* Mock Interview Window - Horizontal Layout */}
          <div className="bg-linear-to-b from-slate-900 to-slate-800 rounded-b-2xl p-6 h-72 ring-1 ring-indigo-900/6 border border-indigo-900/6 flex flex-col">
            {/* Top Row: Avatar Section + Status + Listening Animation */}
            <div className="flex items-start gap-6 mb-4">
              {/* Avatar Circle with gradient background */}
              <div className="relative w-32 h-32 shrink-0">
                {/* Avatar glow effect */}
                <div className="absolute inset-0 bg-linear-to-br from-blue-400 to-indigo-600 rounded-full blur-lg opacity-60"></div>

                {/* Avatar shape - flat cartoon style with subtle ring to separate from bg */}
                <div className="absolute inset-0 bg-linear-to-br from-amber-100 to-orange-200 rounded-full flex items-center justify-center border-4 border-white shadow-lg overflow-hidden ring-1 ring-white/20">
                  {/* Simple flat cartoon avatar */}
                  <svg
                    className="w-20 h-20"
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Head */}
                    <circle cx="50" cy="40" r="20" fill="#D4956D" />
                    {/* Eyes */}
                    <circle cx="43" cy="36" r="2.5" fill="#333" />
                    <circle cx="57" cy="36" r="2.5" fill="#333" />
                    {/* Smile */}
                    <path
                      d="M 43 42 Q 50 45 57 42"
                      stroke="#333"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                    />
                    {/* Neck */}
                    <rect x="46" y="58" width="8" height="6" fill="#D4956D" />
                    {/* Shoulders/Body */}
                    <path
                      d="M 30 64 L 35 66 Q 50 72 65 66 L 70 64"
                      fill="#4F46E5"
                      stroke="#4F46E5"
                    />
                  </svg>
                </div>
              </div>

              {/* Status and Controls Column */}
              <div className="flex flex-col gap-3 flex-1 min-w-0">
                {/* AI Status Text */}
                <div>
                  <h3 className="text-white font-bold text-base">AI Interviewer</h3>
                  <p className="text-emerald-400 text-sm font-semibold">🎤 Listening...</p>
                </div>

                {/* Microphone and Recording Indicators Row */}
                <div className="flex items-center gap-4">
                  {/* Microphone Toggle */}
                  <button className="w-12 h-12 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition duration-300 ring-1 ring-blue-200/20 shrink-0">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 15c1.66 0 3-1.34 3-3V6c0-1.66-1.34-3-3-3S9 4.34 9 6v6c0 1.66 1.34 3 3 3z" />
                      <path d="M17 16.91c-1.04.49-2.19.75-3.4.82v2.02c2.01-.13 3.87-.82 5.42-1.84l-1.02-1Z" />
                      <path d="M5.37 16.18l-1.02 1.01C5.74 18.1 7.59 18.79 9.6 18.92v-2.02c-1.21-.07-2.36-.33-3.23-.72z" />
                      <path d="M12 20c2.76 0 5-2.24 5-5h-2c0 1.66-1.34 3-3 3s-3-1.34-3-3H7c0 2.76 2.24 5 5 5z" />
                    </svg>
                  </button>

                  {/* Recording Indicator */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-11 h-11 bg-red-500/18 border-2 border-red-500 rounded-full flex items-center justify-center animate-pulse shrink-0">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    </div>
                    <span className="text-red-400 text-xs font-semibold">Recording</span>
                  </div>

                  {/* Listening Animation */}
                  <div className="flex items-end gap-1.5">
                    <div className="w-2 h-3 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-2 h-5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-3 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Feedback Panel Shapes - Horizontal Cards */}
            <div className="grid grid-cols-3 gap-3 flex-1 min-h-0">
              <div className="bg-white/8 backdrop-blur-sm border border-blue-200/20 rounded-lg p-3 flex flex-col items-center gap-2 justify-center">
                <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full"></div>
                <span className="text-white/90 text-xs text-center leading-tight font-medium">Communication: Excellent</span>
              </div>
              <div className="bg-white/8 backdrop-blur-sm border border-blue-200/20 rounded-lg p-3 flex flex-col items-center gap-2 justify-center">
                <div className="w-2.5 h-2.5 bg-blue-400 rounded-full"></div>
                <span className="text-white/90 text-xs text-center leading-tight font-medium">Technical: Good</span>
              </div>
              <div className="bg-white/8 backdrop-blur-sm border border-blue-200/20 rounded-lg p-3 flex flex-col items-center gap-2 justify-center">
                <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full"></div>
                <span className="text-white/90 text-xs text-center leading-tight font-medium">Clarity: Improving</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating elements for visual interest */}
        <div className="absolute top-20 -right-4 w-20 h-20 bg-blue-300/30 rounded-full blur-2xl z-5"></div>
        <div className="absolute -bottom-6 left-8 w-32 h-32 bg-indigo-300/30 rounded-full blur-3xl z-5"></div>
      </div>
    </div>
  );
};

export default AIInterviewIllustration;
