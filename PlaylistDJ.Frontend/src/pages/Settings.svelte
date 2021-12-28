<script lang='ts'>
    import Title from '../components/Title.svelte'
    import Footer from '../components/Footer.svelte'
    import { ChevronLeftIcon } from 'svelte-feather-icons'
    import { pop } from 'svelte-spa-router'
    import { onDestroy, onMount } from 'svelte'
    import { showNav } from '../Utility/stores'

    onMount(() => $showNav = false)
    onDestroy(() => $showNav = true)
</script>

<Title iconBefore={ChevronLeftIcon} onClickBefore={pop} text='Settings' />
<Footer />
