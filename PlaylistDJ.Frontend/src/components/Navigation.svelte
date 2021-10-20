<script lang='ts'>
    import { link } from 'svelte-spa-router'
    import { createEventDispatcher } from 'svelte'

    const dispatch = createEventDispatcher()

    interface RouterLink {
        href: string
        icon: string
        title: string
    }

    const routes = [
        { href: '/', title: 'Home', icon: 'home' },
        { href: 'social', title: 'Social', icon: 'radio' },
        { href: 'playlists', title: 'Playlists', icon: 'list' },
        { href: 'settings', title: 'Settings', icon: 'settings' },
    ] as RouterLink[]
</script>

<nav class='flexColumn'>
    {#each routes as { icon, href, title }}
        <div class='flex-row'>
            <a
                {href}
                on:click={() => dispatch('closeNav')}
                use:link
            >{title}</a>
        </div>
    {/each}
</nav>
