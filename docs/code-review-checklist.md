# Check-list for Ai assistants to follow during PR/code reviews:
- Ensure code diff of main to branch aligns with the stated requirements
- Check implementation for each individual change is efficient and best possible approach (consider alternatives)
- Ensure that all guidelines in REAME.md was follow (naming, module structure, test writing)
- Check if appropriate unit tests were added for the changes made
- Ensure no manual SQL has been written and proper use of DRizzle migration system is used
- Check that the status of the branch or PR using: "gh pr checks [insert number] --repo YarnMeister/sales-dashboard" and ensure all passed