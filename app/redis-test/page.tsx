'use client';

import { useState, useEffect } from 'react';

export default function RedisTestPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [key, setKey] = useState('test-key');
  const [value, setValue] = useState('test-value');
  const [operation, setOperation] = useState('test');

  const runTest = async (op: string = operation) => {
    setLoading(true);
    setError(null);
    
    try {
      const url = `/api/redis-test?op=${op}&key=${encodeURIComponent(key)}&value=${encodeURIComponent(value)}`;
      const response = await fetch(url);
      const data = await response.json();
      
      setResult(data);
      
      if (response.status !== 200) {
        setError(`Error: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const checkHealth = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      
      setResult(data);
      
      if (response.status !== 200) {
        setError(`Error: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Redis Test Page</h1>
      
      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Test Redis Operations</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Operation</label>
            <select 
              className="w-full p-2 border rounded"
              value={operation}
              onChange={(e) => setOperation(e.target.value)}
            >
              <option value="test">Run Test Sequence</option>
              <option value="set">Set Key</option>
              <option value="get">Get Key</option>
              <option value="del">Delete Key</option>
              <option value="keys">List All Keys</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Key</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded"
              value={key}
              onChange={(e) => setKey(e.target.value)}
            />
          </div>
          
          {operation === 'set' && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Value</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>
          )}
        </div>
        
        <div className="flex space-x-2">
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            onClick={() => runTest()}
            disabled={loading}
          >
            {loading ? 'Running...' : 'Run Test'}
          </button>
          
          <button 
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            onClick={checkHealth}
            disabled={loading}
          >
            Check Health
          </button>
        </div>
      </div>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      {result && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Result</h2>
          <pre className="p-4 bg-gray-800 text-green-400 rounded-lg overflow-auto max-h-96">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 