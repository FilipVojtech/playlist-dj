<script lang="ts">
    import type { PDJ } from '@playlist-dj/types'
    import { Header, Post } from '../components'
    import { CreatePostModal } from '../components/modals'
    import { _ } from 'svelte-i18n'
    import { LoaderIcon, PlusSquareIcon } from 'svelte-feather-icons'
    import { openModal } from 'svelte-modals'
    import { onMount } from 'svelte'
    import aport from '../utility/Aport'

    let data: Promise<PDJ.Post[]> = new Promise(() => [])

    function loadPosts() {
        data = aport('/api/social')
            .then(data => {
                if (data.ok) return data.json() as PDJ.Post[]
                else return []
            })
            .catch(e => {
                console.error(e)
                return []
            })
    }

    onMount(loadPosts)
</script>

<svelte:head>
    <title>{$_('page.social.title')}</title>
</svelte:head>
<Header
    iconAfter={PlusSquareIcon}
    onClickAfter={() => openModal(CreatePostModal, { onCreate: loadPosts })}
    text={$_('page.social.title')}
/>

{#await data}
    <div class="loader">
        <LoaderIcon />
    </div>
{:then posts}
    {#if posts.length > 0}
        <div class="list">
            {#each posts as post (post.id)}
                <Post {...post} on:postDelete={loadPosts} />
            {/each}
        </div>
    {:else}
        <p>{$_('page.social.noPost')}</p>
    {/if}
{/await}
