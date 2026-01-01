# Activity Registration System

A responsive Single Page Application (SPA) for managing and registering for activities.

## 🚀 Deployment Instructions (GitHub Pages)

You are ready to deploy! The project is configured for your repository: `https://rex-1993.github.io/Event-Registration/`.

**Run these commands in your terminal one by one:**

1.  **Initialize Git & Commit Source Code:**

    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git branch -M main
    ```

2.  **Connect to GitHub:**

    ```bash
    git remote add origin https://github.com/rex-1993/Event-Registration.git
    git push -u origin main
    ```

3.  **Deploy the App:**
    ```bash
    npm run deploy
    ```
    _This command builds the project and uploads it to the `gh-pages` branch automatically._

---

## Admin Access

- **Login URL**: [https://rex-1993.github.io/Event-Registration/#/admin/login](https://rex-1993.github.io/Event-Registration/#/admin/login)
- **Password**: `2335051`

## Configuration

> [!NOTE] > **Firebase Analytics** is currently disabled in `src/lib/firebase.js` to ensure build stability. You can re-enable it if needed.

## Tech Stack

- React (Vite)
- Tailwind CSS (Morandi Theme)
- Firebase Firestore
- `gh-pages` for deployment
