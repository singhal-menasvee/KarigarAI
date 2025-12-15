---
description: Push changes to GitHub
---

# Push Changes to GitHub

Your code is ready and the project is clean. Follow these steps to save your work to GitHub.

1.  **Add all changes** to the staging area:
    ```bash
    git add .
    ```

2.  **Commit the changes** with a descriptive message:
    ```bash
    git commit -m "feat: Add AI Chatbot, Voice Support, and Hindi Language"
    ```

3.  **Push to the remote repository**:
    ```bash
    git push origin main
    ```

> [!TIP]
> If you see an error about "updates were rejected" (because the remote contains work you don't have locally), run `git pull --rebase origin main` first, then try pushing again.
