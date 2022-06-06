<script lang='ts' xmlns='http://www.w3.org/1999/html'>
    import { ChevronDownIcon, HexagonIcon, HomeIcon, ListIcon } from 'svelte-feather-icons'
    import PinIcon from './PinIcon.svelte'
    import { link, location, push } from 'svelte-spa-router'
    import { _ } from 'svelte-i18n'
    import { fly } from 'svelte/transition'
    import CreatePlaylist from './widgets/CreatePlaylist.svelte'
    import { onMount } from 'svelte'
    import aport from '../utility/Aport'
    import PlaylistList from '../components/PlaylistList.svelte'

    let isOpen: boolean = false
    let pinnedPlaylists: [] = []

    const routes = [
        { href: '/playlists', name: 'playlists', icon: ListIcon },
        { href: '/social', name: 'social', icon: HexagonIcon },
    ]

    onMount(async () => {
        pinnedPlaylists = await aport('/api/playlist?pinned=true')
            .then(value => value.json())
    })

    // This is for a future endeavour to implement swipe to open navigation
    // todo: Implement swipe to open navigation
    // let originalPosition
    // let difference

    // function onTouchStart(e) {
    //     console.log(e)
    // }

    // function onTouchMove(e) {
    //     console.log(e)
    // }

    // function onTouchEnd(e) {
    //     console.log(e)
    // }
</script>

<!--<div class='handle'></div>-->
<nav class='nav'> <!-- on:touchend={onTouchEnd} on:touchmove={onTouchMove} on:touchstart={onTouchStart}> -->
    <!-- Always visible -->
    <div class='primary'>
        <div class='primary__item logo'>
            <img alt='Playlist DJ icon' class='logo__img' src='/images/logo.png' />
            <h1 class='logo__text'>{$_('app.name')}</h1>
        </div>
        {#each routes as { href, icon, name }}
            <a
                class='primary__item'
                class:primary__item--active={$location.startsWith(href)}
                {href}
                use:link
                on:click={() => isOpen = false}
            >
                <span><svelte:component this={icon} size='35' /></span>
                <div class='item__name'>{$_(`component.navigation.${name}`)}</div>
            </a>
        {/each}
        <div
            class='primary__item open-button'
            class:open-button--closed={!isOpen}
            on:click={() => isOpen = !isOpen}
        >
            <ChevronDownIcon size='35' />
        </div>
    </div>

    <!-- Visible if navigation open -->
    <div class='secondary' class:secondary--shown='{isOpen}' transition:fly={{ y:200, duration: 300 }}>
        <CreatePlaylist slim />
        {#if pinnedPlaylists.length > 0}
            <!-- Pinned playlist divider -->
            <div class='secondary__item secondary__pin'>
                <span class='secondary__icon pin-icon'><PinIcon /></span>
                {$_('component.navigation.pinnedPlaylists')}
            </div>
            <!-- Pinned playlists -->
            <div class='secondary__item secondary__list'>
                <PlaylistList
                    playlists='{pinnedPlaylists}'
                    on:click={e => push(`/playlist/${e.detail.id}`)}
                    slim
                />
            </div>
        {/if}
    </div>
</nav>

<style>
    /*.handle {*/
    /*    border: 2px solid gray;*/
    /*    width: 30px;*/
    /*    margin: 0 auto 3px;*/
    /*    border-radius: 25px;*/
    /*}*/

    .nav {
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow-y: scroll;
        max-height: 80vh;

        padding-bottom: env(safe-area-inset-bottom);
        border-radius: 20px 20px 0 0;
        box-shadow: 0 -5px 10px var(--darker-bg);

        background-color: var(--darker-bg);
        /*Enable when nav is draggable*/
        /*margin: 0 10px;*/
    }

    .primary {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        height: 55px;
        width: calc(100% - 20px);
    }

    .logo {
        display: none;
    }

    .primary__item {
        padding: 3px;
        border-radius: 10px;
    }

    .primary__item--active {
        background-color: var(--main);
    }

    .item__name {
        display: none;
    }

    :global(.primary__item--active svg) {
        fill: white;
        transform: scale(0.8);
    }

    .open-button {
        transition: 300ms;
    }

    .open-button--closed {
        transform: rotate(180deg);
        transition: 300ms;
    }

    .secondary {
        display: none;
        flex-direction: column;
        width: calc(100% - 20px);
    }

    .secondary--shown {
        display: flex;
    }

    .secondary__item {
        display: flex;
        flex-direction: row;
        justify-content: center;
    }

    .secondary__icon {
        margin-right: 5px;
    }

    .secondary__pin {
        align-self: center;
        width: 90%;
        margin-top: 20px;
        margin-bottom: 5px;
        padding-bottom: 5px;
        border-bottom: 1px solid gray;

        color: gray;
        user-select: none;
    }

    .secondary__list {
        flex-direction: column;
    }

    @media screen and (min-width: 1080px) {
        /*.handle {*/
        /*    display: none;*/
        /*}*/
        .nav {
            box-sizing: border-box;
            height: -webkit-fill-available;
            height: 100%;
            max-height: unset;
            margin: 0;
            padding-bottom: 0;
            overflow-y: auto;
            border-radius: 0 20px 20px 0;
            box-shadow: 10px 0 20px -5px var(--darker-bg);
        }

        .primary {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            height: unset;
            margin: 10px 0;
        }

        .logo {
            display: flex;
            flex-direction: row;
            margin-bottom: 20px !important;
        }

        .logo__img {
            margin-right: 10px;
            height: 40px;
        }

        .logo__text {
            user-select: none;
            font-family: "saffran", sans-serif;
        }

        .primary__item {
            padding: 10px;
            display: flex;
            align-items: center;
            margin: 3px 0 3px 3px;
        }

        .primary__item--active {
            background-color: initial;
            border: 3px solid var(--main);
            margin: 0;
        }

        .item__name {
            display: initial;
            width: auto;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-left: 10px;
            font-size: 24px;
        }

        :global(.primary__item--active svg) {
            fill: var(--main);
            stroke: var(--main);
            transform: scale(1);
        }

        .open-button {
            display: none;
        }

        .secondary {
            display: flex;
        }
    }
</style>
