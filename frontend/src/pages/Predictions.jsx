import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { predictions } from '../data/predictions';

const Predictions = () => {
  const navigate = useNavigate();
  const latestPredictions = useMemo(() => {
    const stored = JSON.parse(localStorage.getItem('predictions:history') || '[]');
    const combined = [...stored, ...predictions];
    return combined
      .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
      .slice(0, 10);
  }, []);

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
  return (
    <div className="min-h-[120vh] app-background">
      <div className="w-full max-w-full px-6 py-10 mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Predictions</h1>
          <p className="text-gray-400 text-sm mt-1">
            Latest prediction outputs across deployed models
          </p>
        </div>

        <div className="space-y-4">
          {latestPredictions.map((item) => (
            <div
              key={item.id}
              className="component-surface border component-border rounded-xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-semibold text-blue-300 bg-blue-500/10 border border-blue-500/30 px-3 py-1 rounded-full">
                    {item.task}
                  </span>
                  <span className="text-xs text-gray-400">{formatTime(item)}</span>
                </div>
                <h2 className="text-lg font-semibold text-white">{item.output}</h2>
                <p className="text-sm text-gray-400 mt-1">
                  Model:{' '}
                  <button
                    type="button"
                    onClick={() => navigate(`/models/${item.modelSlug}`)}
                    className="text-gray-200 hover:text-blue-300 transition-colors"
                  >
                    {item.model}
                  </button>
                </p>
                <p className="text-sm text-gray-400">
                  Input: <span className="text-gray-200">{item.input}</span>
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs text-gray-400">Confidence</p>
                <p className="text-2xl font-bold text-white">{item.confidence}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Predictions;