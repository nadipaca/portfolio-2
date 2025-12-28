export default function MobileDeviceFrame({ videoUrl, className = "" }) {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className="relative w-full" style={{ maxWidth: '320px' }}>
        {/* Phone Frame with Shadow */}
        <div className="relative bg-gradient-to-b from-slate-800 to-slate-900 rounded-[2rem] p-2 md:p-3 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-4 md:w-28 md:h-5 bg-slate-900 rounded-b-xl z-10"></div>
          
          {/* Screen Container */}
          <div className="bg-black rounded-[1.75rem] overflow-hidden relative" style={{ aspectRatio: '9/19' }}>
            {/* Status Bar */}
            <div className="absolute top-0 left-0 right-0 h-6 md:h-7 bg-gradient-to-b from-black/40 to-transparent z-10 flex items-center justify-between px-3 md:px-4 text-white text-[9px] md:text-[10px] font-medium">
              <span>9:41</span>
              <div className="flex items-center gap-0.5 md:gap-1">
                <div className="w-2.5 h-1 md:w-3 md:h-1.5 border border-white/80 rounded-sm"></div>
                <div className="w-0.5 h-0.5 bg-white rounded-full"></div>
              </div>
            </div>
            
            {/* Video Container */}
            <div className="w-full h-full flex items-center justify-center bg-black">
              {videoUrl ? (
                <video
                  controls
                  className="w-full h-full object-cover"
                  playsInline
                  autoPlay
                  muted
                  loop
                >
                  <source src={videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-black">
                  <span className="text-slate-500 text-sm">Video Preview</span>
                </div>
              )}
            </div>
            
            {/* Home Indicator (iOS style) */}
            <div className="absolute bottom-1 md:bottom-1.5 left-1/2 -translate-x-1/2 w-24 md:w-28 h-0.5 bg-white/40 rounded-full backdrop-blur-sm"></div>
          </div>
          
          {/* Side Buttons (optional decorative elements) */}
          <div className="absolute right-0 top-16 h-10 w-0.5 bg-slate-700/50 rounded-l"></div>
          <div className="absolute right-0 top-28 h-6 w-0.5 bg-slate-700/50 rounded-l"></div>
          <div className="absolute right-0 top-36 h-6 w-0.5 bg-slate-700/50 rounded-l"></div>
        </div>
      </div>
    </div>
  );
}

