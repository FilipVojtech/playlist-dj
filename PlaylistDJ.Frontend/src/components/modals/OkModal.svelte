<!--Modal for messages with informative character-->
<script lang="ts">
    import { fade } from 'svelte/transition'
    import { closeModal } from 'svelte-modals'

    export let isOpen: boolean
    export let title: string = ''
    export let message: string
</script>

{#if isOpen}
    <div role="dialog" class="modal" transition:fade>
        <div class="modal__contents">
            <div class="modal__title">{title}</div>
            <div class="modal__message">{message}</div>
            <div class="modal__actions">
                <button class="actions__button" on:click={closeModal}>Ok</button>
            </div>
        </div>
    </div>
{/if}
