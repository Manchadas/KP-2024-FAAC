# Google Form Creator with SvelteKit (FAAC)

This project is a full-stack application built with SvelteKit, designed to empower users to create and customize Google Forms seamlessly. FAAC (Form as a Code) provides an interactive and user-friendly interface for building forms, either manually or by leveraging YAML configuration.

## Features

- **Dynamic Google Form Creation**: Users can create Google Forms directly within their accounts.
- **YAML Builder**: Write YAML code to define form structures efficiently.
- **Interactive Form Builder**: Use a drag-and-drop interface to create forms manually.
- **Review and Edit**: Preview forms before publishing or sending them to Google Forms.
- **Google OAuth2 Authentication**: Securely sign in with Google to access and manage forms.
- **Quiz Mode**: Build quizzes with graded multiple-choice questions and automatic grading.
- **Real-Time Preview**: Instant visual feedback on forms while building them.

---

## Tech Stack

### Frontend
- **Svelte**: Framework for building interactive user interfaces.
- **CSS**: For styling and achieving a clean, modern design.

### Backend
- **SvelteKit**: Backend framework handling routes, server-side rendering, and APIs.
- **Node.js**: Server runtime for efficient API communication.
- **Google Forms API**: To create and update forms dynamically.

---

## Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Google Cloud Project**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/).
   - Create a new project.
   - Enable the Google Forms API.
   - Create OAuth2 credentials and download the JSON file.

4. **Environment Variables**:
   - Create a `.env` file in the project root.
   - Add the following environment variables:
     ```env
     SECRET_CLIENT_ID=<your-google-client-id>
     SECRET_CLIENT_SECRET=<your-google-client-secret>
     REDIRECT_URL=http://localhost:5173/oauth
     ```

5. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173/`.

---

## How to Use

1. **Sign In**:
   - Click "Sign in with Google" to authorize the app.

2. **YAML Builder**:
   - Write YAML code to define your form.
   - Preview the structure in real-time.
   - Example YAML:
     ```yaml
     title: Quiz Form
     description: This is a sample quiz form.
     elements:
       - type: mcq
         label: What is 2 + 2?
         options:
           - 3
           - 4
           - 5
         correctOption: 4
       - type: text
         label: What is your name?
     ```

3. **Form Builder**:
   - Use the interface to create forms manually.

4. **Review & Edit**:
   - Preview your form before sending it to Google.

5. **Create Google Form**:
   - Click "Create Google Form" to send the data to the Google Forms API.

---

## Acknowledgments

Special thanks to:
- **Google Forms API** for enabling dynamic form creation.
- **SvelteKit** for providing an excellent full-stack framework.

