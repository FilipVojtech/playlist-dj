import { Response, NextFunction, Router } from 'express'
import { Request } from '../global'
import { DI } from '../app'
import { endpoint } from '../utility'
import { Playlist } from '../entities'
import { authentication, renewToken } from '../utility/Middleware'

const router = Router()

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
        res.json(req.playlist)
        return
    }
})

router.use(authentication)

// prettier-ignore
router.route('/')
    .get(renewToken, async (req: Request, res: Response) => {
        if (req.query.src && req.query.src === 'spotify') {
            res.json(await endpoint(req.session.user!).ownedPlaylists())
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
    // const spotifyPlaylist = await endpoint(req.session.user!).playlistInfo(req.body.id)
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
    // Add item to playlist
    .put((req: Request, res: Response) => {
        res.sendStatus(501)
    })
    // Remove item from playlist
    .patch((req: Request, res: Response) => {
        res.sendStatus(501)
    })
    // Delete playlist
    .delete(getPlaylist, async (req: Request, res: Response) => {
        if (req.session.user!._id.toString() === req.playlist!.owner._id.toString()) {
            await DI.playlistRepository.removeAndFlush(req.playlist!)
            const query = new URLSearchParams({ url: '/#/playlists' })
            res.redirect(`/?${query}`)
        } else res.sendStatus(403)
    })

// prettier-ignore
router.route('/:id/collaborate')
    /**
     * Get collaboration users
     */
    .get(userIsOwner, (req: Request, res: Response) => {
        res.json({
            canView: req.playlist!.canView ?? [],
            canEdit: req.playlist!.canEdit ?? [],
        })
    })
    /**
     * Add users to collaborate
     */
    .post(userIsOwner, async (req: Request, res: Response) => {
        if (req.session.user!._id.toString() !== req.playlist!._id.toString()) {
            res.sendStatus(403)
            return
        }

        // noinspection RegExpSimplifiable,RegExpUnnecessaryNonCapturingGroup,RegExpRedundantEscape
        const emailPattern = new RegExp(
            '(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:[\u0001-\b\u000B\f\u000E-\u001F!#-[]-\u007F]|\\\\[\u0001-\t\u000B\f\u000E-\u007F])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\u0001-\b\u000B\f\u000E-\u001F!-ZS-\u007F]|\\\\[\u0001-\t\u000B\f\u000E-\u007F])+)\\])',
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

        res.sendStatus(200)
    })
    /**
     * Remove user from collaboration
     */
    .delete((req: Request, res: Response) => {
        res.sendStatus(501)
    })

export default router
