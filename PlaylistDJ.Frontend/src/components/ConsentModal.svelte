<script lang="ts">
    import { fade } from 'svelte/transition'
    import { closeModals } from 'svelte-modals'
    import { _ } from 'svelte-i18n'
    import { replace } from 'svelte-spa-router'
    import aport from '../utility/Aport'

    export let isOpen: boolean
    let checked: boolean = false

    async function handleConsent() {
        await aport('/api/user/consent', { method: 'PATCH' })
        window.location.reload()
    }
</script>

{#if isOpen}
    <div role="dialog" class="modal" transition:fade>
        <div class="modal__contents">
            <form action="/login">
                <div class="modal__title">{$_('modal.consent.title')}</div>
                <div class="modal__message">
                    <p>{$_('modal.consent.message')}</p>
                    <br />
                    <input type="checkbox" name="gdpr" id="gdpr" bind:checked required />
                    <label for="gdpr">
                        {$_('modal.consent.agree.1')}
                        <a class="link" href="/tos">{$_('modal.consent.tos')}</a>
                        {$_('modal.consent.agree.2')}
                        <a class="link" href="/privacy">{$_('modal.consent.privacyPolicy')}</a>
                    </label>
                </div>
                <div class="modal__actions">
                    <input
                        type="submit"
                        class:disabled={!checked}
                        class="actions__button"
                        on:click={handleConsent}
                        disabled={!checked}
                        value={$_('app.continue')}
                    />
                    <button class="actions__button" on:click|preventDefault={() => window.location.replace('/logout')}>
                        {$_('app.logout')}
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}

<style>
    .disabled {
        background: none;
        color: grey;
        cursor: default;
    }
</style>
