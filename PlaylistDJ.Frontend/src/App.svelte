<script lang='ts'>
    import { Footer, Header } from './components'
    import { Home, HomeLoggedIn, NotFound, Playlist, PlaylistList, Settings, Social } from './pages'
    import Router from 'svelte-spa-router'
    import Navigation from './components/Navigation.svelte'
    import { showNav } from './Utility/stores'

    const isLoggedIn = true //getCookies().user
    console.error('DEV mode enabled change isLoggedIn property')
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
    {/if}
    <div class='main-content'>
        <Router {routes} />
    </div>
    {#if !isLoggedIn}
        <Footer />
    {/if}
    {#if $showNav}
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
