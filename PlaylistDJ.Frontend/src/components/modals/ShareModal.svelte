<script lang="ts">
    import { fade } from 'svelte/transition'
    import { closeModals } from 'svelte-modals'
    import { _ } from 'svelte-i18n'
    import { copyToClipboard } from '../../utility'
    import { onMount } from 'svelte'
    import aport from '../../utility/Aport'
    import Loader from '../Loader.svelte'

    export let isOpen: boolean
    export let playlistId: string

    let privateLink: Promise<string> = new Promise<string>(() => '')

    async function resetCode() {
        aport(`/api/playlist/${playlistId}/share`, { method: 'DELETE' })
            .then(res => {
                console.log(res)
                if (res.ok) privateLink = res.json()
            })
            .catch(e => {
                console.error(e)
            })
    }

    onMount(() => {
        privateLink = aport(`/api/playlist/${playlistId}/share`)
            .then(res => {
                if (res.ok) return res.json()
                else return ''
            })
            .catch(e => {
                console.error(e)
                return ''
            })
    })
</script>

{#if isOpen}
    <div role="dialog" class="modal" transition:fade>
        <div class="modal__contents">
            <div class="modal__title">{$_('modal.share.title')}</div>
            <div class="modal__message form">
                <label class="form__label" for="publicLink">{$_('modal.share.publicLink')}</label>
                <button
                    id="publicLink"
                    title={$_('modal.share.tooltip.copyPublic')}
                    class="item--interactive form__input"
                    on:click={copyToClipboard(window.location.href)}
                >
                    {$_('modal.share.copyPublic')}
                </button>
                <p>{$_('modal.share.message')}</p>
                <label class="form__label" for="privateLink">{$_('modal.share.privateLink')}</label>
                {#await privateLink}
                    <Loader size="25" />
                {:then link}
                    <input id="privateLink" type="text" class="form__input" disabled value={link} />
                    <button class="item--interactive form__input" on:click|preventDefault={copyToClipboard(link)}>
                        {$_('modal.share.copyPrivate')}
                    </button>
                    <button class="item--interactive form__input" on:click={resetCode}>
                        {$_('modal.share.resetPrivate')}
                    </button>
                {/await}
                <p>{$_('modal.share.privateMessage')}</p>
                <div class="modal__actions">
                    <button class="actions__button" on:click|preventDefault={closeModals}>{$_('app.close')}</button>
                </div>
            </div>
        </div>
    </div>
{/if}
