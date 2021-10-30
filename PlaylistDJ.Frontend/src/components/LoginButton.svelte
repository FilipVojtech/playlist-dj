<script lang='ts'>
    import { link } from 'svelte-spa-router'

    export let text: string
    export let href: string
</script>

<a class='login-button' {href} use:link>
    <img alt='Spotify logo' class='login-button__logo' src='images/Spotify_Icon.png' />
    {text}
</a>

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
