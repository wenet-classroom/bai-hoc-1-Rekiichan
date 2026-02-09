#!/bin/bash
set -e

echo "Testing Module 04: Multi-stage Builds"

echo "Checking Dockerfile.backend exists..."
[ -f "starter/Dockerfile.backend" ] || { echo "FAILED: Dockerfile.backend not found"; exit 1; }

echo "Checking Dockerfile.frontend exists..."
[ -f "starter/Dockerfile.frontend" ] || { echo "FAILED: Dockerfile.frontend not found"; exit 1; }

echo "Checking for multi-stage (multiple FROM)..."
BE_STAGES=$(grep -c "^FROM" starter/Dockerfile.backend || true)
FE_STAGES=$(grep -c "^FROM" starter/Dockerfile.frontend || true)

[ "$BE_STAGES" -ge 2 ] || { echo "FAILED: Backend needs multiple stages (found $BE_STAGES)"; exit 1; }
[ "$FE_STAGES" -ge 2 ] || { echo "FAILED: Frontend needs multiple stages (found $FE_STAGES)"; exit 1; }

echo "Checking for non-root user in backend..."
grep -q "USER" starter/Dockerfile.backend || echo "WARNING: No USER instruction in backend"

echo "Checking for HEALTHCHECK..."
grep -q "HEALTHCHECK" starter/Dockerfile.backend || echo "WARNING: No HEALTHCHECK in backend"

echo "PASSED: Multi-stage Dockerfiles validated"
echo "  Backend stages: $BE_STAGES"
echo "  Frontend stages: $FE_STAGES"
exit 0
