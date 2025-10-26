

## Convention for picking up new item in Linear:
- Review the item mentioned to understand scope
- Check Git remote to ensure all merge feature branches are cleared and we have a clean git tree before we start
- Start a new feature branch for current task
- Read all the docs in /docs/ folder and the README.md for context, but stick to the Linear acceptance criteria
- At the kick-off, commit any changes to files in /docs/ folder and the README.md to the feature branch so we don't lose on-going updates
- Do all required changes in the feature branch


## PR process
- when all changes for the current task(s) are done, 
- Run all tests and fix any errors
- Run the build and fix any errors
- Run linting and fix any errors
- Create a PR against the repo in Git: https://github.com/YarnMeister/sales-dashboard/pulls
- Update the relevant task status in Linear to "In Review"
- Wait for feedback and next steps

## Prod Deployment process
- When I say  "deploy to prod", merge the PR/feature-branch that we worked on to main to trigger a build in Vercel
- Update the relevant tasks in Linear to "Done"
- Delete the feature branch

## Important reminders:

### Naming & Case Conventions

**AI assistants:** when generating new code, always follow this rule set.
- **Database / Drizzle schemas:** use `snake_case`
- **TypeScript variables & API code:** use `camelCase`
- **Type & class names:** use `PascalCase`
- **JSON payloads to clients:** use `camelCase`
- **Environment variables:** use `SCREAMING_SNAKE_CASE`

This ensures consistent automatic naming by code assistants and Drizzle generators.

### Database migrations
- see migration.md for more detail