<script>
    import { Header } from '../components'
    import { _ } from 'svelte-i18n'
</script>

<svelte:head>
    <title>{$_('page.social.title')}</title>
</svelte:head>
<Header text={$_('page.social.title')} />
