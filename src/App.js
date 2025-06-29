import React, { useState, useEffect } from 'react';

const sql = window.require ? window.require('msnodesqlv8') : null;

function App() {
  const [queryResult, setQueryResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Not tested');
  const [lastQuery, setLastQuery] = useState('');
  
  const connectionString = "Driver={ODBC Driver 18 for SQL Server};Server=127.0.0.1,1433;Database=node;UID=node_user;PWD=StrongPassword123!;TrustServerCertificate=yes;Connect Timeout=10";

  const testConnection = async () => {
    if (!sql) {
      setError('msnodesqlv8 module not available. Make sure you are running in an Electron environment.');
      return;
    }

    setLoading(true);
    setError(null);
    setConnectionStatus('Testing...');
    
    try {
      const testQuery = 'SELECT 1 as test_connection';
      console.log('Testing database connection...');
      const res = await sql.promises.query(connectionString, testQuery);
      setConnectionStatus('Connected ✓');
      setQueryResult(res);
      setLastQuery('Connection Test');
      console.log('Connection test successful:', JSON.stringify(res, null, 4));
    } catch (e) {
      console.error('Connection test failed:', e);
      setError(e.message);
      setConnectionStatus('Failed ✗');
    } finally {
      setLoading(false);
    }
  };

  const runQuery = async (query, description) => {
    if (!sql) {
      setError('msnodesqlv8 module not available. Make sure you are running in an Electron environment.');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log(`Running query: ${description}`);
      const res = await sql.promises.query(connectionString, query);
      setQueryResult(res);
      setLastQuery(description);
      console.log('Query result:', JSON.stringify(res, null, 4));
    } catch (e) {
      console.error('Query error:', e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setQueryResult(null);
    setError(null);
    setLastQuery('');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#2c3e50', textAlign: 'center', marginBottom: '30px' }}>
        🗄️ SQL Server Demo with msnodesqlv8
      </h1>
      
      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '20px', 
        borderRadius: '8px', 
        marginBottom: '20px',
        border: '1px solid #dee2e6'
      }}>
        <h3 style={{ marginTop: 0, color: '#495057' }}>Connection Status</h3>
        <p style={{ fontSize: '16px' }}>
          <strong>Status:</strong> 
          <span style={{ 
            marginLeft: '10px',
            padding: '4px 8px',
            borderRadius: '4px',
            backgroundColor: connectionStatus.includes('Connected') ? '#d4edda' : 
                           connectionStatus.includes('Failed') ? '#f8d7da' : '#fff3cd',
            color: connectionStatus.includes('Connected') ? '#155724' : 
                  connectionStatus.includes('Failed') ? '#721c24' : '#856404'
          }}>
            {connectionStatus}
          </span>
        </p>
        <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: 0 }}>
          <strong>Connection String:</strong> {connectionString}
        </p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: '#495057' }}>Database Operations</h3>
        
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <button 
            onClick={testConnection} 
            disabled={loading}
            style={{
              padding: '12px 20px',
              fontSize: '14px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              fontWeight: 'bold'
            }}
          >
            🔗 Test Connection
          </button>

          <button 
            onClick={() => runQuery('SELECT top 5 * FROM syscolumns', 'System Columns Query')}
            disabled={loading}
            style={{
              padding: '12px 20px',
              fontSize: '14px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            📋 System Columns
          </button>

          <button 
            onClick={() => runQuery('SELECT top 5 * FROM sysobjects', 'System Objects Query')}
            disabled={loading}
            style={{
              padding: '12px 20px',
              fontSize: '14px',
              backgroundColor: '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            🗂️ System Objects
          </button>

          <button 
            onClick={() => runQuery('SELECT @@VERSION as sql_version', 'SQL Server Version')}
            disabled={loading}
            style={{
              padding: '12px 20px',
              fontSize: '14px',
              backgroundColor: '#6f42c1',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            ℹ️ Server Version
          </button>

          <button 
            onClick={clearResults}
            style={{
              padding: '12px 20px',
              fontSize: '14px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            🗑️ Clear Results
          </button>
        </div>

        {loading && (
          <div style={{ 
            textAlign: 'center', 
            padding: '20px',
            color: '#007bff',
            fontSize: '16px'
          }}>
            ⏳ Running query... Please wait...
          </div>
        )}
      </div>

      {error && (
        <div style={{ 
          marginBottom: '20px', 
          padding: '15px', 
          backgroundColor: '#f8d7da', 
          color: '#721c24',
          borderRadius: '6px',
          border: '1px solid #f5c6cb'
        }}>
          <strong>❌ Error:</strong> {error}
        </div>
      )}

      {queryResult && (
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#495057' }}>
            📊 Query Results: {lastQuery}
          </h3>
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '15px', 
            borderRadius: '6px',
            border: '1px solid #dee2e6',
            overflow: 'auto',
            maxHeight: '400px'
          }}>
            <pre style={{ 
              margin: 0,
              fontSize: '13px',
              lineHeight: '1.4',
              color: '#495057'
            }}>
              {JSON.stringify(queryResult, null, 2)}
            </pre>
          </div>
        </div>
      )}

      <div style={{ 
        marginTop: '40px', 
        padding: '20px',
        backgroundColor: '#e9ecef',
        borderRadius: '6px',
        fontSize: '14px', 
        color: '#495057'
      }}>
        <h4 style={{ marginTop: 0, color: '#343a40' }}>ℹ️ About this Demo</h4>
        <ul style={{ marginBottom: 0 }}>
          <li>This demo requires an Electron environment to work properly</li>
          <li>The msnodesqlv8 module is a native C++ addon that needs Node.js APIs</li>
          <li>Make sure your SQL Server is running and accessible</li>
          <li>Check that the connection string matches your database configuration</li>
        </ul>
      </div>
    </div>
  );
}

export default App;