import express from 'express'
import AppointmentService from './service'
import dtoValidationMiddleware from '../../middleware/validation';
import { RES_MESSAGE, RES_STATUS, STATUS_CODE } from '../../common/satusMessageCode';
import Handler from '../../common/handler';
import handleAuthorization from '../../middleware/handleAuthorization';
import { updateAppointment } from '../../dto/appointment';

class AppointmentRouterClass {
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private async getAppointment(req: any, res: any): Promise<void> {
    try {
      const result = await AppointmentService.getAppointmentService(req);
      res.status(result?.success?.statusCode || result?.error?.statusCode).json(result);
    } catch (error: any) {
      res.status(STATUS_CODE.EC500).json(Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500));
    }
  }

  private async getHospitalDoctors(req: any, res: any): Promise<void> {
    try {
      const result = await AppointmentService.getHospitalDoctorsService(req);
      res.status(result?.success?.statusCode || result?.error?.statusCode).json(result);
    } catch (error: any) {
      res.status(STATUS_CODE.EC500).json(Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500));
    }
  }

  private async getAppointmentById(req: any, res: any): Promise<void> {
    try {
      const result = await AppointmentService.getAppointmentByIdService(req);
      res.status(result?.success?.statusCode || result?.error?.statusCode).json(result);
    } catch (error: any) {
      res.status(STATUS_CODE.EC500).json(Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500));
    }
  }

  private async updateAppointment(req: any, res: any): Promise<void> {
    try {
      const result = await AppointmentService.updateAppointmentService(req);
      res.status(result?.success?.statusCode || result?.error?.statusCode).json(result);
    } catch (error: any) {
      res.status(STATUS_CODE.EC500).json(Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500));
    }
  }

  private async deleteAppointment(req: any, res: any): Promise<void> {
    try {
      const result = await AppointmentService.deleteAppointmentService(req);
      res.status(result?.success?.statusCode || result?.error?.statusCode).json(result);
    } catch (error: any) {
      res.status(STATUS_CODE.EC500).json(Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500));
    }
  }

  private async getHospitalAppointment(req: any, res: any): Promise<void> {
    try {
      const result = await AppointmentService.getHospitalAppointmentService(req);
      res.status(result?.success?.statusCode || result?.error?.statusCode).json(result);
    } catch (error: any) {
      res.status(STATUS_CODE.EC500).json(Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500));
    }
  }

  private async filterAppointment(req: any, res: any): Promise<void> {
    try {
      const result = await AppointmentService.filterAppointmentService(req);
      res.status(result?.success?.statusCode || result?.error?.statusCode).json(result);
    } catch (error: any) {
      res.status(STATUS_CODE.EC500).json(Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500));
    }
  }

  private initializeRoutes(): void {
    this.router.post("/filter", handleAuthorization, this.filterAppointment)
    this.router.get("/", handleAuthorization, this.getAppointment)
    this.router.get("/hospital/doctor", handleAuthorization, this.getHospitalDoctors)
    this.router.get("/hospital", handleAuthorization, this.getHospitalAppointment)
    this.router.get("/:id", handleAuthorization, this.getAppointmentById)
    this.router.put("/", handleAuthorization, dtoValidationMiddleware(updateAppointment), this.updateAppointment)
    this.router.delete("/:id", handleAuthorization, this.deleteAppointment)
  }
}

export default new AppointmentRouterClass().router;
