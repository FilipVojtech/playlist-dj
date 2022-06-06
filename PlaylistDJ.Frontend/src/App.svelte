<script lang='ts'>
    import { Navigation } from './components'
    import { About, Home, NotFound, Playlist, PlaylistList, Social } from './pages'
    import Settings, { Account, Communication, Profile } from './pages/Settings'
    import Router from 'svelte-spa-router'
    import { showNav, user } from './utility/stores'
    import './utility/i18n'
    import { isLoading } from 'svelte-i18n'
    import { closeAllModals, Modals } from 'svelte-modals'
    import { fade, fly } from 'svelte/transition'
    import { LoaderIcon } from 'svelte-feather-icons'

    const generalRoutes = {
        '/playlist/:id': Playlist,
    }
    const loggedOutRoutes = {
        '/': About,
    }
    const loggedInRoutes = {
        '/': Home,
        '/playlists': PlaylistList,
        '/playlist/:id/edit': Playlist,
        '/social': Social,
        '/settings': Settings,
        '/settings/account': Account,
        '/settings/notifications': Communication,
        '/settings/profile': Profile,
    }
    const generalRoutesAfter = {
        '*': NotFound,
    }
    const routes = $user
        ? { ...generalRoutes, ...loggedInRoutes, ...generalRoutesAfter }
        : { ...generalRoutes, ...loggedOutRoutes, ...generalRoutesAfter }

    /**
     * Check if media queries use wide layout
     */
    const isWide = window.innerWidth >= 1080
</script>

<div class='page'>
    {#if !$isLoading}
        <main class='main-content'>
            <Router {routes} />
        </main>
        <div class:nav-space={$showNav}></div>
        {#if $showNav && $user}
            <div class='nav-wrapper' transition:fly={{ x: isWide ? -350 : 0, y: isWide ? 0 : 55, duration: 200 }}>
                <Navigation />
            </div>
        {/if}
        <Modals>
            <div
                class='backdrop'
                on:click={closeAllModals}
                slot='backdrop'
                transition:fade></div>
        </Modals>
    {:else }
        <div class='loader'>
            <LoaderIcon size='100' />
        </div>
    {/if}
</div>

<style>
    .page {
        display: flex;
        flex-flow: column nowrap;
        width: 100%;
        min-height: 100vh;
    }

    .main-content {
        overflow-x: hidden;
        padding: 0 10px env(safe-area-inset-bottom);
    }

    .nav-wrapper {
        position: fixed;
        bottom: 0;
        width: 100%;
    }

    .nav-space {
        height: calc(55px + env(safe-area-inset-bottom));
    }

    .backdrop {
        position: fixed;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        background: rgba(0, 0, 0, 0.5);
    }

    @supports not ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
        .backdrop {
            background-color: rgba(0, 0, 0, .8);
        }
    }

    @media screen and (min-width: 1080px) {
        .page {
            flex-direction: row;
        }

        .nav-wrapper {
            top: 0;
            order: -1;
            width: 320px;
            height: 100vh;
            position: sticky;
        }
    }

    @media (min-width: 640px) {
        .main-content {
            width: 60vw;
            margin: 0 auto;
        }
    }
</style>
