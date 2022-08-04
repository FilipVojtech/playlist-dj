<script lang="ts">
    import { _ } from 'svelte-i18n'
    import { Header } from '../../components'
    import { Modal, OkModal } from '../../components/modals'
    import { ChevronLeftIcon, TrashIcon, UserCheckIcon } from 'svelte-feather-icons'
    import { push } from 'svelte-spa-router'
    import { closeModals, openModal } from 'svelte-modals'
    import aport from '../../utility/Aport'
    import { ModalAction } from '../../utility'
    import { user } from '../../utility/stores'
    import { onMount } from 'svelte'

    let listener
    let item: HTMLElement
    let wrapper: HTMLElement

    function deleteAccount() {
        function sendDelete() {
            closeModals(2)
            openModal(OkModal, {
                title: $_('modal.deleteAccount.title3'),
                message: $_('modal.deleteAccount.message3'),
            })
            setTimeout(async () => {
                await aport('/api/user/account', { method: 'DELETE' })
                window.location.replace('/logout')
            }, 5000)
        }
        openModal(Modal, {
            title: $_('modal.deleteAccount.title'),
            message: $_('modal.deleteAccount.message1'),
            actions: [
                new ModalAction($_('app.yes'), () =>
                    openModal(Modal, {
                        title: $_('modal.deleteAccount.title2'),
                        message: $_('modal.deleteAccount.message2'),
                        actions: [
                            new ModalAction($_('modal.deleteAccount.action'), sendDelete),
                            new ModalAction($_('app.cancel'), closeModals),
                        ],
                    })
                ),
                new ModalAction($_('app.cancel'), closeModals),
            ],
        })
    }

    onMount(() => {
        wrapper.style.width = `${item.clientWidth - 25 - 45}px`
    })

    delete $user!.schemaVersion
</script>

<svelte:window on:resize={() => (wrapper.style.width = `${item.clientWidth - 25 - 45}px`)} />

<Header iconBefore={ChevronLeftIcon} onClickBefore={() => push('/settings')} text={$_('page.settings.account.title')} />

<div bind:this={item} class="item">
    <span class="item__icon"><UserCheckIcon size="25" /></span>
    <div>
        {$_('page.settings.account.whatWeKnow')}
        <div bind:this={wrapper} class="wrapper">
            <div class="code">{JSON.stringify($user, null, 2)}</div>
        </div>
        <span class="font--darker">{$_('page.settings.account.savedInfo')}</span>
    </div>
</div>
<div class="item item--interactive item--warning" on:click={deleteAccount}>
    <span class="item__icon"><TrashIcon size="25" /></span>
    {$_('modal.deleteAccount.title')}
</div>

<style>
    .item__icon {
        align-self: flex-start;
    }

    .wrapper {
        margin-top: 5px;
        padding: 5px;
        border: 2px solid var(--main-bg--hover);
        border-radius: 15px;
        white-space: pre;
        background-color: var(--darker-bg);
    }

    .code {
        font-family: monospace;
        font-size: 16px;
        overflow-x: auto;
    }
</style>
