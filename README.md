# React msnodesqlv8 Demo

This is a simple React demo application that shows how to use the msnodesqlv8 native module in a React application running within Electron.

## Prerequisites

- Node.js
- ODBC Driver 18 for SQL Server
- A SQL Server instance running on `127.0.0.1:1433` with:
  - Database: `node`
  - User: `node_user`
  - Password: `StrongPassword123!`

## Installation

```bash
npm install
```

The `postinstall` script will automatically rebuild the msnodesqlv8 module for Electron.

## Running the Application

### Option 1: Run in Electron (Recommended)

To run the React app inside Electron where the native module will work:

```bash
# For development with hot reload
npm run electron-dev

# Or just run Electron
npm run electron
```

### Option 2: Run as standalone React (Limited functionality)

```bash
npm start
```

**Note:** When running as a standalone React app in the browser, the msnodesqlv8 module won't be available since it's a native Node.js module. You'll see an error message in the UI.

## Building

To build the React app for production:

```bash
npm run build
```

Then run the built version in Electron:

```bash
npm run electron
```

## How it Works

1. The React app is built using Webpack with special configuration to handle native modules
2. When running in Electron, the app has access to Node.js APIs including the msnodesqlv8 module
3. The app connects to SQL Server and runs a simple query when you click the button
4. Results are displayed in the UI

## Troubleshooting

If you encounter issues with the native module:

1. Make sure you have the correct ODBC drivers installed
2. Rebuild the native module: `npm run electron-rebuild`
3. Ensure your SQL Server connection string is correct
4. Check that SQL Server is running and accessible