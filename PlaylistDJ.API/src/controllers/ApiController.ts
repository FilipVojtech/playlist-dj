import express, { Response } from 'express'
import { userController } from './Endpoints'
import { Request } from '../global'

const router = express.Router()

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
