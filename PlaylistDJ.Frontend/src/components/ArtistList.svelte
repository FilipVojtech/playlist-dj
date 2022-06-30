<script lang="ts">
    import type { SearchFilter, Spotify, FilterType } from '@playlist-dj/types'
    import { UserIcon } from 'svelte-feather-icons'
    import { searchResult } from '../utility/stores'
    import { closeModal } from 'svelte-modals'
    import FilterImg from './FilterImg.svelte'

    export let artists: Spotify.Artist[] = []

    function handleSearchResultClick(id: SearchFilter) {
        $searchResult = id
        closeModal()
    }
</script>

{#each artists as { images, name, type, id }}
    <div class="item item--interactive filter" on:click={() => handleSearchResultClick({ id, type: FilterType.Artist })}>
        <FilterImg {images} {name} alt="{name} artist picture" placeholderIcon={UserIcon} />
        <div class="filter__info">
            <div class="info__name">{name}</div>
        </div>
    </div>
{/each}
