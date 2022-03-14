<script lang='ts'>
    import type { Spotify } from '@playlist-dj/types'
    import { UserIcon } from 'svelte-feather-icons'
    import { searchResult } from '../Utility/stores'
    import { closeModal } from 'svelte-modals'

    export let artists: Spotify.Artist[] = []

    function handleClick(id: string) {
        $searchResult = id
        closeModal()
    }
</script>

{#each artists as { images, name, type, id }}
    <div class='item item--interactive filter' on:click={() => {handleClick(id)}}>
        {#if images.length === 3}
            <img alt='{name} artist picture' class='filter__img' src='{images[2].url}' />
        {:else}
            <div class='filter__img placeholder'>
                <UserIcon size='32' />
            </div>
        {/if}
        <div class='filter__info'>
            <div class='info__name'>{name}</div>
        </div>
    </div>
{/each}

<style>
    .placeholder {
        display: flex;
        justify-content: center;
        align-items: center;
        min-width: 56px;
        min-height: 56px;
        background-color: var(--darker-bg);
    }
</style>
