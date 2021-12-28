<script lang='ts'>
    import Title from '../components/Title.svelte'
    import { onDestroy, onMount } from 'svelte'
    import { showNav } from '../Utility/stores'

    export let params = {
        id: '',
    }
    let id = params.id

    onMount(() => $showNav = false)
    onDestroy(() => $showNav = true)
</script>

<Title />
<p>Id: {id}</p>
