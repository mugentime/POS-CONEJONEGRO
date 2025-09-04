# 🔧 Conejo Negro POS - Debugging Guide

## 🚀 Quick Start Debugging

### 🔍 Health Check Commands
```bash
# Local health check
curl http://localhost:3000/api/health

# Production health check  
curl https://conejo-negro-pos.onrender.com/api/health

# Check if server is running locally
netstat -an | findstr :3000
```

### 📊 System Status
```bash
# Check current data state
curl http://localhost:3000/api/products
curl http://localhost:3000/api/records

# Test coworking endpoint
curl http://localhost:3000/coworking
```

## 🐛 Common Issues & Solutions

### 1. Server Won't Start
**Symptoms:**
- `npm start` fails
- Port already in use
- Module not found errors

**Debug Steps:**
```powershell
# Check if port is in use
netstat -ano | findstr :3000

# Kill process on port 3000 if needed
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process

# Clear npm cache
npm cache clean --force
npm install

# Check Node version
node --version  # Should be 18+
```

### 2. Backup Data Not Loading
**Symptoms:**
- "Could not load backup data" warning
- 0 products/records loaded

**Debug Steps:**
```bash
# Check if backup file exists
ls -la ../conejo-negro-backup-2025-08-22.json

# Validate backup file format
node -e "console.log(JSON.parse(require('fs').readFileSync('../conejo-negro-backup-2025-08-22.json', 'utf8')))"
```

### 3. Render Deployment Issues
**Symptoms:**
- Build fails on Render
- Environment variables missing
- Health check fails

**Debug Steps:**
1. Check Render dashboard logs
2. Verify environment variables are set
3. Test build locally:
```bash
NODE_ENV=production npm ci
NODE_ENV=production npm start
```

### 4. API Endpoints Not Responding
**Symptoms:**
- 404 errors on API calls
- Empty responses
- CORS errors

**Debug Steps:**
```bash
# Test each endpoint individually
curl -v http://localhost:3000/api/health
curl -v http://localhost:3000/api/products
curl -v http://localhost:3000/api/records

# Check middleware order
grep -n "app.use" server.js
```

### 5. Frontend Issues
**Symptoms:**
- Blank pages
- JavaScript errors
- CSS not loading

**Debug Steps:**
1. Open browser DevTools (F12)
2. Check Console for errors
3. Check Network tab for failed requests
4. Verify CSP headers aren't blocking resources

## 🔬 Advanced Debugging

### Environment Variables Setup
Create `.env` file for local debugging:
```env
NODE_ENV=development
PORT=3000
LOG_LEVEL=debug
MONGODB_URI=mongodb://localhost:27017/conejo_negro_pos
JWT_SECRET=your-local-jwt-secret
```

### Logging Levels
- `error`: Only critical errors
- `warn`: Warnings and errors  
- `info`: General info, warnings, errors (default)
- `debug`: All logs including detailed debugging

Set log level:
```bash
# Local development
set LOG_LEVEL=debug && npm start

# Or in PowerShell
$env:LOG_LEVEL="debug"; npm start
```

### Database Debugging
```bash
# If using MongoDB locally
mongosh
use conejo_negro_pos
db.products.find()
db.records.find()
```

### Performance Debugging
```bash
# Check memory usage
node --expose-gc server.js

# Monitor with nodemon for auto-restart
npm run dev
```

## 🔄 Debugging Workflow

### 1. Local Development Debugging
1. Set `LOG_LEVEL=debug`
2. Use `npm run dev` for auto-restart
3. Check browser console for frontend issues
4. Use curl/Postman for API testing

### 2. Staging/Production Debugging  
1. Check Render logs in dashboard
2. Use health check endpoint
3. Monitor error rates
4. Check environment variables

### 3. Data Issues
1. Verify backup file format
2. Check data validation
3. Test CRUD operations
4. Validate API responses

## 📋 Pre-Deployment Checklist

- [ ] All tests pass locally
- [ ] Health check responds correctly
- [ ] No console errors in browser
- [ ] API endpoints return expected data
- [ ] Backup data loads correctly
- [ ] Environment variables documented
- [ ] Security headers configured
- [ ] Error handling implemented

## 🚨 Emergency Debug Commands

### Kill All Node Processes
```powershell
Get-Process node | Stop-Process -Force
```

### Reset Local Environment
```bash
rm -rf node_modules
rm package-lock.json
npm cache clean --force
npm install
```

### Quick System Test
```bash
npm test
npm start & 
sleep 5
curl http://localhost:3000/api/health
```

---

## 📞 Debugging Support

**Task Master Available For:**
- Real-time debugging assistance
- Log analysis and troubleshooting  
- Performance optimization
- Security vulnerability fixes
- Database migration support

**Report Issues:**
Use GitHub Issues with the bug report template for systematic debugging.
