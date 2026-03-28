# KARA TOONE CAMPAIGN — BUILD QUEUE

## How This Works

This folder contains numbered task files. Each file is ONE focused module for Claude Code.

### Rules for Claude Code:
1. Pick up the NEXT numbered task (lowest number not marked DONE)
2. Read ONLY that file — ignore the others
3. Complete the task fully
4. Update BUILD-STATUS.json with your progress
5. Commit with message: `build: complete task XX — [description]`
6. Move to the next task

### Rules for Scott (Human):
- Tasks marked 🧑 HUMAN require your input before Claude Code can proceed
- Check NEEDS-FROM-SCOTT.md for any blockers
- Check BUILD-STATUS.json for current progress
- Feed Claude Code ONE task at a time: `cat tasks/XX-task-name.md | npx @anthropic-ai/claude-code`

### Task Status Legend:
- ⬜ TODO — Not started
- 🔨 IN PROGRESS — Claude Code is working on it
- ✅ DONE — Complete and committed
- 🧑 HUMAN — Waiting on Scott
- ❌ BLOCKED — Dependency not met

## Priority Order:
Tasks 01-08: MUST SHIP BY TUESDAY (invoice depends on it)
Tasks 09-15: SHIP THIS WEEK (makes her jaw drop)
Tasks 16-25: ONGOING THROUGH JUNE (the winning machine)
