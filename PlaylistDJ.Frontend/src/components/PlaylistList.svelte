<script lang="ts">
    import type { PDJ } from '@playlist-dj/types'
    import { FilterType } from '@playlist-dj/types'
    import { ListIcon } from 'svelte-feather-icons'
    import Filter from './Filter.svelte'
    import { push } from 'svelte-spa-router'
    import { createEventDispatcher } from 'svelte'

    export let playlists: PDJ.Playlist[] = []
    export let slim: boolean = false
    export let half: boolean = false
    export let useCustom: boolean = false

    const dispatch = createEventDispatcher()
</script>

{#each playlists as { name, images, id } (id)}
    <Filter
        {name}
        {images}
        {id}
        {slim}
        {half}
        type={FilterType.Playlist}
        altSubject="playlist cover art"
        placeholderIcon={ListIcon}
        interactive
        onClick={() => (useCustom ? dispatch('click', { id, type: FilterType.Playlist }) : push(`/playlist/${id}`))}
        on:click
    />
{/each}
