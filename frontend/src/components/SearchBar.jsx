import React, { useState, useRef, useEffect } from 'react';

const SearchBar = ({ className = '' }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const modelTypes = ['Classification', 'Regression', 'Clustering', 'Deep Learning', 'Time Series', 'Anomaly Detection'];

    const handleModelSelect = (modelType) => {
        setSelectedCategory(modelType);
        setIsDropdownOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className={`w-full max-w-full mx-auto mb-8 ${className}`}>
            <div className="flex flex-col md:flex-row gap-4 items-center">
                {/* Lengthy Search Input with Hover */}
                <div className="flex-1">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for models..."
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 hover:border-gray-600 focus:outline-none"
                    />
                </div>
                
                {/* Two Buttons: All + Dropdown */}
                <div className="flex gap-3" ref={dropdownRef}>
                    {/* All Button with Hover */}
                    <button
                        onClick={() => setSelectedCategory('All')}
                        className={`px-6 py-3 rounded-lg text-sm font-medium min-w-[100px] ${
                            selectedCategory === 'All'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                    >
                        All
                    </button>

                    {/* Dropdown Model Selection Button with Hover */}
                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className={`flex items-center justify-between w-full px-6 py-3 rounded-lg text-sm font-medium min-w-[140px] ${
                                selectedCategory !== 'All'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            }`}
                        >
                            <span className="flex-1 text-left">
                                {selectedCategory !== 'All' ? selectedCategory : 'Model Type'}
                            </span>
                            <svg 
                                className={`w-4 h-4 ${isDropdownOpen ? 'rotate-180' : ''}`}
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Dropdown Menu with Hover Effects */}
                        {isDropdownOpen && (
                            <div className="absolute top-full right-0 mt-1 min-w-[140px] bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 py-2">
                                {modelTypes.map((modelType) => (
                                    <button
                                        key={modelType}
                                        onClick={() => handleModelSelect(modelType)}
                                        className={`w-full text-left px-6 py-2 text-sm hover:bg-gray-700 ${
                                            selectedCategory === modelType
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-300'
                                        }`}
                                    >
                                        {modelType}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchBar;