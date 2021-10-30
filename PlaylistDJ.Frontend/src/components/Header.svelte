<script>
    import { SpotifyButton } from './'
</script>

<header class='header'>
    <div class='header__row'>
        <img alt='Playlist DJ icon' class='logo__img' src='/images/logo.png' />
        <h1 class='logo__text'>Playlist DJ</h1>
    </div>
    <SpotifyButton href='/login' text='Log in' />
</header>

<style>
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        font-size: 14px;
        padding: 10px;
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
        font-family: "saffran", sans-serif;
    }
</style>
