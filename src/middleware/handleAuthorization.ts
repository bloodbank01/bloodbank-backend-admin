import { Request, NextFunction } from 'express';
import { RES_MESSAGE, RES_STATUS, STATUS_CODE } from '../common/satusMessageCode';
import Handler from '../common/handler';
import { Admin } from '../models/admin';
import { Doctors } from '../models/doctor';

declare global {
    namespace Express {
        interface Request {
            userId?: string;
            type?: string;
        }
    }
}

const handleAuthorization = async (req: Request, res: any, next: NextFunction) => {
    const token: any = await req.header('Authorization')?.replace('Bearer ', '');
    const vr: any = await req.header('vr');

    if (!token) {
        return res.status(STATUS_CODE.EC401).json(Handler.Error(RES_STATUS.E2, STATUS_CODE.EC401, RES_MESSAGE.EM401));
    }

    if (!vr) {
        return res.status(STATUS_CODE.EC401).json(Handler.Error(RES_STATUS.E2, STATUS_CODE.EC401, 'Header Token Missing!'));
    }

    let user: any = await Admin.findOne({
        where: { login_token: token, vr: vr }
    })

    if (!user) {

        user = await Doctors.findOne({
            where: { login_token: token, vr: vr }
        })

        if (!user) {
            return res.status(STATUS_CODE.EC401).json(Handler.Error(RES_STATUS.E2, STATUS_CODE.EC401, "Your Session Has Expired!"));
        }

        // return res.status(STATUS_CODE.EC401).json(Handler.Error(RES_STATUS.E2, STATUS_CODE.EC401, "Your Session Has Expired!"));
    }


    if (user.dataValues.is_active === true || user.dataValues.is_active === false) {
        if (!user.dataValues.is_active) {
            return res.status(STATUS_CODE.EC400).json(Handler.Error(RES_STATUS.E2, STATUS_CODE.EC400, "Admin Is Not Active!"));
        }
    }

    const verifyToken = await Handler.verifyToken(token)

    try {

        if (!verifyToken) {
            user.update({ login_token: null, vr: null })
            return res.status(STATUS_CODE.EC401).json(Handler.Error(RES_STATUS.E2, STATUS_CODE.EC401, RES_MESSAGE.EM402));
        }

        if (verifyToken.vr != vr) {
            return res.status(STATUS_CODE.EC401).json(Handler.Error(RES_STATUS.E2, STATUS_CODE.EC401, 'Invalid Header Token!'));
        }

        if (user.dataValues.id != verifyToken.id) {
            return res.status(STATUS_CODE.EC403).json(Handler.Error(RES_STATUS.E2, STATUS_CODE.EC403, "You Cannot Access Another Admin's Account!"));
        }

        req.userId = verifyToken?.id;
        req.type = verifyToken?.type;
    } catch (err: any) {
        return res.status(STATUS_CODE.EC401).json(Handler.Error(RES_STATUS.E2, STATUS_CODE.EC401, RES_MESSAGE.EM500));
    }

    next();
};

export default handleAuthorization;
