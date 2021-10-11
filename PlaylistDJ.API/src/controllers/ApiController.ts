import { Request, Response } from 'express'

const router = require('express').Router()

/**
 * Return API status
 */
router.get('/', async (req: Request, res: Response) => res.status(200).json({ status: 'running' }))

export const apiController = router
