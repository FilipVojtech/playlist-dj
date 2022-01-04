<script>
    import { Header } from '../components'
    import { _ } from 'svelte-i18n'
</script>

<svelte:head>
    <title>{$_('page.playlistList.title')}</title>
</svelte:head>
<Header text={$_('page.playlistList.title')} />
