<script lang='ts'>
    import { Header, LanguagePicker, ListItem } from '../../components'
    import { BellIcon, LogOutIcon, UserIcon } from 'svelte-feather-icons'
    import { _ } from 'svelte-i18n'
</script>

<svelte:head>
    <title>{$_('page.settings.title')}</title>
</svelte:head>
    <Header text={$_('page.settings.title')} />
<div class='options'>
    <div class='options__list'>
        <!--App - Start app on screen-->
        <!--Display name, show account info, delete account:-->
        <ListItem href='/settings/account' icon={UserIcon} text={$_('page.settings.account.title')} />
        <!--Legal - Legal documents and other stuff-->
        <ListItem href='/settings/notifications' icon={BellIcon} text={$_('page.settings.communication.title')} />
        <LanguagePicker />
    </div>
    <footer>
        <!--Log out button-->
        <a class='item item--interactive item--warning' href='/logout' style='padding: 10px 10px'>
            <span class='item__icon'><svelte:component size='25' this='{LogOutIcon}' /></span>
            {$_('app.logout')}
        </a>
    </footer>
</div>

<style>
    .options {
        display: flex;
        flex-direction: column;
    }
</style>
