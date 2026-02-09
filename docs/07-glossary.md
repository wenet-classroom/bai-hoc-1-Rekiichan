# Glossary

| Term | Definition |
|------|-----------|
| **Container** | Lightweight, isolated runtime environment for an application |
| **Image** | Read-only template used to create containers |
| **Dockerfile** | Text file with instructions to build a Docker image |
| **Layer** | Each instruction in a Dockerfile creates a cached layer |
| **Volume** | Persistent storage that survives container restarts |
| **Bind Mount** | Maps a host directory into a container |
| **Network** | Virtual network allowing container communication |
| **Registry** | Storage and distribution service for images (e.g., Docker Hub) |
| **Docker Compose** | Tool for defining multi-container applications in YAML |
| **Service** | A container definition in docker-compose.yml |
| **Multi-stage Build** | Dockerfile technique using multiple FROM statements to create smaller images |
| **Alpine** | Minimal Linux distribution commonly used as base image (~5MB) |
| **Health Check** | Command Docker runs to verify container is working |
| **CI** | Continuous Integration - automatically test/build on every code change |
| **CD** | Continuous Delivery/Deployment - automatically deploy tested code |
| **Pipeline** | Sequence of automated steps (test, build, deploy) |
| **Workflow** | GitHub Actions automation defined in YAML |
| **Job** | Set of steps in a workflow running on one machine |
| **Step** | Individual task within a job |
| **Action** | Reusable workflow component (e.g., actions/checkout) |
| **Trigger** | Event that starts a workflow (push, pull_request) |
| **Artifact** | File produced by a build (e.g., Docker image, test report) |
| **Environment Variable** | Configuration value passed to a container at runtime |
| **Port Mapping** | Connecting a host port to a container port (-p 8080:3000) |
| **EXPOSE** | Dockerfile instruction documenting which port an app uses |
| **CMD** | Default command run when a container starts |
| **ENTRYPOINT** | Fixed command that always runs (CMD provides default arguments) |
| **Build Context** | Files sent to Docker daemon during build |
| **.dockerignore** | File listing patterns to exclude from build context |
| **Tag** | Version label for an image (e.g., node:20-alpine) |
| **Pull** | Download an image from a registry |
| **Push** | Upload an image to a registry |
| **Orchestration** | Managing multiple containers as a unified application |
| **Scaling** | Running multiple instances of a service |
| **Load Balancing** | Distributing traffic across multiple container instances |
| **Secret** | Sensitive configuration (passwords, API keys) |
| **SSH** | Secure Shell - protocol for remote server access |
| **VM** | Virtual Machine - full operating system virtualization |
| **Deployment** | Process of releasing application to production |
