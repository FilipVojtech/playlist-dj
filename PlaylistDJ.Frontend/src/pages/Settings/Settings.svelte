<script lang='ts'>
    import { Header, LanguagePicker, ListItem } from '../../components'
    import { BellIcon, ChevronLeftIcon, LogOutIcon } from 'svelte-feather-icons'
    import { push } from 'svelte-spa-router'
    import { onDestroy, onMount } from 'svelte'
    import { showNav } from '../../Utility/stores'
    import { _ } from 'svelte-i18n'

    onMount(() => $showNav = false)
    onDestroy(() => $showNav = true)
</script>

<svelte:head>
    <title>{$_('page.settings.title')}</title>
</svelte:head>
<main class='options'>
    <Header iconBefore={ChevronLeftIcon} onClickBefore={() => push('/')} text={$_('page.settings.title')} />
    <div class='options__list'>
        <!--        <ListItem href='/settings/account' icon={LockIcon} text={$_('page.settings.account.title')} />-->
        <!--        <ListItem href='/settings/profile' icon={UserIcon} text={$_('page.settings.profile.title')} />-->
        <ListItem href='/settings/notifications' icon={BellIcon} text={$_('page.settings.communication.title')} />
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
