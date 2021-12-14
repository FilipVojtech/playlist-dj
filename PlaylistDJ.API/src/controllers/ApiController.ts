import express, { Request, Response } from 'express'

const router = express.Router()

/**
 * Return API status
 */
router.get('/', async (req: Request, res: Response) => {
    res.status(200).json({
        api: { status: 'running' },
        database: { status: 'running' },
    })
})

if (!process.env.PRODUCTION) {
    /**
     * Debug route
     */
    router.get('/debug', async (req: Request, res: Response) => {})
}

export const apiController = router
