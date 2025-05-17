import express from 'express'
import DoctorService from './service'
import dtoValidationMiddleware from '../../middleware/validation';
import { RES_MESSAGE, RES_STATUS, STATUS_CODE } from '../../common/satusMessageCode';
import Handler from '../../common/handler';
import handleAuthorization from '../../middleware/handleAuthorization';
import { createDoctor, updateDoctor } from '../../dto/doctor';

class DoctorRouterClass {
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private async createDoctor(req: any, res: any): Promise<void> {
    try {
      const result = await DoctorService.createDoctorService(req);
      res.status(result?.success?.statusCode || result?.error?.statusCode).json(result);
    } catch (error: any) {
      res.status(STATUS_CODE.EC500).json(Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500));
    }
  }

  private async getDoctor(req: any, res: any): Promise<void> {
    try {
      const result = await DoctorService.getDoctorService(req);
      res.status(result?.success?.statusCode || result?.error?.statusCode).json(result);
    } catch (error: any) {
      res.status(STATUS_CODE.EC500).json(Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500));
    }
  }

  private async getDoctorById(req: any, res: any): Promise<void> {
    try {
      const result = await DoctorService.getDoctorByIdService(req);
      res.status(result?.success?.statusCode || result?.error?.statusCode).json(result);
    } catch (error: any) {
      res.status(STATUS_CODE.EC500).json(Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500));
    }
  }

  private async updateDoctor(req: any, res: any): Promise<void> {
    try {
      const result = await DoctorService.updateDoctorService(req);
      res.status(result?.success?.statusCode || result?.error?.statusCode).json(result);
    } catch (error: any) {
      res.status(STATUS_CODE.EC500).json(Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500));
    }
  }

  private async deleteDoctor(req: any, res: any): Promise<void> {
    try {
      const result = await DoctorService.deleteDoctorService(req);
      res.status(result?.success?.statusCode || result?.error?.statusCode).json(result);
    } catch (error: any) {
      res.status(STATUS_CODE.EC500).json(Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500));
    }
  }

  private initializeRoutes(): void {
    this.router.post("/", handleAuthorization, dtoValidationMiddleware(createDoctor), this.createDoctor)
    this.router.get("/", handleAuthorization, this.getDoctor)
    this.router.get("/:id", handleAuthorization, this.getDoctorById)
    this.router.put("/", handleAuthorization, dtoValidationMiddleware(updateDoctor), this.updateDoctor)
    this.router.delete("/:id", handleAuthorization, this.deleteDoctor)
  }
}

export default new DoctorRouterClass().router;
