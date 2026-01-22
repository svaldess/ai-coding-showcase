# CLAUDE.md - AI Assistant Guide for ai-coding-showcase

> **Last Updated:** 2026-01-22
> **Repository:** ai-coding-showcase
> **Purpose:** Comprehensive guide for AI assistants working with this codebase

---

## 🎯 Repository Overview

### Current State
This is a **newly initialized showcase repository** designed to demonstrate AI-assisted coding capabilities and best practices. The repository is currently minimal and serves as a foundation for future development.

### Repository Information
- **Name:** ai-coding-showcase
- **Primary Branch:** `main`
- **Current Branch:** `claude/claude-md-mkq2aejxeaxugpwt-zNqz2`
- **Remote:** Configured with local proxy
- **Initial Commit:** 04c7b3a (2026-01-22)

### Current Structure
```
ai-coding-showcase/
├── .git/           # Git repository metadata
├── README.md       # Project README (minimal)
└── CLAUDE.md       # This file - AI assistant guide
```

---

## 📋 Development Workflow for AI Assistants

### Branch Management

#### Creating Feature Branches
1. **Always** work on feature branches, never directly on `main`
2. Branch naming convention: `claude/<descriptive-name>-<session-id>`
3. Example: `claude/add-api-endpoints-abc123xyz`

#### Branch Operations
```bash
# Create and switch to new branch
git checkout -b claude/<feature-name>-<session-id>

# Push to remote with upstream tracking
git push -u origin claude/<feature-name>-<session-id>

# CRITICAL: Branch must start with 'claude/' and include session ID
# Otherwise push will fail with 403 error
```

#### Network Resilience
- For `git push`: Retry up to 4 times with exponential backoff (2s, 4s, 8s, 16s)
- For `git fetch/pull`: Same retry strategy
- Always fetch specific branches: `git fetch origin <branch-name>`

### Commit Guidelines

#### When to Commit
- Only create commits when explicitly requested by the user
- If unclear whether to commit, **ask first**
- Avoid being overly proactive with commits

#### Commit Message Format
```
<type>: <subject>

<body - optional>

<footer - optional>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements

**Example:**
```
feat: add user authentication API

Implements JWT-based authentication with refresh tokens.
Includes middleware for protected routes.
```

#### Commit Process
1. Run `git status` to see untracked files (never use `-uall` flag)
2. Run `git diff` to see staged and unstaged changes
3. Run `git log` to understand commit message style
4. Analyze changes and draft appropriate commit message
5. Add relevant files: `git add <files>`
6. Commit with heredoc format:
   ```bash
   git commit -m "$(cat <<'EOF'
   Commit message here.
   EOF
   )"
   ```
7. Verify with `git status`

#### Git Safety Rules
- **NEVER** update git config
- **NEVER** run destructive commands (`push --force`, `reset --hard`) without explicit user request
- **NEVER** skip hooks (`--no-verify`, `--no-gpg-sign`) unless explicitly requested
- **NEVER** force push to `main` or `master`
- **AVOID** `git commit --amend` unless ALL conditions met:
  1. User explicitly requested amend, OR commit succeeded but hook auto-modified files
  2. HEAD commit was created by you in this conversation
  3. Commit has NOT been pushed to remote
- **CRITICAL:** If commit failed/rejected by hook, fix and create NEW commit (never amend)
- **NEVER** use `-i` flag (interactive mode not supported)

### Pull Request Creation

When asked to create a PR:

1. **Understand the changes** (run in parallel):
   ```bash
   git status                          # See untracked files
   git diff                           # See all changes
   git log [base-branch]...HEAD       # See all commits in PR
   git diff [base-branch]...HEAD      # See full diff
   ```

2. **Analyze ALL commits** (not just the latest)
   - Review the full commit history
   - Understand the complete scope of changes

3. **Create PR** with proper format:
   ```bash
   gh pr create --title "the pr title" --body "$(cat <<'EOF'
   ## Summary
   - Bullet point 1
   - Bullet point 2

   ## Test plan
   - [ ] Test item 1
   - [ ] Test item 2
   EOF
   )"
   ```

4. **Return the PR URL** to the user

---

## 🏗️ Code Organization Principles

### Directory Structure (To Be Established)

When adding code to this repository, follow this structure:

```
ai-coding-showcase/
├── src/                    # Source code
│   ├── components/        # Reusable components
│   ├── services/          # Business logic services
│   ├── utils/             # Utility functions
│   ├── types/             # Type definitions
│   └── index.ts           # Main entry point
├── tests/                 # Test files
│   ├── unit/             # Unit tests
│   ├── integration/      # Integration tests
│   └── e2e/              # End-to-end tests
├── docs/                  # Additional documentation
├── scripts/               # Build and utility scripts
├── .github/
│   └── workflows/        # CI/CD workflows
├── config/                # Configuration files
├── public/                # Static assets (if applicable)
├── package.json           # Project manifest (if Node.js)
├── tsconfig.json          # TypeScript config (if applicable)
├── .gitignore            # Git ignore rules
├── .eslintrc.json        # Linting rules
├── .prettierrc           # Code formatting
├── README.md             # Project documentation
└── CLAUDE.md             # This file
```

### File Naming Conventions

- **Source files:** Use camelCase or kebab-case consistently
  - TypeScript/JavaScript: `userService.ts`, `auth-middleware.ts`
  - Python: `user_service.py`, `auth_middleware.py`
- **Test files:** Match source file naming with `.test` or `.spec` suffix
  - `userService.test.ts`
  - `auth_middleware_test.py`
- **Components:** PascalCase for React/Vue components
  - `UserProfile.tsx`, `LoginForm.vue`
- **Configuration:** Use standard names
  - `.eslintrc.json`, `.prettierrc`, `jest.config.js`

---

## 💻 Coding Standards

### General Principles

1. **Avoid Over-Engineering**
   - Only make changes that are directly requested or clearly necessary
   - Keep solutions simple and focused
   - Don't add features beyond what was asked
   - Three similar lines are better than a premature abstraction

2. **Don't Add Unnecessary Code**
   - No docstrings, comments, or type annotations on unchanged code
   - Only add comments where logic isn't self-evident
   - No error handling for scenarios that can't happen
   - Trust internal code and framework guarantees
   - Only validate at system boundaries (user input, external APIs)

3. **Avoid Backwards-Compatibility Hacks**
   - No renaming unused `_vars`
   - No re-exporting types
   - No `// removed` comments for deleted code
   - If something is unused, delete it completely

4. **Don't Design for Hypothetical Future**
   - No feature flags or configuration for one-time operations
   - No helpers/utilities for single-use cases
   - Minimum complexity needed for current task

### Security Best Practices

Always check for and prevent:

- **Command Injection:** Validate and sanitize all shell commands
- **XSS (Cross-Site Scripting):** Sanitize user input in web contexts
- **SQL Injection:** Use parameterized queries
- **Path Traversal:** Validate file paths
- **OWASP Top 10:** Review all code against common vulnerabilities

**If insecure code is written, immediately fix it before proceeding.**

### Code Quality

- **Read Before Modifying:** NEVER propose changes to code you haven't read
- **Understand Context:** Read related files to understand the broader system
- **Test Your Changes:** Ensure changes don't break existing functionality
- **Follow Existing Patterns:** Match the style and patterns already in the codebase

---

## 🧪 Testing Strategy

### Testing Principles

1. **Write tests for new features** when implementing functionality
2. **Run existing tests** before committing changes
3. **Fix failing tests** before marking tasks complete
4. **Never mark a task completed** if tests are failing

### Test Organization

- **Unit tests:** Test individual functions/methods in isolation
- **Integration tests:** Test interactions between components
- **E2E tests:** Test complete user workflows

### Running Tests

```bash
# To be defined based on chosen framework
# Examples:
npm test                    # Jest/Vitest
pytest                      # Python
cargo test                  # Rust
go test ./...              # Go
```

---

## 📦 Dependencies and Package Management

### Adding Dependencies

When adding new dependencies:

1. **Justify the need:** Don't add dependencies for trivial functionality
2. **Check security:** Review package for known vulnerabilities
3. **Verify maintenance:** Prefer actively maintained packages
4. **Consider bundle size:** For frontend projects, check impact on bundle size

### Package Managers

- **Node.js:** npm or yarn (to be determined)
- **Python:** pip with requirements.txt or poetry
- **Rust:** Cargo
- **Go:** go modules

---

## 🔧 Build and Development

### Development Environment Setup

```bash
# To be defined based on chosen tech stack
# Example for Node.js:
npm install                 # Install dependencies
npm run dev                # Start development server
npm run build              # Build for production
npm run test               # Run tests
npm run lint               # Run linter
```

### Environment Variables

- Store sensitive data in `.env` files (never commit these!)
- Use `.env.example` to document required variables
- Load environment variables using appropriate tools:
  - Node.js: `dotenv`
  - Python: `python-dotenv`

---

## 📖 Documentation Requirements

### Code Documentation

- **Functions/Methods:** Document complex logic, not obvious operations
- **Modules:** Add file-level comments explaining purpose for non-obvious files
- **APIs:** Document all public APIs with parameters, return types, and examples
- **Architecture:** Document significant architectural decisions

### README.md Updates

Update the README.md when:
- Adding new features
- Changing setup/installation process
- Adding new scripts or commands
- Changing deployment process

### CHANGELOG.md (To Be Created)

When created, maintain a changelog following [Keep a Changelog](https://keepachangelog.com/):
- **Added** for new features
- **Changed** for changes in existing functionality
- **Deprecated** for soon-to-be removed features
- **Removed** for removed features
- **Fixed** for bug fixes
- **Security** for vulnerability fixes

---

## 🤖 AI Assistant Task Management

### Using TodoWrite Tool

**CRITICAL:** Use the `TodoWrite` tool frequently for:

1. **Planning:** Break down complex tasks into steps
2. **Tracking:** Keep user informed of progress
3. **Organization:** Prevent forgetting important tasks

### When to Use TodoWrite

✅ **Use for:**
- Complex multi-step tasks (3+ steps)
- Non-trivial complex tasks
- User explicitly requests todo list
- User provides multiple tasks
- After receiving new instructions
- When starting work on a task (mark `in_progress`)
- After completing a task (mark `completed`)

❌ **Skip for:**
- Single, straightforward tasks
- Trivial tasks
- Tasks completable in <3 trivial steps
- Purely conversational/informational requests

### Todo Task Format

```json
{
  "content": "Run tests",           // Imperative form
  "activeForm": "Running tests",    // Present continuous form
  "status": "pending"               // pending | in_progress | completed
}
```

### Todo Management Rules

1. **Update in real-time** as you work
2. **Mark completed IMMEDIATELY** after finishing (don't batch)
3. **Exactly ONE task in_progress** at a time
4. **Complete current task** before starting new ones
5. **Remove irrelevant tasks** entirely from the list
6. **Only mark completed** when FULLY accomplished:
   - ❌ Tests are failing → Keep as `in_progress`
   - ❌ Implementation is partial → Keep as `in_progress`
   - ❌ Unresolved errors → Keep as `in_progress`
   - ✅ Task fully complete → Mark as `completed`

---

## 🔍 Code Exploration Guidelines

### Using Specialized Tools

**Prefer specialized tools over bash:**

- **File search:** Use `Glob` (NOT `find` or `ls`)
- **Content search:** Use `Grep` (NOT `grep` or `rg`)
- **Read files:** Use `Read` (NOT `cat`/`head`/`tail`)
- **Edit files:** Use `Edit` (NOT `sed`/`awk`)
- **Write files:** Use `Write` (NOT `echo >`/`cat <<EOF`)

### When to Use Task Tool with Explore Agent

Use `Task` tool with `subagent_type=Explore` for:
- Exploring codebase to gather context
- Answering questions that aren't needle queries for specific file/class/function
- Understanding how errors are handled across the codebase
- Understanding codebase structure
- Finding patterns and conventions

**Example:**
```
User: "Where are errors from the client handled?"
→ Use Task tool with subagent_type=Explore
(NOT Glob or Grep directly)
```

### Parallel Tool Calls

**Maximize efficiency** by calling independent tools in parallel:

```
✅ Good: Single message with multiple tool calls
- Read file A
- Read file B
- Read file C

❌ Bad: Sequential messages for independent operations
- Read file A → wait → Read file B → wait → Read file C
```

**Only use sequential calls** when operations have dependencies.

---

## 🚀 Deployment and CI/CD

### CI/CD Pipeline (To Be Established)

When setting up CI/CD, include:

1. **Automated Testing**
   - Run on every pull request
   - Run on pushes to main branch
   - Block merges if tests fail

2. **Code Quality Checks**
   - Linting (ESLint, Pylint, etc.)
   - Type checking (TypeScript, mypy, etc.)
   - Code formatting (Prettier, Black, etc.)
   - Security scanning

3. **Build Verification**
   - Ensure project builds successfully
   - Check for build warnings

4. **Deployment** (if applicable)
   - Automatic deployment to staging on merge to main
   - Manual deployment to production

### GitHub Actions Template

```yaml
# .github/workflows/ci.yml (example)
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup
        run: npm install
      - name: Lint
        run: npm run lint
      - name: Test
        run: npm test
      - name: Build
        run: npm run build
```

---

## 📝 Common Workflows

### Adding a New Feature

1. **Read the request** and understand requirements
2. **Use TodoWrite** to plan the feature implementation
3. **Explore codebase** to understand existing patterns
4. **Read relevant files** before modifying
5. **Implement changes** following existing conventions
6. **Write tests** for new functionality
7. **Run tests** to ensure nothing breaks
8. **Update documentation** if needed
9. **Commit changes** (if requested by user)
10. **Create PR** (if requested by user)

### Fixing a Bug

1. **Understand the bug** - ask questions if unclear
2. **Use TodoWrite** for multi-step fixes
3. **Locate the bug** using Grep/Explore tools
4. **Read surrounding code** to understand context
5. **Implement fix** - minimal changes only
6. **Verify fix** doesn't break existing functionality
7. **Add test** to prevent regression
8. **Commit fix** (if requested)

### Refactoring Code

1. **Understand the goal** - why refactor?
2. **Only refactor if explicitly requested** - avoid proactive refactoring
3. **Read all affected files** first
4. **Use TodoWrite** to track refactoring steps
5. **Ensure tests exist** before refactoring
6. **Refactor incrementally** - small, safe changes
7. **Run tests** after each change
8. **Keep behavior identical** - no functional changes
9. **Commit when complete** (if requested)

---

## ⚡ Performance Considerations

### Tool Usage Optimization

- **Parallel execution:** Call independent tools simultaneously
- **Avoid redundant reads:** Cache file contents mentally across conversation
- **Use Task tool** for complex, multi-round explorations
- **Prefer specialized tools** over bash for file operations

### Code Performance

When writing code:
- **Profile before optimizing** - don't prematurely optimize
- **Focus on algorithmic complexity** for data processing
- **Consider bundle size** for frontend code
- **Lazy load** when appropriate
- **Cache expensive operations** when beneficial

---

## 🔐 Security Guidelines

### Secret Management

- **Never commit secrets** to the repository
- **Use environment variables** for sensitive data
- **Review .gitignore** to exclude sensitive files:
  - `.env`
  - `credentials.json`
  - API keys
  - Private keys

### Code Security

- **Validate all user input** at entry points
- **Sanitize data** before rendering or executing
- **Use parameterized queries** for databases
- **Keep dependencies updated** for security patches
- **Review security implications** of new dependencies

---

## 📞 Communication Guidelines

### With Users

- **Be concise** - output is displayed on CLI
- **Use markdown** - Github-flavored, rendered in monospace
- **No emojis** unless user explicitly requests them
- **Output text directly** - never use bash echo to communicate
- **Ask when unclear** - don't assume requirements
- **Reference code with line numbers** - Format: `file_path:line_number`
  - Example: "Clients are marked as failed in `src/services/process.ts:712`"

### Professional Tone

- **Prioritize accuracy** over validation
- **Be objective** - focus on facts and problem-solving
- **Disagree when necessary** - honest correction over false agreement
- **Investigate uncertainty** - find truth before confirming beliefs
- **Avoid excessive praise** - no "You're absolutely right" unless truly exceptional

---

## 🎓 Learning from the Codebase

### Understanding Patterns

Before implementing features:
1. **Search for similar features** in the codebase
2. **Read existing implementations** to understand patterns
3. **Follow established conventions** - don't introduce new patterns without reason
4. **Maintain consistency** in naming, structure, and style

### When Patterns Aren't Clear

If the codebase lacks clear patterns:
1. **Ask the user** about their preferences
2. **Suggest industry best practices** for the tech stack
3. **Document the pattern** you establish for future reference
4. **Be consistent** once a pattern is chosen

---

## 📊 Repository Metadata

### Current State (As of 2026-01-22)

- **Total Files:** 2 (README.md, CLAUDE.md)
- **Source Files:** 0
- **Test Files:** 0
- **Configuration Files:** 0
- **Documentation Files:** 2
- **Total Lines of Code:** 0

### To-Do for Repository Setup

When developing this repository, consider adding:

- [ ] Technology stack selection (Node.js, Python, Rust, etc.)
- [ ] Package manifest (package.json, requirements.txt, Cargo.toml, etc.)
- [ ] TypeScript/Build configuration (if applicable)
- [ ] Test framework setup
- [ ] Linting and formatting configuration
- [ ] CI/CD pipeline (.github/workflows/)
- [ ] Source directory structure (src/)
- [ ] Test directory structure (tests/)
- [ ] .gitignore file
- [ ] CONTRIBUTING.md
- [ ] LICENSE file
- [ ] Enhanced README.md with setup instructions

---

## 🔄 Maintenance and Updates

### Keeping CLAUDE.md Updated

Update this file when:
- **Major architectural changes** are made
- **New conventions** are established
- **Technology stack** is chosen or updated
- **New workflows** are introduced
- **Best practices** evolve

### Version Control

- Track changes to CLAUDE.md in git
- Include updates to CLAUDE.md in relevant feature PRs
- Review CLAUDE.md periodically (quarterly suggested)

---

## 📚 Additional Resources

### Useful Commands

```bash
# Git operations
git status                                    # Check repository status
git log --oneline -10                        # View recent commits
git diff                                     # View uncommitted changes
git branch -a                                # List all branches

# GitHub CLI (gh)
gh pr list                                   # List pull requests
gh pr create                                 # Create pull request
gh pr view <number>                          # View PR details
gh issue list                                # List issues

# File operations (prefer specialized tools when possible)
ls -la                                       # List files with details
find . -name "*.ts" -type f                 # Find files (use Glob instead)
grep -r "pattern" .                         # Search in files (use Grep instead)
```

### External References

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Keep a Changelog](https://keepachangelog.com/)
- [Semantic Versioning](https://semver.org/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

---

## ✨ Summary for AI Assistants

### Quick Start Checklist

When starting work on this repository:

1. ✅ Read CLAUDE.md (this file)
2. ✅ Check current branch - must start with `claude/`
3. ✅ Read README.md and relevant source files
4. ✅ Use TodoWrite for planning if task is complex
5. ✅ Explore codebase before making changes
6. ✅ Read files before editing them
7. ✅ Follow established patterns and conventions
8. ✅ Check security implications of changes
9. ✅ Run tests before committing
10. ✅ Use proper commit message format
11. ✅ Push to correct branch with retry logic
12. ✅ Return PR URL when creating pull requests

### Key Principles

1. **Read before writing** - Never modify code you haven't read
2. **Plan before executing** - Use TodoWrite for complex tasks
3. **Follow conventions** - Match existing patterns in the codebase
4. **Keep it simple** - Avoid over-engineering
5. **Security first** - Check for vulnerabilities
6. **Test thoroughly** - Don't mark tasks complete with failing tests
7. **Document clearly** - Update docs when needed
8. **Communicate effectively** - Be concise and objective
9. **Use specialized tools** - Prefer Read/Edit/Write over bash
10. **Work in parallel** - Maximize efficiency with concurrent tool calls

---

**Remember:** This repository is a showcase for AI-assisted development. Demonstrate best practices, clean code, thorough testing, and excellent documentation in all contributions.

---

*This CLAUDE.md file is a living document. Update it as the repository evolves and new patterns emerge.*
