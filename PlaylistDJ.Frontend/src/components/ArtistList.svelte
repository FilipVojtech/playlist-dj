<script lang='ts'>
    import type { Spotify } from '@playlist-dj/types'
    import { UserIcon } from 'svelte-feather-icons'
    import { searchResult } from '../utility/stores'
    import { closeModal } from 'svelte-modals'
    import FilterPlaceholder from './FilterPlaceholder.svelte'

    export let artists: Spotify.Artist[] = []

    function handleSearchResultClick(id: string) {
        $searchResult = { id, type: 'artist' }
        closeModal()
    }
</script>

{#each artists as { images, name, type, id }}
    <div class='item item--interactive filter' on:click={() => {handleSearchResultClick(id)}}>
        {#if images.length === 3}
            <img alt='{name} artist picture' class='filter__img' src='{images[2].url}' />
        {:else}
            <FilterPlaceholder icon='{UserIcon}' />
        {/if}
        <div class='filter__info'>
            <div class='info__name'>{name}</div>
        </div>
    </div>
{/each}
