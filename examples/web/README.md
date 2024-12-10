# GeoXp Web Example App

This is an example application demonstrating how to use the **GeoXp** library in a browser environment.

## Setup and Usage

1. ### **Install Dependencies**  
   Run the following command to install all necessary dependencies:  
   ```bash
   yarn
   ```

2. ### **Build Example Bundle**  
   Create the application bundle with Rollup:  
   ```bash
   yarn build
   ```

3. ### **Start App Development Server**  
   Launch a local development server:  
   ```bash
   # from the example root
   yarn dev
   ```

4. ### **🚀 Enable Workspace Watching (Highly Recommended)**
   For the best development experience, enable automatic rebuilding of the app bundle whenever there are changes in either this app's codebase or the GeoXp library source code by running __from the project root__:  
   ```bash
   # from the project root
   yarn dev:examples-web
   ```

   This will also start the example development server.

   💡 **Why use this?**  
   - Automatically rebuilds the app after changes.  
   - Saves time and improves efficiency during development.  
   - Ensures the app stays in sync with the latest changes in your codebase and the library.  

   **⚠️ NOTE:** Live reload is **not enabled** in this setup. You will need to manually refresh your browser to see changes.

---

Happy GeoXp experience! 🚀
