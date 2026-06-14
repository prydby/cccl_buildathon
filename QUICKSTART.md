# Claude Code Terminal → GitHub: Simple English Guide

## What is Claude Code?

Claude Code is like having Claude inside your terminal. Instead of chatting on a website, you type in your terminal and Claude can actually create files, run commands, and build your project directly on your computer. No copy-pasting artifacts.

---

## Step 0: Check if You Have Everything

Open your Mac terminal (Cmd + Space → type "Terminal" → Enter) and run these one by one:

```bash
node --version
```
Should show v18 or higher. If not, install Node: https://nodejs.org

```bash
npm --version
```
Should show a number. Comes with Node.

```bash
git --version
```
Should show a version. If not: `xcode-select --install`

```bash
gh --version
```
This is GitHub CLI. If not installed:
```bash
brew install gh
```
(If you don't have brew: https://brew.sh)

---

## Step 1: Install Claude Code

```bash
npm install -g @anthropic-ai/claude-code
```

This installs the `claude` command globally on your machine.

---

## Step 2: Authenticate Claude Code

```bash
claude
```

First time you run it, it opens your browser to log in. 

**You have two options:**
- **Option A: Use your Claude Pro/Max subscription** — log in with your Gmail that has the subscription
- **Option B: Use API key** — if you have API credits on console.anthropic.com

If using API key, set it before running claude:
```bash
export ANTHROPIC_API_KEY="sk-ant-your-key-here"
```

After auth, you'll see a prompt like:
```
claude >
```

That's it. You're in. Type `/exit` to leave for now.

---

## Step 3: Set Up Your Project Folder

```bash
cd ~/kiro_priyaay/cccl_buildathon
```

This is where all your agent files already live (the ones we created earlier).

---

## Step 4: Initialize Git (one time)

```bash
git init
git add .
git commit -m "chore: initial workspace setup with Claude Code agents"
```

This creates a local git repository. Nothing goes to the internet yet.

---

## Step 5: Create a GitHub Repo

First, log into GitHub CLI:
```bash
gh auth login
```
- Choose: GitHub.com
- Choose: HTTPS
- Choose: Login with a web browser
- It opens your browser, you log in with your GitHub account

Then create the repo:
```bash
gh repo create seven-dimension-scorer --public --source=. --remote=origin --push
```

This does three things:
1. Creates a new repo called "seven-dimension-scorer" on your GitHub
2. Connects your local folder to it
3. Pushes your current files up

---

## Step 6: Run Claude Code with the Orchestrator

Now the fun part. Start Claude Code as the orchestrator agent:

```bash
claude --agent orchestrator
```

You'll see Claude's prompt. Type:

```
build it
```

Then sit back. Claude will:
- Create all the project files
- Install dependencies (npm install)
- Build the app
- Tell you when each phase is done

**What you'll see:**
- File creation happening in real-time
- Terminal commands running (npm install, etc.)
- Status updates after each phase
- Permission prompts (say "y" or press Enter to allow)

**If Claude asks permission:**
- "Allow write to src/engine/dimensions.js?" → Type `y`
- "Allow bash: npm install?" → Type `y`
- Or run with auto-approve: `claude --agent orchestrator --dangerously-skip-permissions`
  (Only use this if you trust the agent — it skips all permission prompts)

---

## Step 7: After Build Completes — Push to GitHub

Once Claude says "SHIPPED" or finishes all phases:

```bash
git add .
git commit -m "feat: DimensionScore — seven-dimension product evaluation tool"
git push origin main
```

That's it. Your code is on GitHub.

---

## Step 8: Check Your Work

Go to: `https://github.com/YOUR_USERNAME/seven-dimension-scorer`

You should see all your files there.

To run the app locally:
```bash
npm run dev
```
Opens in your browser at http://localhost:5173

---

## Common Issues & Fixes

### "command not found: claude"
```bash
npm install -g @anthropic-ai/claude-code
```
Then close and reopen terminal.

### "permission denied" errors
Claude Code needs to run commands and write files. Either:
- Say "y" to each permission prompt, OR
- Add to `.claude/settings.json` (already done in your project):
```json
{
  "permissions": {
    "allow": ["Bash(npm:*)", "Bash(node:*)", "Bash(git:*)"]
  }
}
```

### "ANTHROPIC_API_KEY not set"
```bash
export ANTHROPIC_API_KEY="sk-ant-api03-your-key-here"
```
Get your key from: https://console.anthropic.com/settings/keys

### Claude seems stuck or slow
- Press `Ctrl+C` to interrupt
- Type `/clear` to reset the conversation
- Try again with a simpler command

### "git push rejected"
```bash
git pull origin main --rebase
git push origin main
```

### Build fails with npm errors
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## Quick Reference — Commands You'll Use

| What | Command |
|---|---|
| Start Claude Code | `claude` |
| Start with orchestrator agent | `claude --agent orchestrator` |
| Stop Claude Code | `/exit` or `Ctrl+C` twice |
| Clear conversation | `/clear` |
| Check costs | `/cost` |
| See what Claude built | `ls src/` |
| Run the app | `npm run dev` |
| Build for production | `npm run build` |
| Save progress to git | `git add . && git commit -m "message"` |
| Push to GitHub | `git push origin main` |
| See git status | `git status` |
| See git history | `git log --oneline` |

---

## The Entire Flow in 10 Commands

```bash
# 1. Go to your project
cd ~/kiro_priyaay/cccl_buildathon

# 2. Init git (if not done)
git init && git add . && git commit -m "chore: initial setup"

# 3. Create GitHub repo
gh auth login
gh repo create seven-dimension-scorer --public --source=. --remote=origin --push

# 4. Set your API key (if using API credits, not Pro subscription)
export ANTHROPIC_API_KEY="sk-ant-your-key"

# 5. Launch the build
claude --agent orchestrator

# 6. (Inside Claude) Type:
# build it

# 7. Wait for it to finish. Then exit:
# /exit

# 8. Commit and push the built project
git add .
git commit -m "feat: DimensionScore — complete build"
git push origin main

# 9. Run locally to verify
npm run dev

# 10. Done. Check github.com/YOUR_USERNAME/seven-dimension-scorer
```

---

## What if I Can't Use Claude Code?

If your personal account doesn't have Claude Code access (it requires Pro, Max, or API), you can still use the Claude.ai web approach described in `CLAUDE_WEB_GUIDE.md`. The difference:
- Web: Claude generates code as text → you copy-paste into files manually
- CLI: Claude writes files directly on your computer → zero copy-paste

Both end up at the same place: files on your machine → git push → GitHub.
