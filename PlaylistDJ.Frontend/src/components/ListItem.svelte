<script lang="ts">
    import { SvelteComponent } from 'svelte'
    import { link } from 'svelte-spa-router'

    export let href: string
    export let text: string
    export let icon: SvelteComponent
</script>

<a class="item item--interactive" {href} use:link>
    <span class="item__icon"><svelte:component this={icon} size="25" /></span>
    {text}
</a>
