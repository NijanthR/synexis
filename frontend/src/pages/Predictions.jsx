import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { predictions } from '../data/predictions';

const Predictions = () => {
  const navigate = useNavigate();
  const [filterTask, setFilterTask] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  
  const latestPredictions = useMemo(() => {
    const stored = JSON.parse(localStorage.getItem('predictions:history') || '[]');
    const combined = [...stored, ...predictions];
    
    // Filter by task
    let filtered = filterTask === 'all' 
      ? combined 
      : combined.filter(p => p.task.toLowerCase() === filterTask.toLowerCase());
    
    // Sort
    if (sortBy === 'recent') {
      filtered = filtered.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    } else if (sortBy === 'confidence') {
      filtered = filtered.sort((a, b) => {
        const aConf = parseFloat(a.confidence) || 0;
        const bConf = parseFloat(b.confidence) || 0;
        return bConf - aConf;
      });
    }
    
    return filtered.slice(0, 20);
  }, [filterTask, sortBy]);
  
  // Calculate stats
  const stats = useMemo(() => {
    const total = latestPredictions.length;
    const avgConfidence = latestPredictions.reduce((sum, p) => {
      return sum + (parseFloat(p.confidence) || 0);
    }, 0) / (total || 1);
    
    const tasks = [...new Set(latestPredictions.map(p => p.task))];
    const models = [...new Set(latestPredictions.map(p => p.model))];
    
    return {
      total,
      avgConfidence: avgConfidence.toFixed(1) + '%',
      uniqueTasks: tasks.length,
      uniqueModels: models.length
    };
  }, [latestPredictions]);

  const formatTime = (item) => {
    if (!item.timestamp) {
      return item.time || 'Just now';
    }
    const diffMs = Date.now() - item.timestamp;
    const diffMinutes = Math.max(Math.floor(diffMs / 60000), 0);
    if (diffMinutes < 1) {
      return 'Just now';
    }
    if (diffMinutes < 60) {
      return `${diffMinutes} min ago`;
    }
    const hours = Math.floor(diffMinutes / 60);
    if (hours < 24) {
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    }
    const days = Math.floor(hours / 24);
    return `${days} day${days === 1 ? '' : 's'} ago`;
  };
  
  const getTaskIcon = (task) => {
    switch(task.toLowerCase()) {
      case 'classification':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        );
      case 'detection':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        );
      case 'segmentation':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        );
    }
  };
  
  const getConfidenceColor = (confidence) => {
    const value = parseFloat(confidence);
    if (value >= 90) return 'text-green-400';
    if (value >= 70) return 'text-blue-400';
    if (value >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };
  
  const getConfidenceBadge = (confidence) => {
    const value = parseFloat(confidence);
    if (value >= 90) return { color: 'green', label: 'Excellent' };
    if (value >= 70) return { color: 'blue', label: 'Good' };
    if (value >= 50) return { color: 'yellow', label: 'Fair' };
    return { color: 'red', label: 'Low' };
  };

  return (
    <div className="min-h-[120vh] app-background">
      <div className="w-full max-w-full px-6 py-10 mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Predictions</h1>
              <p className="text-gray-400 text-sm">
                Real-time prediction outputs across all deployed models
              </p>
            </div>
            <button className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Prediction
            </button>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="component-surface border component-border rounded-xl p-5 bg-gradient-to-br from-blue-500/5 to-transparent">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-bold text-white mb-1">{stats.total}</p>
              <p className="text-sm text-gray-400">Total Predictions</p>
            </div>

            <div className="component-surface border component-border rounded-xl p-5 bg-gradient-to-br from-green-500/5 to-transparent">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-bold text-white mb-1">{stats.avgConfidence}</p>
              <p className="text-sm text-gray-400">Avg Confidence</p>
            </div>

            <div className="component-surface border component-border rounded-xl p-5 bg-gradient-to-br from-purple-500/5 to-transparent">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-bold text-white mb-1">{stats.uniqueTasks}</p>
              <p className="text-sm text-gray-400">Task Types</p>
            </div>

            <div className="component-surface border component-border rounded-xl p-5 bg-gradient-to-br from-orange-500/5 to-transparent">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-bold text-white mb-1">{stats.uniqueModels}</p>
              <p className="text-sm text-gray-400">Active Models</p>
            </div>
          </div>

          {/* Filters and Sort */}
          <div className="flex flex-wrap items-center gap-4 component-surface border component-border rounded-xl p-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span className="text-sm font-medium text-gray-300">Filter by Task:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterTask('all')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                    filterTask === 'all'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : 'component-surface text-gray-400 border component-border hover:border-blue-500/20'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterTask('classification')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                    filterTask === 'classification'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : 'component-surface text-gray-400 border component-border hover:border-blue-500/20'
                  }`}
                >
                  Classification
                </button>
                <button
                  onClick={() => setFilterTask('detection')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                    filterTask === 'detection'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : 'component-surface text-gray-400 border component-border hover:border-blue-500/20'
                  }`}
                >
                  Detection
                </button>
              </div>
            </div>

            <div className="h-8 w-px component-border"></div>

            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
              <span className="text-sm font-medium text-gray-300">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg component-surface app-text border component-border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="recent">Most Recent</option>
                <option value="confidence">Highest Confidence</option>
              </select>
            </div>
          </div>
        </div>

        {/* Predictions List */}
        <div className="space-y-4">
          {latestPredictions.length === 0 ? (
            <div className="component-surface border component-border rounded-xl p-12 text-center">
              <div className="w-16 h-16 component-surface border component-border rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-gray-400 mb-2">No predictions found</p>
              <p className="text-sm text-gray-500">Try adjusting your filters or make a new prediction</p>
            </div>
          ) : (
            latestPredictions.map((item) => {
              const badge = getConfidenceBadge(item.confidence);
              return (
                <div
                  key={item.id}
                  className="component-surface border component-border rounded-xl p-6 transition-all duration-200 hover:shadow-lg hover:border-blue-500/30 hover:scale-[1.01] cursor-pointer group"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    {/* Left Section */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <span className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-${badge.color}-500/10 text-${badge.color}-300 border border-${badge.color}-500/30`}>
                          {getTaskIcon(item.task)}
                          {item.task}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-gray-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {formatTime(item)}
                        </span>
                      </div>
                      
                      <h2 className="text-lg font-semibold text-white mb-3 group-hover:text-blue-300 transition-colors">
                        {item.output}
                      </h2>
                      
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                          </svg>
                          <p className="text-sm text-gray-400">
                            Model:{' '}
                            <button
                              type="button"
                              onClick={() => navigate(`/models/${item.modelSlug}`)}
                              className="text-blue-400 hover:text-blue-300 transition-all duration-200 hover:underline font-medium"
                            >
                              {item.model}
                            </button>
                          </p>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <p className="text-sm text-gray-400">
                            Input: <span className="text-gray-200 font-medium">{item.input}</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right Section - Confidence */}
                    <div className="flex lg:flex-col items-center lg:items-end gap-4">
                      <div className="text-center lg:text-right">
                        <p className="text-xs text-gray-400 mb-1">Confidence Score</p>
                        <div className="flex items-center gap-2">
                          <div className="relative w-16 h-16">
                            <svg className="w-16 h-16 transform -rotate-90">
                              <circle
                                cx="32"
                                cy="32"
                                r="28"
                                stroke="currentColor"
                                strokeWidth="6"
                                fill="none"
                                className="text-gray-800"
                              />
                              <circle
                                cx="32"
                                cy="32"
                                r="28"
                                stroke="currentColor"
                                strokeWidth="6"
                                fill="none"
                                strokeDasharray={`${(parseFloat(item.confidence) / 100) * 176} 176`}
                                className={getConfidenceColor(item.confidence)}
                                strokeLinecap="round"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className={`text-lg font-bold ${getConfidenceColor(item.confidence)}`}>
                                {Math.round(parseFloat(item.confidence))}
                              </span>
                            </div>
                          </div>
                          <div className="hidden lg:block">
                            <p className={`text-3xl font-bold ${getConfidenceColor(item.confidence)}`}>
                              {item.confidence}
                            </p>
                          </div>
                        </div>
                        <span className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded bg-${badge.color}-500/10 text-${badge.color}-300`}>
                          {badge.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Predictions;