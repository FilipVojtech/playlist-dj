<script lang="ts">
    import { FilterList, Header, Modal, SpotifySearchModal } from '../components'
    import { onDestroy, onMount } from 'svelte'
    import { searchResult, showNav, user } from '../utility/stores'
    import { _ } from 'svelte-i18n'
    import { ChevronLeftIcon, ListIcon, LoaderIcon, MoreHorizontalIcon, PlusIcon } from 'svelte-feather-icons'
    import aport from '../utility/Aport'
    import LoginWidget from '../components/widgets/LoginWidget.svelte'
    import { closeModal, closeModals, openModal } from 'svelte-modals'
    import { push } from 'svelte-spa-router'
    import NotFound from './NotFound.svelte'
    import { copyToClipboard, ModalAction } from '../utility'

    export let params = { id: '' }
    export let previousPage = '/playlists'
    export let isEditing: boolean = false

    let data: Promise<{}> = new Promise(() => {
        return {}
    })

    function getPlaylist() {
        data = aport(`/api/playlist/${params.id}`)
            .then(value => {
                if (value.ok) return value.json()
                else return { status: value.status }
            })
            .catch(e => {
                console.log(e)
            })
    }

    async function actions() {
        // noinspection TypeScriptUnresolvedVariable
        openModal(Modal, {
            title: $_('app.actions'),
            message: '',
            actions: [
                new ModalAction($_('page.playlist.more.delete'), handleDelete),
                new ModalAction($_('app.cancel'), closeModal),
            ],
        })
    }

    function handleDelete() {
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
    }

    onMount(() => {
        $showNav = false
        getPlaylist()
    })
    onDestroy(() => ($showNav = true))

    $: if ($searchResult.id) {
        aport(`/api/playlist/${params.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify($searchResult),
        })
        $searchResult = {}
    }
</script>

<svelte:head>
    {#if isEditing}
        <title>Editing {$_('page.playlist.title')}</title>
    {:else}
        <title>{$_('page.playlist.title')}</title>
    {/if}
</svelte:head>

{#await data}
    <div class="loader">
        <LoaderIcon size="100" />
    </div>
{:then { status, images, name, description, filters }}
    {#if status === 404}
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
        <Header
            iconBefore={ChevronLeftIcon}
            onClickBefore={() => push(previousPage)}
            text={$_('app.back')}
            iconAfter={MoreHorizontalIcon}
            onClickAfter={actions}
        />

        <div class="playlist">
            <div class="playlist__title">
                <!--<editor-fold desc="Playlist cover art">-->
                <div class="title__cover">
                    <!--Cannot use the FilterImg component, because this image is too unique ❄-->
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
                    <div class="title__description">
                        {description}
                    </div>
                </div>
            </div>
            <div class="playlist__actions scroll-shadows">
                {#if isEditing}
                    <div
                        on:click={() => openModal(SpotifySearchModal)}
                        class="actions__action actions__action--main item--interactive"
                    >
                        <span class="action__icon action__icon--left"><PlusIcon /></span> Add filter
                    </div>
                {/if}
                {#if !isEditing}
                    <div on:click={() => push(`/playlist/${params.id}/edit`)} class="actions__action item--interactive">
                        Edit
                    </div>
                    <div
                        class="actions__action item--interactive"
                        on:click={() => copyToClipboard(`http://192.168.1.63:3000/#/playlist/${params.id}`)}
                    >
                        Share
                    </div>
                    <!--<editor-fold desc="Playlist taste | On hold">-->
                    <!--<div class="actions__action">-->
                    <!--    Taste the playlist-->
                    <!--    <span class="action__icon action__icon&#45;&#45;right">-->
                    <!--        <PlayIcon />-->
                    <!--    </span>-->
                    <!--</div>-->
                    <!--</editor-fold>-->
                {/if}
            </div>
            <div class="playlist__filters">
                <FilterList data={{ albums: undefined, artists: undefined, tracks: undefined }} />
            </div>
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
        min-height: 200vh;
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

    .playlist__actions {
        display: flex;
        flex-flow: row nowrap;
        white-space: nowrap;

        position: sticky;
        top: 5px;
        box-sizing: border-box;
        width: 100vw;

        margin-top: 15px;
        padding: 0 5px 7px 5px;
        overflow-y: scroll;
        transform: translateX(-10px);
        /*noinspection CssUnknownProperty*/
        scrollbar-width: thin;
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
        .playlist__actions {
            width: 100%;
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
