<script lang="ts">
    import type { Spotify } from '@playlist-dj/types'
    import { artistListFromArray } from '../utility'
    import { searchResult } from '../utility/stores'
    import { closeModal } from 'svelte-modals'
    import FilterImg from './FilterImg.svelte'
    import { DiscIcon } from 'svelte-feather-icons'

    export let albums: Spotify.Album[] = []

    function handleSearchResultClick(id: { id: string; type: '' | 'artist' | 'album' | 'track' }) {
        $searchResult = id
        closeModal()
    }
</script>

{#each albums as { artists, images, name, type, id }}
    <div class="item item--interactive filter" on:click={() => handleSearchResultClick({ id, type: 'album' })}>
        <FilterImg {images} {name} alt="{name} album cover" placeholderIcon={DiscIcon} />
        <div class="filter__info">
            <div class="info__name">{name}</div>
            {#if artists}
                <div class="info__authors">{artistListFromArray(artists)}</div>
            {/if}
        </div>
    </div>
{/each}
