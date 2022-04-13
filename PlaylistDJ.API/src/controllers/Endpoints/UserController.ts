import express, { Response } from 'express'
import { Request } from '../../global'
import { wrap } from '@mikro-orm/core'
import { DI } from '../../app'

const router = express.Router()

router.route('/account')
    .get((req: Request, res: Response) => {
        // todo: Get account
        res.sendStatus(501)
    })
    .post((req: Request, res: Response) => {
        //todo: Post account
        res.sendStatus(501)
    })
    .delete((req: Request, res: Response) => {
        // todo: Delete account
        res.sendStatus(501)
    })

router.route('/profile')
    .get((req: Request, res: Response) => {
        res.json(req.session.user!.profile)
    })
    .post((req: Request, res: Response) => {
        // todo: Post profile
        res.sendStatus(501)
    })

router.route('/communication')
    .get((req: Request, res: Response) => {
        res.json(req.session.user!.communication)
    })
    .post(async (req: Request, res: Response) => {
        req.session.user!.communication = req.body
        const user = await DI.userRepository.findOne({ _id: req.session.user!._id })
        wrap(user).assign(req.session.user!)
        await DI.userRepository.flush()
        res.json(req.session.user!.communication)
    })

export const userController = router
