<script lang="ts">
    import { fade } from 'svelte/transition'
    import { closeModals } from 'svelte-modals'
    import { _ } from 'svelte-i18n'

    export let isOpen: boolean

    let file: string
    let name: string
</script>

{#if isOpen}
    <div role="dialog" class="modal" transition:fade>
        <div class="modal__contents">
            <div class="modal__title">{$_('modal.importM3U.title')}</div>
            <div class="modal__message">
                <form class="form" method="post" action="/api/playlist/upload" enctype="multipart/form-data">
                    <label class="form__label" for="file">{$_('modal.importM3U.playlistFile')}</label>
                    <input
                        class="form__input"
                        type="file"
                        name="file"
                        id="file"
                        accept=".m3u,.m3u8"
                        required
                        bind:value={file}
                        on:change={() => (name = file.slice(file.lastIndexOf('\\') + 1, file.indexOf('.')))}
                    />
                    <label class="form__label" for="playlistName">{$_('modal.importM3U.playlistName')}</label>
                    <input type="text" class="form__input" id="playlistName" name="name" bind:value={name} />
                    <div class="modal__actions">
                        <input type="submit" class="actions__button" value={$_('app.upload')} />
                        <button class="actions__button" on:click|preventDefault={closeModals}>
                            {$_('app.cancel')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
{/if}
