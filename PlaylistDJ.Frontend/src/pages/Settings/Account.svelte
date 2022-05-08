<script lang='ts'>
    import { onDestroy, onMount } from 'svelte'
    import { _ } from 'svelte-i18n'
    import { showNav } from '../../utility/stores'
    import { Header, Modal, OkModal } from '../../components'
    import { ChevronLeftIcon, TrashIcon } from 'svelte-feather-icons'
    import { push } from 'svelte-spa-router'
    import { closeModals, openModal } from 'svelte-modals'
    import aport from '../../utility/Aport'

    onMount(() => $showNav = false)
    onDestroy(() => $showNav = true)

    function deleteAccount() {
        function sendDelete() {
            closeModals(2)
            openModal(OkModal, {
                title: $_('page.settings.account.deleteAccount.modal.title3'),
                message: $_('page.settings.account.deleteAccount.modal.message3'),
            })
            setTimeout(async () => {
                await aport('/api/user/account', { method: 'DELETE' })
                window.location.replace('/logout')
            }, 5000)
        }

        openModal(Modal, {
            title: $_('page.settings.account.deleteAccount.delete'),
            message: $_('page.settings.account.deleteAccount.modal.message1'),
            actions: [
                {
                    title: $_('app.yes'),
                    onClick: () => openModal(Modal, {
                        title: $_('page.settings.account.deleteAccount.modal.title2'),
                        message: $_('page.settings.account.deleteAccount.modal.message2'),
                        actions: [
                            { title: $_('page.settings.account.deleteAccount.modal.action'), onClick: sendDelete },
                            { title: $_('app.cancel'), onClick: closeModals },
                        ],
                    }),
                },
                { title: $_('app.cancel'), onClick: closeModals },
            ],
        })
    }
</script>

<Header iconBefore={ChevronLeftIcon} onClickBefore={() => push('/settings')} text={$_('page.settings.account.title')} />

<div class='item item--interactive item--warning' on:click={deleteAccount}>
    <span class='item__icon'><TrashIcon size='25' /></span>
    {$_('page.settings.account.deleteAccount.delete')}
</div>
