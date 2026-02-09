# Research: GitHub Classroom Auto-grading & CI/CD Teaching

## Executive Summary
GitHub Classroom auto-grading automates test execution on every student push via .github/workflows/classroom.yml. Key teaching strategy: start simple (input/output tests), progress to custom GitHub Actions (Docker validation), then advanced (SSH deployment testing).

## GitHub Classroom Auto-grading Setup

### Configuration Approach
- **Workflow File**: `.github/workflows/classroom.yml` auto-generated when enabling auto-grading
- **Three Test Types**: Input/output tests (simplest), Python tests, custom run commands
- **Execution**: Runs on every push in Linux environment; teacher can configure schedule
- **UI Setup**: Enable in assignment settings → Add test → Select type
- **Custom YAML**: Edit workflow directly for Docker-specific tests

### Key Implementation Points
- Auto-grading applies to ALL student repositories created from assignment
- Tests run in isolated Linux containers (security + consistency)
- Output captured to disk for assessment phase
- Avoid relying solely on automation—pair with feedback mechanisms

## Docker Testing in GitHub Actions

### Best Practices for Beginners
1. **Start Simple**: Basic `docker build` validation before running tests
2. **Use Services**: Spin up containers as dependencies (databases, APIs)
3. **Cache Layers**: Cache Docker images to reduce CI runtime
4. **Secrets Management**: Use GitHub Secrets for credentials, never embed in layers

### Testing Strategies
- Run unit tests early in pipeline (separate job)
- Validate container startup health (curl endpoint checks)
- Use docker-compose for multi-container validation
- Capture output for grading feedback

## Automated Feedback for Common Docker Mistakes

### Implementation Pattern
- Run student's Dockerfile: `docker build -t student-app .`
- Validate image exists and starts: `docker run --rm student-app /bin/sh -c "exit 0"`
- Check exposed ports: `docker inspect student-app | grep -i port`
- Test API endpoints: `curl -f http://localhost:8080/health || exit 1`
- Provide granular feedback on STDOUT (fails fast on first error)

### Common Issues to Catch
- Missing EXPOSE statements → explain port requirements
- Non-root user missing → security feedback
- Docker Compose syntax errors → validate compose file before running
- No health checks → template for improvement
- Hardcoded credentials → security warning

## SSH Deployment Testing

### Validation in GitHub Actions
- Use marketplace actions: docker-compose-deploy-ssh, SSH-Compose
- SSH keys stored in GitHub Secrets
- Workflow: Copy docker-compose.yml → SSH connect → Run `docker-compose up`
- Validate container running: `docker ps` check or health endpoint
- Typical flow: build image → push registry → deploy via SSH → verify running

### Teaching Progressive Complexity
1. **Module 1-2**: Validate Dockerfile builds locally
2. **Module 3-4**: GitHub Actions validates docker build
3. **Module 5-6**: docker-compose validation + local service startup
4. **Module 7**: SSH deployment + health check validation

## Modular Assignment Structure Recommendations

| Module | Test Type | Validation |
|--------|-----------|------------|
| 1 | Run command | `docker build` succeeds |
| 2 | Custom script | Image runs without errors |
| 3 | docker-compose | Services start, ports exposed |
| 4 | Health check | API responds to requests |
| 5 | Integration | Multiple containers coordinate |
| 6 | SSH deploy | Deployment to VM succeeds |
| 7 | System test | End-to-end deployment validation |

## Key Findings

**Strengths**:
- GitHub Classroom handles workflow setup automatically
- Docker provides consistent, isolated testing environments
- GitHub Actions marketplace has pre-built SSH deployment actions
- Progressive complexity naturally maps to 7-module structure

**Teaching Gaps to Address**:
- Automated feedback alone insufficient—pair with human review for complex assignments
- Documentation quality critical for student success
- Need clear error messages at each test stage

## Implementation Approach Summary

1. **Phases 1-2**: Use GitHub Classroom's input/output tests (UI config)
2. **Phases 3-4**: Custom `docker build` + `docker run` validation via run commands
3. **Phases 5-6**: Custom Actions for docker-compose validation + API testing
4. **Phase 7**: SSH deployment action + health endpoint verification

Each phase provides working examples + helpful failure feedback.

---

## Sources

- [GitHub Docs: Use Autograding](https://docs.github.com/en/education/manage-coursework-with-github-classroom/teach-with-github-classroom/use-autograding)
- [GitHub Blog: Teacher Toolbox & Autograding](https://github.blog/developer-skills/github/github-teacher-toolbox-and-classroom-with-autograding/)
- [Docker Docs: GitHub Actions](https://docs.docker.com/build/ci/github-actions/)
- [How to Build CI/CD Pipeline with GitHub Actions & Docker](https://runcloud.io/blog/setup-docker-github-actions-ci-cd)
- [Beginner's Journey into CI/CD & Docker](https://medium.com/@aayushisinha702/my-journey-into-ci-cd-docker-and-github-workflows-as-a-beginner-744a537429ae)
- [Docker Assignment Evaluation Research](https://www.sciencedirect.com/science/article/pii/S1877705815005688)
- [Docker Compose SSH Deployment Actions](https://github.com/marketplace/actions/docker-compose-deployment-ssh)
- [GitHub Actions SSH Docker Compose Docs](https://docs.servicestack.net/ssh-docker-compose-deploment)
- [Continuous Deployment with GitHub Actions & Docker Compose](https://aaronstannard.com/docker-compose-tailscale/)
