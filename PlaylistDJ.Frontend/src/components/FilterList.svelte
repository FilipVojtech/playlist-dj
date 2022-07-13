<script lang="ts">
    import type { Spotify } from '@playlist-dj/types'
    import { FilterType } from '@playlist-dj/types'
    import aport from '../utility/Aport'
    import Filter from './Filter.svelte'
    import { artistListFromArray } from '../utility'
    import { _ } from 'svelte-i18n'

    export let data: Spotify.SearchResults
    export let actions: { icon; onClick: Function }[] = []
    export let onItemClick: Function = () => {}

    async function loadMore(link) {
        let results: Spotify.SearchResults = await aport(
            `/api/search?${new URLSearchParams({ url: link }).toString()}`
        ).then(value => value.json())

        if (results.artists) {
            data.artists.items = [...data.artists.items, ...results.artists.items]
            data.artists.next = results.artists.next
        }

        if (results.albums) {
            data.albums.items = [...data.albums.items, ...results.albums.items]
            data.albums.next = results.albums.next
        }

        if (results.tracks) {
            data.tracks.items = [...data.tracks.items, ...results.tracks.items]
            data.tracks.next = results.tracks.next
        }
    }
</script>

{#if data.artists}
    <div class="list__section">{$_('component.filterList.artists')}</div>
    <div class="list">
        {#each data.artists.items as { name, images, id }}
            <div class="filter-wrapper item--half" on:click={() => onItemClick({ id, type: FilterType.Artist })}>
                <Filter {name} {images} {id} type={FilterType.Artist} {actions} />
            </div>
        {/each}
    </div>
    {#if data.artists.next}
        <button class="list__more" on:click={() => loadMore(data.artists.next)}>
            {$_('component.filterList.loadMore')}
        </button>
    {/if}
{/if}
{#if data.albums}
    <div class="list__section">{$_('component.filterList.albums')}</div>
    <div class="list">
        {#each data.albums.items as { name, images, artists, id }}
            <div class="filter-wrapper item--half" on:click={() => onItemClick({ id, type: FilterType.Album })}>
                <Filter {name} {images} {id} type={FilterType.Album} {actions}>
                    <svelte:fragment slot="artists">
                        {artistListFromArray(artists)}
                    </svelte:fragment>
                </Filter>
            </div>
        {/each}
    </div>
    {#if data.albums.next}
        <button class="list__more" on:click={() => loadMore(data.albums.next)}>
            {$_('component.filterList.loadMore')}
        </button>
    {/if}
{/if}
{#if data.tracks}
    <div class="list__section">{$_('component.filterList.tracks')}</div>
    <div class="list">
        {#each data.tracks.items as { album, artists, name, id }}
            <div class="filter-wrapper item--half" on:click={() => onItemClick({ id, type: FilterType.Track })}>
                <Filter {name} images={album.images} {id} type={FilterType.Track} {actions}>
                    <svelte:fragment slot="artists">
                        {artistListFromArray(artists)} - {album.name}
                    </svelte:fragment>
                </Filter>
            </div>
        {/each}
    </div>
    {#if data.tracks.next}
        <button class="list__more" on:click={() => loadMore(data.tracks.next)}>
            {$_('component.filterList.loadMore')}
        </button>
    {/if}
{/if}

<style>
    .list__section {
        color: white;
        border-bottom: 1px solid white;
        width: 100%;
        text-align: center;
        padding-bottom: 5px;
        margin-bottom: 5px;
        margin-top: 20px;
    }

    .list__section:first-child {
        margin-top: initial;
    }

    .filter-wrapper {
        width: 100%;
    }

    .list__more {
        background-color: var(--lighter-bg);
        padding: 5px;
        border: none;
        border-radius: 5px;
    }
</style>
