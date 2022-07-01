<script lang="ts">
    import { Header, LanguagePicker, ListItem } from '../../components'
    import { BellIcon, LogOutIcon, PaperclipIcon, UserIcon } from 'svelte-feather-icons'
    import { _, locale } from 'svelte-i18n'
</script>

<svelte:head>
    <title>{$_('page.settings.title')}</title>
</svelte:head>

<Header text={$_('page.settings.title')} />
<div class="options">
    <div class="options__list">
        <!--App - Start app on screen-->
        <!--Display name, show account info, delete account:-->
        <ListItem href="/settings/account" icon={UserIcon} text={$_('page.settings.account.title')} />
        <ListItem href="/settings/notifications" icon={BellIcon} text={$_('page.settings.communication.title')} />
        <!--<ListItem href="/settings/legal" icon={PaperclipIcon} text={$_('page.settings.legal.title')} />-->
        <a class="item item--interactive" href="/gdpr/{$locale}">
            <span class="item__icon"><PaperclipIcon size="25" /></span>
            {$_('page.settings.legal.title')}
        </a>
        <LanguagePicker />
    </div>
    <footer>
        <!--Log out button-->
        <a class="item item--interactive item--warning" href="/logout" style="padding: 10px 10px">
            <span class="item__icon"><svelte:component this={LogOutIcon} size="25" /></span>
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
