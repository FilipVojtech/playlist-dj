<script>
    import { LoginButton } from '../components'
    import { LoginWidget } from '../components/widgets'
    import { _ } from 'svelte-i18n'
</script>

<svelte:head>
    <title>{$_('app.name')}</title>
</svelte:head>

<section class="section">
    <h1>{$_('app.welcome')}</h1>
    <p>{$_('app.description')}</p>
</section>
<section class="section">
    <LoginWidget />
</section>

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
