<script lang='ts'>
    import { Navigation } from './components'
    import { About, Home, NotFound, Playlist, PlaylistList, Social } from './pages'
    import Settings, { Account, Communication, Profile } from './pages/Settings'
    import Router from 'svelte-spa-router'
    import { showNav, user } from './Utility/stores'
    import './Utility/i18n'
    import { isLoading } from 'svelte-i18n'
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
        <!--{#if !$user}-->
        <!--todo: Footer-->
        <!--{/if}-->
        {#if $showNav && $user}
            <Navigation />
        {/if}
    {:else }
        <div class='loader'>
            <LoaderIcon size='100' />
        </div>
    {/if}
</main>

<style>
    .main-content {
        /* Whole page - height of the nav */
        min-height: calc(100vh - 62px);
        max-width: 100vw;
        padding: 0 10px;
    }

    .loader {
        animation: rotate 3s linear infinite;
    }

    @keyframes rotate {
        from {
            transform: rotate(0deg);
        }

        to {
            transform: rotate(360deg);
        }
    }

    @media (min-width: 640px) {
        .main-content {
            max-width: 60vw;
            margin: auto;
        }
    }
</style>
