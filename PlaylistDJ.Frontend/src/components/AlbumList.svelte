<script lang='ts'>
    import type { Spotify } from '@playlist-dj/types'
    import { artistListFromArray } from '../Utility'

    export let albums: Spotify.Album[] = []
</script>

{#each albums as { artists, images, name, type }}
    <div class='item item--interactive filter'>
        <img alt='{name} album cover' class='filter__img' src='{images[2].url}'>
        <div class='filter__info'>
            <div class='info__name'>{name}</div>
            {#if artists}
                <div class='info__authors'>{artistListFromArray(artists)}</div>
            {/if}
        </div>
    </div>
{/each}
