<script>
    export let isSignedIn = false; // Passed from the backend
    export let userEmail = ''; // Passed from the backend

    async function signOut() {
        // Clear session or token on the server and refresh the page
        await fetch('/api/logout', { method: 'POST' });
        location.reload();
    }
</script>

<main>
    <div class="home-wrapper">
        <header class="header-content">
            <h1>Welcome to <span class="highlight">FAAC</span></h1>
            <p>Effortlessly create Google Forms using YAML or manually through our interface.</p>
            <p class="emphasis">Sign in with your Google account to get started!</p>
        </header>

        <section class="features">
            <div class="feature-item">
                <h3>📜 YAML Builder</h3>
                <p>Write YAML code to quickly generate Google Forms.</p>
            </div>
            <div class="feature-item">
                <h3>🛠️ Form Builder</h3>
                <p>Create forms manually with an intuitive drag-and-drop interface.</p>
            </div>
            <div class="feature-item">
                <h3>🔍 Review & Edit</h3>
                <p>Preview and make changes before publishing your forms.</p>
            </div>
        </section>

        {#if isSignedIn}
            <div class="user-info">
                <p>You are signed in as: <strong>{userEmail}</strong></p>
                <button on:click={signOut}>Sign Out</button>
            </div>
        {:else}
            <div class="sign-in-wrapper">
                <h2>Get Started</h2>
                <p class="sign-in-note">Sign in with Google to access all features and publish your forms.</p>
                <form class="auth-form" method="post" action="?/OAuth2">
                    <button class="btn-auth" type="submit">
                        <img
                            class="btn-auth-img"
                            src="/google_signin_buttons/web/1x/btn_google_signin_dark_pressed_web.png"
                            alt="Sign in with Google"
                        />
                    </button>
                </form>
            </div>
        {/if}
    </div>
</main>

<style>
    /* Main Page Styling */
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: #000000;
        color: #ffffff;
        min-height: 100vh;
        padding: 2rem;
        font-family: 'Inter', sans-serif;
    }

    .home-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 2rem;
    }

    /* Header Section */
    .header-content {
        margin-bottom: 2rem;
    }

    .header-content h1 {
        font-size: 3rem;
        font-weight: 700;
        margin-bottom: 1rem;
    }

    .header-content p {
        font-size: 1.25rem;
        color: #cccccc;
    }

    .emphasis {
        font-size: 1.2rem;
        color: #ff7b00;
        font-weight: 600;
        margin-top: 0.5rem;
    }

    .highlight {
        color: #ff7b00;
    }

    /* Features Section */
    .features {
        display: flex;
        flex-wrap: wrap;
        gap: 1.5rem;
        justify-content: center;
        margin-bottom: 2rem;
    }

    .feature-item {
        background-color: #1e1e1e;
        padding: 1.5rem;
        border-radius: 10px;
        text-align: center;
        max-width: 300px;
        width: 100%;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    }

    .feature-item h3 {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
    }

    .feature-item p {
        font-size: 1rem;
        color: #aaaaaa;
    }

    /* Sign-In Section */
    .sign-in-wrapper {
        background-color: rgba(84, 81, 81, 0.35);
        padding: 2rem;
        border-radius: 10px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        max-width: 400px;
        width: 100%;
    }

    .sign-in-wrapper h2 {
        margin-bottom: 0.5rem;
        font-size: 1.75rem;
    }

    .sign-in-note {
        font-size: 1rem;
        color: #cccccc;
        margin-bottom: 1rem;
    }

    .auth-form {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .btn-auth {
        border: 0;
        background-color: rgba(84, 81, 81, 0);
        padding: 0.5rem;
        cursor: pointer;
    }

    .btn-auth:hover .btn-auth-img {
        box-shadow: 0px 0px 10px rgba(255, 255, 255, 0.5);
    }

    /* User Info Section */
    .user-info {
        background-color: #2c2c2c;
        padding: 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        text-align: center;
        max-width: 400px;
        width: 100%;
    }

    .user-info p {
        font-size: 1.2rem;
        color: #ffffff;
        margin-bottom: 1rem;
    }

    .user-info button {
        background-color: #ff4c4c;
        color: #ffffff;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.3s ease-in-out;
    }

    .user-info button:hover {
        background-color: #d9534f;
    }
</style>
