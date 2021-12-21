<script lang='ts'>
    import { FeatherIcon, HexagonIcon, HomeIcon, ListIcon } from 'svelte-feather-icons'
    import { link } from 'svelte-spa-router'

    interface RouterLink {
        href: string
        icon: FeatherIcon
        name: string
    }

    const routes = [
        { href: '/', name: 'home', icon: HomeIcon },
        { href: '/social', name: 'social', icon: HexagonIcon }, // or RadioIcon
        { href: '/playlists', name: 'playlists', icon: ListIcon },
    ] as RouterLink[]

    let active: string = window.location.hash
</script>

<main class='nav__wrapper'>
    <div class='handle'></div>
    <nav class='nav'>
        {#each routes as { href, icon, name }}
            <div class='nav__item' class:nav__item--active={active === `#/${name}`}>
                <a
                    class='nav__link'
                    {href}
                    use:link
                    on:click={()=>active = `#/${name}`}
                >
                    <svelte:component this={icon} size='35' />
                </a>
            </div>
        {/each}
    </nav>
</main>

<style>
    .handle {
        border: 2px solid gray;
        width: 30px;
        margin: 0 auto 3px;
        border-radius: 25px;
    }

    .nav__wrapper {
        position: sticky;
        bottom: 0;
    }

    .nav {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        max-height: 55px;
        min-height: 55px;
        margin: 0 10px;
        border-radius: 20px 20px 0 0;
        background-color: var(--darker-bg);
    }

    .nav__item {
        padding: 3px;
        border-radius: 10px;
    }

    .nav__item--active {
        background-color: white;
    }

    :global(.nav__item--active svg) {
        fill: black;
        stroke: black;
        transform: scale(0.8);
    }

    .nav__link {
    }
</style>
