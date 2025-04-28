<script>
    export let linkText;
    export let linkHref;
    export let classes = "";
</script>

<a class="text-blue-600 after:content-['_↗'] {classes}" href={linkHref}>{linkText}</a>
