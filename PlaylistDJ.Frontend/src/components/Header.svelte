<script lang='ts'>
    import LoginButton from './LoginButton.svelte'
    import { _ } from 'svelte-i18n'
</script>

<header class='header'>
    <div class='header__row'>
        <img alt='Playlist DJ icon' class='logo__img' src='/images/logo.png' />
        <h1 class='logo__text'>{$_('app.name')}</h1>
    </div>
    <LoginButton text={$_('app.login.short')} />
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
