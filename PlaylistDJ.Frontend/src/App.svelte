<script lang='ts'>
    import { Navigation } from './components'
    import { About, Home, NotFound, Playlist, PlaylistList, Social } from './pages'
    import Settings, { Account, Communication, Profile } from './pages/Settings'
    import Router from 'svelte-spa-router'
    import { showNav, user } from './utility/stores'
    import './utility/i18n'
    import { isLoading } from 'svelte-i18n'
    import { closeAllModals, Modals } from 'svelte-modals'
    import { fade } from 'svelte/transition'
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
</script>

<main>
    {#if !$isLoading}
        <div class='main-content'>
            <Router {routes} />
        </div>
        <div class:nav-space={$showNav} ></div>
        {#if $showNav && $user}
            <Navigation />
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
</main>

<style>
    .main-content {
        max-width: 100vw;
        padding: 0 10px;
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

    @media (min-width: 640px) {
        .main-content {
            max-width: 60vw;
            margin: auto;
        }
    }
</style>
