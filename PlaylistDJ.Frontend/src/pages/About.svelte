<script>
    import { LoginButton } from '../components'
    import { LoginWidget } from '../components/widgets'
    import { link } from 'svelte-spa-router'
    import { _ } from 'svelte-i18n'
</script>

<svelte:head>
    <title>{$_('app.name')}</title>
</svelte:head>
<main>
    <header class='header'>
        <div class='header__row'>
            <img alt='Playlist DJ icon' class='logo__img' src='/images/logo.png' />
            <h1 class='logo__text'>{$_('app.name')}</h1>
        </div>
        <LoginButton text={$_('app.login.short')} />
    </header>
    <section class='section'>
        <h1>{$_('app.welcome')}</h1>
        <p>{$_('app.description')}</p>
    </section>
    <section class='section'>
        <LoginWidget />
    </section>
</main>

<style>
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
        font-family: "saffran", sans-serif;
    }

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
