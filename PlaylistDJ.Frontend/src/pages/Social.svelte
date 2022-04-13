<script>
    import { CreatePostModal, Header, Post } from '../components'
    import { _ } from 'svelte-i18n'
    import { PlusSquareIcon, LoaderIcon } from 'svelte-feather-icons'
    import { openModal } from 'svelte-modals'
    import { onMount } from 'svelte'
    import aport from '../Utility/Aport'

    let data = []

    onMount(() => {
        data = aport('/social')
            .then(data => data.json())
    })
</script>

<svelte:head>
    <title>{$_('page.social.title')}</title>
</svelte:head>
<Header text={$_('page.social.title')} iconAfter='{PlusSquareIcon}' onClickAfter='{() => openModal(CreatePostModal)}' />

{#await data}
    <div class='loader'>
        <LoaderIcon />
    </div>
{:then posts}
    {#each posts as post}
        <Post {...post} />
    {/each}
{:catch e}
{/await}
