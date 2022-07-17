<script lang="ts">
    import { fade } from 'svelte/transition'
    import { _ } from 'svelte-i18n'

    export let isOpen: boolean
</script>

{#if isOpen}
    <div role="dialog" class="modal" transition:fade>
        <div class="modal__contents">
            <div class="modal__title">{$_('modal.editPlaylistPicture.title')}</div>
            <div class="modal__actions">
                <input type="submit" class="actions__button" value={$_('app.save')} />
                <button class="actions__button">{$_('app.cancel')}</button>
            </div>
        </div>
    </div>
{/if}
