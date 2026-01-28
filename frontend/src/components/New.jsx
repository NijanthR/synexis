import React, { useState } from 'react';

const LightbulbIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="11.5" r="10" />
    <rect x="7.5" y="20.5" width="9" height="4" rx="1" fill="currentColor" stroke="none" />
    <path d="M12 20.5v-3.5" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const New = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleLaterClick = () => {
        setIsVisible(false);
    };

    const handleTourClick = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setIsExpanded(!isExpanded);
        setTimeout(() => {
            setIsAnimating(false);
        }, 400);
    };

    const tourContent = `Start by exploring available ML models in the Models section. Choose one that fits your needs, upload your dataset in CSV format, and use our preprocessing tools. Configure parameters or use auto-tune, then train your model while monitoring progress. Make predictions on new data and view performance analytics. Export results or integrate via API for seamless workflow.`;

    if (!isVisible) {
        return null;
    }

    return (
        <div 
            className={`group component-surface rounded-xl shadow-2xl mb-8 flex flex-col transition-all duration-400 ease-in-out border component-border hover:border-blue-500/30 hover:shadow-3xl overflow-hidden ${
                isExpanded ? 'max-h-[300px]' : 'max-h-[140px]'
            }`}
            style={{
                transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), all 0.3s ease-in-out'
            }}
        >
            <div className="p-6 flex flex-col md:flex-row items-center justify-between">
                <div className="flex items-start flex-1 w-full md:w-auto mb-4 md:mb-0">
                    <div 
                        className={`mr-4 mt-1 relative
                                    filter drop-shadow-[0_0_8px_rgba(30,58,138,0.7)] 
                                    group-hover:drop-shadow-[0_0_15px_rgba(37,99,235,0.9)] 
                                    group-hover:drop-shadow-[0_0_25px_rgba(30,64,175,0.8)]
                                    group-hover:drop-shadow-[0_0_35px_rgba(23,37,84,0.6)]
                                    transition-all duration-500 ease-in-out`}
                    >
                        <LightbulbIcon className="w-9 h-9 text-blue-500 group-hover:text-blue-300 transition-colors duration-500" />
                        <div className="absolute inset-0 bg-blue-800 rounded-full blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-500 -z-10 scale-110"></div>
                        <div className="absolute inset-0 bg-blue-900 rounded-full blur-sm opacity-0 group-hover:opacity-30 transition-opacity duration-500 -z-10 scale-105 delay-100"></div>
                        <div className="absolute inset-0 bg-indigo-900 rounded-full blur opacity-0 group-hover:opacity-25 transition-opacity duration-500 -z-10 scale-115 delay-200"></div>
                    </div>
                    
                    <div className="pr-4 transition-colors duration-300">
                        <h3 className="text-lg font-bold app-text mb-1 group-hover:text-blue-400 transition-colors duration-300">
                            New to our platform?
                        </h3>
                        <p className="text-sm text-gray-400 max-w-lg group-hover:text-gray-500 transition-colors duration-300">
                            Take a quick tour to learn how to select models and make your first prediction.
                        </p>
                    </div>
                </div>

                <div className="flex space-x-3 w-full md:w-auto justify-end">
                    <button 
                        onClick={handleLaterClick}
                        className="relative px-5 py-2 text-sm font-medium text-blue-400 component-surface rounded-lg 
                                 hover:bg-blue-500/10 hover:text-blue-500 hover:shadow-lg
                                 transition-all duration-300 ease-out transform hover:-translate-y-0.5
                                 border component-border hover:border-blue-500/30
                                 overflow-hidden group/button min-w-[110px]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-900/20 to-transparent 
                                      -translate-x-full group-hover/button:translate-x-full transition-transform duration-600"></div>
                        <span className="relative z-10 drop-shadow-sm group-hover/button:drop-shadow-[0_0_8px_rgba(96,165,250,0.6)] 
                                       transition-all duration-300">
                            Maybe Later
                        </span>
                        <div className="absolute inset-0 rounded-lg bg-blue-500 opacity-0 group-hover/button:opacity-5 transition-opacity duration-300"></div>
                    </button>

                    <button 
                        onClick={handleTourClick}
                        disabled={isAnimating}
                        className="relative px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg 
                                 hover:bg-blue-700 hover:shadow-xl
                                 transition-all duration-300 ease-out transform hover:-translate-y-0.5 hover:scale-105
                                 border border-blue-500 hover:border-blue-400
                                 overflow-hidden group/button min-w-[120px] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-blue-400/20 to-blue-500/30 
                                      -translate-x-full group-hover/button:translate-x-full transition-transform duration-700"></div>
                        <div className="absolute top-0 left-0 w-6 h-full bg-white/30 -skew-x-12 
                                      -translate-x-full group-hover/button:translate-x-[400%] transition-transform duration-1000"></div>
                        <span className="relative z-10 font-semibold drop-shadow-md 
                                       group-hover/button:drop-shadow-[0_0_12px_rgba(59,130,246,0.8)]
                                       transition-all duration-300">
                            {isExpanded ? 'Close Tour' : 'Take the Tour'}
                        </span>
                        <div className="absolute inset-0 rounded-lg bg-white opacity-0 group-hover/button:opacity-10 transition-opacity duration-300"></div>
                    </button>
                </div>
            </div>

            <div 
                className={`border-t component-border component-surface overflow-hidden transition-all duration-400 ease-in-out ${
                    isExpanded ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0'
                }`}
                style={{
                    transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease-in-out'
                }}
            >
                <div className="p-4">
                    <div className="w-full">
                        <h4 className="text-md font-semibold app-text mb-3 flex items-center">
                            <svg className="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Quick Start Guide
                        </h4>
                        <p className="text-sm text-gray-400 leading-relaxed transition-opacity duration-300 text-left">
                            {tourContent}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default New;