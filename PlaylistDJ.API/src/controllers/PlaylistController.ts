import type { FilterRequest } from '@playlist-dj/types'
import { FilterType } from '@playlist-dj/types'
import { Response, Router } from 'express'
import { Request } from '../global'
import { DI } from '../app'
import { authentication, getPlaylist, renewToken, userIsOwner } from '../utility/Middleware'
import { PlaylistLinkController } from './playlist'
import { endpoint, generateRandomString, getClientToken } from '../utility'
import { Playlist, Share } from '../entities'
import { Readable } from 'stream'
import readline from 'readline'
import multer from 'multer'
import path from 'path'

const router = Router()
const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter(req: Request, file: Express.Multer.File, callback: multer.FileFilterCallback) {
        const extension = path.extname(file.originalname)
        callback(null, extension === '.m3u' || extension === '.m3u8')
    },
})

router.get('/:id', getPlaylist, (req: Request, res: Response) => {
    if (req.session.quickpl?.playlist) {
        req.session.quickpl.playlist = false
        // @ts-ignore
        delete req.playlist.filters
        res.json(req.playlist)
        return
    }

    if (req.playlist!.isPublic) {
        // @ts-ignore
        delete req.playlist.filters
        res.json(req.playlist)
        return
    }

    if (req.session.user?._id.toString() !== req.playlist!.owner._id.toString()) {
        res.sendStatus(403)
        return
    }

    if (!req.session.user) {
        res.sendStatus(401)
        return
    }

    if (req.session.user._id.toString() === req.playlist!.owner._id.toString()) {
        // @ts-ignore
        delete req.playlist.filters
        res.json(req.playlist)
        return
    }
})

/**
 * Get playlist filters
 */
router.get('/:id/filter', getPlaylist, async (req: Request, res: Response) => {
    if (!req.playlist) {
        res.sendStatus(404)
        return
    }

    if (req.session.quickpl?.filters) {
        req.session.quickpl.filters = false
        res.json(await endpoint(await getClientToken()).filtersToFilterList(req.playlist!.filters))
        return
    }

    if (req.playlist!.isPublic) {
        res.json(await endpoint(await getClientToken()).filtersToFilterList(req.playlist!.filters))
        return
    }

    if (req.session.user?._id.toString() !== req.playlist!.owner._id.toString()) {
        res.sendStatus(403)
        return
    }

    if (!req.session.user) {
        res.sendStatus(401)
        return
    }

    if (req.session.user._id.toString() === req.playlist!.owner._id.toString()) {
        res.json(await endpoint(await getClientToken()).filtersToFilterList(req.playlist!.filters))
        return
    }
})

router.use(authentication)

router.use(PlaylistLinkController)

// prettier-ignore
router.route('/')
    .get(renewToken, async (req: Request, res: Response) => {
        switch (req.query.src) {
            case 'spotify':
                res.json(
                    await endpoint(req.session.user!.token.value).ownedPlaylists(req.session.user!.profile.spotifyId)
                )
                break
            case 'pinned':
                res.json(
                    await DI.playlistRepository.find({
                        owner: req.session.user!._id.toString(),
                        isPinned: true,
                        isMerged: false,
                    })
                )
                break
            case 'link':
                let playlists = await DI.playlistRepository.find({
                    owner: req.session.user!._id.toString(),
                    isMerged: false,
                })
                res.json(
                    playlists.filter(
                        value => value.filters.findIndex(value1 => value1.type === FilterType.Playlist) === -1
                    )
                )
                break
            default:
                res.json(
                    await DI.playlistRepository.find({
                        owner: req.session.user!._id.toString(),
                        isMerged: false,
                    })
                )
                break
        }
    })
    /**
     * Create a new playlist
     */
    .post(renewToken, async (req: Request, res: Response) => {
        if (req.body.name) {
            const playlist = DI.playlistRepository.create(
                new Playlist(req.session.user!, req.body.name ?? 'New playlist')
            )

            playlist.spotifyId = await endpoint(req.session.user!.token.value).playlistCreate(playlist)
            await DI.playlistRepository.persistAndFlush(playlist)

            const query = new URLSearchParams({ url: `/#/playlist/${playlist.id}/edit` })
            res.redirect(`/?${query}`)
        } else if (req.body.id) {
            const spotifyPlaylist = await endpoint(req.session.user!.token.value).playlist(req.body.id)
            if (spotifyPlaylist) {
                const tracks = await endpoint(req.session.user!.token.value).playlistTracks(req.body.id)
                let playlist = await DI.playlistRepository.findOne({ spotifyId: spotifyPlaylist.id })
                if (playlist) {
                    const query = new URLSearchParams({ url: `/#/playlist/${playlist.id}/edit` })
                    res.redirect(`/?${query}`)
                    return
                }
                playlist = DI.playlistRepository.create(new Playlist(req.session.user!, spotifyPlaylist.name))
                playlist.spotifyId = spotifyPlaylist.id
                playlist.images = spotifyPlaylist.images
                playlist.filters = tracks.map(value => ({ id: value.track.id, type: FilterType.Track }))
                await DI.playlistRepository.persistAndFlush(playlist)

                const query = new URLSearchParams({ url: `/#/playlist/${playlist.id}/edit` })
                res.redirect(`/?${query}`)
            } else res.sendStatus(404)
        } else res.sendStatus(400)
    })

// prettier-ignore
router.route('/:id')
    .all(getPlaylist, userIsOwner)
    /**
     * Edit playlist details
     */
    .patch(renewToken, async (req: Request, res: Response) => {
        const name: string = req.body.name ?? null
        const description: string = req.body.description ?? null

        if (!name || name.length > 100 || !description || description.length > 300) {
            res.sendStatus(400)
            return
        }
        req.playlist!.name = name
        req.playlist!.description = description
        await DI.playlistRepository.flush()
        await endpoint(req.session.user!.token.value).playlistEdit(req.playlist!.spotifyId, name, description)
        res.sendStatus(200)
    })

    /**
     * Pin or unpin playlist
     */
    .subscribe(userIsOwner, async (req: Request, res: Response) => {
        req.playlist!.isPinned = !req.playlist!.isPinned
        await DI.playlistRepository.flush()
        res.sendStatus(200)
    })

    /**
     * Delete playlist
     */
    .delete(renewToken, async (req: Request, res: Response) => {
        // Remove the playlists from linked playlists
        const linked = await DI.playlistRepository.findOne({ filters: { $elemMatch: { id: req.playlist!.id } } as any })
        linked?.filters.splice(
            linked.filters.findIndex(value => value.id === req.playlist!.id),
            1
        )
        if (linked?.filters.length === 0) DI.playlistRepository.remove(linked)
        if (req.playlist!.isMerged)
            await endpoint(req.session.user!.token.value).playlistReplaceItems(
                linked!.spotifyId,
                await endpoint(req.session.user!.token.value).filtersToTrackUris(linked!.filters)
            )
        // Remove posts with this playlist
        const posts = await DI.postRepository.find({ playlist: req.playlist! })
        posts.forEach(value => DI.postRepository.remove(value))
        await DI.postRepository.flush()
        // Unfollow playlist on Spotify
        await endpoint(req.session.user!.token.value).playlistUnfollow(req.playlist!.spotifyId)
        // Remove playlist
        await DI.playlistRepository.removeAndFlush(req.playlist!)
        const query = new URLSearchParams({ url: '/#/playlists' })
        res.redirect(`/?${query}`)
    })

// prettier-ignore
router.route('/:id/filter')
    .all(getPlaylist)
    /**
     * Add filters
     */
    .post(userIsOwner, renewToken, async (req: FilterRequest & Request, res: Response) => {
        if (!req.body) {
            res.sendStatus(400)
            return
        }

        for (const filter of req.body) {
            if ((!filter.id || typeof filter.id !== 'string') && (!filter.type || typeof filter.type !== 'string')) {
                res.sendStatus(400)
                return
            }
        }
        req.playlist!.filters.push(...req.body)
        // Remove duplicate values
        req.playlist!.filters = [...new Map(req.playlist!.filters.map(value => [value.id, value])).values()]
        if (!req.playlist!.spotifyId && !req.playlist!.isMerged)
            req.playlist!.spotifyId = await endpoint(req.session.user!.token.value).playlistCreate(req.playlist!)
        await DI.em.flush()
        res.sendStatus(200)
        if (!req.playlist!.isMerged) {
            const trackUris = await endpoint(req.session.user!.token.value).filtersToTrackUris(req.playlist!.filters)
            await endpoint(req.session.user!.token.value).playlistReplaceItems(req.playlist!.spotifyId, trackUris)
        } else {
            // Get parent playlist
            const playlist = await DI.playlistRepository.findOne({
                filters: { $elemMatch: { id: req.playlist!.id } } as any,
            })
            // Update linked playlist's items
            await endpoint(req.session.user!.token.value).playlistReplaceItems(
                playlist!.spotifyId,
                await endpoint(req.session.user!.token.value).filtersToTrackUris(playlist!.filters)
            )
        }
    })
    /**
     * Delete filters
     */
    .delete(userIsOwner, renewToken, async (req: Request, res: Response) => {
        if (!req.body) {
            res.sendStatus(400)
            return
        }

        for (const filter of req.body) {
            if ((!filter.id || typeof filter.id !== 'string') && (!filter.type || typeof filter.type !== 'string')) {
                res.sendStatus(400)
                break
            }
            // Remove by id
            const removeItemIndex = req.playlist!.filters.findIndex(value => value.id === filter.id)
            req.playlist!.filters.splice(removeItemIndex, 1)
        }
        if (!req.playlist!.spotifyId && !req.playlist!.isMerged)
            req.playlist!.spotifyId = await endpoint(req.session.user!.token.value).playlistCreate(req.playlist!)
        await DI.playlistRepository.flush()
        res.sendStatus(200)
        if (!req.playlist!.isMerged) {
            const trackUris = await endpoint(req.session.user!.token.value).filtersToTrackUris(req.playlist!.filters)
            await endpoint(req.session.user!.token.value).playlistReplaceItems(req.playlist!.spotifyId, trackUris)
        } else {
            // Get parent playlist
            const playlist = await DI.playlistRepository.findOne({
                filters: { $elemMatch: { id: req.playlist!.id } } as any,
            })
            // Update linked playlist's items
            await endpoint(req.session.user!.token.value).playlistReplaceItems(
                playlist!.spotifyId,
                await endpoint(req.session.user!.token.value).filtersToTrackUris(playlist!.filters)
            )
        }
    })

/**
 * Get share code for playlist
 */
// prettier-ignore
router.route('/:id/share')
    .all(getPlaylist, userIsOwner)
    .get(async (req: Request, res: Response) => {
        const share = await DI.shareRepository.findOne({ playlist: req.playlist })
        let code = share?.code

        // 1. check if the sharing code for the current playlist and the current user is already in the DB
        if (!code) {
            // 2. generate random unique code to share playlist for current user
            do code = generateRandomString(6)
            while ((await DI.shareRepository.count({ code })) > 0)
            // 3. save the code to the DB
            await DI.shareRepository.persistAndFlush(new Share(req.session.user!, req.playlist!, code))
        }
        // 4. return the URL for the shared playlist
        res.json(`${process.env.REDIRECT_URI}/p/${code}`)
    })
    .delete(async (req: Request, res: Response) => {
        const share = await DI.shareRepository.findOne({ playlist: req.playlist })
        let code = share!.code

        do code = generateRandomString(6)
        while ((await DI.shareRepository.count({ code })) > 0)
        share!.code = code
        await DI.shareRepository.flush()
        res.json(`${process.env.REDIRECT_URI}/p/${code}`)
    })

router.post('/upload', renewToken, upload.single('file'), async (req: Request, res: Response) => {
    const fStream = new Readable({
        read() {
            this.push(Buffer.from(req.file!.buffer))
            this.push(null)
        },
    })
    const fLines = readline.createInterface(fStream)
    const searchTerms: string[] = []
    let lineCount = 0

    fLines.on('line', line => {
        if (line.startsWith('#EXTINF')) searchTerms.push(line.split(',')[1].trim())
        lineCount++
        if (lineCount === 1 && line !== '#EXTM3U') res.redirect('/#/playlists')
    })
    fLines.on('close', async () => {
        const playlist = DI.playlistRepository.create(new Playlist(req.session.user!, req.body.name))
        const songUris = []
        playlist.spotifyId = await endpoint(req.session.user!.token.value).playlistCreate(playlist)
        for (const term of searchTerms) {
            const searchResult = await endpoint(req.session.user!.token.value).search('track', term, '1')
            if (searchResult.tracks?.items.length === 1) {
                playlist.filters.push({ id: searchResult.tracks.items[0].id, type: FilterType.Track })
                songUris.push(searchResult.tracks.items[0].uri)
            }
        }
        await endpoint(req.session.user!.token.value).playlistAddItems(playlist.spotifyId, songUris)
        await DI.playlistRepository.persistAndFlush(playlist)
        res.redirect(`/#/playlist/${playlist.id}`)
    })
})

export default router
