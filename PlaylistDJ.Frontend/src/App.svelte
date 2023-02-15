<script lang="ts">
    import { Loader, LoginButton, Navigation } from './components'
    import { ConsentModal } from './components/modals'
    import { About, Home, NotFound, Playlist, PlaylistList, Social } from './pages'
    import Settings, { Account, Communication, Legal, Profile } from './pages/Settings'
    import Router, { replace } from 'svelte-spa-router'
    import { canCloseModal, showNav, user } from './utility/stores'
    import './utility/i18n'
    import { _, isLoading } from 'svelte-i18n'
    import { closeAllModals, Modals, openModal } from 'svelte-modals'
    import { fade, fly } from 'svelte/transition'
    import wrap from 'svelte-spa-router/wrap'
    import { onMount } from 'svelte'
    import aport from './utility/Aport'
    import System from './System.svelte'

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
        '/settings/legal': wrap({ component: Legal, conditions: [authorize] }),
        '*': NotFound,
    }

    /**
     * Check if media queries use wide layout
     */
    let isWide = window.innerWidth >= 1080

    function authorize(): boolean {
        return !!$user
    }

    function conditionsFailedHandler(e) {
        if (e.detail.route !== '/about' && !$user) {
            replace('/about')
        }
    }

    onMount(async () => {
        const nullDate = new Date(0)
        if ($user) {
            const consentDate: Date = await aport('/api/user/consent')
                .then(res => {
                    if (res.ok) return res.json()
                    else return null
                })
                .then(value => {
                    if (value !== null) return new Date(value['consent'])
                    else return nullDate
                })
                .catch(e => {
                    console.log(e)
                    return nullDate
                })
            if (consentDate.toString() === nullDate.toString()) openModal(ConsentModal)
        }
    })
</script>

<svelte:window on:resize={() => (isWide = window.innerWidth >= 1080)} />

<div class="page">
    {#if !$isLoading}
        <System />
        <main class="main-content">
            {#if !$user}
                <header class="header">
                    <div class="header__row">
                        <img alt="Playlist DJ icon" class="logo__img" src="/images/logo.png" />
                        <h1 class="logo__text">{$_('app.name')}</h1>
                    </div>
                    <LoginButton text={$_('app.login.short')} />
                </header>
            {/if}
            <Router {routes} restoreScrollState={true} on:conditionsFailed={conditionsFailedHandler} />
        </main>
        <div class:nav-space={$showNav} />
        {#if $showNav && $user}
            <div class="nav-wrapper" transition:fly={{ x: isWide ? -350 : 0, y: isWide ? 0 : 55, duration: 200 }}>
                <Navigation />
            </div>
        {/if}
        <Modals>
            <div class="backdrop" on:click={$canCloseModal ? closeAllModals : null} slot="backdrop" transition:fade />
        </Modals>
    {:else}
        <Loader size="100" />
    {/if}
</div>

<style>
    .page {
        display: flex;
        flex-flow: column nowrap;
        width: 100%;
        min-height: 100vh;
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
        max-width: 100vw;
    }

    .header__row {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
    }

    .logo__img {
        margin-right: 10px;
        height: 40px;
    }

    .logo__text {
        font-family: 'saffran', sans-serif;
    }

    .main-content {
        overflow-x: clip;
        padding: env(safe-area-inset-top) 10px 0;
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
