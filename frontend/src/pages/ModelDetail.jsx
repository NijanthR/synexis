import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getModelBySlug } from '../data/models';

const ModelDetail = () => {
  const { modelId } = useParams();
  const model = useMemo(() => getModelBySlug(modelId), [modelId]);
  const [inputValue, setInputValue] = useState('');
  const [outputValue, setOutputValue] = useState(null);
  const [notesValue, setNotesValue] = useState('');
  const [notesSaved, setNotesSaved] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const outputRef = useRef(null);

  useEffect(() => {
    if (!model) {
      return;
    }
    const storedNotes = localStorage.getItem(`model-notes:${model.slug}`) || '';
    setNotesValue(storedNotes);
    setNotesSaved(false);
    setImageFile(null);
    setImagePreview('');
  }, [model]);

  if (!model) {
    return (
      <div className="min-h-[120vh] app-background">
        <div className="px-6 py-10 max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Model not found</h1>
          <p className="text-gray-400 mt-2">Try selecting a model from the list.</p>
          <Link
            to="/models"
            className="inline-flex mt-6 text-sm font-semibold text-blue-300 hover:text-blue-200"
          >
            Back to Models
          </Link>
        </div>
      </div>
    );
  }

  const handleRun = () => {
    const safeInput =
      model.category === 'image'
        ? imageFile?.name || model.inputPlaceholder
        : inputValue?.trim() || model.inputPlaceholder;
    setOutputValue({
      input: safeInput,
      output: model.sampleOutput,
      confidence: model.category === 'tabular' ? '92.1%' : '97.4%',
      latency: model.speed,
    });
    setTimeout(() => {
      outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleSaveNotes = () => {
    if (!model) {
      return;
    }
    localStorage.setItem(`model-notes:${model.slug}`, notesValue.trim());
    setNotesSaved(true);
  };

  return (
    <div className="min-h-[120vh] app-background">
      <div className="px-6 py-10 max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <Link
              to="/models"
              className="text-xs font-semibold text-blue-300 hover:text-blue-200"
            >
              Back to Models
            </Link>
            <h1 className="text-2xl font-bold text-white mt-2">{model.title}</h1>
            <p className="text-gray-400 text-sm mt-1">{model.category} model</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-gray-400">Accuracy</p>
              <p className="text-lg font-semibold text-white">{model.accuracy}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Latency</p>
              <p className="text-lg font-semibold text-white">{model.speed}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-gray-800 border border-gray-700 rounded-xl p-6 flex flex-col">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">About model</h2>
              <div className="flex items-center gap-3">
                {notesSaved && (
                  <span className="text-xs text-emerald-300">Saved</span>
                )}
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  className="text-xs font-semibold text-blue-300 bg-blue-500/10 border border-blue-500/30 px-3 py-1 rounded-full hover:text-blue-200"
                >
                  Save
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-300 mt-3 leading-relaxed">{model.description}</p>
            <div className="mt-5">
              <label className="text-xs font-semibold text-gray-400">Add usage notes</label>
              <textarea
                value={notesValue}
                onChange={(event) => {
                  setNotesValue(event.target.value);
                  setNotesSaved(false);
                }}
                className="mt-2 w-full min-h-[140px] rounded-lg bg-gray-900 border border-gray-700 text-sm text-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                placeholder="Describe how you plan to use this model..."
              />
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 flex flex-col">
            <h2 className="text-lg font-semibold text-white">Run</h2>
            <p className="text-xs text-gray-400 mt-1">Provide sample input and run the model.</p>
            <div className="mt-4 flex-1">
              {model.category === 'image' ? (
                <div className="space-y-4">
                  <div className="min-h-[160px] rounded-lg bg-gray-900 border border-dashed border-gray-700 flex items-center justify-center">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Uploaded preview"
                        className="max-h-[160px] object-contain"
                      />
                    ) : (
                      <p className="text-sm text-gray-500">Run image</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-sm text-gray-200 cursor-pointer hover:border-blue-500/60">
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (!file) {
                            return;
                          }
                          setImageFile(file);
                          const previewUrl = URL.createObjectURL(file);
                          setImagePreview(previewUrl);
                        }}
                      />
                    </label>
                    {imageFile && (
                      <span className="text-xs text-gray-400">{imageFile.name}</span>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <label className="text-xs font-semibold text-gray-400">Input</label>
                  <textarea
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    className="mt-2 w-full min-h-[140px] rounded-lg bg-gray-900 border border-gray-700 text-sm text-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    placeholder={model.inputPlaceholder}
                  />
                </>
              )}
            </div>
            <button
              onClick={handleRun}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 rounded-lg transition"
            >
              Run model
            </button>
          </div>
        </div>

        <div
          ref={outputRef}
          className="bg-gray-800 border border-gray-700 rounded-xl p-6 scroll-mt-6"
        >
          <h2 className="text-lg font-semibold text-white">Output</h2>
          {outputValue ? (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-300">
              <div>
                <p className="text-xs text-gray-400">Input used</p>
                <p className="text-gray-200">{outputValue.input}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Prediction</p>
                <p className="text-gray-200 text-lg font-semibold">{outputValue.output}</p>
              </div>
              <div className="flex items-center gap-8">
                <div>
                  <p className="text-xs text-gray-400">Confidence</p>
                  <p className="text-gray-200">{outputValue.confidence}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Latency</p>
                  <p className="text-gray-200">{outputValue.latency}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-400 mt-3">Run the model to see output here.</p>
          )}
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white">Dataset overview</h2>
          <div className="mt-4 overflow-hidden rounded-lg border border-gray-700">
            <table className="w-full text-sm text-gray-300">
              <thead className="bg-gray-900 text-gray-400">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Dataset</th>
                  <th className="text-left px-4 py-3 font-medium">Rows</th>
                  <th className="text-left px-4 py-3 font-medium">Features</th>
                  <th className="text-left px-4 py-3 font-medium">Updated</th>
                </tr>
              </thead>
              <tbody>
                {model.datasets.map((dataset) => (
                  <tr key={dataset.id} className="border-t border-gray-700">
                    <td className="px-4 py-3 text-gray-200">{dataset.name}</td>
                    <td className="px-4 py-3">{dataset.rows}</td>
                    <td className="px-4 py-3">{dataset.features}</td>
                    <td className="px-4 py-3">{dataset.updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelDetail;
