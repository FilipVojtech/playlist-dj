export default function aport(url: RequestInfo, options?: RequestInit): Promise<Response> {
    return fetch(url, options)
        .then(value => {
            if (value.status === 403) window.location.replace('/logout')
            return value
        })
}
