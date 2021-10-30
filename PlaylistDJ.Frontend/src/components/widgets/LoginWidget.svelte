<script lang='ts'>
    import LoginButton from '../LoginButton.svelte'
</script>

<main>
    <p>Join the experience!</p>
    <LoginButton href='/login' text='Log in with Spotify' />
</main>

<style>
    main {
        display: flex;
        align-items: center;
        justify-items: center;
        flex-direction: column;

        padding: 30px 10px;
        margin: 20px;
        background-color: var(--darker-bg);
        border-radius: 25px;
    }

    p {
        font-weight: bold;
        margin-bottom: 15px;
    }
</style>
