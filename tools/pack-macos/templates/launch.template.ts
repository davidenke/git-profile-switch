export function generateLauncher(name: string): string {
  return `#!/bin/bash
SCRIPT_DIR="$(cd -- "$(dirname -- "\${BASH_SOURCE[0]}")" &> /dev/null && pwd)"
CONTENTS_DIR="$(dirname "$SCRIPT_DIR")"
exec "\${SCRIPT_DIR}/${name}" --path="\${CONTENTS_DIR}/Resources"
`;
}
