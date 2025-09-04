# Claude Flow - POS Conejo Negro

## Overview
This directory contains the Claude Flow configuration for the POS Conejo Negro project, implementing a Task Master architecture pattern for scalable development.

## Architecture: Task Master
The Task Master architecture emphasizes:
- **Separation of Concerns**: Clear separation between models, views, and controllers
- **Modular Design**: Each component has a single, well-defined responsibility
- **Scalable Structure**: Easy to extend and maintain as the project grows
- **Consistent Patterns**: Standardized approaches to common development tasks

## Configuration Files

### `config.json`
Main project configuration including:
- Project metadata and version info
- Framework and environment settings
- Security and feature configurations
- Task Master architecture settings

### `flow.yaml`
Development workflow definitions:
- Common development commands
- Task Master patterns and guidelines
- Project context and business logic
- Coding standards and best practices

### `dev-env.json`
Development environment setup:
- Quick command shortcuts
- Port configurations
- Environment variable requirements
- File structure mapping
- Task Master context definitions

## Quick Start Commands

### Development
```bash
# Start development server (runs in background)
npm run dev

# Run tests
npm test

# Install dependencies
npm install
```

### Project Structure
Following Task Master patterns:
- `/routes/` - API endpoint definitions
- `/models/` - Database schemas and models
- `/middleware/` - Cross-cutting concerns
- `/controllers/` - Business logic handlers
- `/utils/` - Utility functions
- `/tests/` - Test suites

## Development Workflow

1. **Feature Development**:
   - Create API routes in `/routes/`
   - Implement controllers for business logic
   - Add middleware for validation/auth
   - Write comprehensive tests
   - Update documentation

2. **Database Changes**:
   - Design Mongoose schemas in `/models/`
   - Add proper validation rules
   - Create model methods and statics
   - Test database operations
   - Update related controllers

3. **Deployment**:
   - Run local tests
   - Commit to version control
   - Push to main branch
   - Monitor Render.com deployment
   - Verify production functionality

## Task Master Context Areas

1. **POS System Operations**: Sales, inventory, user management, reporting
2. **Technical Architecture**: Express.js, MongoDB, JWT authentication
3. **Business Logic**: Product management, order processing, permissions

## Security Features
- JWT authentication with bcryptjs password hashing
- Helmet.js security headers
- CORS protection
- Rate limiting
- Input validation and sanitization

## Environment Variables Required
- `MONGODB_URI`: Database connection string
- `JWT_SECRET`: Secret for JWT token generation
- `SESSION_SECRET`: Session management secret
- `NODE_ENV`: Environment mode (development/production)
- `PORT`: Server port (default: 3000)

## Getting Help
This Claude Flow setup is designed to work with the Task Master architecture. All development should follow the patterns and guidelines defined in the flow configuration files.
