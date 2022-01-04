<script lang='ts'>
    import type { SvelteComponentTyped } from 'svelte'
    import { ChevronLeftIcon } from 'svelte-feather-icons'
    import { pop } from 'svelte-spa-router'
    import { _ } from 'svelte-i18n'

    export let iconBefore: SvelteComponentTyped | null = null
    export let onClickBefore: Function = null
    export let iconAfter: SvelteComponentTyped | null = null
    export let onClickAfter: Function = null
    export let text: string = ''
</script>


<div class='head'>
    {#if !iconBefore && text === ''}
        <div class='head__before head--clickable' on:click={pop}>
            <ChevronLeftIcon size='35' />
            <h1>{$_('app.back')}</h1>
        </div>
    {:else}
        <div class='head__before' class:head--clickable={onClickBefore} on:click={onClickBefore ? onClickBefore : null}>
            <svelte:component size='35' this={iconBefore} />
            <h1>{text}</h1>
        </div>
        {#if iconAfter}
            <span class='icon head--clickable' on:click={onClickAfter}>
                <svelte:component size='35' this={iconAfter} />
            </span>
        {/if}
    {/if}
</div>

<style>
    .head {
        padding-top: 5px;
        display: flex;
        justify-content: space-between;
    }

    .head__before {
        display: flex;
        align-items: center;
    }

    .head--clickable:hover {
        cursor: pointer;
    }
</style>
