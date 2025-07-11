@echo off
echo Starting ServiceNow Knowledge Base API Server...
echo.
echo This will start the HTTP server on http://localhost:3000
echo Press Ctrl+C to stop the server
echo.
echo The server provides:
echo - Knowledge Base search and retrieval
echo - Technical issue analysis
echo - Popular solutions
echo - Mock healthcare IT data
echo.
echo Once started, you can:
echo 1. Test in browser: http://localhost:3000
echo 2. Use with VS Code REST Client extension
echo 3. Connect to Copilot (see QUICK-REFERENCE.md)
echo 4. Full setup guide (see COMPLETE-SETUP-GUIDE.md)
echo.
pause
echo Starting server...
node quick-start.js 