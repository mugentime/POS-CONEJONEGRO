# Project Specification: Conejo Negro POS System

## Overview

The Conejo Negro POS (Point of Sale) System is a comprehensive web-based application designed specifically for café management. It provides a complete solution for inventory management, sales tracking, user management, and financial reporting with automated backup capabilities.

## Project Information

- **Name**: POS-CONEJONEGRO
- **Version**: 1.0.0
- **License**: MIT
- **Author**: Conejo Negro Café
- **Repository**: https://github.com/mugentime/POS-CONEJONEGRO

## Technical Stack

### Backend
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: PostgreSQL (primary), File-based storage (fallback)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **File Upload**: Multer
- **Task Scheduling**: node-cron

### Frontend
- **Technology**: Vanilla JavaScript (ES6+)
- **Styling**: CSS3 with responsive design
- **UI Framework**: Bootstrap (via CDN)
- **Icons**: Font Awesome

### DevOps & Deployment
- **Platform**: Railway (primary), Render (alternative)
- **CI/CD**: GitHub Actions
- **Testing**: Jest (unit), Playwright (e2e)
- **Monitoring**: Custom health checks

## Core Features

### 1. Authentication System
- Multi-role user management (admin, manager, employee)
- Secure JWT-based authentication
- Role-based access control (RBAC)
- Password reset functionality

### 2. Inventory Management
- Product categorization (cafetería, refrigerador)
- Real-time stock tracking
- Product CRUD operations
- Low stock alerts

### 3. Sales Management
- Transaction recording
- Client type classification
- Service type tracking
- Sales history and analytics

### 4. Cash Management (Cortes de Caja)
- Daily cash register management
- Opening and closing balance tracking
- Cash flow monitoring
- Financial reporting

### 5. Reporting System
- Daily, weekly, monthly reports
- Sales analytics and trends
- Inventory reports
- Financial summaries

### 6. Backup System
- Automated Google Drive backups
- Configurable backup schedules
- Data integrity verification
- Cloud storage integration

## Architecture

### Database Layer
```
utils/database.js - Database abstraction layer
├── PostgreSQL adapter (primary)
└── File-based storage adapter (fallback)
```

### API Layer
```
server.js - Main application server
├── routes/ - API endpoints
├── middleware/ - Authentication & validation
└── models/ - Data models
```

### Frontend Layer
```
public/ - Static assets
├── js/ - Client-side JavaScript
├── css/ - Stylesheets
└── index.html - Main application
```

## Security Features

- Content Security Policy (CSP) headers
- Rate limiting on API endpoints
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- Secure session management

## Performance Considerations

- Database connection pooling
- Optimized queries with indexing
- Client-side caching
- Compressed static assets
- Lazy loading for large datasets

## Deployment Configuration

### Environment Variables
```env
PORT=3000
NODE_ENV=production
JWT_SECRET=<secret-key>
DATABASE_URL=<postgresql-connection-string>
```

### Railway Deployment
- Automatic deployments from main branch
- PostgreSQL addon integration
- Environment variable management
- Health check endpoints

## API Specification

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Token verification

### Inventory Endpoints
- `GET /api/products` - List all products
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Sales Endpoints
- `POST /api/sales` - Record new sale
- `GET /api/sales` - Get sales history
- `GET /api/sales/stats` - Get sales statistics

### User Management Endpoints
- `GET /api/users` - List users (admin only)
- `POST /api/users` - Create user (admin only)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin only)

## Quality Assurance

### Testing Strategy
- Unit tests for business logic
- Integration tests for API endpoints
- End-to-end tests for user workflows
- Security testing for vulnerabilities

### Code Quality
- ESLint for code linting
- Prettier for code formatting
- Git hooks for pre-commit checks
- Code review process via pull requests

## Monitoring & Maintenance

### Health Checks
- Application health endpoint (`/health`)
- Database connectivity checks
- External service availability
- Performance metrics collection

### Logging
- Structured logging with timestamps
- Error tracking and alerting
- Access logs for security monitoring
- Performance metrics logging

## Development Workflow

### Branch Strategy
- `main` - Production-ready code
- Feature branches for new development
- Pull request reviews required
- Automated testing before merge

### Release Process
1. Feature development in branches
2. Pull request with comprehensive tests
3. Code review and approval
4. Merge to main branch
5. Automated deployment to production
6. Post-deployment verification

## Future Enhancements

### Planned Features
- Mobile application (React Native)
- Advanced analytics dashboard
- Multi-location support
- Third-party integrations (payment processors)
- Real-time notifications
- Advanced inventory forecasting

### Technical Improvements
- Microservices architecture
- Redis caching layer
- GraphQL API
- Containerization with Docker
- Advanced monitoring with APM tools

## Compliance & Standards

- **GDPR**: Data protection and privacy compliance
- **Security**: OWASP security guidelines
- **Accessibility**: WCAG 2.1 Level AA compliance
- **Performance**: Core Web Vitals optimization
- **SEO**: Search engine optimization best practices

## Support & Documentation

- Comprehensive README with setup instructions
- API documentation with examples
- Troubleshooting guides
- Development environment setup
- Deployment guides for different platforms

---

This specification serves as the authoritative guide for the Conejo Negro POS System development and maintenance. It should be updated as the project evolves to reflect current architecture, features, and standards.