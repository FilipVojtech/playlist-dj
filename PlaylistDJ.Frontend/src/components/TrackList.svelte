<script lang="ts">
    import type { SearchFilter, Spotify, FilterType } from '@playlist-dj/types'
    import { artistListFromArray } from '../utility'
    import { searchResult } from '../utility/stores'
    import { closeModal } from 'svelte-modals'
    import FilterImg from './FilterImg.svelte'
    import { MusicIcon } from 'svelte-feather-icons'

    export let tracks: Spotify.Track[] = []

    function handleSearchResultClick(id: SearchFilter) {
        $searchResult = id
        closeModal()
    }
</script>

{#each tracks as { album, artists, name, type, id }}
    <div class="item item--interactive filter" on:click={() => handleSearchResultClick({ id, type: FilterType.Track })}>
        <FilterImg images={album.images} {name} alt="{name} album cover" placeholderIcon={MusicIcon} />
        <div class="filter__info">
            <div class="info__name">{name}</div>
            <div class="info__authors">{artistListFromArray(artists)}</div>
        </div>
    </div>
{/each}
