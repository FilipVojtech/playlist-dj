<script lang="ts">
    import type { PDJ } from '@playlist-dj/types'
    import { ChevronDownIcon, ChevronUpIcon, MoreHorizontalIcon, StarIcon } from 'svelte-feather-icons'
    import FilterList from './FilterList.svelte'
    import External from './External.svelte'
    import { _, date, time } from 'svelte-i18n'
    import { fade, fly, slide } from 'svelte/transition'
    import aport from '../utility/Aport'
    import { createEventDispatcher, onDestroy, onMount } from 'svelte'
    import { user } from '../utility/stores'
    import { closeModal, closeModals, openModal } from 'svelte-modals'
    import { Modal } from './modals'
    import { ModalAction } from '../utility'

    export let id = ''
    export let author: PDJ.User
    export let createdAt: Date
    export let playlist: PDJ.Playlist
    export let message = ''
    export let stars: number = 0
    export let starred: boolean = false

    let isPlaylistOpen: boolean = false
    let interval

    const dispatch: Function = createEventDispatcher()

    async function getStars(): Promise<void> {
        await aport(`/api/social/${id}/stars`)
            .then(res => {
                if (res.ok) return res.json()
            })
            .then(value => {
                stars = value.stars
                starred = value.starred
            })
            .catch(e => console.error(e))
    }

    async function starPost() {
        starred = true
        await aport(`/api/social/${id}`, { method: 'PUT' })
        await getStars()
    }

    onMount(() => (interval = setInterval(() => getStars(), 10000)))
    onDestroy(() => clearInterval(interval))
</script>

<div class="post" {id}>
    <div class="post__details">
        <div class="post__text">
            <div class="post__title">{playlist.name}</div>
            <div class="post__author">
                {$_('component.post.by').toLowerCase()}
                <External href="https://open.spotify.com/user/{author.profile.spotifyId}">
                    {author.profile.displayName}
                </External>
            </div>
            <div class="post__date">
                {$date(new Date(createdAt), { format: 'medium' })}
                {$time(new Date(createdAt))}
            </div>
            <div class="post__desc">{message}</div>
        </div>
        <div class="post__actions">
            <div class="actions__action">
                <div class="action__icon" on:click={starPost} class:post__star--active={starred}>
                    <StarIcon />
                </div>
                {#key stars}
                    <span
                        style="grid-area: 1/1/2/2;"
                        in:fly|local={{ y: -10, delay: 200 }}
                        out:fade|local={{ duration: 200 }}
                    >
                        {stars}
                    </span>
                {/key}
            </div>
            {#if author.profile.spotifyId === $user.spotifyId}
                <div
                    class="actions__action"
                    on:click={() =>
                        openModal(Modal, {
                            title: $_('app.actions'),
                            message: '',
                            actions: [
                                new ModalAction($_('component.post.delete'), async () => {
                                    await aport(`/api/social/${id}`, { method: 'DELETE' })
                                    closeModals()
                                    dispatch('postDelete')
                                }),
                                new ModalAction($_('app.cancel'), closeModal),
                            ],
                        })}
                >
                    <div class="action__icon">
                        <MoreHorizontalIcon />
                    </div>
                </div>
            {/if}
        </div>
    </div>
    {#if playlist.filters.length > 0}
        <div class="post__playlist">
            {#if isPlaylistOpen}
                <div transition:slide|local={{ duration: 200 }} on:introend={e => e.target.scrollIntoView()}>
                    <FilterList data={playlist.filters} slim />
                </div>
                <div
                    class="playlist__collapse"
                    on:click={() => (isPlaylistOpen = !isPlaylistOpen)}
                    transition:slide|local
                >
                    <div class="collapse__icon">
                        <ChevronUpIcon />
                    </div>
                    {$_('component.post.collapsePlaylist')}
                </div>
            {:else}
                <div
                    class="playlist__collapse"
                    on:click={() => (isPlaylistOpen = !isPlaylistOpen)}
                    transition:slide|local
                >
                    <div class="collapse__icon">
                        <ChevronDownIcon />
                    </div>
                    {$_('component.post.showPlaylist')}
                </div>
            {/if}
        </div>
    {/if}
</div>

<style>
    .post {
        border-radius: 20px;
        background-color: var(--lighter-bg);
        padding: 10px;
        margin-bottom: 20px;
    }

    .post__details {
        display: flex;
        flex-direction: row;
    }

    .post__text {
        width: 100%;
    }

    .post__title {
        font-size: 24px;
        font-variant: small-caps;
    }

    .post__desc {
        margin: 10px 0;
        font-variant-ligatures: common-ligatures no-contextual;
    }

    .post__actions {
        width: 30px;
    }

    .actions__action {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 12px;
        cursor: pointer;
        box-sizing: border-box;
        margin-top: 15px;
    }

    .actions__action:first-child {
        margin-top: 0;
    }

    .action__icon {
        margin-bottom: 3px;
    }

    .post__playlist {
        background-color: var(--darker-bg);
        padding: 10px;
        border-radius: 15px;
    }

    .playlist__collapse {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        cursor: pointer;
    }

    .collapse__icon {
        height: 1.25em;
        aspect-ratio: 1 / 1;
        margin-right: 5px;
    }
</style>
