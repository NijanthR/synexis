const ModelsBox = ({ title, description, accuracy, speed, onUse }) => {
  return (
    <div className="w-full h-full rounded-xl bg-gray-800 shadow-lg overflow-hidden border border-gray-700 flex flex-col transition-all duration-300 hover:shadow-2xl hover:border-blue-500/50 hover:bg-gray-750">
      <div className="p-4 flex-shrink-0">
        <h2 className="text-lg font-bold text-white">{title}</h2>
      </div>
      
      <div className="px-4 flex-1 min-h-0">
        <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
          {description}
        </p>
      </div>
      
      <div className="p-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Accuracy:</span>
            <span className="text-base font-semibold text-white">{accuracy}</span>
          </div>
          <span className="text-base font-semibold text-white">{speed}</span>
        </div>
        
        <button
          onClick={onUse}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Use Model
        </button>
      </div>
    </div>
  );
};

export default ModelsBox;