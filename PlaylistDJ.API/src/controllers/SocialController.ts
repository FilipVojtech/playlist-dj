import express, { Response } from 'express'
import { Request } from '../global'

const router = express.Router()

router.route('/')
    /**
     * Get posts
     */
    .get((req: Request, res: Response) => {
        res.sendStatus(501)
    })
    /**
     * Create a post
     */
    .post((req: Request, res: Response) => {
        res.sendStatus(501)
    })

export default router
