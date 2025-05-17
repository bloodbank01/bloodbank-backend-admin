import express from 'express'
import HospitalService from './service'
import dtoValidationMiddleware from '../../middleware/validation';
import { RES_MESSAGE, RES_STATUS, STATUS_CODE } from '../../common/satusMessageCode';
import Handler from '../../common/handler';
import handleAuthorization from '../../middleware/handleAuthorization';
import { createHospital, updateHospital } from '../../dto/hospital';

class HospitalRouterClass {
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private async createHospital(req: any, res: any): Promise<void> {
    try {
      const result = await HospitalService.createHospitalService(req);
      res.status(result?.success?.statusCode || result?.error?.statusCode).json(result);
    } catch (error: any) {
      res.status(STATUS_CODE.EC500).json(Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500));
    }
  }

  private async getHospital(req: any, res: any): Promise<void> {
    try {
      const result = await HospitalService.getHospitalService(req);
      res.status(result?.success?.statusCode || result?.error?.statusCode).json(result);
    } catch (error: any) {
      res.status(STATUS_CODE.EC500).json(Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500));
    }
  }

  private async getHospitalById(req: any, res: any): Promise<void> {
    try {
      const result = await HospitalService.getHospitalByIdService(req);
      res.status(result?.success?.statusCode || result?.error?.statusCode).json(result);
    } catch (error: any) {
      res.status(STATUS_CODE.EC500).json(Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500));
    }
  }

  private async updateHospital(req: any, res: any): Promise<void> {
    try {
      const result = await HospitalService.updateHospitalService(req);
      res.status(result?.success?.statusCode || result?.error?.statusCode).json(result);
    } catch (error: any) {
      res.status(STATUS_CODE.EC500).json(Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500));
    }
  }

  private async deleteHospital(req: any, res: any): Promise<void> {
    try {
      const result = await HospitalService.deleteHospitalService(req);
      res.status(result?.success?.statusCode || result?.error?.statusCode).json(result);
    } catch (error: any) {
      res.status(STATUS_CODE.EC500).json(Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500));
    }
  }

  private initializeRoutes(): void {
    this.router.post("/", handleAuthorization, dtoValidationMiddleware(createHospital), this.createHospital)
    this.router.get("/", handleAuthorization, this.getHospital)
    this.router.get("/:id", handleAuthorization, this.getHospitalById)
    this.router.put("/", handleAuthorization, dtoValidationMiddleware(updateHospital), this.updateHospital)
    this.router.delete("/:id", handleAuthorization, this.deleteHospital)
  }
}

export default new HospitalRouterClass().router;
