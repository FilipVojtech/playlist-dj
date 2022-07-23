<script lang="ts">
    import { ExternalLinkIcon } from 'svelte-feather-icons'

    export let href
    let customClass = ''
    export { customClass as class }
</script>

<a {href} target="_blank" class={customClass}>
    <slot />
    <sup class="ext-icon"><ExternalLinkIcon /></sup>
</a>

<style>
    .ext-icon {
        height: 1em;
        aspect-ratio: 1 / 1;
        display: inline-block;
    }
</style>
