<script lang='ts'>
    import { Footer } from './components'
    import { About, HomeLoggedIn, NotFound, Playlist, PlaylistList, Settings, Social } from './pages'
    import Router from 'svelte-spa-router'
    import Navigation from './components/Navigation.svelte'
    import { showNav } from './Utility/stores'
    import './Utility/i18n'
    import { isLoading } from 'svelte-i18n'
    import { getCookies } from './Utility'

    const isLoggedIn = getCookies().user
    // console.error('DEV mode enabled change isLoggedIn property')
    const generalRoutes = {
        '/playlist/:id': Playlist,
    }
    const loggedOutRoutes = {
        '/': About,
    }
    const loggedInRoutes = {
        '/': HomeLoggedIn,
        '/playlists': PlaylistList,
        '/social': Social,
        '/settings': Settings,
    }
    const generalRoutesAfter = {
        '*': NotFound,
    }
    const routes = isLoggedIn
        ? { ...generalRoutes, ...loggedInRoutes, ...generalRoutesAfter }
        : { ...generalRoutes, ...loggedOutRoutes, ...generalRoutesAfter }
</script>

<main>
    {#if !$isLoading}
        <div class='main-content'>
            <Router {routes} />
        </div>
        {#if !isLoggedIn}
            <Footer />
        {/if}
        {#if $showNav && isLoggedIn}
            <Navigation />
        {/if}
    {:else }
        <p>Loading...</p>
    {/if}
</main>

<style>
    .main-content {
        /* Whole page - height of the nav */
        min-height: calc(100vh - 62px);
        max-width: 100vw;
        padding: 0 10px;
    }

    @media (min-width: 640px) {
        .main-content {
            max-width: 60vw;
            margin: auto;
        }
    }
</style>
