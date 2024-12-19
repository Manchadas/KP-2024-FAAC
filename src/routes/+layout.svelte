<script>
    import Navbar from "$lib/Navbar.svelte";
</script>

<Navbar />
<main>
    <slot />
</main>

<svelte:head>
    <style>
        body {
            margin: 0;
            font-family: 'Inter', sans-serif;
            background-color: #000000; /* Black background */
            color: #ffffff; /* White text */
        }

        a {
            color: #ffffff; /* White links */
            text-decoration: none;
        }

        a:hover {
            color: #aaaaaa; /* Grey on hover */
        }

        button {
            background-color: #1e1e1e; /* Dark button */
            color: #ffffff;
            border: 1px solid #ffffff;
            border-radius: 5px;
            padding: 10px 20px;
            cursor: pointer;
            font-family: 'Inter', sans-serif;
        }

        button:hover {
            background-color: #333333; /* Slightly lighter */
        }
    </style>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" />
</svelte:head>

<style>
    main {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
</style>
