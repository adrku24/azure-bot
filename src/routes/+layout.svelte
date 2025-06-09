<script>
    import Header from "$lib/components/Header.svelte";

    let { data, children } = $props();
    import "../app.css";
</script>

<Header renderNavigationIntoDOM={data.renderExtraHeader}/>
{@render children()}
