<script lang='ts'>
    import { StarIcon } from 'svelte-feather-icons'
    import  PlaylistList  from './PlaylistList.svelte'

    export let id = ''
    export let name = ''
    export let description = ''
    export let stars = ''
</script>

<div class='post' id='{id}'>
    <div class='post__row'>
        <div class='post__title'>{name}</div>
        <div class='post__desc'>{description}</div>
    </div>
    <div class='post__row'>
        <span><StarIcon /> {stars}</span>
    </div>
    <div class='post__row'>
        <PlaylistList />
    </div>
</div>

<style>

</style>
