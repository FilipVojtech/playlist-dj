<!--Generic modal that can be configured with multiple buttons-->
<script lang='ts'>
    import { fade } from 'svelte/transition'

    export let isOpen: boolean
    export let title: string = ''
    export let message: string
    export let actions: [{ onClick: Function, title: string }] = []
</script>

{#if isOpen}
    <div role='dialog' class='modal' transition:fade>
        <div class='modal__contents'>
            <div class='modal__title'>{title}</div>
            {#if message}
                <div class='modal__message'>{message}</div>
            {/if}
            <div class='modal__actions'>
                {#each actions as { onClick, title }}
                    <button class='actions__button' on:click={onClick}>{title}</button>
                {/each}
            </div>
        </div>
    </div>
{/if}
