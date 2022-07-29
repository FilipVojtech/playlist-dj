export default function aport(url: RequestInfo, options?: RequestInit): Promise<Response> {
    options = { ...options, headers: { ...options?.headers, 'Content-Type': 'application/json' } }
    return fetch(url, options).then(value => {
        if (value.status === 401) window.location.replace('/logout')
        else if (value.redirected) {
            const url = new URL(value.url)
            if (url.searchParams.has('url')) window.location.href = url.searchParams.get('url') as string
        }
        return value
    })
}
