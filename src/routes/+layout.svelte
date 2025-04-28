<script>
    import Header from "$lib/components/Header.svelte";

    let { children } = $props();
    import "../app.css";
</script>

<Header/>
{@render children()}
