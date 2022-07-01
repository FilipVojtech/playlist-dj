<script lang="ts">
    import Header from '../../components/Header.svelte'
    import { ChevronLeftIcon } from 'svelte-feather-icons'
    import { push } from 'svelte-spa-router'
    import { _ } from 'svelte-i18n'
</script>

<Header iconBefore={ChevronLeftIcon} onClickBefore={() => push('/settings')} text={$_('page.settings.legal.title')} />
