<script lang="ts">
    import FilterPlaceholder from './FilterPlaceholder.svelte'
    import { SvelteComponent } from 'svelte'

    export let images: []
    export let name = ''
    export let alt = `${name} cover art`
    export let placeholderIcon: SvelteComponent
</script>

{#if images.length === 3}
    <img class="filter__img" src={images[2].url} {alt} />
{:else if images.length === 1}
    <img class="filter__img" src={images[0].url} {alt} />
{:else}
    <FilterPlaceholder icon={placeholderIcon} />
{/if}
