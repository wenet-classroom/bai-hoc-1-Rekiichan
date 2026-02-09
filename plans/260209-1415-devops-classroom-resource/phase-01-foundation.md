# Phase 01: Project Foundation & Structure

**Context Links**: [Plan Overview](plan.md)

## Overview

**Date**: 2026-02-09
**Description**: Establish project structure, skeleton code, and documentation framework
**Priority**: P1 (Critical - Foundation for all phases)
**Implementation Status**: ⬜ Pending
**Review Status**: ⬜ Not Started
**Estimated Effort**: 2h

## Key Insights

- Repository must work as both: complete reference implementation + starter template for students
- Clear separation between instructor solution and student starter code
- GitHub Classroom expects specific directory structure for auto-grading
- Documentation must be progressive (basic → advanced) to match learning curve

## Requirements

### Functional Requirements
- Complete directory structure for full-stack application
- Package manifests (package.json for backend/frontend)
- Basic README with setup instructions
- Git repository initialization with proper .gitignore
- Environment variable templates

### Non-Functional Requirements
- Clean, organized structure easy for beginners to understand
- Consistent naming conventions (kebab-case)
- Scalable structure supporting future enhancements
- GitHub Classroom compatible structure

## Architecture

### Repository Structure
```
classroom-mvp/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── models/
│   │   └── index.js
│   ├── tests/
│   ├── package.json
│   ├── .env.example
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   ├── .env.example
│   └── README.md
├── docs/
│   ├── 00-getting-started.md
│   ├── 01-docker-basics.md
│   ├── 02-cicd-introduction.md
│   ├── 03-troubleshooting.md
│   └── 04-best-practices.md
├── assignments/
│   ├── module-01-dockerize-backend/
│   ├── module-02-dockerize-frontend/
│   ├── module-03-docker-compose/
│   ├── module-04-multi-stage-builds/
│   ├── module-05-basic-ci/
│   ├── module-06-complete-pipeline/
│   └── module-07-vm-deployment/
├── .github/
│   ├── workflows/
│   │   └── classroom.yml (placeholder)
│   └── classroom/
│       └── autograding.json (placeholder)
├── .gitignore
├── README.md
├── docker-compose.yml (created in Phase 04)
└── LICENSE
```

## Related Code Files

### Files to Create
- `README.md` - Main project documentation
- `.gitignore` - Git ignore patterns
- `backend/package.json` - Backend dependencies manifest
- `backend/.env.example` - Backend environment template
- `backend/README.md` - Backend-specific documentation
- `frontend/package.json` - Frontend dependencies manifest
- `frontend/.env.example` - Frontend environment template
- `frontend/README.md` - Frontend-specific documentation
- `frontend/vite.config.js` - Vite configuration
- `docs/00-getting-started.md` - Initial setup guide
- `LICENSE` - MIT License
- `.github/workflows/classroom.yml` - Placeholder for auto-grading

### Files to Modify
None (new project)

## Implementation Steps

### Step 1: Initialize Git Repository
```bash
cd /home/rekii/workspace/classroom-mvp
git init
```

### Step 2: Create Directory Structure
```bash
mkdir -p backend/src/{config,routes,controllers,models}
mkdir -p backend/tests
mkdir -p frontend/src/{components,services}
mkdir -p frontend/public
mkdir -p docs
mkdir -p assignments/{module-01-dockerize-backend,module-02-dockerize-frontend,module-03-docker-compose,module-04-multi-stage-builds,module-05-basic-ci,module-06-complete-pipeline,module-07-vm-deployment}
mkdir -p .github/{workflows,classroom}
```

### Step 3: Create .gitignore
```gitignore
# Dependencies
node_modules/
npm-debug.log
yarn-error.log

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Build outputs
dist/
build/
*.log

# Docker
*.log

# Coverage
coverage/
.nyc_output/
```

### Step 4: Create Backend package.json
```json
{
  "name": "classroom-mvp-backend",
  "version": "1.0.0",
  "description": "Backend API for DevOps classroom teaching resource",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "test": "jest"
  },
  "keywords": ["devops", "docker", "express", "postgresql"],
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.3",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "nodemon": "^3.0.2",
    "jest": "^29.7.0",
    "supertest": "^6.3.3"
  }
}
```

### Step 5: Create Frontend package.json
```json
{
  "name": "classroom-mvp-frontend",
  "version": "1.0.0",
  "description": "Frontend UI for DevOps classroom teaching resource",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.6.2"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.8",
    "vitest": "^1.0.4"
  }
}
```

### Step 6: Create Environment Templates
**backend/.env.example**:
```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=classroom_db
DB_USER=postgres
DB_PASSWORD=postgres
```

**frontend/.env.example**:
```env
VITE_API_URL=http://localhost:3000
```

### Step 7: Create Main README.md
See detailed content in implementation.

### Step 8: Create LICENSE
```
MIT License
```

### Step 9: Initialize Git with First Commit
```bash
git add .
git commit -m "chore: initialize project structure"
```

## Todo List

- [ ] Create directory structure
- [ ] Initialize git repository
- [ ] Create .gitignore
- [ ] Create backend/package.json
- [ ] Create frontend/package.json
- [ ] Create backend/.env.example
- [ ] Create frontend/.env.example
- [ ] Create backend/README.md
- [ ] Create frontend/README.md
- [ ] Create main README.md
- [ ] Create LICENSE
- [ ] Create docs/00-getting-started.md placeholder
- [ ] Create .github/workflows/classroom.yml placeholder
- [ ] Create vite.config.js for frontend
- [ ] Initial git commit

## Success Criteria

✅ All directories created
✅ Package manifests valid and parseable
✅ Environment templates complete
✅ Git repository initialized
✅ README provides clear setup instructions
✅ Structure matches GitHub Classroom requirements
✅ No syntax errors in configuration files

## Risk Assessment

**Low Risk**: Standard project initialization
- **Potential Issue**: Incorrect directory structure for GitHub Classroom
- **Mitigation**: Follow GitHub Classroom documentation structure

## Security Considerations

- `.env` files excluded from git via .gitignore
- `.env.example` contains no real credentials
- MIT License allows educational use

## Next Steps

→ Proceed to Phase 02: Backend API Implementation
- Dependency: Foundation structure complete
- Build REST API on top of established structure
