<script lang='ts'>
    import { fade } from 'svelte/transition'
    import { closeModal } from 'svelte-modals'

    export let isOpen: boolean
</script>

{#if isOpen}
    <div role='dialog' class='modal' transition:fade>
        <div class='modal__contents'>
            <div class='modal__title'>Import a playlist file</div>
            <div class='modal__message'>
                <input type='file' accept='.m3u'>
            </div>
            <div class='modal__actions'>
                <button class='actions__button' on:click={closeModal}>Upload</button> <!--class:actions__button--inactive={}-->
                <button class='actions__button' on:click={closeModal}>Cancel</button>
            </div>
        </div>
    </div>
{/if}
