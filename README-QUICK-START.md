# Quick Start Guide - ServiceNow Knowledge Base for VS Code Copilot

## What We've Built

✅ **HTTP API Server** - A working ServiceNow Knowledge Base API with mock healthcare IT data  
✅ **VS Code Integration** - Ready to connect with VS Code Copilot  
✅ **MCP Server** - Model Context Protocol server for advanced integration  
✅ **Mock Data** - 3 sample healthcare IT articles (password reset, VPN, email)  
✅ **Testing Tools** - REST Client test file and comprehensive guides  

## Immediate Testing (No Setup Required)

### 1. Start the Server
```bash
# Option 1: Double-click start-server.bat (Windows)
# Option 2: Command line
node quick-start.js
```

### 2. Test in Browser
- **Health Check**: http://localhost:3000/health
- **Search**: http://localhost:3000/api/knowledge/search?q=password
- **API Docs**: http://localhost:3000/api/docs

### 3. Test with VS Code REST Client
1. Install the "REST Client" extension in VS Code
2. Open `test-mcp.http` in VS Code
3. Click "Send Request" above any endpoint to test

## VS Code Copilot Integration

### Method 1: Simple HTTP Integration
1. Start the server: `node quick-start.js`
2. Use the REST Client extension to test endpoints
3. Reference the API in your development workflow

### Method 2: Full MCP Integration (Advanced)
1. Install dependencies: `npm install @modelcontextprotocol/sdk`
2. Configure VS Code settings (see VSCODE-SETUP.md)
3. Use the MCP server: `node mcp-server.js`

## Available Endpoints

| Endpoint | Description | Example |
|----------|-------------|---------|
| `GET /health` | Server health check | `curl http://localhost:3000/health` |
| `GET /api/knowledge/search?q=query` | Search knowledge base | `curl "http://localhost:3000/api/knowledge/search?q=password"` |
| `GET /api/knowledge/article/1` | Get specific article | `curl http://localhost:3000/api/knowledge/article/1` |
| `GET /api/knowledge/popular` | Get popular articles | `curl http://localhost:3000/api/knowledge/popular` |
| `GET /api/knowledge/categories` | Get all categories | `curl http://localhost:3000/api/knowledge/categories` |
| `POST /api/knowledge/analyze` | Analyze technical issue | See test-mcp.http file |

## Sample Mock Data

The server includes 3 healthcare IT knowledge articles:

1. **Password Reset in Active Directory** (ID: 1)
   - Category: Authentication
   - High views: 1,250 | Helpful: 98 votes

2. **VPN Connection Troubleshooting** (ID: 2)
   - Category: Network
   - High priority | Views: 2,100 | Helpful: 156 votes

3. **Outlook Email Configuration** (ID: 3)
   - Category: Email
   - Views: 890 | Helpful: 72 votes

## Next Steps

### For New Users:
1. 📖 **Read**: `COMPLETE-SETUP-GUIDE.md` - Full setup instructions for your team
2. ✅ **Test**: Follow the step-by-step setup process
3. 🤖 **Integrate**: Connect with VS Code Copilot

### For Existing Users:
1. 📋 **Quick Reference**: `QUICK-REFERENCE.md` - One-page cheat sheet
2. 🔧 **Advanced Setup**: `VSCODE-SETUP.md` - Detailed VS Code integration
3. 🧪 **Testing**: `TESTING.md` - Comprehensive testing guide

### For Production:
1. 🏥 **Healthcare**: `HEALTHCARE-QUICKSTART.md` - Healthcare-specific deployment
2. 🔒 **Security**: Add Azure AD authentication
3. 🌐 **Integration**: Connect to real ServiceNow APIs

## Files Overview

| File | Purpose |
|------|---------|
| `quick-start.js` | **Main HTTP server** (ready to run) |
| `mcp-server.js` | MCP protocol server for advanced integration |
| `test-mcp.http` | REST Client test file for VS Code |
| `start-server.bat` | Windows batch file to start server |
| `VSCODE-SETUP.md` | Detailed VS Code integration guide |
| `TESTING.md` | Comprehensive testing guide |
| `src/data/mock-kb.json` | Extended mock data (30+ articles) |

## Testing Commands

```bash
# Start server
node quick-start.js

# Test health
curl http://localhost:3000/health

# Search for password help
curl "http://localhost:3000/api/knowledge/search?q=password"

# Analyze an issue
curl -X POST http://localhost:3000/api/knowledge/analyze \
  -H "Content-Type: application/json" \
  -d '{"issue_description": "User cannot connect to VPN", "error_message": "Error 800"}'
```

## Support

- **Quick issues**: Check if server is running on port 3000
- **VS Code integration**: See VSCODE-SETUP.md
- **API testing**: Use the test-mcp.http file
- **Advanced setup**: Review the comprehensive docs/ folder

## Key Features

🔍 **Smart Search** - Searches titles, content, and tags  
🏷️ **Category Filtering** - Filter by Authentication, Network, Email, etc.  
📊 **Relevance Scoring** - AI-powered relevance ranking  
🔍 **Issue Analysis** - Analyze technical problems and get solutions  
📈 **Popular Solutions** - Get most helpful articles  
🏥 **Healthcare Ready** - Mock data designed for healthcare IT  
🔒 **Security Ready** - Azure AD configuration prepared  

**Ready to test!** Just run `node quick-start.js` and start exploring the knowledge base API. 