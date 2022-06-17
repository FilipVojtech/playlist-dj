<script lang="ts">
    import { ListIcon } from 'svelte-feather-icons'
    import { createEventDispatcher } from 'svelte'
    import FilterImg from './FilterImg.svelte'

    export let playlists = []
    export let slim: boolean = false
    export let half: boolean = false

    const dispatch = createEventDispatcher()
</script>

{#each playlists as { name, images, id }}
    <div
        class="item item--interactive"
        class:item--slim={slim}
        class:item--half={half}
        on:click={() => dispatch('click', { id })}
    >
        <FilterImg {images} {name} alt="{name} playlist picture" placeholderIcon={ListIcon} />
        <div class="filter__info">{name}</div>
    </div>
{/each}
