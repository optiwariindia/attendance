const fs = require('fs');
const path = require('path');

const targets = [
  path.join(__dirname, 'node_modules', 'react-dev-utils', 'checkRequiredFiles.js')
];

for (const target of targets) {
  if (fs.existsSync(target)) {
    let content = fs.readFileSync(target, 'utf8');
    if (content.includes('fs.F_OK')) {
      content = content.replace(/fs\.F_OK/g, 'fs.constants.F_OK');
      fs.writeFileSync(target, content, 'utf8');
      console.log(`[Patch] Successfully replaced fs.F_OK with fs.constants.F_OK in ${target}`);
    }
  } else {
    console.log(`[Patch] Target file not found: ${target}`);
  }
}
