# How to Run the Carbon Insight Hub Locally

This guide provides step-by-step instructions to set up and run the Carbon Insight Hub application on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher recommended)
- **npm** (usually comes with Node.js) or **yarn** / **bun**

## Step-by-Step Instructions

### 1. Navigate to the Project Directory

Open your terminal and navigate to the project folder:

```bash
cd "/Users/pranay/Documents/Work/Trace Resource/TR Calculator/carbon-insight-hub-main"
```

### 2. Install Dependencies

Install the required project dependencies using npm:

```bash
npm install
```

*Alternatively, if you use yarn or bun:*
```bash
# yarn
yarn install

# bun
bun install
```

### 3. Set Up Environment Variables

The application requires Supabase for backend services. You need to configure the environment variables.

1.  Check if a `.env` file exists in the root directory.
2.  If not, create one based on `.env.example` (if available) or simply create a new `.env` file.
3.  Add your Supabase credentials to the `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

> **Note:** You can find these keys in your Supabase project settings under **Project Settings > API**.

### 4. Run the Development Server

Start the local development server:

```bash
npm run dev
```

You should see output similar to this:

```
  VITE v5.4.19  ready in 250 ms

  ➜  Local:   http://localhost:8080/
  ➜  Network: use --host to expose
```

### 5. Open in Browser

Open your web browser and visit the URL shown in your terminal (usually `http://localhost:8080/` or `http://localhost:5173/`).

## Troubleshooting

-   **Port Already in Use**: If the default port is busy, Vite will automatically try the next available port. Check the terminal output for the correct URL.
-   **Missing Dependencies**: If you see errors about missing modules, try running `npm install` again.
-   **Supabase Connection Errors**: Ensure your `.env` file has the correct URL and Key, and that you have restarted the server after making changes to `.env`.

## Project Structure Overview

-   `src/pages`: Contains all the application pages (Auth, ESG, Carbon Emissions, Footprint).
-   `src/components`: Reusable UI components.
-   `src/lib`: Utility functions and calculation logic.
-   `src/integrations/supabase`: Database client and type definitions.
