<script lang='ts'>
    import type { Spotify } from '@playlist-dj/types'
    import { artistListFromArray } from '../utility'
    import { searchResult } from '../utility/stores'
    import { closeModal } from 'svelte-modals'

    export let tracks: Spotify.Track[] = []

    function handleSearchResultClick(id: { id, type: '' | 'artist' | 'album' | 'track' }) {
        $searchResult = id
        closeModal()
    }
</script>

{#each tracks as { album, artists, name, type, id }}
    <div class='item item--interactive filter' on:click={() => handleSearchResultClick({id, type: 'track'})}>
        <img alt='{name} album cover' class='filter__img' src='{album.images[2].url}'>
        <div class='filter__info'>
            <div class='info__name'>{name}</div>
            <div class='info__authors'>{artistListFromArray(artists)}</div>
        </div>
    </div>
{/each}
