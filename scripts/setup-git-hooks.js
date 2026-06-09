// Point git at the committed hooks directory so the pre-push secret scan
// runs for every clone. Safe to no-op outside a git checkout (e.g., CI builds).
const { execSync } = require("child_process");

try {
  execSync("git config core.hooksPath .githooks", { stdio: "ignore" });
} catch {
  // not a git repo or git unavailable — nothing to do
}
