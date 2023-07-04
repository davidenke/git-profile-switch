import { join } from 'node:path';

export function prepareBinaryPath(dist: string, name: string): string {
  return join(dist, name, `${name}-mac_universal`);
}

export function getBinaryLauncher(name: string): string {
  return `#!/bin/bash
SCRIPT_DIR="$(cd -- "$(dirname -- "\${BASH_SOURCE[0]}")" &> /dev/null && pwd)"
CONTENTS_DIR="$(dirname "$SCRIPT_DIR")"
exec "\${SCRIPT_DIR}/${name}" --path="\${CONTENTS_DIR}/Resources"
`;
}
