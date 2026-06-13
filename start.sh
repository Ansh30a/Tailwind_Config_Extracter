#!/usr/bin/env bash
set -e

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ── Install dependencies if node_modules is missing ──────────────────────────
for dir in backend webApp; do
  if [ ! -d "$ROOT/$dir/node_modules" ]; then
    echo "📦 Installing dependencies in $dir..."
    (cd "$ROOT/$dir" && npm install)
  fi
done

# ── Start backend and webApp ──────────────────────────────────────────────────
echo ""
echo "🚀 Starting backend  →  http://localhost:5000"
echo "🚀 Starting webApp   →  http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop all services."
echo ""

trap 'kill 0' SIGINT SIGTERM

(cd "$ROOT/backend" && npm run dev) &
(cd "$ROOT/webApp"  && npm run dev) &

wait
