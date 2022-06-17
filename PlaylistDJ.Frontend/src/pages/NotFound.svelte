<script lang='ts'>
    import { _ } from 'svelte-i18n'
    import { link, pop } from 'svelte-spa-router'
</script>

<div class='not-found'>
    <div class='info-text'>
        404<br />
        > {$_('page.notFound.notFound')}
    </div>
    <div on:click={() => pop()} class='item item--interactive back-btn'>{$_('page.notFound.goBack')}</div>
    <a href='/playlists' use:link class='item item--interactive back-btn'>{$_('page.notFound.returnHome')}</a>
</div>

<style>
    .not-found {
        display: flex;
        flex-flow: column nowrap;
        align-items: stretch;
        justify-content: center;
        width: 100%;
        height: 100%;
    }

    .info-text {
        font-size: 36px;
        font-family: monospace;
        align-items: center;
        margin: 20px auto;
    }

    .back-btn {
        font-size: 26px;
        padding: 20px;
        justify-content: center;
    }
</style>
