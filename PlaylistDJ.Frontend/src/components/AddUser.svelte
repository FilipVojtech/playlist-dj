<script lang="ts">
    import FilterPlaceholder from './FilterPlaceholder.svelte'
    import { PlusIcon } from 'svelte-feather-icons'
    import { _ } from 'svelte-i18n'
    import aport from '../utility/Aport'
    import ToggleFormInput from './ToggleFormInput.svelte'
    import { createEventDispatcher } from 'svelte'

    export let playlistId: string = ''

    const dispatch = createEventDispatcher()
    const emailPattern = new RegExp(
        '(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:[\u0001-\b\u000B\f\u000E-\u001F!#-[]-\u007F]|\\\\[\u0001-\t\u000B\f\u000E-\u007F])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\u0001-\b\u000B\f\u000E-\u001F!-ZS-\u007F]|\\\\[\u0001-\t\u000B\f\u000E-\u007F])+)\\])'
    )
    let isEditing: boolean = false
    let canEdit = false
    let email: string = ''

    function cancelHandle(e) {
        if (e.key !== 'Escape' && e.key !== 'Esc' && e.key !== undefined) return

        isEditing = false
        email = ''
        canEdit = false
    }

    async function addUser() {
        await aport(`/api/playlist/${playlistId}/collaborate`, {
            method: 'POST',
            body: JSON.stringify(canEdit ? { canEdit: [email] } : { canView: [email] }),
        })
        isEditing = false
        email = ''
        dispatch('userAdded')
    }
</script>

{#if !isEditing}
    <div class="item item--interactive item--slim" on:click={() => (isEditing = true)}>
        <FilterPlaceholder icon={PlusIcon} />
        {$_('modal.collaborate.addUser')}
    </div>
{:else}
    <div class="item item--column">
        <form on:submit|preventDefault={addUser} class="form">
            <!--suppress XmlInvalidId -->
            <label for="access">{$_('modal.collaborate.permissions')}</label>
            <div class="access form__input">
                <div class="access__type" on:click={() => (canEdit = false)}>
                    <p class="access__text" class:access__text--active={!canEdit}>
                        {$_('modal.collaborate.access.view')}
                    </p>
                </div>
                <ToggleFormInput bind:checked={canEdit} name="access" id="access" />
                <div class="access__type" on:click={() => (canEdit = true)}>
                    <p class="access__text" class:access__text--active={canEdit}>
                        {$_('modal.collaborate.access.edit')}
                    </p>
                </div>
            </div>
            <label for="email">{$_('modal.collaborate.email')}</label>
            <input
                type="text"
                id="email"
                name="email"
                class="form__input"
                required
                bind:value={email}
                on:keyup={cancelHandle}
                placeholder={$_('modal.collaborate.mail')}
            />
            <div class="item__actions">
                <input
                    type="submit"
                    class="item__actions__action text--accept"
                    value={$_('app.add')}
                    class:item__actions__action--disabled={!emailPattern.test(email)}
                    disabled={!emailPattern.test(email)}
                />
                <button class="item__actions__action text--reject" on:click={cancelHandle}>{$_('app.cancel')}</button>
            </div>
        </form>
    </div>
{/if}

<style>
    .access {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .access__text {
        padding: 5px;
        border-radius: 10px;
        user-select: none;
        cursor: pointer;
        opacity: 0.3;
        width: content-box;
        transition: 400ms;
    }

    .access__text--active {
        opacity: 1;
    }
</style>
