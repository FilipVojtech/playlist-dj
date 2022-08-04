<script lang="ts">
    import { fade } from 'svelte/transition'
    import { LoaderIcon } from 'svelte-feather-icons'

    export let size: string = '35'
</script>

<div class="loader" in:fade={{ delay: 500 }}>
    <LoaderIcon {size} />
</div>
