const ModelsBox = ({ title, description, accuracy, speed, onUse }) => {
  return (
    <div 
      onClick={onUse}
      className="w-full h-full rounded-2xl component-surface shadow-xl overflow-hidden border component-border flex flex-col transition-all duration-300 hover:shadow-2xl hover:border-blue-400/60 cursor-pointer group backdrop-blur-sm"
    >
      <div className="p-6 flex-shrink-0 border-b border-gray-700/50">
        <h2 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">{title}</h2>
      </div>
      
      <div className="px-6 py-4 flex-1 min-h-0 overflow-hidden">
        <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
          {description}
        </p>
      </div>
      
      <div className="p-6 pt-4 flex-shrink-0 space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-1">Accuracy</p>
            <p className="text-lg font-bold text-white">{accuracy}</p>
          </div>
          <div className="h-8 w-px bg-gray-700"></div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-1">Speed</p>
            <p className="text-lg font-bold text-white">{speed}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center w-full py-3 bg-blue-600/10 border border-blue-500/30 rounded-lg text-blue-400 font-semibold text-sm group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 transition-all duration-300">
          <span>View Details</span>
          <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ModelsBox;