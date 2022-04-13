<script lang='ts'>
    import { SvelteComponent } from 'svelte'

    export let icon: SvelteComponent
</script>

<div class='filter__img placeholder'>
    <svelte:component size='32' this='{icon}' />
</div>

<style>
    .placeholder {
        display: flex;
        justify-content: center;
        align-items: center;
        min-width: 56px;
        min-height: 56px;
        background-color: var(--darker-bg);
    }
</style>
