import { Response, Router } from 'express'
import { Request } from '../../global'
import { DI } from '../../app'
import { endpoint } from '../../utility'
import { Playlist } from '../../entities'
import { getPlaylist, renewToken, userIsOwner } from '../../utility/Middleware'
import { FilterType, SearchFilter } from '@playlist-dj/types'

const router = Router()

router
    .route('/:id/link')
    .all(getPlaylist)
    /**
     * Unlink playlists
     */
    .patch(userIsOwner, async (req: Request, res: Response) => {
        const playlists: string[] = req.body?.playlists ?? null
        if (!playlists || playlists.length < 1 || req.playlist!.isMerged) {
            res.sendStatus(400)
            return
        }

        // Set isMerged to false for unmerged playlists and set follow for spotify playlists
        for (const id of playlists) {
            let playlist = await DI.playlistRepository.findOne({ id })
            if (playlist) {
                playlist.isMerged = false
                await endpoint(req.session.user!.token.value).playlistFollow(playlist.spotifyId)
            }
            // Remove element from array by its index
            let index = req.playlist!.filters.findIndex(d => d.id === id)
            if (index > -1) {
                req.playlist!.filters.splice(index, 1)
            }
        }
        await DI.playlistRepository.flush()

        if (req.playlist!.filters.length === 0) {
            // Unfollow on spotify and delete empty merged playlist from DB
            await endpoint(req.session.user!.token.value).playlistUnfollow(req.playlist!.spotifyId)
            await DI.playlistRepository.removeAndFlush(req.playlist!)

            const params = new URLSearchParams({ url: '/#/playlists' })
            res.redirect(`/?${params}`)
            return
        }

        res.sendStatus(200)
    })

    /**
     * Restore playlist
     */
    .unlock(userIsOwner, renewToken, async (req: Request, res: Response) => {
        // try to find a non-merged playlist with the same owner and spotify ID - only one restore is possible
        let unmergedPlaylist = await DI.playlistRepository.findOne({
            spotifyId: req.playlist!.spotifyId,
            isMerged: false,
        })

        if (!unmergedPlaylist) {
            // make a copy of the playlist
            const newPlaylist = DI.playlistRepository.create(
                new Playlist(req.session.user!, req.playlist!.name ?? 'New playlist')
            )
            newPlaylist.spotifyId = req.playlist!.spotifyId
            newPlaylist.filters = req.playlist!.filters
            newPlaylist.description = req.playlist!.description
            unmergedPlaylist = newPlaylist
            await DI.playlistRepository.persistAndFlush(newPlaylist)
        }

        // if playlist doesn't exist on spotify, create it
        const spotifyPlaylist = await endpoint(req.session.user!.token.value).playlist(req.playlist!.spotifyId)
        if (!spotifyPlaylist) {
            unmergedPlaylist.spotifyId = await endpoint(req.session.user!.token.value).playlistCreate(unmergedPlaylist)
            // update spotifyId on merged playlist too
            req.playlist!.spotifyId = unmergedPlaylist.spotifyId
            await DI.playlistRepository.flush()
        }

        res.sendStatus(200)
    })

/**
 * Link two or more playlists
 * @param body.playlists { {id: string, filterType: FilterType}[] } Array of playlist ID and FilterType
 */
router.post('/link', renewToken, async (req: Request, res: Response) => {
    const playlists: SearchFilter[] = req.body.playlists ?? null
    if (!playlists || playlists.length < 2) {
        res.sendStatus(400)
        return
    }

    for (const item of playlists) {
        if (item.type !== FilterType.Playlist) {
            res.sendStatus(400)
            break
        }
        // Only user-owned playlists and unmerged playlists can be merged
        const playlist = await DI.playlistRepository.findOne({
            id: item.id,
            // owner: req.session.user,
        })
        if (!playlist) {
            res.sendStatus(400)
            break
        }
    }

    const playlist = DI.playlistRepository.create(new Playlist(req.session.user!, req.body.name ?? 'New playlist'))
    playlist.filters.push(...req.body.playlists)
    // Create a new spotify playlist
    playlist.spotifyId = await endpoint(req.session.user!.token.value).playlistCreate(playlist)
    await DI.playlistRepository.persistAndFlush(playlist)

    // Set isMerged for all merged playlists and collect the spotify ids to remove (unfollow)
    let spotifyPlaylistIDs: string[] = []
    for (const item of playlists) {
        let playlist = await DI.playlistRepository.findOne({ id: item.id })
        if (playlist) {
            playlist.isMerged = true
            spotifyPlaylistIDs.push(playlist.spotifyId)
            playlist.spotifyId = ''
        }
    }
    await DI.playlistRepository.flush()

    // Remove (unfollow) spotify playlist
    if (spotifyPlaylistIDs.length > 0) {
        for (const id of spotifyPlaylistIDs) {
            await endpoint(req.session.user!.token.value).playlistUnfollow(id)
        }
    }

    res.sendStatus(200)
})

export const PlaylistLinkController = router
