# Electron Auto-Update Boilerplate

This is a simple Electron boilerplate application demonstrating the auto-update feature using `electron-updater` and GitHub Releases for a private repository. It displays a basic "Hello World" interface and provides feedback on the update process.

## Features

* Checks for updates on application start.
* Notifies the user when an update is available.
* Allows the user to manually trigger the download of an update.
* Prompts the user to restart the application to install the downloaded update.
* Basic UI feedback on the update status.
* Demonstrates secure communication between the main and renderer processes using `preload.js` and `contextBridge`.

## Prerequisites

Before you can run and test the auto-update functionality, you need to set up a private GitHub repository and a personal access token:

1.  **Private GitHub Repository:**
    * You need a private GitHub repository to host your application's releases. This boilerplate is configured to work with the repository at `https://github.com/Clintonrocks13/electron_auto_update`. You'll need to replace this with your own private repository URL in the `package.json` or `electron-builder.config.js`.

2.  **GitHub Personal Access Token:**
    * To allow the `electron-updater` to access your private repository's releases, you need to generate a Personal Access Token on GitHub with the following scope:
        * **`repo`**: This grants full access to private and public repositories. For a more specific permission, you might be able to use **`contents:read`** if you only need to download release assets.
    * **Generating a Token:**
        1.  Go to your GitHub account settings.
        2.  Navigate to **Developer settings** > **Personal access tokens** > **Tokens (classic)** or **Fine-grained tokens**.
        3.  Generate a new token.
        4.  Select the appropriate **scope** (at least `repo` or `contents:read`).
        5.  Click **Generate token**.
        6.  **Copy the generated token.** You will need to set this as an environment variable.

## Installation and Running

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd electron-auto-update-boilerplate
    ```
    *(Replace `<repository_url>` with the URL of this boilerplate repository if you've cloned it, or your own repository if you've adapted the code.)*

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set the `GH_TOKEN` environment variable:**
    * **Windows:**
        * **Temporary (current session):**
            ```bash
            set GH_TOKEN=your_github_personal_access_token
            ```
        * **Permanent (user-level):**
            ```bash
            setx GH_TOKEN "your_github_personal_access_token"
            ```
            (You might need to restart your terminal or applications for this to take effect.)
        * You can also set it via the Environment Variables GUI (search for "env" in the Start Menu).
    * **macOS/Linux:**
        * **Temporary (current session):**
            ```bash
            export GH_TOKEN=your_github_personal_access_token
            ```
        * **Permanent (add to your shell configuration file, e.g., `.bashrc`, `.zshrc`):**
            ```bash
            echo "export GH_TOKEN='your_github_personal_access_token'" >> ~/.bashrc
            source ~/.bashrc
            # or for zsh
            echo "export GH_TOKEN='your_github_personal_access_token'" >> ~/.zshrc
            source ~/.zshrc
            ```
    *(Replace `your_github_personal_access_token` with the token you generated.)*

4.  **Run the application in development mode:**
    ```bash
    npm start
    ```

## Configuring Auto-Updater

There are two main ways to configure `electron-updater` for private GitHub repositories:

**Option 1: Using `electron-builder` Configuration (Recommended for most)**

Configure the `publish` section in your `electron-builder.config.js` (or within the `build` section of your `package.json`):

```json
"publish": [
  {
    "provider": "github",
    "owner": "Clintonrocks13",
    "repo": "electron_auto_update",
    "private": true,
    "token": process.env.GH_TOKEN
  }
]