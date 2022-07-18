<script lang="ts">
    import type { FilterType, PDJ } from '@playlist-dj/types'
    import { FilterList, Header } from '../components'
    import { EditPlaylistDetailsModal, Modal, SpotifySearchModal } from '../components/modals'
    import { onDestroy, onMount } from 'svelte'
    import { modalEvent, searchResult, showNav, user } from '../utility/stores'
    import { _ } from 'svelte-i18n'
    import {
        ChevronLeftIcon,
        ListIcon,
        LoaderIcon,
        MoreHorizontalIcon,
        PlusIcon,
        TrashIcon,
    } from 'svelte-feather-icons'
    import aport from '../utility/Aport'
    import LoginWidget from '../components/widgets/LoginWidget.svelte'
    import { closeModal, closeModals, openModal } from 'svelte-modals'
    import { push } from 'svelte-spa-router'
    import NotFound from './NotFound.svelte'
    import { copyToClipboard, ModalAction } from '../utility'

    export let params = { id: '' }
    export let isEditing: boolean = false
    export let previousPage = isEditing ? `/playlist/${params.id}` : '/playlists'

    let data: Promise<{}> = new Promise(() => {
        return {}
    })
    let filtersData: Promise<PDJ.FilterList | null> = new Promise<{}>(() => {
        return {}
    })

    function getPlaylist() {
        data = aport(`/api/playlist/${params.id}`)
            .then(value => {
                if (value.ok) return value.json()
                else return { status: value.status }
            })
            .catch(e => console.log(e))
    }

    function getFilters() {
        filtersData = aport(`/api/playlist/${params.id}/filter`)
            .then(value => {
                if (value.ok) return value.json()
                else return { status: value.status }
            })
            .catch(e => console.log(e))
    }

    async function actions() {
        openModal(Modal, {
            title: $_('app.actions'),
            message: '',
            actions: [
                new ModalAction($_('page.playlist.more.delete'), () => {
                    closeModals()
                    openModal(Modal, {
                        title: $_('modal.deleteConfirm.title'),
                        message: $_('modal.deleteConfirm.message'),
                        actions: [
                            new ModalAction($_('app.yes'), () => {
                                closeModals()
                                aport(`/api/playlist/${params.id}`, { method: 'DELETE' })
                            }),
                            new ModalAction($_('app.cancel'), closeModals),
                        ],
                    })
                }),
                new ModalAction($_('app.cancel'), closeModal),
            ],
        })
    }

    async function removeFilter(id: { id: string; type: FilterType }) {
        await aport(`/api/playlist/${params.id}/filter`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify([id]),
        })
        getFilters()
    }

    onMount(() => {
        $showNav = false
        getPlaylist()
        getFilters()
    })
    onDestroy(() => ($showNav = true))

    $: if ($searchResult && $searchResult!.id) {
        aport(`/api/playlist/${params.id}/filter`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify([$searchResult]),
        })
        // noinspection TypeScriptValidateTypes
        $searchResult = undefined
        getFilters()
    }

    $: if ($modalEvent === 'detailsChange') {
        $modalEvent = ''
        getPlaylist()
    }
</script>

<svelte:head>
    {#if isEditing}
        <title>{$_('page.playlist.editTitle')}</title>
    {:else}
        <title>{$_('page.playlist.title')}</title>
    {/if}
</svelte:head>

{#await data}
    <div class="loader">
        <LoaderIcon size="100" />
    </div>
{:then { status, images, name, description, isPinned }}
    {#if status && status === 404}
        <NotFound />
    {:else if status === 403}
        {#if !$user}
            <Header text={$_('page.playlist.privatePlaylist')} />
            <LoginWidget message={$_('page.playlist.tryLogIn')} />
        {:else}
            <Header
                iconBefore={ChevronLeftIcon}
                onClickBefore={() => push(previousPage)}
                text={$_('page.playlist.privatePlaylist')}
            />
        {/if}
    {:else}
        {#if $user}
            <Header
                iconBefore={ChevronLeftIcon}
                onClickBefore={() => push(previousPage)}
                text={$_('app.back')}
                iconAfter={MoreHorizontalIcon}
                onClickAfter={actions}
            />
        {/if}

        <div class="playlist">
            <div class="playlist__title">
                <!--<editor-fold desc="Playlist cover art">-->
                <div class="title__cover">
                    <!--Cannot use the FilterImg component, because this image is too unique ❄-->
                    <!-- - custom css class for the most part-->
                    {#if images.length === 3}
                        <img class="cover__img" src={images[2].url} alt="{name} cover art" />
                    {:else if images.length === 1}
                        <img class="cover__img" src={images[0].url} alt="{name} cover art" />
                    {:else}
                        <div class="cover__img">
                            <div class="placeholder">
                                <ListIcon />
                            </div>
                        </div>
                    {/if}
                </div>
                <!--</editor-fold>-->
                <div class="title__detail">
                    <div class="title__name">{name}</div>
                    <div class="title__description">{description}</div>
                </div>
            </div>
            <div class="playlist__actions__wrapper">
                <div class="playlist__actions scroll-shadows">
                    {#if isEditing}
                        <div
                            on:click={() => openModal(SpotifySearchModal)}
                            class="actions__action actions__action--main item--interactive"
                        >
                            <span class="action__icon action__icon--left"><PlusIcon /></span>
                            {$_('page.playlist.addFilter')}
                        </div>
                        <div
                            on:click={() => openModal(EditPlaylistDetailsModal, { id: params.id, name, description })}
                            class="actions__action item--interactive"
                        >
                            {$_('page.playlist.editDetails')}
                        </div>
                        <!--todo: Allow user to change picture-->
                        <!--<div-->
                        <!--    on:click={() => openModal(EditPlaylistPictureModal)}-->
                        <!--    class="actions__action item&#45;&#45;interactive"-->
                        <!-- >-->
                        <!--    {$_('page.playlist.editPhoto')}-->
                        <!--</div>-->
                    {/if}
                    {#if !isEditing && $user}
                        <div
                            on:click={() => push(`/playlist/${params.id}/edit`)}
                            class="actions__action item--interactive"
                        >
                            {$_('page.playlist.edit')}
                        </div>
                    {/if}
                    {#if !isEditing}
                        <div
                            class="actions__action item--interactive"
                            on:click={async () => {
                                await aport(`/api/playlist/${params.id}`, { method: 'SUBSCRIBE' })
                                getPlaylist()
                            }}
                        >
                            {#if isPinned}
                                {$_('page.playlist.unpin')}
                            {:else}
                                {$_('page.playlist.pin')}
                            {/if}
                        </div>
                        <div
                            class="actions__action item--interactive"
                            on:click={() => copyToClipboard(window.location.href)}
                        >
                            {$_('page.playlist.share')}
                        </div>
                        <!--&lt;!&ndash;<editor-fold desc="Playlist taste | On hold">&ndash;&gt;-->
                        <!--<div class="actions__action item&#45;&#45;interactive">-->
                        <!--    {$_('page.playlist.taste')}-->
                        <!--    <span class="action__icon action__icon&#45;&#45;right">-->
                        <!--        <PlayIcon />-->
                        <!--    </span>-->
                        <!--</div>-->
                        <!--&lt;!&ndash;</editor-fold>&ndash;&gt;-->
                    {/if}
                </div>
            </div>
            {#await filtersData}
                <div class="loader">
                    <LoaderIcon size="45" />
                </div>
            {:then data}
                <div class="playlist__filters">
                    <FilterList {data} actions={isEditing ? [{ icon: TrashIcon, onClick: removeFilter }] : []} />
                </div>
            {/await}
        </div>
    {/if}
{:catch e}
    <h1>Error</h1>
    <p>{e}</p>
{/await}

<style>
    .playlist {
        display: flex;
        flex-flow: column nowrap;
        margin-top: 20px;
    }

    .playlist__title {
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
    }

    .title__cover {
        margin-bottom: 20px;
    }

    .cover__img {
        max-width: 40vw;
        max-height: 30vh;
        aspect-ratio: 1 / 1;
        border-radius: 20px;
        box-shadow: 0 0 15px black;
        background-color: var(--darker-bg);
    }

    .placeholder {
        transform: scale(0.7);
    }

    .title__detail {
        display: flex;
        flex-flow: column nowrap;
    }

    .title__name {
        font-size: 26px;
        font-weight: 600;
        text-align: center;
        margin-bottom: 5px;
    }

    .title__description {
        font-size: 20px;
    }

    .playlist__actions__wrapper {
        display: flex;
        flex-flow: row nowrap;
        white-space: nowrap;

        position: sticky;
        top: 3px;
        box-sizing: border-box;
        width: 100vw;

        margin-top: 15px;
        padding-bottom: 7px;
        overflow-y: auto;
        transform: translateX(-10px);
        /*noinspection CssUnknownProperty*/
        scrollbar-width: thin;
    }

    .playlist__actions {
        display: flex;
        flex-flow: row nowrap;
        white-space: nowrap;
        background-color: var(--main-bg);
        border-radius: 25px;
        padding: 5px;
    }

    .playlist__actions > * {
        margin-right: 5px;
    }

    .playlist__actions > *:last-child {
        margin-right: 0;
    }

    .actions__action {
        display: flex;
        flex-flow: row nowrap;
        white-space: nowrap;

        padding: 3px 7px;
        border-radius: 20px;
        font-size: 18px;
        background-color: var(--lighter-bg);
    }

    .actions__action--main {
        background-color: var(--main);
    }

    .action__icon {
        width: 1em;
        aspect-ratio: 1 / 1;
    }

    /*noinspection CssUnusedSymbol*/
    .action__icon--left {
        margin-right: 5px;
    }

    /*noinspection CssUnusedSymbol*/
    .action__icon--right {
        margin-left: 5px;
    }

    @media screen and (min-width: 640px) {
        .playlist__actions__wrapper {
            top: 5px;
            width: 100%;
            transform: none;
        }

        .playlist__actions {
            /*border-left: 2px solid white;*/
            /*border-right: 2px solid white;*/
            /*border: 5px solid var(--main-bg);*/
        }

        .actions__action {
            font-size: 22px;
        }
    }

    @media screen and (min-width: 1080px) {
        .playlist__title {
            flex-direction: row;
        }

        .title__cover {
            margin-right: 30px;
        }

        .title__name {
            text-align: left;
            margin-bottom: 10px;
        }
    }
</style>
