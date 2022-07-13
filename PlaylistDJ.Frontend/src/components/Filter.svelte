<script lang="ts">
    import type { Spotify, FilterType } from '@playlist-dj/types'
    import FilterImg from './FilterImg.svelte'
    import { UserIcon } from 'svelte-feather-icons'
    import { slide } from 'svelte/transition'

    export let name: string
    export let images: Spotify.Images = []
    export let type: FilterType
    export let id: string
    export let actions: { icon; onClick: Function }[] = []

    const interactive = actions.length > 0
    let showActions = false

    function handleClick() {
        showActions = !showActions
    }
</script>

<div class="item filter" class:item--interactive={interactive}>
    <div class="filter__main-details" on:click={handleClick}>
        <FilterImg {images} {name} alt="{name} artist picture" placeholderIcon={UserIcon} />
        <div>
            <div class="main-details__name">{name}</div>
            <div class="main-details__artists">
                <slot name="artists" />
            </div>
        </div>
    </div>
    <div class="filter__minor-details" on:click={handleClick}>
        <slot />
    </div>
    {#if interactive && showActions}
        <div class="filter__actions" transition:slide|local={{ duration: 300 }}>
            {#each actions as { icon, onClick }}
                <div class="filter__actions__action" on:click={() => onClick({ id, type })}>
                    <svelte:component this={icon} />
                </div>
            {/each}
        </div>
    {/if}
</div>

<style>
    .filter {
        display: flex;
        margin: 5px 0;
        user-select: none;
        flex-direction: column;
    }

    .filter > * {
        width: 100%;
    }

    .filter__main-details {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .main-details__name {
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .main-details__artists {
        font-size: 16px;
        color: var(--text-darker);
    }

    .filter__actions {
        display: flex;
        margin-top: 5px;
        width: 100%;
        overflow: scroll;
        border-radius: 10px;
    }

    .filter__actions__action {
        aspect-ratio: 1 / 1;
        height: 30px;
        padding: 5px;
        margin-right: 3px;
        background-color: var(--darker-bg);
        border-radius: 10px;
    }
</style>
