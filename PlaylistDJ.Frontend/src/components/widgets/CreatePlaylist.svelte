<script lang="ts">
    import aport from '../../utility/Aport'
    import FilterPlaceholder from '../FilterPlaceholder.svelte'
    import { PlusIcon } from 'svelte-feather-icons'
    import { _ } from 'svelte-i18n'

    export let slim: boolean = false
    export let half: boolean = false
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
            body: JSON.stringify({ name: playlistName }),
        })
    }
</script>

{#if !isCreating}
    <div class="item item--interactive" class:item--half={half} class:item--slim={slim} on:click={itemOnClickHandle}>
        <FilterPlaceholder icon={PlusIcon} />
        <div class="filter__info font--small-caps">{$_('widget.createPlaylist.action')}</div>
    </div>
{:else}
    <div class="item item--column" class:item--half={half}>
        <form on:submit|preventDefault={createPlaylist} class="form">
            <label for="playlistName" class="form__label">
                {$_('widget.createPlaylist.playlistName')}
            </label>
            <!-- svelte-ignore a11y-autofocus -->
            <input
                type="text"
                id="playlistName"
                name="playlistName"
                class="form__input font--small-caps"
                autofocus
                required
                bind:value={playlistName}
                on:keyup={cancelHandle}
            />
            <div class="item__actions">
                <input
                    type="submit"
                    class="item__actions__action text--accept"
                    class:item__actions__action--disabled={playlistName.length < 1}
                    value={$_('app.create')}
                />
                <button class="item__actions__action text--reject" on:click={cancelHandle}>{$_('app.cancel')}</button>
            </div>
        </form>
    </div>
{/if}
