import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import New from '../components/New';
import SearchBar from '../components/SearchBar';
import ModelsBox from '../components/ModelsBox';
import Animation from '../components/Animation';
import { models as catalogModels } from '../data/models';

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModelType, setSelectedModelType] = useState('All');
  const [storedPredictions, setStoredPredictions] = useState([]);
  const [uploadedDatasetsCount, setUploadedDatasetsCount] = useState(0);
  const modelsData = [
    {
      id: 1,
      title: "Image Classifier",
      description: "A model that can classify images into predefined categories with high accuracy. Perfect for content moderation or product categorization.",
      accuracy: "98.2%",
      speed: "25ms",
      category: "image",
      modelType: "Classification"
    },
    {
      id: 2,
      title: "Text Sentiment Analyzer",
      description: "Analyzes text sentiment and classifies it as positive, negative, or neutral. Great for social media monitoring.",
      accuracy: "95.7%",
      speed: "15ms",
      category: "text",
      modelType: "Classification"
    },
    {
      id: 3,
      title: "Object Detection",
      description: "Detects and locates multiple objects within images with bounding boxes. Ideal for autonomous vehicles and surveillance.",
      accuracy: "96.8%",
      speed: "45ms",
      category: "image",
      modelType: "Deep Learning"
    },
    {
      id: 4,
      title: "Speech Recognition",
      description: "Converts spoken language into text with high precision. Suitable for voice assistants and transcription services.",
      accuracy: "94.3%",
      speed: "30ms",
      category: "audio",
      modelType: "Deep Learning"
    },
    {
      id: 5,
      title: "Fraud Detection",
      description: "Identifies fraudulent transactions and activities in real-time. Essential for financial security.",
      accuracy: "99.1%",
      speed: "10ms",
      category: "tabular",
      modelType: "Anomaly Detection"
    },
    {
      id: 6,
      title: "Recommendation Engine",
      description: "Provides personalized recommendations based on user behavior and preferences. Perfect for e-commerce.",
      accuracy: "92.5%",
      speed: "20ms",
      category: "tabular",
      modelType: "Regression"
    }
  ];

  const modelTypes = useMemo(() => {
    const uniqueTypes = new Set(modelsData.map((model) => model.modelType));
    return Array.from(uniqueTypes);
  }, [modelsData]);

  const filteredModels = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return modelsData.filter((model) => {
      const matchesQuery =
        query.length === 0 ||
        model.title.toLowerCase().includes(query) ||
        model.description.toLowerCase().includes(query);
      const matchesType =
        selectedModelType === 'All' || model.modelType === selectedModelType;
      return matchesQuery && matchesType;
    });
  }, [modelsData, searchQuery, selectedModelType]);

  useEffect(() => {
    const loadPredictions = () => {
      try {
        const stored = JSON.parse(localStorage.getItem('predictions:history') || '[]');
        setStoredPredictions(Array.isArray(stored) ? stored : []);
      } catch (error) {
        setStoredPredictions([]);
      }
    };

    const loadDatasets = () => {
      try {
        const stored = JSON.parse(localStorage.getItem('datasets:excel') || '[]');
        setUploadedDatasetsCount(Array.isArray(stored) ? stored.length : 0);
      } catch (error) {
        setUploadedDatasetsCount(0);
      }
    };

    loadPredictions();
    loadDatasets();

    const handleStorage = (event) => {
      if (event.key === 'predictions:history') {
        loadPredictions();
      }
      if (event.key === 'datasets:excel') {
        loadDatasets();
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const activeModelsCount = catalogModels.length;

  const predictionsTodayCount = useMemo(() => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const startTimestamp = startOfDay.getTime();
    return storedPredictions.filter((prediction) =>
      typeof prediction.timestamp === 'number' && prediction.timestamp >= startTimestamp
    ).length;
  }, [storedPredictions]);

  const averageLatencyMs = useMemo(() => {
    const latencies = catalogModels
      .map((model) => Number.parseFloat(String(model.speed).replace('ms', '').trim()))
      .filter((value) => Number.isFinite(value));
    if (!latencies.length) {
      return 0;
    }
    const total = latencies.reduce((sum, value) => sum + value, 0);
    return total / latencies.length;
  }, [catalogModels]);

  const stats = [
    {
      id: 'stat-1',
      label: 'Active Models',
      value: activeModelsCount.toString(),
      trend: `${activeModelsCount} in catalog`,
    },
    {
      id: 'stat-2',
      label: 'Predictions Today',
      value: predictionsTodayCount.toLocaleString(),
      trend: 'From local runs',
    },
    {
      id: 'stat-3',
      label: 'Avg Latency',
      value: averageLatencyMs ? `${Math.round(averageLatencyMs)}ms` : '—',
      trend: `Avg across ${activeModelsCount} models`,
    },
    {
      id: 'stat-4',
      label: 'Datasets Uploaded',
      value: uploadedDatasetsCount.toString(),
      trend: 'Stored locally',
    },
  ];

  const quickActions = [
    { id: 'qa-1', title: 'Create new model', description: 'Spin up a baseline model with presets.' },
    { id: 'qa-2', title: 'Upload dataset', description: 'Add a CSV or Excel dataset for training.' },
    { id: 'qa-3', title: 'Run batch inference', description: 'Score a dataset using any model.' },
  ];

  const activities = [
    { id: 'act-1', title: 'Animal ClassifyNet', detail: 'New prediction run completed', time: '5 min ago' },
    { id: 'act-2', title: 'Price Predictor X', detail: 'Dataset refreshed: Metro Housing 2025', time: '1 hour ago' },
    { id: 'act-3', title: 'Synexis Vision Pro', detail: 'Model version 2.4 deployed', time: 'Yesterday' },
  ];

  return (
    <div className="min-h-[120vh] app-background">
      <div className="relative pt-12 pb-12">
        {/* All three components with EXACT same width */}
        <div className="w-full max-w-full px-6 mx-auto">
          <New />
        </div>
        
        <div className="w-full max-w-full px-6 mx-auto">
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedModelType}
            onCategoryChange={setSelectedModelType}
            modelTypes={modelTypes}
          />
        </div>
        
        {/* Models Container with gap near sidebar */}
        <div className="w-full max-w-full mx-auto">
          <div className="w-full flex space-x-8 overflow-x-auto pb-12 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pl-6">
            {filteredModels.map((model) => (
              <div key={model.id} className="flex-shrink-0 w-[380px] h-[310px]">
                <ModelsBox
                  title={model.title}
                  description={model.description}
                  accuracy={model.accuracy}
                  speed={model.speed}
                  onUse={() => {
                    if (model.category === 'image') {
                      navigate('/models?focus=image');
                    } else {
                      navigate('/models');
                    }
                  }}
                />
              </div>
            ))}

            {filteredModels.length === 0 && (
              <div className="flex items-center justify-center h-64 w-full">
                <div className="text-sm text-gray-400">
                  No models match your search.
                </div>
              </div>
            )}
            
            {/* Extra space at the end for proper scrolling */}
            <div className="flex-shrink-0 w-6"></div>
          </div>
        </div>

        <div className="w-full max-w-full px-6 mx-auto mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
              const gradients = [
                'from-blue-500/10 to-purple-500/10',
                'from-emerald-500/10 to-teal-500/10',
                'from-orange-500/10 to-red-500/10',
                'from-indigo-500/10 to-blue-500/10'
              ];
              const iconColors = ['text-blue-400', 'text-emerald-400', 'text-orange-400', 'text-indigo-400'];
              return (
                <div
                  key={stat.id}
                  className={`component-surface border component-border rounded-xl p-5 transition-all duration-200 hover:shadow-lg hover:border-blue-500/30 hover:scale-105 cursor-pointer bg-gradient-to-br ${gradients[index]} relative overflow-hidden`}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full blur-2xl"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{stat.label}</p>
                      <svg className={`w-5 h-5 ${iconColors[index]} opacity-60`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {index === 0 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
                        {index === 1 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />}
                        {index === 2 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />}
                        {index === 3 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />}
                      </svg>
                    </div>
                    <p className="text-3xl font-bold text-white mt-1 mb-2">{stat.value}</p>
                    <p className="text-xs text-gray-400">{stat.trend}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="w-full max-w-full px-6 mx-auto mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 component-surface border component-border rounded-xl p-6 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h2 className="text-lg font-bold text-white">Recent Activity</h2>
                </div>
                <span className="text-xs text-gray-400 component-surface px-3 py-1 rounded-full border component-border">Last 24 hours</span>
              </div>
              <div className="h-0.5 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4"></div>
              <div className="mt-4 space-y-3">
                {activities.map((activity, index) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between border component-border rounded-lg p-4 transition-all duration-200 hover:border-blue-500/40 hover:bg-blue-500/5 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full group-hover:scale-125 transition-transform"></div>
                      <div>
                        <p className="text-sm font-semibold text-white group-hover:text-blue-100 transition-colors">{activity.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{activity.detail}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="component-surface border component-border rounded-xl p-6 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent">
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <h2 className="text-lg font-bold text-white">Quick Actions</h2>
              </div>
              <div className="h-0.5 w-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4"></div>
              <div className="mt-4 space-y-3">
                {quickActions.map((action, index) => {
                  const icons = [
                    <path key="1" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />,
                    <path key="2" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />,
                    <path key="3" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  ];
                  return (
                    <button
                      key={action.id}
                      type="button"
                      className="w-full text-left border component-border rounded-lg p-4 hover:border-purple-500/50 hover:bg-purple-500/5 hover:scale-102 transition-all duration-200 group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500/20 transition-colors">
                          <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {icons[index]}
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white group-hover:text-purple-100 transition-colors">{action.title}</p>
                          <p className="text-xs text-gray-400 mt-1">{action.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Dashboard;