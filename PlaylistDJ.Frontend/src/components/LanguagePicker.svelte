<script lang='ts'>
    import { _, locale, locales } from 'svelte-i18n'
    import { GlobeIcon } from 'svelte-feather-icons'

    // Format the locale value before binding
    $locale = $locale?.indexOf('-') === -1 ? $locale : $locale?.substring(0, $locale?.indexOf('-'))
</script>

<main class='item item--with-input'>
    <span class='item__icon'>
        <GlobeIcon size='25' />
    </span>
    <select bind:value={$locale} class='form__input form__input--lang-picker' id='language-select' name='language'>
        {#each $locales as loc}
            <option value={loc}>{$_(`locales.${loc}`)}</option>
        {/each}
    </select>
</main>

<style>
    .form__input--lang-picker {
        width: 100%;
        margin-bottom: 0;
    }

    .item--with-input {
        padding: 10px;
    }

</style>
