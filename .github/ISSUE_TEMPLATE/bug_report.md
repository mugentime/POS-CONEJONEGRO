---
name: 🐛 Bug Report
about: Report a bug in the Conejo Negro POS system
title: '[BUG] Brief description of the issue'
labels: 'bug, needs-triage'
assignees: ''
---

## 🐛 Bug Description
A clear and concise description of what the bug is.

## 🔄 Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Enter data '....'
4. See error

## ✅ Expected Behavior
A clear description of what you expected to happen.

## ❌ Actual Behavior
A clear description of what actually happened.

## 📸 Screenshots
If applicable, add screenshots to help explain your problem.

## 🌐 Environment
- **Environment**: [Local/Production/Render]
- **Browser**: [Chrome, Firefox, Safari, etc.]
- **OS**: [Windows, macOS, Linux]
- **Node.js Version**: [if known]
- **Server URL**: [localhost:3000 or production URL]

## 🔍 System Information
**If this is a server-side issue, please provide:**
- [ ] Server logs from the time of the issue
- [ ] API endpoint affected: `/api/...`
- [ ] Request method: GET/POST/PUT/DELETE
- [ ] Request payload (if applicable):

```json
{
  "example": "request data"
}
```

**If this is a frontend issue:**
- [ ] Console errors (F12 > Console)
- [ ] Network tab errors (F12 > Network)
- [ ] Local storage state (if relevant)

## 🔧 Debugging Information
**Server Health Check:**
```bash
curl https://your-render-url.onrender.com/api/health
```

**Database Status:**
- [ ] Products loading correctly
- [ ] Records saving/retrieving properly
- [ ] Coworking data displaying

## 🎯 Module Affected
- [ ] 🛒 POS/Sales System
- [ ] 💼 Coworking Management
- [ ] 📦 Inventory (Refrigerator)
- [ ] ☕ Cafeteria Inventory
- [ ] 📊 Reporting/Dashboard
- [ ] 🔐 Authentication/Security
- [ ] 🗄️ Database/Data Storage

## 🚨 Priority Level
- [ ] 🔥 Critical (System down, data loss)
- [ ] ⚡ High (Major functionality broken)
- [ ] 📋 Medium (Minor functionality issue)
- [ ] 🔧 Low (Enhancement, minor bug)

## 💡 Possible Solution
If you have ideas on how to fix the issue, please describe them here.

## 📎 Additional Context
Add any other context about the problem here.

---
**For Internal Use:**
- [ ] Issue reproduced locally
- [ ] Issue reproduced on staging
- [ ] Issue reproduced on production
- [ ] Root cause identified
- [ ] Fix implemented and tested
