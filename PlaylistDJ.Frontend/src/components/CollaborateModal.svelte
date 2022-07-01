<script lang="ts">
    import { fade } from 'svelte/transition'
    import { closeModal } from 'svelte-modals'
    import { onMount } from 'svelte'
    import aport from '../utility/Aport'
    import { LoaderIcon } from 'svelte-feather-icons'
    import { _ } from 'svelte-i18n'
    import AddUser from './AddUser.svelte'
    import UserList from './UserList.svelte'

    export let isOpen: boolean
    export let playlistId: string
    let data: Promise<[]> = new Promise<[]>(() => [])

    async function getUsers() {
        data = aport(`/api/playlist/${playlistId}/collaborate`).then(value => value.json())
    }

    async function removeUser() {
        await aport(`/api/playlist/${playlistId}/collaborate`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ canEdit: 'id' }),
        })
        await getUsers()
    }

    onMount(getUsers)
</script>

{#if isOpen}
    <div role="dialog" class="modal" transition:fade>
        <div class="modal__contents">
            <div class="modal__title">{$_('modal.collaborate.title')}</div>
            <div class="modal__message">
                <AddUser {playlistId} on:userAdded={getUsers} />
                {#await data}
                    <div class="loader">
                        <LoaderIcon />
                    </div>
                {:then users}
                    {@debug users}
                    <!--List users-->
                    <UserList {users} />
                {/await}
            </div>
            <div class="modal__actions">
                <button class="actions__button" on:click={closeModal}>{$_('app.cancel')}</button>
            </div>
        </div>
    </div>
{/if}
