import express, { Response } from 'express'
import { userController } from './Endpoints'
import { Request } from '../global'
import { renewToken } from '../Classes'

const router = express.Router()

router.all('*', async (req: Request, res: Response, next) => {
    req.session.user!.token = await renewToken(req.session.user as User)
    next()
})

/**
 * Return API status
 */
router.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        status: {
            api: 'running',
            database: 'running',
        },
    })
})

/**
 * User paths
 */
router.use('/user', userController)

/**
 * Debug route
 */
if (!process.env.PRODUCTION) {
    router.get('/debug', (req: Request, res: Response) => {})
}

export const apiController = router
