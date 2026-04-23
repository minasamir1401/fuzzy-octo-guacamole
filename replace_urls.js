const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const apiUrl = 'http://localhost:5000';
const replacement = '${API_URL}';
const importLine = 'import { API_URL } from "@/config/api";';

function walk(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            walk(filePath);
        } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
            if (filePath.endsWith('api.ts')) return;
            
            let content = fs.readFileSync(filePath, 'utf8');
            let updated = false;

            // Replace URLs if any left (though most should be replaced by now)
            if (content.includes(apiUrl)) {
                content = content.split(apiUrl).join(replacement);
                updated = true;
            }

            // Ensure import is present and in correct position
            if (!content.includes('import { API_URL }')) {
                if (content.startsWith('"use client"') || content.startsWith("'use client'")) {
                    const lines = content.split('\n');
                    lines.splice(1, 0, importLine);
                    content = lines.join('\n');
                } else {
                    content = importLine + '\n' + content;
                }
                updated = true;
            } else {
                // If import exists but is BEFORE "use client", fix it
                if (content.indexOf(importLine) < content.indexOf('"use client"')) {
                    content = content.replace(importLine + '\n', '');
                    content = content.replace(importLine, '');
                    const lines = content.split('\n');
                    lines.splice(1, 0, importLine);
                    content = lines.join('\n');
                    updated = true;
                }
            }
            
            if (updated) {
                console.log(`Fixing ${filePath}`);
                fs.writeFileSync(filePath, content);
            }
        }
    });
}

walk(srcDir);
console.log('Done!');
