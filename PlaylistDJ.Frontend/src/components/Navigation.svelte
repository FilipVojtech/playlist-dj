<script lang='ts' xmlns='http://www.w3.org/1999/html'>
    import { ChevronDownIcon, HexagonIcon, HomeIcon, ListIcon, PlusCircleIcon } from 'svelte-feather-icons'
    import PinIcon from './PinIcon.svelte'
    import { link } from 'svelte-spa-router'
    import { _ } from 'svelte-i18n'
    import { fly } from 'svelte/transition'

    let active: string = window.location.hash
    let isOpen: boolean = false

    const routes = [
        { href: '/social', name: 'social', icon: HexagonIcon },
        { href: '/', name: 'home', icon: HomeIcon },
        { href: '/playlists', name: 'playlists', icon: ListIcon },
    ]

    /*
     * Placeholder data
     * todo: Implement pinned playlists
     */
    const playlists = [
        {
            src: 'https://i.scdn.co/image/ab67706f00000003d33da3d4e483709cb1b33c8b',
            name: 'Floating Through Space',
            id: '132abc321cba',
        },
        {
            src: 'https://i.scdn.co/image/ab67616d00001e028ff9ce48387873c883afa037',
            name: 'Arcane League of Legends (Soundtrack from the Animated Series)',
            id: 'necojakoid',
        },
        {
            src: 'https://i.scdn.co/image/ab67616d00001e02c5663e50de353981ed2b1a37',
            name: 'Donda (Deluxe)',
            id: 'UwUOwO',
        },
    ]

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

<main class='nav__wrapper'> <!-- on:touchend={onTouchEnd} on:touchmove={onTouchMove} on:touchstart={onTouchStart}> -->
    <!-- <div class='handle'></div> -->
    <nav class='nav'>
        <!-- Always visible -->
        <div class='primary'>
            {#each routes as { href, icon, name }}
                <div class='primary__item' class:primary__item--active='{active === `#/${name}`}'>
                    <a
                        {href}
                        use:link
                        on:click={() => active = `#/${name}`}
                    >
                        <svelte:component this={icon} size='35' />
                    </a>
                </div>
            {/each}
            <div class='primary__item open-button' class:open-button--closed={!isOpen}
                 on:click={() => isOpen = !isOpen}>
                <ChevronDownIcon size='35' />
            </div>
        </div>

        {#if isOpen}
            <!-- Visible if navigation open -->
            <div class='secondary' in:fly={{ y:200, duration: 300 }}>
                <!-- Create playlist button -->
                <a class='secondary__item secondary__add-playlist' href='/playlist/new' use:link>
                    <span class='secondary__icon'><PlusCircleIcon size='30' /></span>
                    {$_('component.navigation.createPlaylist')}
                </a>
                <!-- Pinned playlist divider -->
                <div class='secondary__item secondary__pin'>
                    <span class='secondary__icon pin-icon'><PinIcon /></span>
                    {$_('component.navigation.pinnedPlaylists')}
                </div>
                <!-- Pinned playlists -->
                <div class='secondary__item secondary__pinned'>
                    {#each playlists as { src, name, id }}
                        <a href='/playlist/{id}' use:link class='playlist'>
                            <img {src} class='playlist__image' alt='{name} playlist icon'/>
                            <p class='playlist__name'>{name}</p>
                        </a>
                    {/each}
                </div>
            </div>
        {/if}
    </nav>
</main>

<style>
    /*.handle {*/
    /*    border: 2px solid gray;*/
    /*    width: 30px;*/
    /*    margin: 0 auto 3px;*/
    /*    border-radius: 25px;*/
    /*}*/

    .nav__wrapper {
        position: absolute;
        bottom: 0;
        width: 100%;
    }

    .nav {
        display: flex;
        flex-direction: column;
        align-items: center;
        border-radius: 20px 20px 0 0;
        background-color: var(--darker-bg);
    }

    .primary {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        max-height: 55px;
        min-height: 55px;
        margin: 0 10px;
        width: 100%;
    }

    .primary__item {
        padding: 3px;
        border-radius: 10px;
    }

    .primary__item--active {
        background-color: white;
    }

    :global(.primary__item--active svg) {
        fill: black;
        stroke: black;
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
        margin-top: 10px;
        max-width: 100vw;
        width: calc(100% - 10px);
        padding: 0 5px;
        display: flex;
        align-items: center;
        flex-direction: column;
    }

    .secondary__item {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        margin: 7px;
        width: inherit;
    }

    .secondary__add-playlist {
        text-transform: uppercase;
    }

    .secondary__icon {
        margin-right: 5px;
    }

    .secondary__pin {
        color: gray;
        padding-bottom: 5px;
        width: 65%;
    }

    .secondary__pinned {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    .playlist {
        display: flex;
        align-items: center;
        justify-content: flex-start;
    }

    .playlist__image {
        width: 50px;
        height: auto;
        margin-right: 10px;
    }

    .playlist__name {
        width: 75vw;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
    }
</style>
