<script lang="ts">
    import type { SvelteComponent } from 'svelte'
    import { fly } from 'svelte/transition'

    export let title: string = ''
    export let main: boolean = false
    export let iconRight: SvelteComponent | undefined = undefined
    export let iconLeft: SvelteComponent | undefined = undefined
</script>

<div class="option item--interactive" class:option--main={main} on:click transition:fly|local={{ x: -20 }}>
    {#if iconLeft}<span class="option__icon option__icon--left"><svelte:component this={iconLeft} /></span>{/if}
    <slot>{title}</slot>
    {#if iconRight}<span class="option__icon option__icon--right"><svelte:component this={iconRight} /></span>{/if}
</div>

<style>
    .option {
        display: flex;
        flex-flow: row nowrap;
        white-space: nowrap;

        padding: 3px 7px;
        border-radius: 20px;
        font-size: 18px;
        background-color: var(--lighter-bg);
        margin-right: 5px;
        grid-area: 1/1/2/2;
    }

    .option:last-child {
        margin-right: 0;
    }

    .option--main {
        background-color: var(--main);
    }

    .option__icon {
        align-self: center;
        height: 1em;
        aspect-ratio: 1 / 1;
    }

    .option__icon--left {
        margin-right: 5px;
    }

    .option__icon--right {
        margin-left: 5px;
    }

    @media screen and (min-width: 640px) {
        .option {
            font-size: 22px;
        }
    }
</style>
