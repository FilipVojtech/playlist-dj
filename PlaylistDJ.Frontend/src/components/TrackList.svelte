<script lang='ts'>
    import type { Spotify } from '@playlist-dj/types'
    import { artistListFromArray } from '../Utility'

    export let tracks: Spotify.Track[] = []
</script>

{#each tracks as { album, artists, name, type }}
    <a class='item item--interactive filter'>
        <img alt='{name} album cover' class='filter__img' src='{album.images[2].url}'>
        <div class='filter__info'>
            <div class='info__name'>{name}</div>
            <div class='info__authors'>{artistListFromArray(artists)}</div>
        </div>
    </a>
{/each}
