<script lang='ts'>
    import LoginButton from '../LoginButton.svelte'
    import { _ } from 'svelte-i18n'

    export let message: string = $_('widget.login.message')
</script>


<div class='widget'>
    <p class='widget__text'>{message}</p>
    <LoginButton text={$_('app.login.long')} />
</div>

<style>
    .widget {
        display: flex;
        align-items: center;
        justify-items: center;
        flex-direction: column;

        padding: 30px 10px;
        margin: 20px;
        background-color: var(--darker-bg);
        border-radius: 25px;
    }

    .widget__text {
        font-weight: bold;
        margin-bottom: 15px;
    }
</style>
