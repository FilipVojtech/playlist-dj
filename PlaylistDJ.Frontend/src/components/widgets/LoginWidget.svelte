<script lang='ts'>
    import LoginButton from '../LoginButton.svelte'
    import { _ } from 'svelte-i18n'
</script>


<main class='widget'>
    <p class='widget__text'>{$_('widget.login.message')}</p>
    <LoginButton text={$_('app.login.long')} />
</main>

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
