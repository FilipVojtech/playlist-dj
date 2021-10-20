<script lang='ts'>
    import { Footer, Header, Router } from './components'
</script>

<main>
    <Header />
    <div class='main-content'>
        <Router />
    </div>
    <Footer />
</main>

<style>
    .main-content {
        max-width: 100vw;
        padding: 0 10px;
    }

    @media (min-width: 640px) {
        .main-content {
            max-width: 60vw;
            margin: auto;
        }
    }
</style>
