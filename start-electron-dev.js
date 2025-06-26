const { spawn } = require('child_process');
const path = require('path');

let webpack = null;
let electron = null;

// Cleanup function to ensure all processes are killed
function cleanup() {
  console.log('Cleaning up processes...');
  if (webpack) {
    webpack.kill('SIGTERM');
    // Force kill if it doesn't respond to SIGTERM
    setTimeout(() => {
      if (webpack && !webpack.killed) {
        webpack.kill('SIGKILL');
      }
    }, 2000);
  }
  if (electron) {
    electron.kill('SIGTERM');
  }
  setTimeout(() => {
    process.exit();
  }, 3000);
}

// Start webpack dev server
console.log('Starting webpack dev server...');
webpack = spawn('npm', ['start'], {
  stdio: 'inherit',
  shell: true
});

// Wait a bit for webpack to start, then launch electron
setTimeout(() => {
  console.log('Starting Electron...');
  electron = spawn('electron', ['.'], {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, NODE_ENV: 'development' }
  });

  electron.on('close', () => {
    cleanup();
  });
}, 5000);

// Handle various termination signals
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);