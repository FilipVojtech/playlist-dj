import type { FilterRequest } from '@playlist-dj/types'
import { FilterType } from '@playlist-dj/types'
import { Response, Router } from 'express'
import { Request } from '../global'
import { DI } from '../app'
import { authentication, getPlaylist, renewToken, userIsOwner } from '../utility/Middleware'
import { PlaylistLinkController } from './playlist'
import { endpoint, generateRandomString, getClientToken } from '../utility'
import { Playlist, Share } from '../entities'

const router = Router()

router.use(PlaylistLinkController)

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

router.get('/:id/filter', getPlaylist, renewToken, async (req: Request, res: Response) => {
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
        res.json(await endpoint(req.session.user!.token.value).filtersToFilterList(req.playlist!.filters))
        return
    }
})

router.use(authentication)

// prettier-ignore
router.route('/')
    .get(renewToken, async (req: Request, res: Response) => {
        switch (req.query.src) {
            case 'spotify':
                res.json(
                    await endpoint(req.session.user!.token.value).ownedPlaylists(req.session.user!.profile.spotifyId),
                )
                break
            case 'pinned':
                res.json(
                    await DI.playlistRepository.find({
                        owner: req.session.user!._id.toString(),
                        isPinned: true,
                        isMerged: false,
                    }),
                )
                break
            case 'link':
                let playlists = await DI.playlistRepository.find({
                    owner: req.session.user!._id.toString(),
                    isMerged: false,
                })
                res.json(
                    playlists.filter(
                        value => value.filters.findIndex(value1 => value1.type === FilterType.Playlist) === -1,
                    ),
                )
                break
            default:
                res.json(
                    await DI.playlistRepository.find({
                        owner: req.session.user!._id.toString(),
                        isMerged: false,
                    }),
                )
                break
        }
    })
    //<editor-fold desc="Import playlist with analysis and Filters | On hold for now">
    /**
     * Create a new playlist
     */
    // .post(renewToken, async (req: Request, res: Response) => {
    // const playlist = DI.playlistRepository.create(new Playlist(req.session.user!, req.body.name ?? 'New playlist'))
    // const spotifyPlaylist = await endpoint(req.session.user!.token.value).playlistInfo(req.body.id)
    //
    // if (req.body.id) {
    //     playlist.spotifyId = req.body.id
    //     playlist.fromPlaylistId = req.body.id
    // }
    // if (spotifyPlaylist) {
    //     playlist.name = spotifyPlaylist.name
    //     playlist.description = spotifyPlaylist.description
    // }
    //
    // await DI.playlistRepository.persistAndFlush(playlist)
    //
    // const query = new URLSearchParams({ url: `/#/playlist/${playlist.id}/edit`, importing: '' }).toString()
    // res.redirect(`/?${query}`)
    //
    // const filters = await filtersFromPlaylistTracks(req.session.user!, req.body.id)
    // })
    //</editor-fold>
    .post(renewToken, async (req: Request, res: Response) => {
        const playlist = DI.playlistRepository.create(new Playlist(req.session.user!, req.body.name ?? 'New playlist'))

        playlist.spotifyId = await endpoint(req.session.user!.token.value).playlistCreate(playlist)
        await DI.playlistRepository.persistAndFlush(playlist)

        const query = new URLSearchParams({ url: `/#/playlist/${playlist.id}/edit`, importing: '' })
        res.redirect(`/?${query}`)
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
    .delete(async (req: Request, res: Response) => {
        // Remove the playlists from linked playlists
        const linked = await DI.playlistRepository.findOne({ filters: { $elemMatch: { id: req.playlist!.id } } as any })
        linked?.filters.splice(
            linked.filters.findIndex(value => value.id === req.playlist!.id),
            1,
        )
        if (linked?.filters.length === 0) DI.playlistRepository.remove(linked)
        // Remove posts with this playlist
        const posts = await DI.postRepository.find({ playlist: req.playlist! })
        posts.forEach(value => DI.postRepository.remove(value))
        await DI.postRepository.flush()
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
        await DI.em.flush()
        res.sendStatus(200)
    })
    /**
     * Delete filters
     */
    .delete(userIsOwner, async (req: Request, res: Response) => {
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
        await DI.playlistRepository.flush()
        res.sendStatus(200)
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

export default router
