<!-- Show system messages that require loaded locale -->
<script lang="ts">
    import { onMount } from 'svelte'
    import { openModal } from 'svelte-modals'
    import { OkModal } from './components/modals'
    import { _ } from 'svelte-i18n'
    import { message } from './utility/stores'
    import { replace } from 'svelte-spa-router'

    onMount(() => {
        const query = new URLSearchParams(window.location.search)

        if (query.has('message')) {
            $message = <string>query.get('message')
            query.delete('message')
            const url = new URL(window.location.toString())
            replace(url.hash)
        }

        if ($message && !query.has('message')) {
            openModal(OkModal, { message: $_(`messages.${$message}`) })
        }
    })
</script>
