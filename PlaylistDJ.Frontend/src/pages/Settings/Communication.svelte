<script lang='ts'>
    import { onDestroy, onMount } from 'svelte'
    import { _ } from 'svelte-i18n'
    import { showNav } from '../../Utility/stores'
    import { Header } from '../../components'
    import { ChevronLeftIcon } from 'svelte-feather-icons'
    import { push } from 'svelte-spa-router'

    let communicationSettings

    onMount(async () => {
        $showNav = false
        communicationSettings = await fetch('/api/user/communication')
            .then(value => {
                if (value.status === 403) window.location.replace('/logout')
                return value
            })
            .then(value => value.json())
    })
    onDestroy(() => $showNav = true)

    const onSubmit = e =>
        fetch('/api/user/communication', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(communicationSettings),
        })
            .then(value => {
                if (value.status === 403)
                    window.location.replace('/logout')
                return value.json()
            })
            .catch(reason => console.error(reason))
</script>

<Header iconBefore={ChevronLeftIcon} onClickBefore={() => push('/settings')}
        text={$_('page.settings.communication.title')} />
{#if communicationSettings}
    <form class='form' method='post' on:submit|preventDefault on:change|preventDefault={onSubmit}>
        <!--Update emails won't be in the first release
            <select bind:value={updateFrequency} class='form__input' name='updateFrequency'>
            <option value='Disabled'>{$_('page.settings.communication.updateFrequency.disabled')}</option>
            <option value='Daily'>{$_('page.settings.communication.updateFrequency.daily')}</option>
            <option value='Weekly'>{$_('page.settings.communication.updateFrequency.weekly')}</option>
            <option value='BiWeekly'>{$_('page.settings.communication.updateFrequency.biWeekly')}</option>
            <option value='Monthly'>{$_('page.settings.communication.updateFrequency.monthly')}</option>
            <option value='Custom'>Custom</option>
        </select>
        {#if updateFrequency === 'Custom'}
            <input class='form__input' name='customFrequency' type='number' min='1' max='365' />
        {/if}-->
        <label class='form__input'>
            <input type='checkbox' checked disabled>
            {$_('page.settings.communication.subscribeTo.important')}
        </label>
        <label class='form__input' for='sendMarketing'>
            <input bind:checked={communicationSettings.sendMarketing} id='sendMarketing' name='sendMarketing'
                   type='checkbox'>
            {$_('page.settings.communication.subscribeTo.product')}
        </label>
    </form>
{/if}
