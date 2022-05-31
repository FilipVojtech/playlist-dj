import { NextFunction, Response, Router } from 'express'
import { Request } from '../global'
import { DI } from '../app'
import { endpoint, renewToken } from '../utility'
import { Playlist } from '../entities'

const router = Router()

router.get('/:id', async (req: Request, res: Response) => {
    let playlist = await DI.playlistRepository.findOne({ id: req.params.id })

    if (playlist) {
        if (playlist.isPublic) res.json(playlist)
        else if (req.session.user) {
            if (req.session.user.id === playlist.owner.id) res.json(playlist)
            else res.sendStatus(403)
        } else res.sendStatus(401)
    } else res.sendStatus(404)
})

router.all('*', async (req: Request, res: Response, next: NextFunction) => {
    if (req.session.user) {
        next()
    } else res.sendStatus(401)
})

router.route('/')
    .get(async (req: Request, res: Response) => {
        if (req.query.src && req.query.src === 'spotify') {
            req.session.user!.token = await renewToken(req.session.user!)
            res.json(await endpoint(req.session.user!).ownedPlaylists())
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

        const query = new URLSearchParams({ url: `/#/playlist/${playlist.id}/edit`, importing: '' }).toString()
        res.redirect(`/?${query}`)
    })

router.route('/:id')
    // Add item to playlist
    .put((req: Request, res: Response) => {
        res.sendStatus(501)
    })
    // Remove item from playlist
    .delete((req: Request, res: Response) => {
        res.sendStatus(501)
    })

export default router
