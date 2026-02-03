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
  const [isRunning, setIsRunning] = useState(false);
  const [runError, setRunError] = useState('');
  const outputRef = useRef(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [imageErrors, setImageErrors] = useState({});

  const savePrediction = (payload) => {
    const existing = JSON.parse(localStorage.getItem('predictions:history') || '[]');
    const next = [payload, ...existing].slice(0, 10);
    localStorage.setItem('predictions:history', JSON.stringify(next));
  };

  useEffect(() => {
    if (!model) {
      return;
    }
    const storedNotes = localStorage.getItem(`model-notes:${model.slug}`) || '';
    setNotesValue(storedNotes);
    setNotesSaved(false);
    setImageFile(null);
    setImagePreview('');
    loadComments();
  }, [model]);

  const loadComments = async () => {
    if (!model) return;
    setIsLoadingComments(true);
    try {
      const response = await fetch(`/api/comments/${model.slug}/`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments || []);
      }
    } catch (error) {
      console.error('Failed to load comments:', error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    
    setIsPostingComment(true);
    try {
      const userName = sessionStorage.getItem('userName') || sessionStorage.getItem('userEmail') || 'Anonymous';
      const userEmail = sessionStorage.getItem('userEmail') || 'anonymous';
      const userPicture = sessionStorage.getItem('userPicture') || '';
      
      const response = await fetch('/api/comments/add/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model_id: model.slug,
          user_name: userName,
          user_email: userEmail,
          user_picture: userPicture,
          comment: newComment,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setComments([data, ...comments]);
        setNewComment('');
      }
    } catch (error) {
      console.error('Failed to post comment:', error);
    } finally {
      setIsPostingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const userEmail = sessionStorage.getItem('userEmail') || 'anonymous';
      const response = await fetch(`/api/comments/delete/${commentId}/?user_email=${encodeURIComponent(userEmail)}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setComments(comments.filter(c => c.id !== commentId));
      }
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

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

  const handleRun = async () => {
    setRunError('');

    if (model.category === 'image' && model.slug === 'synexis-vision-pro') {
      if (!imageFile) {
        setRunError('Please upload a flower image first.');
        return;
      }

      setIsRunning(true);
      try {
        const formData = new FormData();
        formData.append('file', imageFile);

        const response = await fetch('/api/flower/predict/', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json().catch(() => null);
        if (!response.ok) {
          setRunError(data?.error || 'Prediction failed.');
          return;
        }

        const resultPayload = {
          input: imageFile.name,
          output: data.label,
          confidence: `${(data.confidence * 100).toFixed(1)}%`,
          latency: model.speed,
        };
        setOutputValue(resultPayload);
        savePrediction({
          id: `pred-${Date.now()}`,
          task: 'Image Classification',
          model: model.title,
          modelSlug: model.slug,
          input: imageFile.name,
          output: resultPayload.output,
          confidence: resultPayload.confidence,
          timestamp: Date.now(),
        });
      } catch (err) {
        setRunError('Network error. Please try again.');
      } finally {
        setIsRunning(false);
      }
    } else if (model.category === 'image' && model.slug === 'leaf-classifynet') {
      if (!imageFile) {
        setRunError('Please upload an animal image first.');
        return;
      }

      setIsRunning(true);
      try {
        const formData = new FormData();
        formData.append('file', imageFile);

        const response = await fetch('/api/animal/predict/', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json().catch(() => null);
        if (!response.ok) {
          setRunError(data?.error || 'Prediction failed.');
          return;
        }

        const resultPayload = {
          input: imageFile.name,
          output: data.label,
          confidence: `${(data.confidence * 100).toFixed(1)}%`,
          latency: model.speed,
        };
        setOutputValue(resultPayload);
        savePrediction({
          id: `pred-${Date.now()}`,
          task: 'Animal Classification',
          model: model.title,
          modelSlug: model.slug,
          input: imageFile.name,
          output: resultPayload.output,
          confidence: resultPayload.confidence,
          timestamp: Date.now(),
        });
      } catch (err) {
        setRunError('Network error. Please try again.');
      } finally {
        setIsRunning(false);
      }
    } else {
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
    }

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
              className="text-xs font-semibold text-blue-300 hover:text-blue-200 hover:underline transition-all duration-200"
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
          <div className="lg:col-span-2 component-surface border component-border rounded-xl p-6 flex flex-col">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">About model</h2>
              <div className="flex items-center gap-3">
                {notesSaved && (
                  <span className="text-xs text-emerald-300">Saved</span>
                )}
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  className="text-xs font-semibold text-blue-300 bg-blue-500/10 border border-blue-500/30 px-3 py-1 rounded-full hover:text-blue-200 hover:bg-blue-500/20 hover:scale-105 transition-all duration-200"
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
                className="mt-2 w-full min-h-[140px] rounded-lg component-surface border component-border text-sm app-text p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/40 hover:border-blue-500/30 transition-all duration-200"
                placeholder="Describe how you plan to use this model..."
              />
            </div>
          </div>

          <div className="component-surface border component-border rounded-xl p-6 flex flex-col">
            <h2 className="text-lg font-semibold text-white">Run</h2>
            <p className="text-xs text-gray-400 mt-1">Provide sample input and run the model.</p>
            <div className="mt-4 flex-1">
              {model.category === 'image' ? (
                <div className="space-y-4">
                  <div className="min-h-[160px] rounded-lg component-surface border border-dashed component-border flex items-center justify-center">
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
                    <label className="inline-flex items-center justify-center px-4 py-2 rounded-lg component-surface border component-border text-sm app-text cursor-pointer hover:border-blue-500/60 hover:bg-blue-500/10 hover:scale-105 transition-all duration-200">
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
                          setRunError('');
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
                    className="mt-2 w-full min-h-[140px] rounded-lg component-surface border component-border text-sm app-text p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/40 hover:border-blue-500/30 transition-all duration-200"
                    placeholder={model.inputPlaceholder}
                  />
                </>
              )}
            </div>
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:bg-gray-600 disabled:hover:scale-100 disabled:hover:shadow-none"
            >
              {isRunning ? 'Running...' : 'Run model'}
            </button>
            {runError && (
              <p className="text-xs text-red-300 mt-3" role="alert">
                {runError}
              </p>
            )}
          </div>
        </div>

        <div
          ref={outputRef}
          className="component-surface border component-border rounded-xl p-6 scroll-mt-6"
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

        <div className="component-surface border component-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white">Dataset overview</h2>
          <div className="mt-4 overflow-hidden rounded-lg border component-border">
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
                  <tr key={dataset.id} className="border-t component-border hover:bg-gray-900/40 transition-all duration-150 cursor-pointer">
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

        {/* Comments Section */}
        <div className="component-surface border component-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Comments</h2>
          
          {/* Add Comment */}
          <div className="mb-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full min-h-[100px] rounded-lg component-surface border component-border text-sm app-text p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/40 hover:border-blue-500/30 transition-all duration-200"
              placeholder="Share your thoughts about this model..."
            />
            <button
              onClick={handlePostComment}
              disabled={isPostingComment || !newComment.trim()}
              className="mt-3 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-all duration-200 hover:scale-105 disabled:bg-gray-600 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              {isPostingComment ? 'Posting...' : 'Post Comment'}
            </button>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {isLoadingComments ? (
              <div className="text-center py-8">
                <div className="inline-block w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-gray-400 mt-2">Loading comments...</p>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8 border border-dashed component-border rounded-lg">
                <svg className="w-12 h-12 text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-sm text-gray-400">No comments yet. Be the first to comment!</p>
              </div>
            ) : (
              comments.map((comment) => {
                const currentUserEmail = sessionStorage.getItem('userEmail') || 'anonymous';
                const isOwner = comment.user_email === currentUserEmail;
                const commentDate = new Date(comment.created_at);
                const formattedDate = commentDate.toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });
                
                const hasImageError = imageErrors[comment.id];
                
                return (
                  <div key={comment.id} className="component-surface border component-border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {comment.user_picture && !hasImageError ? (
                          <img
                            src={comment.user_picture}
                            alt={comment.user_name}
                            className="w-10 h-10 rounded-full object-cover"
                            crossOrigin="anonymous"
                            referrerPolicy="no-referrer"
                            onError={() => setImageErrors(prev => ({ ...prev, [comment.id]: true }))}
                          />
                        ) : (
                          <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
                            <span className="text-blue-400 font-semibold text-sm">
                              {comment.user_name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-semibold text-white">{comment.user_name}</p>
                          <p className="text-xs text-gray-400">{formattedDate}</p>
                        </div>
                      </div>
                      {isOwner && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-xs text-red-400 hover:text-red-300 transition-colors"
                          title="Delete comment"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-gray-300 mt-3 leading-relaxed">{comment.comment}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelDetail;
