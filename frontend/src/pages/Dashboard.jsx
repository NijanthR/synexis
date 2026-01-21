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
              <div key={model.id} className="flex-shrink-0 w-[380px] h-64">
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
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="component-surface border component-border rounded-xl p-4"
              >
                <p className="text-xs text-gray-400">{stat.label}</p>
                <p className="text-2xl font-semibold text-white mt-2">{stat.value}</p>
                <p className="text-xs text-blue-300 mt-2">{stat.trend}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full max-w-full px-6 mx-auto mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 component-surface border component-border rounded-xl p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Recent activity</h2>
                <span className="text-xs text-gray-400">Last 24 hours</span>
              </div>
              <div className="mt-4 space-y-4">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between border component-border rounded-lg p-4"
                  >
                    <div>
                      <p className="text-sm font-semibold text-white">{activity.title}</p>
                      <p className="text-xs text-gray-400 mt-1">{activity.detail}</p>
                    </div>
                    <span className="text-xs text-gray-400">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="component-surface border component-border rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white">Quick actions</h2>
              <div className="mt-4 space-y-3">
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    type="button"
                    className="w-full text-left border component-border rounded-lg p-4 hover:border-blue-500/50 transition"
                  >
                    <p className="text-sm font-semibold text-white">{action.title}</p>
                    <p className="text-xs text-gray-400 mt-1">{action.description}</p>
                  </button>
                ))}
              </div>
              
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Dashboard;