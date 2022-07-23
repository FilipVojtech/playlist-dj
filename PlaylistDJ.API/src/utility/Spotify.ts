import got from 'got'
import { DI } from '../app'
import { Playlist, Profile, User } from '../entities'
import type { PDJ, SearchFilter, Spotify } from '@playlist-dj/types'
import { artistsFromSpotifyArtists, snakeToCamelCase } from './index'
import { Album, Artist, Token, Track } from '../Classes'

const apiUrl = 'https://api.spotify.com/v1'
const accUrl = 'https://accounts.spotify.com'
let clientCredentialsToken = { access_token: '', validity: new Date(0) }

/**
 * Exchange the authorization code for an Access Token.
 * @param code Authorization code
 */
export async function requestToken(code: string): Promise<Spotify.Token> {
    const token: Spotify.Token = new Token()

    await got(`${accUrl}/api/token`, {
        method: 'post',
        headers: {
            Authorization:
                'Basic ' +
                Buffer.from(`${process.env.PDJ_CLIENT_ID}:${process.env.PDJ_CLIENT_SECRET}`).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        form: {
            code,
            redirect_uri: `${process.env.REDIRECT_URI}/login/callback`,
            grant_type: 'authorization_code',
        },
    })
        .then(res => JSON.parse(res.body))
        .then(({ access_token, expires_in, refresh_token }) => {
            const now = new Date()
            token.value = access_token
            token.expiration = new Date(now.setMilliseconds(now.getMilliseconds() + expires_in))
            token.refreshToken = refresh_token
        })
        .catch(e => console.error(e))

    return token
}

/**
 * Request refreshed token
 */
export async function renewToken(user: User): Promise<Spotify.Token> {
    if (user.token.expiration.valueOf() > new Date().valueOf()) return user.token
    user = (await DI.userRepository.findOne({ profile: { spotifyId: user.profile.spotifyId } })) as User

    await got(`${accUrl}/api/token`, {
        method: 'post',
        headers: {
            Authorization:
                'Basic ' +
                Buffer.from(`${process.env.PDJ_CLIENT_ID}:${process.env.PDJ_CLIENT_SECRET}`).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        form: {
            refresh_token: user.token.refreshToken,
            grant_type: 'refresh_token',
        },
    })
        .then(res => JSON.parse(res.body))
        .then(({ access_token, expires_in }) => {
            const now = new Date()
            user.token.value = access_token
            user.token.expiration = new Date(now.setMilliseconds(now.getMilliseconds() + expires_in))
        })
        .catch(e => console.error(e))
    await DI.userRepository.flush()
    return user.token
}

/**
 * Get access token user for non-user related requests from Spotify such as
 * - requesting track/album/artist/etc. details
 * - requesting publicly accessible data
 * @returns string
 */
export async function getClientToken(): Promise<string> {
    if (!(clientCredentialsToken.validity.valueOf() > new Date().valueOf()))
        await got(`${accUrl}/api/token`, {
            method: 'POST',
            headers: {
                Authorization:
                    'Basic ' +
                    Buffer.from(`${process.env.PDJ_CLIENT_ID}:${process.env.PDJ_CLIENT_SECRET}`).toString('base64'),
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            form: { grant_type: 'client_credentials' },
        })
            .then(value => {
                const data = JSON.parse(value.body) as { access_token: string; expires_in: number }
                const now = new Date()
                if (value.statusCode === 200)
                    clientCredentialsToken = {
                        access_token: data.access_token,
                        validity: new Date(now.setMilliseconds(now.getMilliseconds() + data.expires_in)),
                    }
                else return
            })
            .catch(e => console.log(e))

    return clientCredentialsToken.access_token
}

// Haha no
// It appears the import is not specified in the assignment, so I won't do it
// export async function filtersFromPlaylistTracks(user: User, playlistId: string): Promise<Filter[]> {
//     const tracks: Spotify.TrackFromPlaylist[] = await endpoint(user).playlistTracks(playlistId)
//     let analysis: any = {}
//     for (const { track } of tracks) {
//         if (!analysis[track.artists[0].name]) {
//             analysis[track.artists[0].name] = {}
//         }
//         if (!analysis[track.artists[0].name][track.album.name]) {
//             analysis[track.artists[0].name][track.album.name] = {}
//         }
//         analysis[track.artists[0].name][track.album.name][track.name] = true
//     }
//     console.log('analysis', analysis)
//     // @ts-ignore
//     return tracks
// }

/**
 * Spotify API endpoints
 * @param token - Authentication token
 */
export function endpoint(token: string) {
    const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    }

    return {
        /**
         * Send request when already having an url
         * @param url
         */
        async url(url: string) {
            return await got(url, { headers })
                .then(value => JSON.parse(value.body))
                .catch(e => console.error(e))
        },

        /**
         * Search on Spotify
         * @param type Which categories to search in
         * @param query Search phrase
         * @param limit Limit results count
         * @returns Search results
         */
        async search(
            type: 'artist' | 'album' | 'track' | string,
            query: string,
            limit = '10'
        ): Promise<Spotify.SearchResults> {
            const queryParams = new URLSearchParams({
                q: query,
                type,
                limit,
            })

            return await got(`${apiUrl}/search?${queryParams}`, { headers })
                .then(value => JSON.parse(value.body) as Spotify.SearchResults)
                .then(value => snakeToCamelCase(value) as any)
                .catch(e => console.error(e))
        },

        /**
         * @returns Detailed profile information about the current user (including the current user's username).
         */
        async me(): Promise<Profile | null> {
            return (
                (await got(`${apiUrl}/me`, { headers })
                    .then(value => JSON.parse(value.body))
                    .then(body => Profile.fromBody(body))
                    .catch(e => console.error(e))) ?? null
            )
        },

        /**
         * Get current users owned playlists
         * @param userSpotifyId - User's Spotify ID
         */
        async ownedPlaylists(userSpotifyId: string): Promise<[{}]> {
            const query = new URLSearchParams({ limit: '50' })
            return await got(`${apiUrl}/me/playlists?${query}`, { headers })
                .then(data => JSON.parse(data.body))
                .then(data => data.items.filter((value: any) => value.owner.id === userSpotifyId))
                .catch(e => console.error(e))
        },

        /**
         * Information about an artist
         * @param id - Artist ID
         */
        async artist(id: string): Promise<PDJ.Artist | null> {
            return await got(`${apiUrl}/artists/${id}`, { headers })
                .then(data => {
                    const { id: artistId, name, href, type }: Spotify.Artist = JSON.parse(data.body)
                    return { id: artistId, name, href, type } as PDJ.Artist
                })
                .catch(e => {
                    console.error(e)
                    return null
                })
        },

        /**
         * Get information on multiple artists
         * @param ids - Artists IDs
         */
        async artists(ids: string[]): Promise<PDJ.Artist[] | []> {
            const spotifyArtistIdLimit = 50
            let reqIds = ''
            reqIds = ids.slice(0, spotifyArtistIdLimit - 1).toString()
            ids.splice(0, spotifyArtistIdLimit - 1)
            let result = await got(`${apiUrl}/artists?ids=${reqIds}`, { headers })
                .then(data => {
                    let value: PDJ.Artist[] = []
                    for (const { id, name, images, href } of JSON.parse(data.body).artists as Spotify.Artist[])
                        value.push(new Artist(id, name, images, href))
                    return value
                })
                .catch(e => {
                    console.log(e)
                    return []
                })
            if (ids.length > 0) result = [...result, ...(await this.artists(ids))]
            return result
        },

        /**
         * Information about an album
         * @param id - Album ID
         */
        async album(id: string): Promise<PDJ.Album | null> {
            return await got(`${apiUrl}/albums/${id}`, { headers })
                .then(data => {
                    const { id: albumId, name, artists, images }: Spotify.Album = JSON.parse(data.body)
                    return new Album(albumId, name, artistsFromSpotifyArtists(artists), images)
                })
                .catch(e => {
                    console.error(e)
                    return null
                })
        },

        /**
         * Get information about multiple albums
         * @param ids - Albums Spotify IDs
         */
        async albums(ids: string[]): Promise<PDJ.Album[] | []> {
            const spotifyAlbumIdLimit = 20
            let reqIds = ''
            reqIds = ids.slice(0, spotifyAlbumIdLimit - 1).toString()
            ids.splice(0, spotifyAlbumIdLimit - 1)
            let result = await got(`${apiUrl}/albums?ids=${reqIds}`, { headers })
                .then(data => {
                    let value: PDJ.Album[] = []
                    for (const { id, name, artists, images } of JSON.parse(data.body).albums as Spotify.Album[])
                        value.push(new Album(id, name, artistsFromSpotifyArtists(artists), images))
                    return value
                })
                .catch(e => {
                    console.log(e)
                    return []
                })
            if (ids.length > 0) result = [...result, ...(await this.albums(ids))]
            return result
        },

        /**
         * Track details
         * @param id - Track ID
         */
        async track(id: string): Promise<PDJ.Track | null> {
            return await got(`${apiUrl}/artists/${id}/albums`, { headers })
                .then(data => {
                    const { id, name, artists, album: trackAlbum }: Spotify.Track = JSON.parse(data.body)
                    let album: PDJ.Album = new Album(
                        id,
                        name,
                        artistsFromSpotifyArtists(trackAlbum.artists),
                        trackAlbum.images
                    )

                    return { id, name, artists: artistsFromSpotifyArtists(artists), album } as PDJ.Track
                })
                .catch(e => {
                    console.error(e)
                    return null
                })
        },

        /**
         * Get information about multiple tracks
         * @param ids - Tracks Spotify IDs
         */
        async tracks(ids: string[]): Promise<PDJ.Track[] | []> {
            const spotifyTrackIdLimit = 50
            let reqIds = ''
            reqIds = ids.slice(0, spotifyTrackIdLimit - 1).toString()
            ids.splice(0, spotifyTrackIdLimit - 1)
            let result = await got(`${apiUrl}/tracks?ids=${reqIds}`, { headers })
                .then(data => {
                    let value: PDJ.Track[] = []
                    for (const { id, name, album, artists } of JSON.parse(data.body).tracks as Spotify.Track[])
                        value.push(new Track(id, name, album, artistsFromSpotifyArtists(artists)))
                    return value
                })
                .catch(e => {
                    console.log(e)
                    return []
                })
            if (ids.length > 0) result = [...result, ...(await this.tracks(ids))]
            return result
        },

        /**
         * Get info about playlist
         * @param playlistId
         */
        async playlist(playlistId: string): Promise<Spotify.Playlist> {
            return await got(`${apiUrl}/playlists/${playlistId}`, { headers })
                .then(res => snakeToCamelCase(JSON.parse(res.body)) as any)
                .catch(e => console.error(e))
        },

        /**
         * Get playlists' tracks
         * @param playlistId
         * @param nextUrl
         */
        async playlistTracks(playlistId: string, nextUrl: string | null = null): Promise<Spotify.TrackFromPlaylist[]> {
            const url = `${apiUrl}/playlists/${playlistId}/tracks`
            return await got(nextUrl ?? url, { headers })
                .then(res => snakeToCamelCase(JSON.parse(res.body)) as any)
                .then(async value => {
                    let songs = []
                    songs.push(...value.items)
                    if (value.next) songs.push(...(await this.playlistTracks(playlistId, value.next)))
                    return songs as any
                })
                .catch(e => console.error(e))
        },

        /**
         * Create a new playlist
         * @returns New playlist Spotify ID
         */
        async playlistCreate(playlist: Playlist): Promise<string> {
            const response = await got(`${apiUrl}/users/${playlist.owner.profile.spotifyId}/playlists`, {
                headers,
                method: 'POST',
                body: JSON.stringify({
                    name: playlist.name,
                    description: playlist.description,
                    public: playlist.isPublic,
                }),
            })
                .then(res => snakeToCamelCase(JSON.parse(res.body)) as Spotify.Playlist)
                .catch(e => {
                    console.error(e)
                    return e
                })
            return response.id
        },

        /**
         * Change a playlist's name and public/private state. (The user must, of course, own the playlist.)
         * @param playlistId - Spotify ID of the playlist
         * @param name - New name value
         * @param description - New description value
         */
        async playlistEdit(playlistId: string, name: string, description: string) {
            await got(`${apiUrl}/playlists/${playlistId}`, {
                headers,
                method: 'PUT',
                body: JSON.stringify({ name, description }),
            }).catch(e => console.error(e))
        },

        async filtersToFilterList(filters: SearchFilter[]): Promise<PDJ.FilterList> {
            let result = {
                artists: { items: [] },
                albums: { items: [] },
                tracks: { items: [] },
                length: 0,
            } as PDJ.FilterList
            let artists: string[] = []
            let albums: string[] = []
            let tracks: string[] = []

            for (const { type, id } of filters) {
                switch (type) {
                    case 'artist':
                        artists.push(id)
                        break
                    case 'album':
                        albums.push(id)
                        break
                    case 'track':
                        tracks.push(id)
                        break
                }
                result.length++
            }
            if (artists.length > 0) result.artists!.items = await this.artists(artists)
            if (albums.length > 0) result.albums!.items = await this.albums(albums)
            if (tracks.length > 0) result.tracks!.items = await this.tracks(tracks)

            return result
        },
    }
}
