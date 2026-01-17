import React from 'react';
import New from '../components/New';
import SearchBar from '../components/SearchBar';
import ModelsBox from '../components/ModelsBox';
import Animation from '../components/Animation';

const Dashboard = () => {
  const modelsData = [
    {
      id: 1,
      title: "Image Classifier",
      description: "A model that can classify images into predefined categories with high accuracy. Perfect for content moderation or product categorization.",
      accuracy: "98.2%",
      speed: "25ms"
    },
    {
      id: 2,
      title: "Text Sentiment Analyzer",
      description: "Analyzes text sentiment and classifies it as positive, negative, or neutral. Great for social media monitoring.",
      accuracy: "95.7%",
      speed: "15ms"
    },
    {
      id: 3,
      title: "Object Detection",
      description: "Detects and locates multiple objects within images with bounding boxes. Ideal for autonomous vehicles and surveillance.",
      accuracy: "96.8%",
      speed: "45ms"
    },
    {
      id: 4,
      title: "Speech Recognition",
      description: "Converts spoken language into text with high precision. Suitable for voice assistants and transcription services.",
      accuracy: "94.3%",
      speed: "30ms"
    },
    {
      id: 5,
      title: "Fraud Detection",
      description: "Identifies fraudulent transactions and activities in real-time. Essential for financial security.",
      accuracy: "99.1%",
      speed: "10ms"
    },
    {
      id: 6,
      title: "Recommendation Engine",
      description: "Provides personalized recommendations based on user behavior and preferences. Perfect for e-commerce.",
      accuracy: "92.5%",
      speed: "20ms"
    }
  ];

  return (
    <div className="min-h-[120vh] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className='relative top-12'>
        {/* All three components with EXACT same width */}
        <div className="w-full max-w-full px-6 mx-auto">
          <New />
        </div>
        
        <div className="w-full max-w-full px-6 mx-auto">
          <SearchBar />
        </div>
        
        {/* Models Container with gap near sidebar */}
        <div className="w-full max-w-full mx-auto">
          <div className="w-full flex space-x-8 overflow-x-auto pb-12 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pl-6">
            {modelsData.map((model) => (
              <div key={model.id} className="flex-shrink-0 w-[380px] h-64">
                <ModelsBox
                  title={model.title}
                  description={model.description}
                  accuracy={model.accuracy}
                  speed={model.speed}
                />
              </div>
            ))}
            
            {/* Extra space at the end for proper scrolling */}
            <div className="flex-shrink-0 w-6"></div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Dashboard;