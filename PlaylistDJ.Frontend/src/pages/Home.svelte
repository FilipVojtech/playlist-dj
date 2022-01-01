<script>
    import { LoginWidget } from '../components/widgets'
    import { link } from 'svelte-spa-router'
    import { _ } from 'svelte-i18n'
</script>

<svelte:head>
    <title>{$_('page.home.title')}</title>
</svelte:head>
<main>
    <section class='section'>
        <h1>{$_('app.welcome')}</h1>
        <p>{$_('app.description')}</p>
    </section>
    <section class='section'>
        <LoginWidget />
    </section>
    <section class='section'>
        <div>
            <a href='/playlists' use:link>Playlists</a>
        </div>
        <div>
            <a href='/playlist/abc123cba321' use:link>Playlist abc123cba321</a>
        </div>
    </section>
</main>

<style>
    .section {
        margin: 25px 0;
    }

    .section:first-child {
        margin-top: 10px;
    }

    .section:last-child {
        margin-bottom: 10px;
    }
</style>
