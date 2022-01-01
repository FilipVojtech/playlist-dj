<script>
    import Title from '../components/Title.svelte'
    import { _ } from 'svelte-i18n'
</script>

<svelte:head>
    <title>{$_('page.social.title')}</title>
</svelte:head>
<Title text={$_('page.social.title')} />
