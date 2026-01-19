import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

const Datasets = () => {
  const [userDatasets, setUserDatasets] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [isParsing, setIsParsing] = useState(false);

  const excelDatasets = [
    {
      id: 'xls-001',
      name: 'Retail Sales Q4 2025.xlsx',
      rows: '84,120',
      columns: '18',
      size: '12.4 MB',
      updated: '2026-01-05',
      owner: 'Analytics Team',
      fields: ['Date', 'Region', 'Category', 'Revenue'],
      records: [
        { Date: '2025-12-03', Region: 'West', Category: 'Electronics', Revenue: 48210 },
        { Date: '2025-12-03', Region: 'East', Category: 'Home', Revenue: 32540 },
      ],
    },
    {
      id: 'xls-002',
      name: 'Customer Support Tickets.xlsx',
      rows: '46,532',
      columns: '12',
      size: '6.1 MB',
      updated: '2025-12-22',
      owner: 'Ops',
      fields: ['Ticket ID', 'Priority', 'Status', 'Resolution Time'],
      records: [
        { 'Ticket ID': 'SUP-8831', Priority: 'High', Status: 'Resolved', 'Resolution Time': '4h' },
        { 'Ticket ID': 'SUP-8832', Priority: 'Medium', Status: 'In progress', 'Resolution Time': '—' },
      ],
    },
    {
      id: 'xls-003',
      name: 'Housing Features San Francisco.xlsx',
      rows: '120,004',
      columns: '15',
      size: '18.9 MB',
      updated: '2025-12-29',
      owner: 'Data Science',
      fields: ['Bedrooms', 'Bathrooms', 'Sqft', 'Price'],
      records: [
        { Bedrooms: 3, Bathrooms: 2, Sqft: 1650, Price: 412000 },
        { Bedrooms: 2, Bathrooms: 1, Sqft: 980, Price: 295000 },
      ],
    },
    {
      id: 'xls-004',
      name: 'Inventory Snapshot.xlsx',
      rows: '27,880',
      columns: '10',
      size: '3.2 MB',
      updated: '2026-01-11',
      owner: 'Supply Chain',
      fields: ['SKU', 'Warehouse', 'On Hand', 'Reorder Point'],
      records: [
        { SKU: 'INV-1029', Warehouse: 'W1', 'On Hand': 320, 'Reorder Point': 120 },
        { SKU: 'INV-1031', Warehouse: 'W2', 'On Hand': 88, 'Reorder Point': 150 },
      ],
    },
  ];

  useEffect(() => {
    const stored = localStorage.getItem('datasets:excel');
    if (stored) {
      try {
        setUserDatasets(JSON.parse(stored));
      } catch (error) {
        setUserDatasets([]);
      }
    }
  }, []);

  const persistDatasets = (nextDatasets) => {
    setUserDatasets(nextDatasets);
    localStorage.setItem('datasets:excel', JSON.stringify(nextDatasets));
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
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const records = XLSX.utils.sheet_to_json(sheet, { defval: '' });
      const fields = records.length ? Object.keys(records[0]) : [];
      const now = new Date();
      const next = [
        {
          id: `usr-${now.getTime()}`,
          name: file.name,
          rows: records.length.toLocaleString(),
          columns: fields.length.toString(),
          size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          updated: now.toISOString().slice(0, 10),
          owner: 'You',
          fields,
          records,
        },
        ...userDatasets,
      ];
      persistDatasets(next);
    } catch (error) {
      setErrorMessage('Unable to parse the Excel file.');
    } finally {
      setIsParsing(false);
    }
    event.target.value = '';
  };

  const handleDelete = (datasetId) => {
    const next = userDatasets.filter((dataset) => dataset.id !== datasetId);
    persistDatasets(next);
  };

  const allDatasets = [...userDatasets, ...excelDatasets];

  return (
    <div className="min-h-[120vh] app-background">
      <div className="w-full max-w-full px-6 py-10 mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Datasets</h1>
          <p className="text-gray-400 text-sm mt-1">
            Excel datasets available for training, validation, and reporting
          </p>
        </div>

        <div className="component-surface border component-border rounded-xl overflow-hidden">
          <div className="p-4 border-b component-border flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white">Upload Excel dataset</p>
              <p className="text-xs text-gray-400">Supported formats: .xlsx, .xls</p>
            </div>
            <div className="flex items-center gap-3">
                {isParsing && <span className="text-xs text-blue-300">Parsing...</span>}
                {!isParsing && errorMessage && (
                  <span className="text-xs text-red-300">{errorMessage}</span>
                )}
              <label className="inline-flex items-center justify-center px-4 py-2 rounded-lg component-surface border component-border text-sm text-gray-200 cursor-pointer hover:border-blue-500/60">
                Upload
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  className="hidden"
                  onChange={handleUpload}
                />
              </label>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-300">
              <thead className="bg-gray-900 text-gray-400">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Dataset</th>
                  <th className="text-left px-4 py-3 font-medium">Rows</th>
                  <th className="text-left px-4 py-3 font-medium">Columns</th>
                  <th className="text-left px-4 py-3 font-medium">Size</th>
                  <th className="text-left px-4 py-3 font-medium">Owner</th>
                  <th className="text-left px-4 py-3 font-medium">Updated</th>
                  <th className="text-right px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allDatasets.map((dataset) => (
                  <tr
                    key={dataset.id}
                    onClick={() => setSelectedDataset(dataset)}
                    className="border-t component-border hover:bg-gray-900/40 cursor-pointer"
                  >
                    <td className="px-4 py-3 text-gray-200">{dataset.name}</td>
                    <td className="px-4 py-3">{dataset.rows}</td>
                    <td className="px-4 py-3">{dataset.columns}</td>
                    <td className="px-4 py-3">{dataset.size}</td>
                    <td className="px-4 py-3">{dataset.owner}</td>
                    <td className="px-4 py-3">{dataset.updated}</td>
                    <td className="px-4 py-3 text-right">
                      {dataset.owner === 'You' ? (
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleDelete(dataset.id);
                          }}
                          className="text-xs text-red-300 hover:text-red-200"
                        >
                          Delete
                        </button>
                      ) : (
                        <span className="text-xs text-gray-500">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selectedDataset && (
          <div className="mt-6 component-surface border component-border rounded-xl p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Dataset details</h2>
              <button
                type="button"
                onClick={() => setSelectedDataset(null)}
                className="text-xs text-gray-400 hover:text-gray-200"
              >
                Clear
              </button>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
              <div>
                <p className="text-xs text-gray-400">Name</p>
                <p className="text-gray-200">{selectedDataset.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Owner</p>
                <p className="text-gray-200">{selectedDataset.owner}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Rows</p>
                <p className="text-gray-200">{selectedDataset.rows}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Columns</p>
                <p className="text-gray-200">{selectedDataset.columns}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Size</p>
                <p className="text-gray-200">{selectedDataset.size}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Last updated</p>
                <p className="text-gray-200">{selectedDataset.updated}</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold text-white">All records</h3>
              {selectedDataset.records?.length ? (
                <div className="mt-3 overflow-auto rounded-lg border component-border">
                  <table className="min-w-full text-sm text-gray-300">
                    <thead className="bg-gray-900 text-gray-400">
                      <tr>
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