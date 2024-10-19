<script>
    import Navbar from "../lib/Navbar.svelte";
</script>


<Navbar />
<main class="main-app">
    <slot></slot>
</main>



<style>
    .main-app{
        height: 100vh;
        width: 100vw;
        margin: 0;
        background-color: #242424;
        color: #FFF;
        display: flex;
        flex-direction: column;

        align-items: center;
    }
</style>