# HOW TO FEED CLAUDE CODE — One Task at a Time

## Setup (do once)
```bash
# On Mac Studio, copy this entire kara-build-queue folder into the repo
cp -r ~/kara-build-queue ~/kara-toone-campaign/build-queue/

cd ~/kara-toone-campaign
```

## Running a Task
```bash
# Feed ONE task at a time. Never paste multiple.
cat build-queue/tasks/01-fix-forms.md | npx @anthropic-ai/claude-code

# When it finishes and commits, feed the next one:
cat build-queue/tasks/02-fix-photos.md | npx @anthropic-ai/claude-code

# And so on...
```

## Quick Status Check
```bash
# See what Claude Code has done
cat build-queue/BUILD-STATUS.json | python3 -m json.tool

# See git log of completed tasks
git log --oneline -20
```

## If Claude Code Gets Confused
```bash
# Kill it and restart with the SAME task file
# Don't skip ahead — finish the current task first
cat build-queue/tasks/XX-current-task.md | npx @anthropic-ai/claude-code
```

## If You're Away (Overnight Mode)
```bash
# Create a simple loop that feeds tasks sequentially
# But honestly — just feed them one at a time when you check in
# Claude Code does better with human checkpoints between tasks
```

## Golden Rules
1. ONE file at a time
2. Let it finish and commit before feeding the next
3. Check the output before moving on
4. Tasks 01-08 must be done before Tuesday
5. Tasks with 🧑 HUMAN need your input first — skip and come back
