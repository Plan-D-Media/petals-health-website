#!/bin/sh
# Installs the commit gate: layout-check must be green on every page before a commit is accepted.
# Run once per clone: sh app/tools/install-hooks.sh
ROOT="$(git rev-parse --show-toplevel)"
cat > "$ROOT/.git/hooks/pre-commit" <<'HOOK'
#!/bin/sh
# Commit gate (app/tools/gate.mjs): build + layout-check at 390/768/1024/1280/1366/1920 on every page. Red = no commit.
cd "$(git rev-parse --show-toplevel)/app" || exit 1
node tools/gate.mjs || { echo "pre-commit: layout-check failed; commit refused"; exit 1; }
HOOK
chmod +x "$ROOT/.git/hooks/pre-commit"
echo "pre-commit gate installed at $ROOT/.git/hooks/pre-commit"
