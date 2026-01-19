import { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ModelsBox from '../components/ModelsBox';
import { models } from '../data/models';

const Models = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const focus = searchParams.get('focus');

  const filteredModels = useMemo(() => {
    if (focus === 'image') {
      return models.filter((model) => model.category === 'image' && model.best);
    }
    return models;
  }, [focus]);

  return (
    <div className="min-h-[120vh] app-background">
      <div className="w-full max-w-full px-6 py-10 mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Models</h1>
            <p className="text-gray-400 text-sm mt-1">
              {focus === 'image'
                ? 'Best models for image classification'
                : 'Browse all available models across tasks'}
            </p>
          </div>
          {focus === 'image' && (
            <span className="text-xs font-semibold text-blue-300 bg-blue-500/10 border border-blue-500/30 px-3 py-1 rounded-full">
              Image Classification Focus
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredModels.map((model) => (
            <div key={model.id} className="h-64">
              <ModelsBox
                title={model.title}
                description={model.description}
                accuracy={model.accuracy}
                speed={model.speed}
                onUse={() => navigate(`/models/${model.slug}`)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Models;