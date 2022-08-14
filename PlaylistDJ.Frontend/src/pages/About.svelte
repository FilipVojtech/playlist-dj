<script lang="ts">
    import { LoginWidget } from '../components/widgets'
    import { _ } from 'svelte-i18n'
    import { SvelteComponent } from 'svelte'
    import { FileTextIcon, LinkIcon, ThumbsUpIcon, UserCheckIcon } from 'svelte-feather-icons'

    const features: { icon: SvelteComponent; title: string; description: string }[] = [
        {
            icon: UserCheckIcon,
            title: $_('page.about.feature.data.title'),
            description: $_('page.about.feature.data.description'),
        },
        {
            icon: LinkIcon,
            title: $_('page.about.feature.link.title'),
            description: $_('page.about.feature.link.description'),
        },
        {
            icon: FileTextIcon,
            title: $_('page.about.feature.localPlaylists.title'),
            description: $_('page.about.feature.localPlaylists.description'),
        },
        {
            icon: ThumbsUpIcon,
            title: $_('page.about.feature.social.title'),
            description: $_('page.about.feature.social.description'),
        },
    ]
</script>

<svelte:head>
    <title>{$_('app.name')}</title>
</svelte:head>

<section class="section">
    <h1>{$_('page.about.welcome')}</h1>
    <p>{$_('page.about.description')}</p>
</section>
<section class="section">
    <LoginWidget />
</section>
<section>
    <div class="features">
        {#each features as { icon, title, description } (title)}
            <div class="feature">
                <div class="feature__icon">
                    <svelte:component this={icon} size="125" />
                </div>
                <h1 class="feature__title">{title}</h1>
                <p class="feature__description">{description}</p>
            </div>
        {/each}
    </div>
</section>

<style>
    .section {
        margin: 25px 0;
    }

    .section:first-child {
        margin-top: 10px;
    }

    .section:last-child {
        margin-bottom: 10px;
    }

    .features {
        display: flex;
        flex-flow: row wrap;
        justify-content: center;
    }

    .feature {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 75px;
        padding: 0 25px;
    }

    .feature__icon {
        margin-bottom: 20px;
    }

    .feature__title {
        font-size: 26px;
        text-align: center;
        margin-bottom: 10px;
        font-weight: bold;
    }

    .feature__description {
        text-align: center;
    }

    @media screen and (min-width: 640px) {
        .feature {
            width: 300px;
        }
    }

    @media screen and (min-width: 640px) {
        .feature {
            width: 300px;
        }
    }
</style>
