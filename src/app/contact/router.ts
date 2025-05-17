import express from 'express'
import ContactService from './service'
import dtoValidationMiddleware from '../../middleware/validation';
import { RES_MESSAGE, RES_STATUS, STATUS_CODE } from '../../common/satusMessageCode';
import Handler from '../../common/handler';
import handleAuthorization from '../../middleware/handleAuthorization';
import { updateContact } from '../../dto/contact';

class ContactRouterClass {
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private async getContact(req: any, res: any): Promise<void> {
    try {
      const result = await ContactService.getContactService(req);
      res.status(result?.success?.statusCode || result?.error?.statusCode).json(result);
    } catch (error: any) {
      res.status(STATUS_CODE.EC500).json(Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500));
    }
  }

  private async getContactById(req: any, res: any): Promise<void> {
    try {
      const result = await ContactService.getContactByIdService(req);
      res.status(result?.success?.statusCode || result?.error?.statusCode).json(result);
    } catch (error: any) {
      res.status(STATUS_CODE.EC500).json(Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500));
    }
  }

  private async updateContact(req: any, res: any): Promise<void> {
    try {
      const result = await ContactService.updateContactService(req);
      res.status(result?.success?.statusCode || result?.error?.statusCode).json(result);
    } catch (error: any) {
      res.status(STATUS_CODE.EC500).json(Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500));
    }
  }

  private async deleteContact(req: any, res: any): Promise<void> {
    try {
      const result = await ContactService.deleteContactService(req);
      res.status(result?.success?.statusCode || result?.error?.statusCode).json(result);
    } catch (error: any) {
      res.status(STATUS_CODE.EC500).json(Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500));
    }
  }

  private async filterContact(req: any, res: any): Promise<void> {
    try {
      const result = await ContactService.filterContactService(req);
      res.status(result?.success?.statusCode || result?.error?.statusCode).json(result);
    } catch (error: any) {
      res.status(STATUS_CODE.EC500).json(Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500));
    }
  }

  private initializeRoutes(): void {
    this.router.get("/:filter", handleAuthorization, this.getContact)
    this.router.get("/:id", handleAuthorization, this.getContactById)
    this.router.put("/", handleAuthorization, dtoValidationMiddleware(updateContact), this.updateContact)
    this.router.delete("/:id", handleAuthorization, this.deleteContact)
    this.router.post("/filter", handleAuthorization, this.filterContact)
  }
}

export default new ContactRouterClass().router;
