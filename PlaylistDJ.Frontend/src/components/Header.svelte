<script lang='ts'>
    import LoginButton from './LoginButton.svelte'
</script>

<header>
    <div class='flex-row'>
        <img alt='Playlist DJ icon' src='/images/logo.png' />
        <h1 class='logo__text'>Playlist DJ</h1>
    </div>
    <LoginButton href='/login' text='Log in' />
</header>

<style>
    header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        font-size: 14px;
        padding: 10px;
        max-width: 100vw;
    }

    .logo__text {
        font-family: "saffran", sans-serif;
    }

    .flex-row {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
    }

    img {
        margin-right: 10px;
        height: 40px;
    }
</style>
