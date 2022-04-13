<script lang='ts'>
    import { ListIcon } from 'svelte-feather-icons'
    import FilterPlaceholder from '../components/FilterPlaceholder.svelte'
    import { createEventDispatcher } from 'svelte'

    export let playlists = []

    const dispatch = createEventDispatcher()
</script>

<main>
    {#each playlists as { name, images, id }}
        <div class='item item--interactive' on:click={() => dispatch('click', {id})}>
            {#if images[2] && images[2].url}
                <img class='filter__img' src='{images[2].url}' alt='{name} playlist picture' />
            {:else if images[0] && images[0].url}
                <img class='filter__img' src='{images[0].url}' alt='{name} playlist picture' />
            {:else}
                <FilterPlaceholder icon={ListIcon} />
            {/if}
            <div class='filter__info'>{name}</div>
        </div>
    {/each}
</main>
