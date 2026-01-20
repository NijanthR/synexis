import { useEffect, useMemo, useState } from 'react';

const FlowerClassifier = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const probabilities = useMemo(() => {
    if (!result?.probabilities) {
      return [];
    }
    return Object.entries(result.probabilities).sort((a, b) => b[1] - a[1]);
  }, [result]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
    setResult(null);
    setError('');
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl('');
    }
  };

  const handlePredict = async () => {
    if (!selectedFile) {
      setError('Please select an image first.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/flower/predict/', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setError(data?.error || 'Prediction failed.');
        return;
      }

      setResult(data);
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="component-surface border component-border rounded-xl p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Flower classifier</h2>
            <p className="text-sm text-gray-400 mt-1">
              Upload a flower image to predict Daisy, Dandelion, Roses, Sunflowers, or
              Tulips.
            </p>
          </div>

          <div className="space-y-3">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            />
            <button
              type="button"
              onClick={handlePredict}
              disabled={isSubmitting || !selectedFile}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-600 disabled:text-gray-300"
            >
              {isSubmitting ? 'Predicting...' : 'Run prediction'}
            </button>
            {error && (
              <p className="text-sm text-red-400" role="alert">
                {error}
              </p>
            )}
          </div>

          {result && (
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Predicted label</p>
                  <p className="text-xl font-semibold text-white">{result.label}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Confidence</p>
                  <p className="text-xl font-semibold text-white">
                    {(result.confidence * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {probabilities.map(([name, value]) => (
                  <div key={name} className="flex items-center gap-3">
                    <span className="text-xs text-gray-300 w-24">{name}</span>
                    <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500"
                        style={{ width: `${Math.min(value * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-300 w-12 text-right">
                      {(value * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="w-full lg:w-80">
          <div className="h-56 w-full rounded-xl border border-dashed border-gray-600 bg-gray-800/40 flex items-center justify-center overflow-hidden">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Selected flower"
                className="h-full w-full object-cover"
              />
            ) : (
              <p className="text-sm text-gray-400">Preview will appear here</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowerClassifier;