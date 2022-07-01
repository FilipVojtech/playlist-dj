import { NextFunction, Response, Router } from 'express'
import { Request } from '../global'
import { DI } from '../app'
import { endpoint, getClientToken } from '../utility'
import { Playlist, User } from '../entities'
import { authentication, renewToken } from '../utility/Middleware'
import type { FilterRequest } from '@playlist-dj/types'

const router = Router()

async function userIsOwner(req: Request, res: Response, next: NextFunction) {
    if (req.playlist!.owner._id.toString() !== req.session.user!._id.toString()) res.sendStatus(403)
    else next()
}

async function getPlaylist(req: Request, res: Response, next: NextFunction) {
    if (!req.params.id) {
        res.sendStatus(400)
        return
    }

    const playlist = await DI.playlistRepository.findOne({ id: req.params.id }, { populate: true })

    if (playlist) {
        req.playlist = playlist
        next()
    } else res.sendStatus(404)
}

router.get('/:id', getPlaylist, (req: Request, res: Response) => {
    if (!req.playlist) {
        res.sendStatus(404)
        return
    }
    // Now playlist exists

    if (req.playlist.isPublic) {
        // @ts-ignore
        delete req.playlist.filters
        res.json(req.playlist)
        return
    }
    // Now playlists is private

    if (req.session.user?._id.toString() !== req.playlist.owner._id.toString()) {
        res.sendStatus(403)
        return
    }

    if (!req.session.user) {
        res.sendStatus(401)
        return
    }

    if (req.session.user._id.toString() === req.playlist.owner._id.toString()) {
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
    // Now playlist exists

    if (req.playlist.isPublic) {
        res.json(await endpoint(await getClientToken()).filtersToFilterList(req.playlist!.filters))
        return
    }
    // Now playlists is private

    if (req.session.user?._id.toString() !== req.playlist.owner._id.toString()) {
        res.sendStatus(403)
        return
    }

    if (!req.session.user) {
        res.sendStatus(401)
        return
    }

    if (req.session.user._id.toString() === req.playlist.owner._id.toString()) {
        res.json(await endpoint(req.session.user!.token.value).filtersToFilterList(req.playlist!.filters))
        return
    }
})

router.use(authentication)

// prettier-ignore
router.route('/')
    .get(renewToken, async (req: Request, res: Response) => {
        if (req.query.src && req.query.src === 'spotify') {
            res.json(await endpoint(req.session.user!.token.value).ownedPlaylists(req.session.user!.profile.spotifyId))
        } else if (req.query.pinned) {
            res.json(
                await DI.playlistRepository.find({
                    owner: req.session.user!._id.toString(),
                    isPinned: true,
                })
            )
        } else {
            const playlists = await DI.playlistRepository.find({ owner: req.session.user!._id.toString() })
            res.json(playlists)
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
    //     playlist.spotifyID = req.body.id
    //     playlist.fromPlaylistID = req.body.id
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
    .post(async (req: Request, res: Response) => {
        const playlist = DI.playlistRepository.create(new Playlist(req.session.user!, req.body.name ?? 'New playlist'))

        await DI.playlistRepository.persistAndFlush(playlist)

        const query = new URLSearchParams({ url: `/#/playlist/${playlist.id}/edit`, importing: '' })
        res.redirect(`/?${query}`)
    })

// prettier-ignore
router.route('/:id')
    .all(getPlaylist, userIsOwner)
    // Delete playlist
    .delete(async (req: Request, res: Response) => {
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
    .delete(userIsOwner, (req: Request, res: Response) => {
        res.sendStatus(501)
    })

// prettier-ignore
router.route('/:id/collaborate')
    .all(getPlaylist, userIsOwner)
    /**
     * Get collaboration users
     */
    .get((req: Request, res: Response) => {
        console.log(req.playlist!)
        res.json({
            canView: req.playlist!.canView ?? [],
            canEdit: req.playlist!.canEdit ?? [],
        })
    })
    /**
     * Add users to collaborate
     */
    .post(async (req: Request, res: Response) => {
        // noinspection RegExpSimplifiable,RegExpUnnecessaryNonCapturingGroup,RegExpRedundantEscape
        const emailPattern = new RegExp(
            '(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:[\u0001-\b\u000B\f\u000E-\u001F!#-[]-\u007F]|\\\\[\u0001-\t\u000B\f\u000E-\u007F])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\u0001-\b\u000B\f\u000E-\u001F!-ZS-\u007F]|\\\\[\u0001-\t\u000B\f\u000E-\u007F])+)\\])'
        )
        let users: [(User | string)?] = []

        for (const accessType in req.body) {
            if (accessType === 'canView' || accessType === 'canEdit') {
                for (const email of req.body[accessType] as string[]) {
                    if (emailPattern.test(email)) {
                        const user = await DI.userRepository.findOne({ profile: { email } })

                        if (!user) users.push(email)
                        else req.playlist![accessType].push(user)
                    }
                }
            }
        }
        await DI.playlistRepository.flush()

        res.sendStatus(200)
    })
    /**
     * Remove user from collaboration
     */
    .delete((req: Request, res: Response) => {
        res.sendStatus(501)
    })

export default router
