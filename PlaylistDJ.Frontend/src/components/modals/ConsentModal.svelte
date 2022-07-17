<script lang="ts">
    import { fade } from 'svelte/transition'
    import { _, locale } from 'svelte-i18n'
    import aport from '../../utility/Aport'
    import { onDestroy, onMount } from 'svelte'
    import { canCloseModal } from '../../utility/stores'

    export let isOpen: boolean
    let checked: boolean = false

    async function handleConsent() {
        await aport('/api/user/consent', { method: 'PATCH' })
        window.location.reload()
    }

    onMount(() => ($canCloseModal = false))
    onDestroy(() => ($canCloseModal = true))
</script>

{#if isOpen}
    <div role="dialog" class="modal" transition:fade>
        <div class="modal__contents">
            <form action="/login" on:submit|preventDefault={handleConsent}>
                <div class="modal__title">{$_('modal.consent.title')}</div>
                <div class="modal__message">
                    <p>{$_('modal.consent.message')}</p>
                    <br />
                    <input type="checkbox" name="gdpr" id="gdpr" bind:checked required />
                    <label for="gdpr">
                        {$_('modal.consent.agree.1')}
                        <!--<a class="link" href="/tos/{$locale}" target="_blank">{$_('modal.consent.tos')}</a>-->
                        <!--{$_('modal.consent.agree.2')}-->
                        <a class="link" href="/privacy/{$locale}" target="_blank">
                            {$_('modal.consent.privacyPolicy')}
                        </a>
                    </label>
                </div>
                <div class="modal__actions">
                    <input
                        type="submit"
                        class:disabled={!checked}
                        class="actions__button"
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
