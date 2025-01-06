
# Contributing to Digi-Cry

Thank you for your interest in contributing to **Digi-Cry**! We welcome all types of contributions, from ideas and documentation improvements to bug fixes and feature implementations.

## Table of Contents

1. [Git Workflow](#git-workflow)
      - 1.  [Workflow Overview](#workflow-overview)
2. [How to Contribute](#how-to-contribute)
      - 1. [Fork the Repository](#fork-the-repository)
      - 2. [Clone the Fork Locally](#clone-the-fork-locally)
      - 3. [Set Up Remotes](#set-up-remotes)
      - 4. [Create a Feature Branch](#create-a-feature-branch)
      - 5. [Make Changes](#make-changes)
      - 6. [Test Your Changes](#test-your-changes)
      - 7. [Commit and Push](#commit-and-push)
      - 8. [Open a Pull Request](#open-a-pull-request)
      - 9. [Keeping Your Fork Up-to-Date](#keeping-your-fork-up-to-date)
3. [Reporting Issues](#reporting-issues)
4. [Thank You!](#thank-you)

---

## Git Workflow

Our project follows the **Forking Workflow**, which is ideal for open-source projects and encourages contributions from multiple developers.

  1. ### **Workflow Overview:**

	  -	**Fork** the repository.
	  - **Clone** your fork locally.
	  - **Set up remotes** to track origin and upstream.
	  - **Create a feature branch** from main.
	  - **Develop** your feature or fix.
	  - **Commit** your changes following commit guidelines.
	  - **Push** to your fork.
	  - **Create a Pull Request** to the upstream repository.
	  - **Review** your PR.
	  - **Merge** once approved.

---

## How to Contribute

1. ### **Fork the Repository**
   - Click the "Fork" button on the top right corner of this repository to create a copy under your GitHub account.

2. ### **Clone the Fork Locally**
```bash
   git clone https://github.com/<your-username>/digicry.git
   cd digicry
```

3. ### **Set Up Remotes**
    - Navigate to the project directory and set up the upstream remote to keep your fork in sync with the original repository:
```bash
    cd digi-cry
    git remote add upstream https://github.com/original-owner/digi-cry.git
```

4. ### **Create a Feature Branch**
    - Always create a new branch for each feature or bugfix to keep your work organized and to facilitate easier code reviews.
	  - For a feature or enhancement, name your branch like feat/my-feature.
	  - For a bug fix, name your branch like fix/my-bug.
```bash
    git checkout -b feat/my-feature
```

5. ### **Make Changes**
	  - Implement your feature or bug fix.
	  - Write unit tests or integration tests if applicable.
	  - Update any relevant documentation.

6. ### **Test Your Changes**
	  - Ensure the code runs without errors.
	  - Verify all tests pass:
```bash
    npm run lint
    npm run dev
```

7. ### **Commit and Push**
```bash
git add .
git commit -m "Add analytics chart to Home page"
git push origin feat/my-feature
```

8. ### **Open a Pull Request**
	  - Go to your fork on GitHub and click “Compare & pull request.”
	  - Fill out the PR template with relevant details.
	  - Link to any related issues (“Fixes #123”).

9. ### **Keeping Your Fork Up-to-Date:**
    - Regularly synchronize your fork with the upstream repository to minimize merge conflicts.
```bash
# Fetch latest changes from upstream
git fetch upstream

# Checkout your local main branch
git checkout main

# Merge upstream changes into local main
git merge upstream/main

# Push the updated main to your fork
git push origin main
```

---

## Reporting Issues

If you encounter any issues or bugs, please report them to help us improve **Digi-Cry**.

1. **How to Report:**
	- Check Existing Issues
	- Create a New Issue
	- Provide Details
	- Submit the Issue

---

## Thank You!

Your contributions are invaluable to the success of **Digi-Cry**. By following this guide, you help maintain a high standard of quality and foster a collaborative environment. If you have any questions or need further assistance, feel free to reach out by opening an issue or contacting the maintainers directly.

**Happy Coding!** 🚀