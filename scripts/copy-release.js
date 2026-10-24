const fs = require('fs');
const path = require('path');

// Daftar copy mapping disesuaikan persis dari Dockerfile
const copyTasks = [
  // COPY --from=builder /app/.next/standalone ./
  { src: '.next/standalone', dest: 'release' },

  // COPY --from=builder /app/public ./public
  { src: 'public', dest: 'release/public' },

  // COPY --from=builder /app/.next/static ./.next/static
  { src: '.next/static', dest: 'release/.next/static' },

  // COPY --from=builder /app/custom-server.js ./custom-server.js
  { src: 'custom-server.js', dest: 'release/custom-server.js', optional: true },

  // COPY --from=builder /app/open-sse ./open-sse
  { src: 'open-sse', dest: 'release/open-sse', optional: true },

  // COPY --from=builder /app/src/mitm ./src/mitm
  { src: 'src/mitm', dest: 'release/src/mitm', optional: true },

  // Standalone node_modules dependencies
  { src: 'node_modules/node-forge', dest: 'release/node_modules/node-forge' },
  { src: 'node_modules/next', dest: 'release/node_modules/next' },
  { src: 'node_modules/sql.js', dest: 'release/node_modules/sql.js' },
  { src: 'node_modules/node-machine-id', dest: 'release/node_modules/node-machine-id' },
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