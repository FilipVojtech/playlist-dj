<script lang='ts'>
    import Router from 'svelte-spa-router'
    import { Home, NotFound, Playlist, PlaylistList, Settings, Social } from '../pages'

    const isLoggedIn = true
    const generalRoutes = {
        '/': Home,
        '/playlist/:id': Playlist,
    }
    const loggedInRoutes = {
        '/playlists': PlaylistList,
        '/social': Social,
        '/settings': Settings,
    }
    const generalRoutesAfter = {
        '*': NotFound,
    }
    const routes = isLoggedIn
        ? { ...generalRoutes, ...loggedInRoutes, ...generalRoutesAfter }
        : { ...generalRoutes, ...generalRoutesAfter }
</script>

<Router {routes} />
