# Module 06: Complete CI/CD Pipeline

## Learning Objectives
- Build end-to-end CI/CD pipelines
- Chain multiple jobs with dependencies
- Build and tag Docker images in CI
- Implement conditional deployment

## Prerequisites
- Completed Module 05
- Understanding of Docker build and push

## Assignment

Create a complete pipeline workflow that:
1. Tests code on every push
2. Builds Docker images after tests pass
3. Tags images with git SHA
4. Deploys only on main branch pushes

## Getting Started
```bash
cd assignments/module-06-complete-pipeline/starter
# Complete TODOs in pipeline.yml
```

## Success Criteria
- [ ] Valid YAML with proper structure
- [ ] Test job runs first
- [ ] Build job depends on test
- [ ] Deploy job depends on build
- [ ] Deploy only runs on main branch
- [ ] Docker images tagged with git SHA

## Hints

<details>
<summary>Hint 1: Job Dependencies</summary>
needs: [test] makes a job wait for another
</details>

<details>
<summary>Hint 2: Conditional Deploy</summary>
if: github.ref == 'refs/heads/main'
</details>

<details>
<summary>Hint 3: Git SHA Tag</summary>
docker build -t myapp:${{ github.sha }} .
</details>
