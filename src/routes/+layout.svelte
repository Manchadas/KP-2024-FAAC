<script>
    import Navbar from "../lib/Navbar.svelte";
</script>

<Navbar />
<div class="main-app">
    <slot></slot>
</div>

<style>
    .main-app{
        height: 100;
        width: 100vw;
        margin:0;
        background-color: #242424;
        color: #fff;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>