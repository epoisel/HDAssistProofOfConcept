const http = require('http');
const url = require('url');
const querystring = require('querystring');

// Simple mock knowledge base articles
const mockArticles = [
  {
    id: '1',
    kb_number: 'KB0012345',
    title: 'How to Reset User Password in Active Directory',
    content: 'Step-by-step guide to reset user passwords in Active Directory:\n\n1. Open Active Directory Users and Computers\n2. Navigate to the user account\n3. Right-click and select "Reset Password"\n4. Enter new password and confirm\n5. Check "User must change password at next logon" if needed\n6. Click OK to save changes\n\nNote: Ensure you have appropriate permissions to reset passwords.',
    category: 'Authentication',
    tags: ['password', 'reset', 'AD', 'active directory', 'user account'],
    priority: 'medium',
    department: 'IT',
    view_count: 1250,
    helpful_count: 98,
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-20T14:45:00Z'
  },
  {
    id: '2',
    kb_number: 'KB0067891',
    title: 'Troubleshooting VPN Connection Issues',
    content: 'Common VPN connection problems and solutions:\n\n1. Check internet connectivity\n2. Verify VPN server address and credentials\n3. Ensure VPN client is up to date\n4. Check firewall settings\n5. Try different VPN protocols (OpenVPN, IKEv2, etc.)\n6. Restart network adapters\n7. Contact IT support if issues persist\n\nCommon error codes:\n- Error 800: Unable to establish connection\n- Error 619: Connection failed\n- Error 809: Network connection interrupted',
    category: 'Network',
    tags: ['vpn', 'connection', 'troubleshooting', 'remote access'],
    priority: 'high',
    department: 'IT',
    view_count: 2100,
    helpful_count: 156,
    created_at: '2024-01-10T09:15:00Z',
    updated_at: '2024-01-25T11:20:00Z'
  },
  {
    id: '3',
    kb_number: 'KB0034567',
    title: 'Email Configuration Setup for Outlook',
    content: 'How to configure Outlook for corporate email:\n\n1. Open Outlook and click "File" > "Add Account"\n2. Select "Manual setup or additional server types"\n3. Choose "POP or IMAP"\n4. Enter the following settings:\n   - Server: mail.company.com\n   - Port: 993 (IMAP) or 995 (POP3)\n   - Encryption: SSL/TLS\n5. Enter your email address and password\n6. Click "Test Account Settings"\n7. Click "Next" and "Finish"\n\nIf you encounter issues, check with IT for specific server settings.',
    category: 'Email',
    tags: ['email', 'configuration', 'outlook', 'IMAP', 'POP3'],
    priority: 'medium',
    department: 'IT',
    view_count: 890,
    helpful_count: 72,
    created_at: '2024-01-08T16:30:00Z',
    updated_at: '2024-01-22T10:15:00Z'
  }
];

// Helper functions
function extractKeywords(text) {
  const stopWords = ['the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but', 'in', 'with', 'to', 'for', 'of', 'as', 'by'];
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.includes(word));
  
  return [...new Set(words)].slice(0, 10);
}

function calculateRelevanceScore(keywords, article) {
  const titleWords = article.title.toLowerCase().split(/\s+/);
  const contentWords = article.content.toLowerCase().split(/\s+/).slice(0, 100);
  const tagWords = article.tags.map(tag => tag.toLowerCase());
  
  let score = 0;
  keywords.forEach(keyword => {
    if (titleWords.includes(keyword)) score += 3;
    if (contentWords.includes(keyword)) score += 2;
    if (tagWords.includes(keyword)) score += 2;
  });
  
  return Math.min(Math.round(score / keywords.length), 10);
}

function calculateSearchScore(searchTerms, article) {
  const titleWords = article.title.toLowerCase().split(/\s+/);
  const contentWords = article.content.toLowerCase().split(/\s+/).slice(0, 100);
  const tagWords = article.tags.map(tag => tag.toLowerCase());
  
  let score = 0;
  searchTerms.forEach(term => {
    // Higher weight for title matches
    if (titleWords.some(word => word.includes(term))) {
      score += 5;
    }
    // Medium weight for tag matches
    if (tagWords.some(tag => tag.includes(term))) {
      score += 3;
    }
    // Lower weight for content matches
    if (contentWords.some(word => word.includes(term))) {
      score += 1;
    }
    
    // Bonus for exact matches
    if (titleWords.includes(term)) score += 2;
    if (tagWords.includes(term)) score += 1;
  });
  
  // Boost popular articles slightly
  score += (article.view_count + article.helpful_count) / 1000;
  
  return score;
}

function sendResponse(res, data, statusCode = 200) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
  });
  res.end(JSON.stringify(data, null, 2));
}

function sendError(res, error, statusCode = 400) {
  sendResponse(res, { error }, statusCode);
}

// Create HTTP server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;
  
  console.log(`${new Date().toISOString()} - ${method} ${pathname}`);
  
  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
    });
    res.end();
    return;
  }
  
  // Routes
  switch (pathname) {
    case '/':
      sendResponse(res, {
        message: 'ServiceNow Knowledge Base API',
        version: '1.0.0',
        mock_mode: true,
        endpoints: '/api/docs'
      });
      break;
      
    case '/health':
      sendResponse(res, {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: {
          api: 'up',
          knowledge_base: 'up',
          mock_mode: true
        }
      });
      break;
      
    case '/api/docs':
      sendResponse(res, {
        endpoints: [
          { path: '/health', method: 'GET', description: 'Health check endpoint' },
          { path: '/api/knowledge/search', method: 'GET', description: 'Search knowledge base', parameters: ['q (required)', 'category', 'page', 'limit'] },
          { path: '/api/knowledge/article/:id', method: 'GET', description: 'Get specific article by ID' },
          { path: '/api/knowledge/popular', method: 'GET', description: 'Get popular articles' },
          { path: '/api/knowledge/categories', method: 'GET', description: 'Get available categories' },
          { path: '/api/knowledge/analyze', method: 'POST', description: 'Analyze technical issue' }
        ]
      });
      break;
      
    case '/api/knowledge/search':
      const query = parsedUrl.query.q;
      const category = parsedUrl.query.category;
      const page = parseInt(parsedUrl.query.page) || 1;
      const limit = Math.min(parseInt(parsedUrl.query.limit) || 10, 50);
      
      if (!query) {
        sendError(res, 'Query parameter "q" is required');
        return;
      }
      
      const startTime = Date.now();
      let results = mockArticles;
      
      // Filter by query with intelligent word matching
      if (query) {
        const searchTerms = query.toLowerCase()
          .replace(/[^\w\s]/g, ' ')
          .split(/\s+/)
          .filter(term => term.length > 2); // Filter out very short words
        
        results = results.filter(article => {
          const articleText = `${article.title} ${article.content} ${article.tags.join(' ')}`.toLowerCase();
          
          // Score based on how many search terms match
          const matchCount = searchTerms.reduce((count, term) => {
            if (articleText.includes(term)) {
              return count + 1;
            }
            // Also check for partial matches and common variations
            if (term === 'password' && (articleText.includes('pwd') || articleText.includes('pass'))) {
              return count + 0.5;
            }
            if (term === 'reset' && articleText.includes('change')) {
              return count + 0.5;
            }
            if (term === 'issue' && (articleText.includes('problem') || articleText.includes('troubleshoot'))) {
              return count + 0.5;
            }
            if (term === 'vpn' && articleText.includes('connection')) {
              return count + 0.3;
            }
            return count;
          }, 0);
          
          // Include article if at least 30% of search terms match
          return matchCount >= (searchTerms.length * 0.3);
        })
        .sort((a, b) => {
          // Sort by relevance score
          const scoreA = calculateSearchScore(searchTerms, a);
          const scoreB = calculateSearchScore(searchTerms, b);
          return scoreB - scoreA;
        });
      }
      
      // Filter by category
      if (category) {
        results = results.filter(article =>
          article.category.toLowerCase() === category.toLowerCase()
        );
      }
      
      // Pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedResults = results.slice(startIndex, endIndex);
      
      sendResponse(res, {
        articles: paginatedResults.map(article => ({
          ...article,
          kb_number: article.kb_number,
          display_info: `${article.kb_number} - ${article.title}`
        })),
        total: results.length,
        page: page,
        per_page: limit,
        search_time: Date.now() - startTime
      });
      break;
      
    case '/api/knowledge/popular':
      const popularLimit = Math.min(parseInt(parsedUrl.query.limit) || 10, 20);
      const popularArticles = [...mockArticles]
        .sort((a, b) => (b.view_count + b.helpful_count) - (a.view_count + a.helpful_count))
        .slice(0, popularLimit);
        
      sendResponse(res, {
        articles: popularArticles.map(article => ({
          ...article,
          kb_number: article.kb_number,
          display_info: `${article.kb_number} - ${article.title}`
        })),
        total: popularArticles.length
      });
      break;
      
    case '/api/knowledge/categories':
      const categories = [...new Set(mockArticles.map(a => a.category))];
      sendResponse(res, { categories });
      break;
      
    default:
      // Check if it's an article by ID request
      const articleMatch = pathname.match(/^\/api\/knowledge\/article\/(.+)$/);
      if (articleMatch) {
        const id = articleMatch[1];
        const article = mockArticles.find(a => a.id === id);
        
        if (!article) {
          sendError(res, 'Article not found', 404);
          return;
        }
        
        sendResponse(res, article);
        return;
      }
      
      // Handle POST requests (like analyze)
      if (method === 'POST' && pathname === '/api/knowledge/analyze') {
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });
        req.on('end', () => {
          try {
            const data = JSON.parse(body);
            const { issue_description, error_message, system_info } = data;
            
            if (!issue_description) {
              sendError(res, 'issue_description is required');
              return;
            }
            
                         const keywords = extractKeywords(issue_description + ' ' + (error_message || ''));
             
             // Use the same intelligent search logic for analysis
             const relevantArticles = mockArticles.filter(article => {
               const articleText = `${article.title} ${article.content} ${article.tags.join(' ')}`.toLowerCase();
               
               const matchCount = keywords.reduce((count, keyword) => {
                 if (articleText.includes(keyword.toLowerCase())) {
                   return count + 1;
                 }
                 // Check for variations
                 if (keyword === 'password' && (articleText.includes('pwd') || articleText.includes('pass'))) {
                   return count + 0.5;
                 }
                 if (keyword === 'reset' && articleText.includes('change')) {
                   return count + 0.5;
                 }
                 if (keyword === 'issue' && (articleText.includes('problem') || articleText.includes('troubleshoot'))) {
                   return count + 0.5;
                 }
                 if (keyword === 'vpn' && articleText.includes('connection')) {
                   return count + 0.3;
                 }
                 if (keyword === 'email' && (articleText.includes('mail') || articleText.includes('outlook'))) {
                   return count + 0.5;
                 }
                 return count;
               }, 0);
               
               return matchCount >= Math.max(1, keywords.length * 0.2); // At least 20% match or 1 keyword
             })
             .sort((a, b) => {
               const scoreA = calculateSearchScore(keywords, a);
               const scoreB = calculateSearchScore(keywords, b);
               return scoreB - scoreA;
             })
             .slice(0, 5);
            
            const articlesWithScores = relevantArticles.map(article => ({
              ...article,
              kb_number: article.kb_number,
              display_info: `${article.kb_number} - ${article.title}`,
              relevance_score: calculateRelevanceScore(keywords, article)
            })).sort((a, b) => b.relevance_score - a.relevance_score);
            
            sendResponse(res, {
              analysis: {
                issue_description,
                error_message,
                system_info,
                extracted_keywords: keywords,
                relevant_articles: articlesWithScores,
                total_articles_found: articlesWithScores.length,
                recommendations: articlesWithScores.length > 0 ? 
                  [`Found ${articlesWithScores.length} relevant articles`, 'Review articles in order of relevance'] :
                  ['No relevant articles found', 'Try different search terms']
              }
            });
          } catch (error) {
            sendError(res, 'Invalid JSON in request body');
          }
        });
        return;
      }
      
      sendError(res, 'Not found', 404);
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 ServiceNow Knowledge Base API Server running!`);
  console.log(`📍 Server URL: http://localhost:${PORT}`);
  console.log(`📋 API Documentation: http://localhost:${PORT}/api/docs`);
  console.log(`🔍 Health Check: http://localhost:${PORT}/health`);
  console.log(`📊 Mock articles loaded: ${mockArticles.length}`);
  console.log(`\n🌐 For Copilot Studio, use: http://localhost:${PORT}/api/knowledge/search?q=your-query`);
  console.log(`\n📝 Example endpoints to test:`);
  console.log(`   • Search: http://localhost:${PORT}/api/knowledge/search?q=password`);
  console.log(`   • Article: http://localhost:${PORT}/api/knowledge/article/1`);
  console.log(`   • Popular: http://localhost:${PORT}/api/knowledge/popular`);
  console.log(`   • Categories: http://localhost:${PORT}/api/knowledge/categories`);
  console.log(`\nPress Ctrl+C to stop the server`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\nReceived SIGTERM, shutting down gracefully...');
  server.close(() => {
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\nReceived SIGINT, shutting down gracefully...');
  server.close(() => {
    process.exit(0);
  });
}); 