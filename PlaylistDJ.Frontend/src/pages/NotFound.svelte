<script lang="ts">
    import { _ } from 'svelte-i18n'
    import { link, pop } from 'svelte-spa-router'
    import { user } from '../utility/stores'
</script>

<div class="not-found">
    <div class="info-text">
        404<br />
        > {$_('page.notFound.notFound')}
    </div>
    <div class="item item--interactive back-btn" on:click={() => pop()}>{$_('page.notFound.goBack')}</div>
    {#if $user}
        <a class="item item--interactive back-btn" href="/playlists" use:link>
            {$_('page.notFound.returnToPlaylists')}
        </a>
    {:else}
        <a class="item item--interactive back-btn" href="/about" use:link>{$_('page.notFound.returnHome')}</a>
    {/if}
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
