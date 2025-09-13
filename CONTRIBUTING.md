# Contributing to Conejo Negro POS System

First off, thank you for considering contributing to the Conejo Negro POS System! It's people like you that make this project a great tool for café management.

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report. Following these guidelines helps maintainers and the community understand your report, reproduce the behavior, and find related reports.

**Before Submitting A Bug Report:**
- Check if you can reproduce the problem
- Check if the bug has already been reported by searching existing [Issues](../../issues)

**How Do I Submit A (Good) Bug Report?**

Bugs are tracked as [GitHub issues](../../issues). Use the bug report template when creating an issue and provide the following information:

- Use a clear and descriptive title
- Describe the exact steps which reproduce the problem
- Provide specific examples to demonstrate the steps
- Describe the behavior you observed after following the steps
- Explain which behavior you expected to see instead and why
- Include screenshots if applicable
- Include relevant log output

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion, including completely new features and minor improvements to existing functionality.

**Before Submitting An Enhancement Suggestion:**
- Check if there's already a similar suggestion
- Determine which component the enhancement should affect

**How Do I Submit A (Good) Enhancement Suggestion?**

Enhancement suggestions are tracked as [GitHub issues](../../issues). Use the feature request template and provide the following information:

- Use a clear and descriptive title
- Provide a step-by-step description of the suggested enhancement
- Provide specific examples to demonstrate the enhancement
- Describe the current behavior and explain which behavior you expected to see instead
- Explain why this enhancement would be useful to most users

### Your First Code Contribution

Unsure where to begin contributing? You can start by looking through these beginner and help-wanted issues:

- `good first issue` - issues which should only require a few lines of code
- `help wanted` - issues which should be a bit more involved

### Pull Requests

The process described here has several goals:

- Maintain the project's quality
- Fix problems that are important to users
- Engage the community in working toward the best possible POS system

Please follow these steps to have your contribution considered by the maintainers:

1. Follow the [styleguides](#styleguides)
2. Follow the pull request template
3. After you submit your pull request, verify that all [status checks](https://help.github.com/articles/about-status-checks/) are passing

## Styleguides

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line
- Consider starting the commit message with an applicable emoji:
  - 🎨 `:art:` when improving the format/structure of the code
  - 🐎 `:racehorse:` when improving performance
  - 📝 `:memo:` when writing docs
  - 🐛 `:bug:` when fixing a bug
  - 🔥 `:fire:` when removing code or files
  - 💚 `:green_heart:` when fixing the CI build
  - ✅ `:white_check_mark:` when adding tests
  - 🔒 `:lock:` when dealing with security
  - ⬆️ `:arrow_up:` when upgrading dependencies
  - ⬇️ `:arrow_down:` when downgrading dependencies

### JavaScript Styleguide

All JavaScript code must adhere to the following guidelines:

- Use 2-space indentation
- Use semicolons
- Use single quotes for strings
- No trailing whitespace
- Use meaningful variable and function names
- Comment complex logic
- Follow existing code patterns in the project

### CSS Styleguide

- Use 2-space indentation
- Use kebab-case for class names
- Use meaningful class names
- Organize styles by component
- Comment complex or non-obvious styles

### Documentation Styleguide

- Use [Markdown](https://daringfireball.net/projects/markdown/)
- Keep line length to 80 characters when possible
- Use present tense
- Use active voice
- Be concise but thorough

## Development Environment Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Setup Steps

1. **Fork and Clone the Repository**
   ```bash
   git clone https://github.com/your-username/POS-CONEJONEGRO.git
   cd POS-CONEJONEGRO
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Initialize Database**
   ```bash
   npm run setup:db
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

### Running Tests

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Run end-to-end tests
npm run test:e2e

# Run tests with coverage
npm run test:coverage
```

### Project Structure

```
├── backend/           # Backend-specific files
├── middleware/        # Express middleware
├── models/           # Database models
├── routes/           # API routes
├── utils/            # Utility functions
├── tests/            # Test files
├── public/           # Static files
├── css/              # Stylesheets
├── js/               # Client-side JavaScript
└── docs/             # Documentation
```

## Component-Specific Guidelines

### Authentication System
- Always hash passwords using bcrypt
- Use JWT tokens for session management
- Implement proper role-based access control

### Database Operations
- Use prepared statements to prevent SQL injection
- Handle database errors gracefully
- Implement proper connection pooling

### API Endpoints
- Follow RESTful conventions
- Use appropriate HTTP status codes
- Implement proper error handling
- Add input validation

### Frontend Development
- Ensure responsive design
- Implement proper error handling
- Use semantic HTML
- Follow accessibility guidelines

### Security Considerations
- Never commit sensitive information
- Validate all user inputs
- Implement rate limiting
- Use HTTPS in production
- Follow OWASP security guidelines

## Questions?

Feel free to open an issue with your question or reach out to the maintainers. We're here to help!

Thank you for contributing to the Conejo Negro POS System! 🎉