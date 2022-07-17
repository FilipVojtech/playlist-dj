<script lang="ts">
    import { _ } from 'svelte-i18n'
    import { Header } from '../../components'
    import { Modal, OkModal } from '../../components/modals'
    import { ChevronLeftIcon, TrashIcon } from 'svelte-feather-icons'
    import { push } from 'svelte-spa-router'
    import { closeModals, openModal } from 'svelte-modals'
    import aport from '../../utility/Aport'
    import { ModalAction } from '../../utility'

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
                new ModalAction($_('app.yes'), () =>
                    openModal(Modal, {
                        title: $_('page.settings.account.deleteAccount.modal.title2'),
                        message: $_('page.settings.account.deleteAccount.modal.message2'),
                        actions: [
                            new ModalAction($_('page.settings.account.deleteAccount.modal.action'), sendDelete),
                            new ModalAction($_('app.cancel'), closeModals),
                        ],
                    })
                ),
                new ModalAction($_('app.cancel'), closeModals),
            ],
        })
    }
</script>

<Header iconBefore={ChevronLeftIcon} onClickBefore={() => push('/settings')} text={$_('page.settings.account.title')} />

<div class="item item--interactive item--warning" on:click={deleteAccount}>
    <span class="item__icon"><TrashIcon size="25" /></span>
    {$_('page.settings.account.deleteAccount.delete')}
</div>
