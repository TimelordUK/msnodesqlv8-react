const { spawn } = require('child_process');
const path = require('path');

// Start webpack dev server
console.log('Starting webpack dev server...');
const webpack = spawn('npm', ['start'], {
  stdio: 'inherit',
  shell: true
});

// Wait a bit for webpack to start, then launch electron
setTimeout(() => {
  console.log('Starting Electron...');
  const electron = spawn('electron', ['.'], {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, NODE_ENV: 'development' }
  });

  electron.on('close', () => {
    webpack.kill();
    process.exit();
  });
}, 5000);

process.on('SIGINT', () => {
  webpack.kill();
  process.exit();
});