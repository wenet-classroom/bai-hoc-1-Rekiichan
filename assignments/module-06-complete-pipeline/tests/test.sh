#!/bin/bash
set -e

echo "Testing Module 06: Complete Pipeline"

FILE="starter/pipeline.yml"
[ -f "$FILE" ] || { echo "FAILED: pipeline.yml not found"; exit 1; }

python3 -c "
import yaml, sys
with open('$FILE') as f:
    data = yaml.safe_load(f)
if 'jobs' not in data:
    sys.exit('FAILED: Missing jobs')
jobs = data['jobs']
required = ['test', 'build', 'deploy']
for r in required:
    found = any(r in k.lower() for k in jobs.keys())
    if not found:
        print(f'WARNING: No job matching \"{r}\"')
content = str(data).lower()
if 'docker' not in content:
    print('WARNING: No Docker references found')
print('PASSED: Pipeline structure validated')
print(f'  Jobs: {list(jobs.keys())}')
" || { echo "FAILED: Invalid YAML"; exit 1; }

exit 0
