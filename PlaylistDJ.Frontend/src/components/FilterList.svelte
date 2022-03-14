<script lang='ts'>
    import { Spotify } from '@playlist-dj/types'
    import AlbumList from './AlbumList.svelte'
    import aport from '../Utility/Aport'
    import TrackList from './TrackList.svelte'
    import ArtistList from './ArtistList.svelte'

    export let data: Spotify.SearchResults

    async function loadMore(link) {
        let results: Spotify.SearchResults = await aport(`/api/search?${new URLSearchParams({ url: link }).toString()}`)
            .then(value => value.json())

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
    <div class='list__section'>Artists</div>
    <ArtistList artists='{data.artists.items}' />
    {#if data.artists.next}
        <button
            class='list__more'
            on:click={() => loadMore(data.artists.next)}
        >
            Load more
        </button>
    {/if}
{/if}
{#if data.albums}
    <div class='list__section'>Albums</div>
    <AlbumList albums={data.albums.items} />
    {#if data.albums.next}
        <button
            class='list__more'
            on:click={() => loadMore(data.albums.next)}
        >
            Load more
        </button>
    {/if}
{/if}
{#if data.tracks}
    <div class='list__section'>Tracks</div>
    <TrackList tracks='{data.tracks.items}' />
    {#if data.tracks.next}
        <button
            class='list__more'
            on:click={() => loadMore(data.tracks.next)}
        >
            Load more
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
    }

    .list__more {
        background-color: var(--lighter-bg);
        padding: 5px;
        border: none;
        border-radius: 5px;
        margin-bottom: 20px;
    }
</style>
