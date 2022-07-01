<script lang="ts">
    import { Navigation } from './components'
    import { About, Home, NotFound, Playlist, PlaylistList, Social } from './pages'
    import Settings, { Account, Communication, Legal, Profile } from './pages/Settings'
    import Router, { replace } from 'svelte-spa-router'
    import { showNav, user } from './utility/stores'
    import './utility/i18n'
    import { isLoading } from 'svelte-i18n'
    import { closeAllModals, Modals } from 'svelte-modals'
    import { fade, fly } from 'svelte/transition'
    import { LoaderIcon } from 'svelte-feather-icons'
    import wrap from 'svelte-spa-router/wrap'

    const routes = {
        '/': wrap({ component: Home, conditions: [authorize], userData: $user }),
        '/about': About,
        '/playlists': wrap({ component: PlaylistList, conditions: [authorize] }),
        '/playlist/:id': Playlist,
        '/playlist/:id/edit': wrap({ component: Playlist, conditions: [authorize], props: { isEditing: true } }),
        '/social': wrap({ component: Social, conditions: [authorize] }),
        '/settings': wrap({ component: Settings, conditions: [authorize] }),
        '/settings/account': wrap({ component: Account, conditions: [authorize] }),
        '/settings/notifications': wrap({ component: Communication, conditions: [authorize] }),
        '/settings/profile': wrap({ component: Profile, conditions: [authorize] }),
        // '/settings/legal': wrap({ component: Legal, conditions: [authorize] }),
        '*': NotFound,
    }

    /**
     * Check if media queries use wide layout
     */
    const isWide = window.innerWidth >= 1080

    function authorize(): boolean {
        return !!$user
    }

    function conditionsFailedHandler(e) {
        if (e.detail.route !== '/about' && !$user) {
            replace('/about')
        }
    }
</script>

<div class="page">
    {#if !$isLoading}
        <main class="main-content">
            <Router {routes} restoreScrollState={true} on:conditionsFailed={conditionsFailedHandler} />
        </main>
        <div class:nav-space={$showNav} />
        {#if $showNav && $user}
            <div class="nav-wrapper" transition:fly={{ x: isWide ? -350 : 0, y: isWide ? 0 : 55, duration: 200 }}>
                <Navigation />
            </div>
        {/if}
        <Modals>
            <div class="backdrop" on:click={closeAllModals} slot="backdrop" transition:fade />
        </Modals>
    {:else}
        <div class="loader">
            <LoaderIcon size="100" />
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
        overflow-x: clip;
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
            background-color: rgba(0, 0, 0, 0.8);
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
