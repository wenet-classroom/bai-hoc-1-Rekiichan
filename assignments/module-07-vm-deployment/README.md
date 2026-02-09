# Module 07: VM Deployment

## Learning Objectives
- Deploy containerized apps to remote VMs
- Use production Docker Compose configuration
- Write deployment automation scripts
- Monitor deployed applications

## Prerequisites
- Completed Modules 01-06
- SSH access to a VM (or local testing)

## Assignment

Create deployment configuration:
1. Production docker-compose override file
2. Deployment script with SSH commands
3. Environment variable management
4. Health check validation after deploy

## Getting Started
```bash
cd assignments/module-07-vm-deployment/starter
# Complete TODOs in deploy.sh and docker-compose.prod.yml
```

## Success Criteria
- [ ] deploy.sh is executable and contains Docker commands
- [ ] docker-compose.prod.yml has production settings
- [ ] Resource limits configured
- [ ] Environment variables managed securely
- [ ] Post-deploy health check included

## Hints

<details>
<summary>Hint 1: Deploy Command</summary>
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
</details>

<details>
<summary>Hint 2: Health Check</summary>
curl -f http://localhost:3000/health || exit 1
</details>
