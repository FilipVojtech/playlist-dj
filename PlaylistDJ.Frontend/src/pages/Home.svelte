<script>
    import { LoginWidget } from '../components/widgets'
    import { link } from 'svelte-spa-router'
</script>

<main>
    <section class='section'>
        <h1>Welcome to Playlist DJ</h1>
        <p>Manage your Spotify playlists with ease</p>
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
