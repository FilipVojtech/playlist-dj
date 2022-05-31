<script lang='ts'>

    import aport from '../../utility/Aport'
    import FilterPlaceholder from '../FilterPlaceholder.svelte'
    import { PlusIcon } from 'svelte-feather-icons'
    import { _ } from 'svelte-i18n'

    export let slim: boolean = false
    let isCreating: boolean = false
    let playlistName: string = $_('page.playlistList.newPlaylist')

    function itemOnClickHandle() {
        isCreating = true
    }

    function cancelHandle(e) {
        if (e.key !== 'Escape' && e.key !== 'Esc' && e.key !== undefined) {
            return
        }
        isCreating = false
        playlistName = $_('page.playlistList.newPlaylist')
    }

    async function createPlaylist() {
        if (playlistName.length < 1) {
            return
        }

        await aport('/api/playlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: playlistName }),
        })
    }
</script>

{#if !isCreating}
    <div class='item item--interactive' class:item--slim={slim} on:click={itemOnClickHandle}>
        <FilterPlaceholder icon={PlusIcon} />
        <div class='filter__info'>{$_('page.playlistList.createPlaylist')}</div>
    </div>
{:else}
    <div class='item item--column'>
        <form on:submit|preventDefault={createPlaylist} class='form'>
            <label for='playlistName' class='form__label'>
                {$_('page.playlistList.playlistName')}
            </label>
            <input
                type='text'
                id='playlistName'
                name='playlistName'
                class='form__input'
                autofocus
                required
                bind:value={playlistName}
                on:keyup={cancelHandle}
            >
        </form>
        <div class='actions'>
            <button class='action text--accept' on:click={createPlaylist} class:action--disabled={playlistName.length < 1}>
                {$_('app.create')}
            </button>
            <button class='action text--reject' on:click={cancelHandle}>{$_('app.cancel')}</button>
        </div>
    </div>
{/if}

<style>
    .item--column {
        flex-direction: column;
        align-items: flex-start;
    }

    .actions {
        display: flex;
        border-radius: 15px;
        width: 100%;
        overflow: hidden;
    }

    .action {
        border: unset;
        padding: 10px;
        background-color: var(--darker-bg);
        cursor: pointer;
        flex-grow: 1;
        font-size: 16px;
    }

    .action:first-of-type {
        margin-right: 2px;
    }

    .action--disabled {
        background-color: unset;
        color: grey;
        cursor: default;
    }
</style>
