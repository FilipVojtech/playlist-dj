<script lang="ts">
    import { _ } from 'svelte-i18n'
    import { Header } from '../../components'
    import { ChevronLeftIcon } from 'svelte-feather-icons'
    import { push } from 'svelte-spa-router'
</script>

<Header iconBefore={ChevronLeftIcon} onClickBefore={() => push('/settings')} text={$_('page.settings.profile.title')} />
