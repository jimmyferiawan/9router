const fs = require('fs');
const path = require('path');

// Daftar copy mapping disesuaikan persis dari Dockerfile
const copyTasks = [
  // COPY --from=builder /app/.next/standalone ./
  { src: '.next/standalone', dest: 'standalone' },

  // COPY --from=builder /app/public ./public
  { src: 'public', dest: 'standalone/public' },

  // COPY --from=builder /app/.next/static ./.next/static
  { src: '.next/static', dest: 'standalone/.next/static' },

  // COPY --from=builder /app/custom-server.js ./custom-server.js
  { src: 'custom-server.js', dest: 'standalone/custom-server.js', optional: true },

  // COPY --from=builder /app/open-sse ./open-sse
  { src: 'open-sse', dest: 'standalone/open-sse', optional: true },

  // COPY --from=builder /app/src/mitm ./src/mitm
  { src: 'src/mitm', dest: 'standalone/src/mitm', optional: true },

  // Standalone node_modules dependencies
  { src: 'node_modules/node-forge', dest: 'standalone/node_modules/node-forge' },
  { src: 'node_modules/next', dest: 'standalone/node_modules/next' },
{ src: 'node_modules/sql.js', dest: 'standalone/node_modules/sql.js' },
  { src: 'node_modules/node-machine-id', dest: 'standalone/node_modules/node-machine-id' },
];

for (const task of copyTasks) {
  const srcPath = path.resolve(task.src);
  const destPath = path.resolve(task.dest);

  if (fs.existsSync(srcPath)) {
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.cpSync(srcPath, destPath, { recursive: true, force: true });
    console.log(`[COPY OK] ${task.src} -> ${task.dest}`);
  } else if (!task.optional) {
    console.warn(`[WARN] Sumber tidak ditemukan: ${task.src}`);
  }
}