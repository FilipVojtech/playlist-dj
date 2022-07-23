<script lang="ts">
    import { LoaderIcon, XIcon } from 'svelte-feather-icons'
    import { fade } from 'svelte/transition'
    import { closeModal } from 'svelte-modals'
    import { SearchFilter, Spotify } from '@playlist-dj/types'
    import aport from '../../utility/Aport'
    import FilterList from '../FilterList.svelte'
    import { _ } from 'svelte-i18n'
    import { searchResult } from '../../utility/stores'

    export let isOpen: boolean
    export let type: 'artist' | 'album' | 'track' | string = 'artist,album,track'
    let value
    let results: Promise<Spotify.SearchResults> = new Promise<Spotify.SearchResults>(() => {
        return {}
    })
    let counters: number[] = []
    let waiting: boolean

    function handleKeyDown() {
        if (counters.length > 0)
            for (const counter of counters) {
                clearTimeout(counter)
                counters.pop()
            }

        waiting = true
        counters.push(
            setTimeout(() => {
                if (!value) {
                    results = new Promise<Spotify.SearchResults>(() => {
                        waiting = false
                        return {}
                    })
                    return
                }

                results = aport(`/api/search?${new URLSearchParams({ q: value, type })}`).then(response => {
                    waiting = false
                    return response.json()
                })
            }, 1250) as number
        )
    }

    function handleResultClick(id: SearchFilter) {
        $searchResult = id
        closeModal()
    }
</script>

{#if isOpen}
    <div role="dialog" class="modal" transition:fade>
        <div class="modal__search">
            <div class="search-row">
                <!-- svelte-ignore a11y-autofocus -->
                <input
                    class="search"
                    placeholder={$_('modal.search.placeholder')}
                    type="search"
                    autofocus
                    on:keydown={handleKeyDown}
                    bind:value
                />
                <span on:click={closeModal} class="close-btn"><XIcon size="35" /></span>
            </div>
            <div class="search__results">
                {#await results}
                    {#if waiting}
                        <span class="loader">
                            <LoaderIcon size="30" />
                        </span>
                    {/if}
                {:then data}
                    <FilterList half interactive {data} onItemClick={handleResultClick} />
                {:catch e}
                    {@debug e}
                    Error
                {/await}
            </div>
        </div>
    </div>
{/if}

<style>
    .modal {
        top: 0;
        right: 0;
        transform: none;
        overflow-y: initial !important;
        width: 100vw;
    }

    .modal__search {
        padding: 5px 10px;
        pointer-events: auto;
        display: flex;
        flex-direction: column;
        width: 100vw;
        max-width: 100vw;
        max-height: 100vh;
        overflow-y: auto;
    }

    .search-row {
        position: sticky;
        top: 0;
        display: flex;
        flex-direction: row;
        flex-basis: fit-content;
        margin-bottom: 10px;
    }

    .search {
        background-color: var(--darker-bg);
        border: none;
        border-radius: 20px;
        color: white;
        padding: 5px 10px;
        font-size: 20px;
        flex-grow: 1;
        width: 100%;
    }

    .close-btn {
        background-color: var(--main-bg);
        border-radius: 20px;
        width: 35px;
        height: 35px;
        margin-left: 10px;
        cursor: pointer;
    }

    .search__results {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    @media (min-width: 640px) {
        .modal {
            right: 50%;
            transform: translateX(50%);
            width: 50vw;
        }
    }
</style>
