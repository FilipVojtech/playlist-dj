<script lang="ts">
    import type { FilterType, PDJ } from '@playlist-dj/types'
    import { FilterList, Header, Option } from '../components'
    import { EditPlaylistDetailsModal, Modal, OkModal, ShareModal, SpotifySearchModal } from '../components/modals'
    import { afterUpdate, onDestroy, onMount } from 'svelte'
    import { modalEvent, searchResult, showNav, user } from '../utility/stores'
    import { _ } from 'svelte-i18n'
    import {
        ChevronLeftIcon,
        ChevronsUpIcon,
        ListIcon,
        LoaderIcon,
        MoreHorizontalIcon,
        PlusIcon,
        TrashIcon,
    } from 'svelte-feather-icons'
    import aport from '../utility/Aport'
    import LoginWidget from '../components/widgets/LoginWidget.svelte'
    import { closeModal, closeModals, openModal } from 'svelte-modals'
    import { push, replace } from 'svelte-spa-router'
    import NotFound from './NotFound.svelte'
    import { copyToClipboard, ModalAction } from '../utility'
    import { fly, fade } from 'svelte/transition'

    export let params = { id: '' }
    export let isEditing: boolean = false
    export let previousPage = isEditing ? `/playlist/${params.id}` : '/playlists'

    let data: Promise<{}> = new Promise(() => {
        return {}
    })
    let filtersData: Promise<PDJ.FilterList | null> = new Promise<{}>(() => {
        return {}
    })
    let scrollPos: number = 0

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
        const playlistItems = (await filtersData)?.playlists.items.map(value => value.id) as PDJ.Playlist[]
        openModal(Modal, {
            title: $_('app.actions'),
            message: '',
            actions: [
                new ModalAction(
                    $_('page.playlist.more.unlink'),
                    async () => {
                        await aport(`/api/playlist/${params.id}/link`, {
                            method: 'PATCH',
                            body: JSON.stringify({ playlists: playlistItems }),
                        })
                        closeModals()
                        await push('/playlists')
                    },
                    playlistItems.length > 0
                ),
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
            body: JSON.stringify([id]),
        })
        getFilters()
    }

    onMount(() => {
        $showNav = false
    })
    afterUpdate(async () => {
        const playlist: any = await data
        // noinspection TypeScriptUnresolvedVariable
        if (isEditing && $user.spotifyId !== playlist.owner.profile.spotifyId) {
            await replace(`/playlist/${params.id}`)
        }
    })
    onDestroy(() => ($showNav = true))

    $: if ($searchResult && $searchResult!.id) {
        aport(`/api/playlist/${params.id}/filter`, {
            method: 'POST',
            body: JSON.stringify([$searchResult]),
        }).then(() => {
            // noinspection TypeScriptValidateTypes
            $searchResult = undefined
            getFilters()
        })
    }

    $: if ($modalEvent === 'detailsChange') {
        $modalEvent = ''
        getPlaylist()
    }

    // Reload playlist whenever ID changes
    $: if (params.id) {
        getPlaylist()
        getFilters()
    }
</script>

<svelte:head>
    {#if isEditing}
        <title>{$_('page.playlist.editTitle')}</title>
    {:else}
        <title>{$_('page.playlist.title')}</title>
    {/if}
</svelte:head>

<svelte:window on:scroll={() => (scrollPos = window.scrollY)} />

{#await data}
    <div class="loader" in:fade={{ delay: 500 }}>
        <LoaderIcon size="100" />
    </div>
{:then { status, images, name, description, isPinned, owner, isPublic }}
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
            <div class="menu-bar__wrapper">
                <div class="menu-bar">
                    {#if isEditing}
                        {#await filtersData then { playlists }}
                            <Option
                                main
                                iconLeft={PlusIcon}
                                title={$_('page.playlist.addFilter')}
                                on:click={() => {
                                    playlists.items.length === 0
                                        ? openModal(SpotifySearchModal)
                                        : openModal(OkModal, { message: $_('page.playlist.addFilterToLinked') })
                                }}
                            />
                        {/await}
                        <Option
                            title={$_('page.playlist.editDetails')}
                            on:click={() => openModal(EditPlaylistDetailsModal, { id: params.id, name, description })}
                        />
                        <!--todo: Allow user to change picture-->
                        <!--<PlaylistAction-->
                        <!--    on:click={() => openModal(EditPlaylistPictureModal)}-->
                        <!--    title={$_('page.playlist.editPhoto')}-->
                        <!--/>-->
                    {/if}
                    {#if !isEditing && $user && $user.spotifyId === owner.profile.spotifyId}
                        <Option title={$_('page.playlist.edit')} on:click={() => push(`/playlist/${params.id}/edit`)} />
                        <Option
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
                        </Option>
                        <Option on:click={() => openModal(ShareModal, { playlistId: params.id })}>
                            {$_('page.playlist.share')}
                        </Option>
                    {/if}
                    {#if !isEditing}
                        {#if isPublic}
                            <Option on:click={() => copyToClipboard(window.location.href)}>
                                {$_('page.playlist.copyLink')}
                            </Option>
                        {/if}
                        <!--todo: Playlist taste-->
                        <!--<Option iconRight={PlayIcon} title={$_('page.playlist.taste')} />-->
                    {/if}
                    {#if scrollPos > 200}
                        <Option
                            on:click={() => scrollTo({ top: 0, behavior: 'smooth' })}
                            iconLeft={ChevronsUpIcon}
                            title={$_('page.playlist.top')}
                        />
                    {/if}
                </div>
            </div>
            {#await filtersData}
                <div class="loader" in:fade={{ delay: 500 }}>
                    <LoaderIcon size="45" />
                </div>
            {:then data}
                <div class="playlist__filters">
                    <FilterList
                        forPlaylistId={params.id}
                        half
                        {data}
                        actions={isEditing ? [{ icon: TrashIcon, onClick: removeFilter }] : []}
                        on:unlink={getFilters}
                    />
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

    .menu-bar__wrapper {
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

    .menu-bar {
        display: flex;
        flex-flow: row nowrap;
        white-space: nowrap;
        background-color: var(--main-bg);
        border-radius: 25px;
        padding: 5px;
    }

    @media screen and (min-width: 640px) {
        .menu-bar__wrapper {
            top: 5px;
            width: 100%;
            transform: none;
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
