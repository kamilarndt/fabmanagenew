## Contributing Guide

### Principles
- Type safety first; tests for critical paths
- Small, focused PRs with clear description
- Follow existing patterns and domain boundaries

### Workflow
1) Create a feature branch
2) Implement with Zod validation and typed services
3) Run: `npm run lint`, `npm run type-check`, `npm run test`
4) Open PR with screenshots where applicable and link to docs

### Code style
- Named exports, one component per file
- No inline functions in JSX; use `useCallback`
- Keep components small; extract helpers

### Commit messages
- Conventional prefixes: feat, fix, docs, refactor, test, chore


