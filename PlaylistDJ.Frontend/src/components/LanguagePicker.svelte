<script lang='ts'>
    import { _, locale, locales } from 'svelte-i18n'
    import { GlobeIcon } from 'svelte-feather-icons'

    // Format the locale value before binding
    $locale = $locale?.indexOf('-') === -1 ? $locale : $locale?.substring(0, $locale?.indexOf('-'))
</script>

<main class='item'>
    <span class='item__icon'>
        <GlobeIcon size='25' />
    </span>
    <select bind:value={$locale} class='select' id='language-select' name='language'>
        {#each $locales as loc}
            <option value={loc}>{$_(`locales.${loc}`)}</option>
        {/each}
    </select>
</main>

<style>
    .select {
        background-color: var(--darker-bg);
        border: 1px solid var(--darker-bg);
        border-radius: 15px;
        color: white;
        padding: 5px;
        width: 100%;
    }
</style>
