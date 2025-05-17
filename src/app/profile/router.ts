import express from 'express'
import ProfileService from './service'
import dtoValidationMiddleware from '../../middleware/validation';
import { RES_MESSAGE, RES_STATUS, STATUS_CODE } from '../../common/satusMessageCode';
import Handler from '../../common/handler';
import { UpdateAdminProfile } from '../../dto/profile';
import { upload_profile } from '../../middleware/multer';
import handleAuthorization from '../../middleware/handleAuthorization';

class ProfileRouterClass {
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private async updateAdminProfile(req: any, res: any): Promise<void> {
    try {
      const result = await ProfileService.updateAdminProfileService(req);
      res.status(result?.success?.statusCode || result?.error?.statusCode).json(result);
    } catch (error: any) {
      res.status(STATUS_CODE.EC500).json(Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500));
    }
  }

  private async updateProfilePic(req: any, res: any): Promise<void> {
    try {
      const result = await ProfileService.updateProfilePicService(req);
      res.status(result?.success?.statusCode || result?.error?.statusCode).json(result);
    } catch (error: any) {
      res.status(STATUS_CODE.EC500).json(Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500));
    }
  }

  private async getProfile(req: any, res: any): Promise<void> {
    try {
      const result = await ProfileService.getProfileService(req);
      res.status(result?.success?.statusCode || result?.error?.statusCode).json(result);
    } catch (error: any) {
      res.status(STATUS_CODE.EC500).json(Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500));
    }
  }

  private async getProfileById(req: any, res: any): Promise<void> {
    try {
      const result = await ProfileService.getProfileByIdService(req);
      res.status(result?.success?.statusCode || result?.error?.statusCode).json(result);
    } catch (error: any) {
      res.status(STATUS_CODE.EC500).json(Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500));
    }
  }

  private initializeRoutes(): void {
    this.router.post("/update-admin-profile", handleAuthorization, dtoValidationMiddleware(UpdateAdminProfile), this.updateAdminProfile)
    this.router.post("/update-profile-pic", handleAuthorization, upload_profile, this.updateProfilePic)
    this.router.get("/", handleAuthorization, this.getProfile)
    this.router.get("/:id", handleAuthorization, this.getProfileById)
  }
}

export default new ProfileRouterClass().router;
