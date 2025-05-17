import express from 'express'
import AuthService from './service'
import dtoValidationMiddleware from '../../middleware/validation';
import { forgotPassword, login, resetPassword, signUp } from '../../dto/auth';
import { RES_MESSAGE, RES_STATUS, STATUS_CODE } from '../../common/satusMessageCode';
import Handler from '../../common/handler';
import handleAuthorization from '../../middleware/handleAuthorization';

class AuthRouterClass {
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  private async login(req: any, res: any): Promise<void> {
    try {
      const result = await AuthService.loginService(req);
      res.status(result?.success?.statusCode || result?.error?.statusCode).json(result);
    } catch (error: any) {
      res.status(STATUS_CODE.EC500).json(Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500));
    }
  }

  private async signUp(req: any, res: any): Promise<void> {
    try {
      const result = await AuthService.signUpService(req);
      res.status(result?.success?.statusCode || result?.error?.statusCode).json(result);
    } catch (error:any) {
      res.status(STATUS_CODE.EC500).json(Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500));
    }
  }

  private async forgotPassword(req: any, res: any): Promise<void> {
    try {
      const result = await AuthService.forgotPasswordService(req);
      res.status(result?.success?.statusCode || result?.error?.statusCode).json(result);
    } catch (error: any) {
      res.status(STATUS_CODE.EC500).json(Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500));
    }
  }

  private async resetPassword(req: any, res: any): Promise<void> {
    try {
      const result = await AuthService.resetPasswordService(req);
      res.status(result?.success?.statusCode || result?.error?.statusCode).json(result);
    } catch (error: any) {
      res.status(STATUS_CODE.EC500).json(Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500));
    }
  }

  private async logout(req: any, res: any): Promise<void> {
    try {
      const result = await AuthService.logoutService(req);
      res.status(result?.success?.statusCode || result?.error?.statusCode).json(result);
    } catch (error:any) {
      res.status(STATUS_CODE.EC500).json(Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500));
    }
  }

  private initializeRoutes(): void {
    this.router.post("/sign-up", dtoValidationMiddleware(signUp), this.signUp)
    this.router.post("/sign-in", dtoValidationMiddleware(login), this.login)
    this.router.post("/forgot-password", dtoValidationMiddleware(forgotPassword), this.forgotPassword)
    this.router.post("/reset-password", dtoValidationMiddleware(resetPassword), this.resetPassword)
    this.router.get("/logout", handleAuthorization, this.logout)
  }
}

export default new AuthRouterClass().router;
