import React, { useState, useRef, useEffect } from 'react';

const SearchBar = ({
    className = '',
    searchQuery = '',
    onSearchChange = () => {},
    selectedCategory = 'All',
    onCategoryChange = () => {},
    modelTypes = []
}) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleModelSelect = (modelType) => {
        onCategoryChange(modelType);
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
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search for models..."
                        className="w-full px-4 py-3 component-surface border component-border rounded-lg app-text placeholder-gray-400 hover:border-blue-500/40 focus:outline-none transition-all duration-200"
                    />
                </div>
                
                {/* Two Buttons: All + Dropdown */}
                <div className="flex gap-3" ref={dropdownRef}>
                    {/* All Button with Hover */}
                    <button
                        onClick={() => onCategoryChange('All')}
                        className={`px-6 py-3 rounded-lg text-sm font-medium min-w-[100px] transition-all duration-200 ${
                            selectedCategory === 'All'
                                ? 'bg-blue-600 text-white hover:bg-blue-500 hover:scale-105 hover:shadow-lg'
                                : 'component-surface border component-border text-gray-400 hover:border-blue-500/30 hover:scale-105'
                        }`}
                    >
                        All
                    </button>

                    {/* Dropdown Model Selection Button with Hover */}
                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className={`flex items-center justify-between w-full px-6 py-3 rounded-lg text-sm font-medium min-w-[140px] transition-all duration-200 ${
                                selectedCategory !== 'All'
                                    ? 'bg-blue-600 text-white hover:bg-blue-500 hover:scale-105 hover:shadow-lg'
                                    : 'component-surface border component-border text-gray-400 hover:border-blue-500/30 hover:scale-105'
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
                            <div className="absolute top-full right-0 mt-1 min-w-[140px] component-surface border component-border rounded-lg shadow-lg z-50 py-2">
                                {modelTypes.map((modelType) => (
                                    <button
                                        key={modelType}
                                        onClick={() => handleModelSelect(modelType)}
                                        className={`w-full text-left px-6 py-2 text-sm hover:bg-blue-500/10 hover:border-blue-500/30 transition-all duration-150 hover:scale-[1.02] ${
                                            selectedCategory === modelType
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-400'
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