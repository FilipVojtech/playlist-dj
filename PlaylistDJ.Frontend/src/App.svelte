<script lang='ts'>
    import { Footer, Header } from './components'
    import { Home, HomeLoggedIn, NotFound, Playlist, PlaylistList, Settings, Social } from './pages'
    import Router from 'svelte-spa-router'
    import Navigation from './components/Navigation.svelte'

    const isLoggedIn = true //getCookies().user
    const generalRoutes = {
        '/playlist/:id': Playlist,
    }
    const loggedOutRoutes = {
        '/': Home,
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
    {#if !isLoggedIn}
        <Header />
        <div class='main-content'>
            <Router {routes} />
        </div>
        <Footer />
    {:else}
        <div class='main-content'>
            <Router {routes} />
        </div>
        <Navigation />
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
