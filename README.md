
# Google Form Creator with SvelteKit (FAAC)

This project is a full-stack application built with SvelteKit and Svelte, designed to allow users to create Google Forms directly from a custom interface. The application handles Google OAuth2 authentication to securely access and interact with the Google Forms API, enabling users to programmatically create and update forms in their Google account.

## Features

- **Form Builder Interface**: Users can input a title, description, and add various types of questions, including text fields, checkboxes, multiple-choice options, and more.
- **Google OAuth2 Authentication**: Secures access to Google Forms by requesting user permissions through Google's OAuth2 flow.
- **Dynamic Form Creation**: Upon submission, the form data is sent to the Google Forms API to generate a Google Form in the user's account.
- **Real-time Preview**: Users can review the form structure before creating the Google Form.

## Tech Stack

### Frontend
- **Svelte**: Used to create an interactive UI for building and previewing forms.

### Backend
- **SvelteKit**: Serves as the backend framework, handling API routes and managing OAuth2 authorization.
- **Node.js**: Underlies the server, managing API calls and handling requests to the Google Forms API.

## Setup

1. Clone the repository.
2. Install dependencies with `npm install`.
3. Set up your Google Cloud project and OAuth2 credentials.
4. Add your Google OAuth2 credentials in `.env` file.
5. Run the development server with `npm run dev`.

## Usage

1. Sign in with your Google account to authorize the application.
2. Use the form builder interface to create a form with your desired fields and settings.
3. Click "Create Google Form" to send the form data to Google Forms API and create the form in your Google account.


