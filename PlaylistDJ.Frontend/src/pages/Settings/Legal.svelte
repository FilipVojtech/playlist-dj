<script lang="ts">
    import Header from '../../components/Header.svelte'
    import { ChevronLeftIcon, PaperclipIcon } from 'svelte-feather-icons'
    import { push } from 'svelte-spa-router'
    import { _, locale } from 'svelte-i18n'
</script>

<Header iconBefore={ChevronLeftIcon} onClickBefore={() => push('/settings')} text={$_('page.settings.legal.title')} />

<a class="item item--interactive" href="/tos/{$locale}">
    <span class="item__icon"><PaperclipIcon size="25" /></span>
    {$_('page.settings.legal.tos')}
</a>
<a class="item item--interactive" href="/privacy/{$locale}">
    <span class="item__icon"><PaperclipIcon size="25" /></span>
    {$_('page.settings.legal.privacyPolicy')}
</a>
