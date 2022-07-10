<script lang="ts">
    import { _ } from 'svelte-i18n'
    import { closeModals, openModal } from 'svelte-modals'
    import { ModalAction } from '../utility'
    import Modal from './Modal.svelte'
    import RegisterModal from './RegisterModal.svelte'

    export let text: string = $_('app.login.long')

    function handleClick() {
        openModal(Modal, {
            title: $_('modal.login.title'),
            actions: [
                new ModalAction($_('modal.login.logIn'), () => window.location.assign('/login')),
                new ModalAction($_('modal.login.register'), () => {
                    closeModals()
                    openModal(RegisterModal)
                }),
            ],
        })
    }
</script>

<div class="login-button item--interactive" on:click={handleClick}>
    <img alt="Spotify logo" class="login-button__logo" src="images/Spotify_Icon.png" />
    {text}
</div>

<style>
    .login-button {
        display: flex;
        align-items: center;
        justify-content: center;

        max-width: fit-content;
        background-color: var(--spotify-green);
        border-radius: 25px;
        padding: 7px 10px;
    }

    .login-button__logo {
        height: 25px;
        margin-right: 10px;
    }
</style>
