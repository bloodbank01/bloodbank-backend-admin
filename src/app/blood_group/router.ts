import express from 'express'
import BloodGroupService from './service'
import dtoValidationMiddleware from '../../middleware/validation';
import { RES_MESSAGE, RES_STATUS, STATUS_CODE } from '../../common/satusMessageCode';
import Handler from '../../common/handler';
import handleAuthorization from '../../middleware/handleAuthorization';
import { createBloodGroup, updateBloodGroup } from '../../dto/blood_group';

class BloodGroupRouterClass {
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private async createBloodGroup(req: any, res: any): Promise<void> {
    try {
      const result = await BloodGroupService.createBloodGroupService(req);
      res.status(result?.success?.statusCode || result?.error?.statusCode).json(result);
    } catch (error: any) {
      res.status(STATUS_CODE.EC500).json(Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500));
    }
  }

  private async getBloodGroup(req: any, res: any): Promise<void> {
    try {
      const result = await BloodGroupService.getBloodGroupService(req);
      res.status(result?.success?.statusCode || result?.error?.statusCode).json(result);
    } catch (error: any) {
      res.status(STATUS_CODE.EC500).json(Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500));
    }
  }

  private async getBloodGroupById(req: any, res: any): Promise<void> {
    try {
      const result = await BloodGroupService.getBloodGroupByIdService(req);
      res.status(result?.success?.statusCode || result?.error?.statusCode).json(result);
    } catch (error: any) {
      res.status(STATUS_CODE.EC500).json(Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500));
    }
  }

  private async updateBloodGroup(req: any, res: any): Promise<void> {
    try {
      const result = await BloodGroupService.updateBloodGroupService(req);
      res.status(result?.success?.statusCode || result?.error?.statusCode).json(result);
    } catch (error: any) {
      res.status(STATUS_CODE.EC500).json(Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500));
    }
  }

  private async deleteBloodGroup(req: any, res: any): Promise<void> {
    try {
      const result = await BloodGroupService.deleteBloodGroupService(req);
      res.status(result?.success?.statusCode || result?.error?.statusCode).json(result);
    } catch (error: any) {
      res.status(STATUS_CODE.EC500).json(Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500));
    }
  }

  private initializeRoutes(): void {
    this.router.post("/", handleAuthorization, dtoValidationMiddleware(createBloodGroup), this.createBloodGroup)
    this.router.get("/", handleAuthorization, this.getBloodGroup)
    this.router.get("/:id", handleAuthorization, this.getBloodGroupById)
    this.router.put("/", handleAuthorization, dtoValidationMiddleware(updateBloodGroup), this.updateBloodGroup)
    this.router.delete("/:id", handleAuthorization, this.deleteBloodGroup)
  }
}

export default new BloodGroupRouterClass().router;
