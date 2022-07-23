<script lang="ts">
    import type { FilterType, Spotify } from '@playlist-dj/types'
    import FilterImg from './FilterImg.svelte'
    import { slide } from 'svelte/transition'

    export let name: string
    export let images: Spotify.Images = []
    export let altSubject: ''
    export let placeholderIcon
    export let type: FilterType
    export let id: string
    export let actions: { icon; onClick: Function }[] = []
    export let slim: boolean = false
    export let half: boolean = true
    export let onClick = () => (showActions = !showActions)

    const interactive = actions.length > 0
    let showActions = false
</script>

<div class="item filter" class:item--interactive={interactive} class:item--slim={slim}>
    <!--class:item--slim={slim} class:item--half={half}-->
    <div class="filter__main-details" on:click={onClick}>
        <FilterImg alt="{name} {altSubject}" {images} {name} {placeholderIcon} />
        <div>
            <div class="main-details__name">{name}</div>
            <div class="main-details__artists">
                <slot name="artists" />
            </div>
        </div>
    </div>
    <div class="filter__minor-details" on:click={onClick}>
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
        margin-top: 10px;
        width: 100%;
        border-radius: 10px;
        justify-content: center;
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
