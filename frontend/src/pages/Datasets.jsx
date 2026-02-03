import { useEffect, useState, useMemo } from 'react';
import * as XLSX from 'xlsx';

const Datasets = () => {
  const [userDatasets, setUserDatasets] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [isParsing, setIsParsing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Load datasets from backend
    loadDatasetsFromBackend();
  }, []);

  const loadDatasetsFromBackend = async () => {
    try {
      const userEmail = localStorage.getItem('userEmail') || 'anonymous';
      const response = await fetch(`/api/datasets/?user_email=${encodeURIComponent(userEmail)}`);
      if (response.ok) {
        const data = await response.json();
        const formattedDatasets = data.datasets.map(ds => ({
          id: ds.id,
          name: ds.name,
          rows: ds.rows.toLocaleString(),
          columns: ds.columns.toString(),
          size: ds.size,
          updated: ds.uploaded_at.slice(0, 10),
          owner: 'You',
          fields: ds.fields,
          records: ds.records, // Show all records
        }));
        setUserDatasets(formattedDatasets);
      }
    } catch (error) {
      console.error('Failed to load datasets:', error);
    }
  };

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    if (!file.name.toLowerCase().endsWith('.xlsx') && !file.name.toLowerCase().endsWith('.xls')) {
      setErrorMessage('Please upload an Excel file (.xlsx or .xls).');
      event.target.value = '';
      return;
    }
    setErrorMessage('');
    setIsParsing(true);
    
    try {
      // Upload to backend
      const formData = new FormData();
      formData.append('file', file);
      formData.append('user_email', localStorage.getItem('userEmail') || 'anonymous');
      
      const response = await fetch('/api/datasets/upload/', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }
      
      const dataset = await response.json();
      
      // Add to local state
      const formattedDataset = {
        id: dataset.id,
        name: dataset.name,
        rows: dataset.rows.toLocaleString(),
        columns: dataset.columns.toString(),
        size: dataset.size,
        updated: dataset.uploaded_at.slice(0, 10),
        owner: 'You',
        fields: dataset.fields,
        records: dataset.records, // Show all records
      };
      
      setUserDatasets([formattedDataset, ...userDatasets]);
      
    } catch (error) {
      setErrorMessage(error.message || 'Unable to upload the Excel file.');
    } finally {
      setIsParsing(false);
    }
    event.target.value = '';
  };

  const handleDelete = async (datasetId) => {
    if (!window.confirm('Are you sure you want to delete this dataset?')) {
      return;
    }
    
    try {
      const userEmail = localStorage.getItem('userEmail') || 'anonymous';
      const response = await fetch(`/api/datasets/${datasetId}/?user_email=${encodeURIComponent(userEmail)}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Delete failed');
      }
      
      // Remove from local state
      const next = userDatasets.filter((dataset) => dataset.id !== datasetId);
      setUserDatasets(next);
      
    } catch (error) {
      setErrorMessage(error.message || 'Unable to delete the dataset.');
    }
  };

  // Filter and search datasets
  const filteredDatasets = useMemo(() => {
    let filtered = userDatasets;
    
    // Search by name
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(d => d.name.toLowerCase().includes(query));
    }
    
    return filtered;
  }, [userDatasets, searchQuery]);
  
  // Calculate stats
  const stats = useMemo(() => {
    const totalRows = userDatasets.reduce((sum, d) => {
      return sum + parseInt(d.rows.replace(/,/g, ''));
    }, 0);
    
    const totalSize = userDatasets.reduce((sum, d) => {
      const size = parseFloat(d.size);
      return sum + size;
    }, 0);
    
    return {
      total: userDatasets.length,
      totalRows: totalRows.toLocaleString(),
      totalSize: totalSize.toFixed(1) + ' MB',
      userDatasets: userDatasets.length
    };
  }, [userDatasets]);

  return (
    <div className="min-h-[120vh] app-background">
      <div className="w-full max-w-full px-6 py-10 mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Datasets</h1>
              <p className="text-gray-400 text-sm">
                Manage and explore your Excel datasets for ML training and analysis
              </p>
            </div>
            <label className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 flex items-center gap-2 cursor-pointer">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload Dataset
              <input
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={handleUpload}
              />
            </label>
          </div>
          
          {/* Upload Status Messages */}
          {(isParsing || errorMessage) && (
            <div className={`p-3 rounded-lg flex items-center gap-2 ${
              errorMessage ? 'bg-red-500/10 border border-red-500/30' : 'bg-blue-500/10 border border-blue-500/30'
            }`}>
              {isParsing ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-sm text-blue-400">Parsing Excel file...</p>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-red-400">{errorMessage}</p>
                </>
              )}
            </div>
          )}
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="component-surface border component-border rounded-xl p-5 bg-gradient-to-br from-blue-500/5 to-transparent">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-bold text-white mb-1">{stats.total}</p>
              <p className="text-sm text-gray-400">Total Datasets</p>
            </div>

            <div className="component-surface border component-border rounded-xl p-5 bg-gradient-to-br from-green-500/5 to-transparent">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-bold text-white mb-1">{stats.totalRows}</p>
              <p className="text-sm text-gray-400">Total Rows</p>
            </div>

            <div className="component-surface border component-border rounded-xl p-5 bg-gradient-to-br from-purple-500/5 to-transparent">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-bold text-white mb-1">{stats.totalSize}</p>
              <p className="text-sm text-gray-400">Total Storage</p>
            </div>

            <div className="component-surface border component-border rounded-xl p-5 bg-gradient-to-br from-orange-500/5 to-transparent">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-bold text-white mb-1">{stats.userDatasets}</p>
              <p className="text-sm text-gray-400">Your Uploads</p>
            </div>
          </div>
          
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mt-6 component-surface border component-border rounded-xl p-4">
            <div className="flex-1">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search your datasets..."
                  className="w-full pl-10 pr-4 py-2.5 component-surface border component-border rounded-lg app-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Datasets Table */}
        <div className="component-surface border component-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-300">
              <thead className="component-surface border-b component-border">
                <tr className="text-gray-400">
                  <th className="text-left px-4 py-3 font-medium">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                      Dataset
                    </div>
                  </th>
                  <th className="text-left px-4 py-3 font-medium">Rows</th>
                  <th className="text-left px-4 py-3 font-medium">Columns</th>
                  <th className="text-left px-4 py-3 font-medium">Size</th>
                  <th className="text-left px-4 py-3 font-medium">Updated</th>
                  <th className="text-right px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDatasets.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 component-surface border component-border rounded-full flex items-center justify-center mb-4">
                          <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <p className="text-gray-400 mb-2">No datasets found</p>
                        <p className="text-sm text-gray-500">Try adjusting your filters or upload a new dataset</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredDatasets.map((dataset) => (
                    <tr
                      key={dataset.id}
                      onClick={() => setSelectedDataset(dataset)}
                      className="border-t component-border hover:bg-blue-500/5 cursor-pointer transition-all duration-150 group"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
                            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <span className="text-gray-200 font-medium group-hover:text-blue-300 transition-colors">{dataset.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded text-xs font-medium">{dataset.rows}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-purple-500/10 text-purple-400 rounded text-xs font-medium">{dataset.columns}</span>
                      </td>
                      <td className="px-4 py-3">{dataset.size}</td>
                      <td className="px-4 py-3 text-gray-400">{dataset.updated}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleDelete(dataset.id);
                            }}
                            className="text-xs px-3 py-1 text-red-400 bg-red-500/10 border border-red-500/30 rounded hover:bg-red-500/20 hover:text-red-300 transition-all duration-200"
                          >
                            Delete
                          </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {selectedDataset && (
          <div className="mt-6 component-surface border component-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Dataset Details</h2>
                  <p className="text-xs text-gray-400">Viewing: {selectedDataset.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDataset(null)}
                className="px-3 py-2 text-xs font-medium text-gray-400 component-surface border component-border rounded-lg hover:border-red-500/30 hover:text-red-400 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="component-surface border component-border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-xs text-gray-400 font-medium">Name</p>
                </div>
                <p className="text-sm text-white font-semibold truncate">{selectedDataset.name}</p>
              </div>
              
              <div className="component-surface border component-border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <p className="text-xs text-gray-400 font-medium">Owner</p>
                </div>
                <p className="text-sm text-white font-semibold">{selectedDataset.owner}</p>
              </div>
              
              <div className="component-surface border component-border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs text-gray-400 font-medium">Last Updated</p>
                </div>
                <p className="text-sm text-white font-semibold">{selectedDataset.updated}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <p className="text-xs text-green-400 mb-1 font-medium">Total Rows</p>
                <p className="text-2xl font-bold text-green-300">{selectedDataset.rows}</p>
              </div>
              
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <p className="text-xs text-purple-400 mb-1 font-medium">Total Columns</p>
                <p className="text-2xl font-bold text-purple-300">{selectedDataset.columns}</p>
              </div>
              
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-xs text-blue-400 mb-1 font-medium">File Size</p>
                <p className="text-2xl font-bold text-blue-300">{selectedDataset.size}</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                <h3 className="text-md font-semibold text-white">Data Preview</h3>
                <span className="text-xs text-gray-500">({selectedDataset.records?.length || 0} rows shown)</span>
              </div>
              {selectedDataset.records?.length ? (
                <div className="mt-3 overflow-auto rounded-lg border component-border">
                  <table className="min-w-full text-sm text-gray-300">
                    <thead className="component-surface border-b component-border">
                      <tr className="text-gray-400">
                        {selectedDataset.fields?.map((field) => (
                          <th key={field} className="text-left px-4 py-3 font-medium">
                            {field}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {selectedDataset.records.map((record, index) => (
                        <tr key={`${selectedDataset.id}-${index}`} className="border-t component-border">
                          {selectedDataset.fields?.map((field) => (
                            <td key={field} className="px-4 py-3">
                              {record[field] ?? '—'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-gray-400 mt-2">No row data available for this dataset.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Datasets;