#!/bin/bash
set -e

echo "Testing Module 05: Basic CI"

FILE="starter/ci.yml"
[ -f "$FILE" ] || { echo "FAILED: ci.yml not found"; exit 1; }

python3 -c "
import yaml, sys
with open('$FILE') as f:
    data = yaml.safe_load(f)
if not data:
    sys.exit('FAILED: Empty YAML')
if 'on' not in data:
    sys.exit('FAILED: Missing triggers')
if 'jobs' not in data:
    sys.exit('FAILED: Missing jobs')
jobs = data['jobs']
if not jobs:
    sys.exit('FAILED: No jobs defined')
print('PASSED: CI workflow is valid')
print(f'  Triggers: {list(data[\"on\"].keys()) if isinstance(data[\"on\"], dict) else data[\"on\"]}')
print(f'  Jobs: {list(jobs.keys())}')
" || { echo "FAILED: Invalid YAML"; exit 1; }

exit 0
