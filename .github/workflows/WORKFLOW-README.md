# 🚀 Automated Build & Release Workflow

This repository has automated GitHub Actions that handle building, testing, and version management.

## 🌿 How Branches Work

### **Main Branch Only**

- The workflow **only** triggers on the `main` branch
- You can create any branch name you want: `feature/auth`, `bugfix/ui`, `edward/testing`, etc.
- Branch names don't matter - only merging to `main` triggers the automation

### **Typical Workflow**

```bash
# 1. Create any branch
git checkout -b my-cool-feature

# 2. Make changes and commit
git add .
git commit -m "feat: add awesome new feature"
git push origin my-cool-feature

# 3. Create PR to main → automatic build testing
# 4. Merge PR → automatic version bump + changelog update
```

## 🔢 Version Bumping Rules

The workflow automatically determines how to bump the version based on your **commit messages**:

### **Major Version Bump** (1.0.0 → 2.0.0)

Use `major:` at the start of your commit message:

```bash
git commit -m "major: complete API redesign"
git commit -m "major(auth): breaking changes to authentication"
```

### **Minor Version Bump** (1.0.0 → 1.1.0)

Use `feat:` at the start of your commit message:

```bash
git commit -m "feat: add user dashboard"
git commit -m "feat(ui): new dark mode toggle"
```

### **Patch Version Bump** (1.0.0 → 1.0.1)

Everything else (bug fixes, chores, docs, etc.):

```bash
git commit -m "fix: resolve login issue"
git commit -m "chore: update dependencies"
git commit -m "docs: improve README"
git commit -m "refactor: clean up code"
```

## 📋 What Happens Automatically

### **On Pull Requests**

✅ Install dependencies  
✅ Run linting (`npm run lint`)  
✅ Test build (`npm run build`)

### **On Push to Main**

✅ All the above, plus:  
✅ Determine version bump from commit messages  
✅ Update `package.json` version  
✅ Update `CHANGELOG.md` with commits  
✅ Create git tag (e.g., `v1.2.3`)  
✅ Push changes back to main

## 📝 Commit Message Examples

```bash
# These will bump MAJOR version (breaking changes)
git commit -m "major: remove deprecated API endpoints"
git commit -m "major(database): change user schema"

# These will bump MINOR version (new features)
git commit -m "feat: add export functionality"
git commit -m "feat(chat): implement real-time messaging"

# These will bump PATCH version (everything else)
git commit -m "fix: resolve memory leak"
git commit -m "fix(ui): button alignment issue"
git commit -m "chore: update dependencies"
git commit -m "docs: add installation guide"
git commit -m "style: format code"
git commit -m "refactor: optimize database queries"
git commit -m "test: add unit tests"
```

## 🔄 Example Version History

```
v0.1.0 ← Starting version
    ↓ (feat: add login)
v0.2.0 ← Minor bump
    ↓ (fix: login bug)
v0.2.1 ← Patch bump
    ↓ (feat: add dashboard)
v0.3.0 ← Minor bump
    ↓ (major: new API)
v1.0.0 ← Major bump
```

## 📊 What Gets Updated

When a version bump happens, these files are automatically updated:

**`package.json`**

```json
{
  "version": "1.2.3"
}
```

**`CHANGELOG.md`**

```markdown
# Changelog

## [1.2.3] - 2024-01-20

- feat: add user dashboard
- fix: resolve login issue
- chore: update dependencies

## [1.2.2] - 2024-01-19

...
```

**Git Tags**

```bash
git tag
v1.2.1
v1.2.2
v1.2.3
```

## 🚨 Important Notes

- **Use conventional commit format** for proper version bumping
- **Merge squash** is recommended to keep commit history clean
- **`[skip ci]`** in commit messages will skip the workflow (useful for docs)
- **Multiple commits** in one merge will check ALL commits for version bump type

## 🛠️ Manual Override

If you need to manually set a version:

```bash
npm version 2.0.0 --no-git-tag-version
git add package.json
git commit -m "chore: manual version bump [skip ci]"
```

## 📁 Files Changed by Automation

- `package.json` - Version number
- `CHANGELOG.md` - Commit history
- Git tags - Version tags (e.g., `v1.2.3`)

That's it! The workflow handles everything automatically based on your commit messages. 🎉
