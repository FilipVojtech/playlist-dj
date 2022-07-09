<script lang="ts">
    import { fade } from 'svelte/transition'
    import { closeModals } from 'svelte-modals'
    import { _ } from 'svelte-i18n'

    export let isOpen: boolean
    let checked: boolean = false
</script>

{#if isOpen}
    <div role="dialog" class="modal" transition:fade>
        <div class="modal__contents">
            <form action="/login">
                <div class="modal__title">{$_('modal.register.title')}</div>
                <div class="modal__message">
                    <p>{$_('modal.register.message')}</p>
                    <br />
                    <input type="checkbox" name="gdpr" id="gdpr" bind:checked required />
                    <label for="gdpr">
                        {$_('modal.register.consent.1')}
                        <a class="link" href="/tos">{$_('modal.register.tos')}</a>
                        {$_('modal.register.consent.2')}
                        <a class="link" href="/privacy">{$_('modal.register.privacyPolicy')}</a>
                    </label>
                </div>
                <div class="modal__actions">
                    <input
                        type="submit"
                        class="actions__button"
                        class:disabled={!checked}
                        disabled={!checked}
                        value={$_('app.continue')}
                    />
                    <button class="actions__button" on:click|preventDefault={closeModals}>{$_('app.cancel')}</button>
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
