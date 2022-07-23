import type { PDJ } from '@playlist-dj/types'
import express, { NextFunction, Response } from 'express'
import { Request } from '../global'
import { authentication } from '../utility/Middleware'
import { DI } from '../app'
import { Post } from '../entities'
import { endpoint, getClientToken } from '../utility'
import { wrap } from '@mikro-orm/core'

async function getPost(req: Request, res: Response, next: NextFunction) {
    if (!req.params.id) {
        res.sendStatus(400)
        return
    }

    const post = await DI.postRepository.findOne({ id: req.params.id }, { populate: true })

    if (post) {
        req.post = post
        next()
    } else res.sendStatus(404)
}

function userIsOwner(req: Request, res: Response, next: NextFunction) {
    if (req.session.user!._id.toString() !== req.post!.author._id.toString()) res.sendStatus(403)
    else next()
}

const router = express.Router()

/**
 * Get posts
 */
router.get('/', async (req: Request, res: Response) => {
    const posts = await DI.postRepository.findAll({ populate: true, limit: 10, orderBy: { createdAt: 'DESC' } })
    // Duplicate array to remove updatedAt value but not from loaded entities
    const returnValue: Post[] = JSON.parse(JSON.stringify(posts))
    returnValue.forEach((value: any) => delete value.updatedAt)
    for (const post of returnValue as PDJ.Post[]) {
        // @ts-ignore
        post.playlist.filters = await endpoint(await getClientToken()).filtersToFilterList(post.playlist.filters)
        // @ts-ignore
        post.starred = post.stars.findIndex(value => value === req.session.user!._id.toString()) !== -1
        if (typeof post.stars !== 'number') {
            post.stars = post.stars.length
        }
    }
    res.json(returnValue)
})

router.use(authentication)

/**
 * Create a post
 */
router.post('/', async (req: Request, res: Response) => {
    if (!req.body || !req.body.playlist || (req.body.message && req.body.message.length > 512)) {
        res.sendStatus(400)
        return
    }
    let playlist = await DI.playlistRepository.findOne({ id: req.body.playlist })
    if (!playlist) {
        res.sendStatus(404)
        return
    }

    await DI.postRepository.persistAndFlush(new Post(req.session.user!, playlist, req.body.message || ''))
    res.sendStatus(200)
})

// prettier-ignore
router.route('/:id')
    .all(getPost)
    /**
     * Edit post
     */
    .patch(userIsOwner, async (req: Request, res: Response) => {
        res.sendStatus(501)
    })
    /**
     * Star/unstar a post     */
    .put(async (req: Request, res: Response) => {
        const stars = wrap(req.post!).toJSON().stars
        const sameUserIndex = stars.findIndex(value => value === req.session.user!._id.toString())
        if (sameUserIndex === -1) wrap(req.post!).assign({ stars: [...stars, req.session.user!._id.toString()] })
        else {
            stars.splice(sameUserIndex, 1)
            wrap(req.post!).assign({ stars })
        }
        await DI.postRepository.flush()
        res.sendStatus(200)
    })
    /**
     * Delete a post
     */
    .delete(userIsOwner, async (req: Request, res: Response) => {
        await DI.postRepository.removeAndFlush(req.post!)
        res.sendStatus(200)
    })

router.get('/:id/stars', getPost, async (req: Request, res: Response) => {
    const post = wrap(req.post).toObject()!
    res.json({
        stars: req.post!.stars.length,
        // @ts-ignore
        starred: (post.starred = post.stars.findIndex(value => value === req.session.user!._id.toString()) !== -1),
    })
})

export default router
