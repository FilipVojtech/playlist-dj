<script lang='ts'>
    import type { Spotify } from '@playlist-dj/types'
    import { artistListFromArray } from '../Utility'
    import { searchResult } from '../Utility/stores'
    import { closeModal } from 'svelte-modals'

    export let albums: Spotify.Album[] = []

    function handleSearchResultClick(id: string) {
        $searchResult = id
        closeModal()
    }
</script>

{#each albums as { artists, images, name, type, id }}
    <div class='item item--interactive filter' on:click={() => handleSearchResultClick(id)}>
        <img alt='{name} album cover' class='filter__img' src='{images[2].url}'>
        <div class='filter__info'>
            <div class='info__name'>{name}</div>
            {#if artists}
                <div class='info__authors'>{artistListFromArray(artists)}</div>
            {/if}
        </div>
    </div>
{/each}
