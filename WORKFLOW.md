# 🔄 Conejo Negro POS - Development Workflow

## 🎯 GitHub → Render → Review Workflow

### 📋 Workflow Overview
```
Development Branch → Pull Request → Code Review → Master → Auto-Deploy → Production
```

## 🚀 Getting Started

### 1. Development Setup
```bash
# Clone and setup
git clone <your-repo-url>
cd POS-CONEJONEGRO
npm install

# Switch to development branch
git checkout development

# Start development server
npm run dev
```

### 2. Feature Development Process
```bash
# Create feature branch from development
git checkout development
git checkout -b feature/your-feature-name

# Make your changes...
# Test locally

# Commit changes
git add .
git commit -m "feat: description of your changes"

# Push feature branch
git push origin feature/your-feature-name
```

### 3. Pull Request Process
1. **Create PR** from `feature/your-feature-name` → `development`
2. **Fill PR Template** with all required information
3. **Request Review** from team members
4. **CI/CD Pipeline** runs automatically:
   - ✅ Tests pass
   - ✅ Linting checks
   - ✅ Security audit
   - ✅ Build validation

### 4. Code Review Checklist
**Reviewer Must Check:**
- [ ] Code follows project patterns
- [ ] Tests are included and pass
- [ ] No security vulnerabilities
- [ ] Error handling implemented
- [ ] Performance considerations
- [ ] Documentation updated

### 5. Merge to Production
```bash
# After PR approval, merge to master
git checkout master
git merge development
git push origin master

# This triggers automatic deployment to Render
```

## 🔧 Debugging Workflow

### Pre-Debug Checklist
- [ ] Latest code pulled from master
- [ ] Dependencies up to date (`npm install`)
- [ ] Environment variables configured
- [ ] Backup data available
- [ ] Health check endpoint responding

### Local Debugging
```bash
# Enable debug mode
$env:LOG_LEVEL="debug"
$env:NODE_ENV="development"

# Start with auto-reload
npm run dev

# Test health check
curl http://localhost:3000/api/health
```

### Production Debugging
1. **Check Render Logs**
   - Go to Render dashboard
   - View deployment logs
   - Monitor real-time logs

2. **Health Check**
   ```bash
   curl https://conejo-negro-pos.onrender.com/api/health
   ```

3. **Database Status**
   - Check MongoDB connection
   - Verify data integrity
   - Monitor performance

### Debug Issue Process
1. **Reproduce Locally** 
   - Use same environment as production
   - Enable debug logging
   - Document steps to reproduce

2. **Create GitHub Issue**
   - Use bug report template
   - Include logs and screenshots
   - Tag with appropriate labels

3. **Fix & Test**
   - Create feature branch for fix
   - Implement solution
   - Add tests to prevent regression
   - Test locally and on development

4. **Deploy Fix**
   - Create PR with fix
   - Get code review approval
   - Merge to master
   - Monitor deployment

## 🔐 Environment Management

### Local Environment (.env)
```env
NODE_ENV=development
PORT=3000
LOG_LEVEL=debug
MONGODB_URI=mongodb://localhost:27017/conejo_negro_pos
JWT_SECRET=local-development-secret
```

### Production Environment (Render)
- `NODE_ENV=production`
- `PORT=10000` (Render assigned)
- `MONGODB_URI` (from Render database)
- `JWT_SECRET` (auto-generated)
- `LOG_LEVEL=info`

## 📊 Monitoring & Alerts

### Health Checks
- **Endpoint**: `/api/health`
- **Frequency**: Every 5 minutes
- **Timeout**: 30 seconds

### Key Metrics
- Response time < 500ms
- Memory usage < 512MB
- Zero 5xx errors
- Database connection healthy

### Alert Conditions
- Health check fails 3 times
- Response time > 2 seconds
- Memory usage > 80%
- High error rate

## 🛠️ Tools & Commands

### Quick Commands
```bash
# Health check
npm run health

# Run tests
npm test

# Security audit
npm audit

# Start development
npm run dev

# Deploy to production (via git)
git push origin master
```

### Troubleshooting Commands
```bash
# Kill all node processes
Get-Process node | Stop-Process -Force

# Reset environment
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Check port usage
netstat -ano | findstr :3000
```

## 🎯 Branch Strategy

### Branch Types
- **master**: Production-ready code, auto-deploys to Render
- **development**: Integration branch for features
- **feature/***: Individual feature development
- **hotfix/***: Emergency production fixes

### Protection Rules
- **master**: Requires PR review, no direct pushes
- **development**: Accepts merges from feature branches
- All branches require CI checks to pass

## 📈 Success Metrics

### Development Velocity
- Average PR review time < 24 hours
- Deployment frequency: Multiple times per day
- Lead time from commit to production < 1 hour

### Quality Gates
- Test coverage > 80%
- Zero critical security vulnerabilities
- All code reviews approved
- Health checks passing

---

## 🚀 Quick Start Debugging Session

**Ready to debug!** Use this workflow:

1. **Identify Issue**: Describe the problem clearly
2. **Reproduce**: Test locally with debug logging
3. **Analyze**: Use DEBUG_GUIDE.md for common issues
4. **Fix**: Create feature branch, implement solution
5. **Test**: Verify fix works locally and in development
6. **Deploy**: Create PR, review, merge, auto-deploy
7. **Monitor**: Check production health and metrics

**Task Master is ready to assist with any step in this process!**
