<script lang='ts'>
    import { Header, LanguagePicker } from '../components'
    import { ChevronLeftIcon, LogOutIcon } from 'svelte-feather-icons'
    import { pop } from 'svelte-spa-router'
    import { onDestroy, onMount } from 'svelte'
    import { showNav } from '../Utility/stores'
    import { _ } from 'svelte-i18n'

    onMount(() => $showNav = false)
    onDestroy(() => $showNav = true)
</script>

<svelte:head>
    <title>{$_('page.settings.title')}</title>
</svelte:head>
<main class='options'>
    <Header iconBefore={ChevronLeftIcon} onClickBefore={pop} text={$_('page.settings.title')} />
    <div class='options__list'>
        <LanguagePicker />
    </div>
    <footer>
        <!--Log out button-->
        <a class='item item--warning' href='/logout' style='padding: 10px 10px'>
            <span class='item__icon'><svelte:component size='25' this='{LogOutIcon}' /></span>
            {$_('app.logout')}
        </a>
    </footer>
</main>

<style>
    .options {
        display: flex;
        flex-direction: column;
        height: 100vh;
    }

    .options__list {
        flex-grow: 1;
    }
</style>
