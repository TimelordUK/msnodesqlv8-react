import React, { useState, useEffect } from 'react';

const sql = window.require ? window.require('msnodesqlv8') : null;

function App() {
  const [queryResult, setQueryResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const connectionString = "Driver={ODBC Driver 18 for SQL Server};Server=127.0.0.1,1433;Database=node;UID=node_user;PWD=StrongPassword123!;TrustServerCertificate=yes;Connect Timeout=10";
  const query = 'SELECT top 2 * FROM syscolumns';

  const runQuery = async () => {
    if (!sql) {
      setError('msnodesqlv8 module not available. Make sure you are running in an Electron environment.');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log(`Using connection '${connectionString}' run query '${query}'`);
      const res = await sql.promises.query(connectionString, query);
      setQueryResult(res);
      console.log('Query result:', JSON.stringify(res, null, 4));
    } catch (e) {
      console.error('Query error:', e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>React msnodesqlv8 Demo</h1>
      <p>Hello World! This is a React app using msnodesqlv8 native module.</p>
      
      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={runQuery} 
          disabled={loading}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Running Query...' : 'Run SQL Query'}
        </button>
      </div>

      {error && (
        <div style={{ 
          marginTop: '20px', 
          padding: '10px', 
          backgroundColor: '#f8d7da', 
          color: '#721c24',
          borderRadius: '4px' 
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {queryResult && (
        <div style={{ marginTop: '20px' }}>
          <h3>Query Results:</h3>
          <pre style={{ 
            backgroundColor: '#f4f4f4', 
            padding: '10px', 
            borderRadius: '4px',
            overflow: 'auto' 
          }}>
            {JSON.stringify(queryResult, null, 2)}
          </pre>
        </div>
      )}

      <div style={{ marginTop: '40px', fontSize: '14px', color: '#666' }}>
        <p><strong>Note:</strong> This demo requires an Electron environment to work properly.</p>
        <p>The msnodesqlv8 module is a native C++ addon that needs Node.js APIs.</p>
      </div>
    </div>
  );
}

export default App;