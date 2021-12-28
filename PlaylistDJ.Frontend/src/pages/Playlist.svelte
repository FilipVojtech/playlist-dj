<script lang='ts'>
    import Title from '../components/Title.svelte'

    export let params = {
        id: '',
    }
    let id = params.id
</script>

<Title />
<p>Id: {id}</p>
