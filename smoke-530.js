const { app } = require('electron')
process.on('uncaughtException', e => { console.error('UNCAUGHT:', e.message); app.exit(1) })
app.whenReady().then(async () => {
  console.log('react demo | electron', process.versions.electron, '| node', process.versions.node, '| napi', process.versions.napi, '| abi', process.versions.modules)
  const sql = require('msnodesqlv8')
  console.log('NATIVE ADDON LOADED OK:', typeof sql.open === 'function')
  try {
    const r = await sql.promises.query("Driver={ODBC Driver 18 for SQL Server};Server=127.0.0.1,1433;Database=node;UID=node_user;PWD=StrongPassword123!;TrustServerCertificate=yes;Connect Timeout=10", 'select 7*6 as answer')
    console.log('QUERY OK:', JSON.stringify(r.first))
  } catch (e) { console.error('QUERY FAILED:', e.message) }
  app.exit(0)
})
