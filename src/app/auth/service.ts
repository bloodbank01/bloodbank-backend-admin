import dotenv from "dotenv"
dotenv.config();
import { RES_MESSAGE, RES_STATUS, STATUS_CODE } from "../../common/satusMessageCode";
import bcrypt from 'bcrypt'
import Handler from "../../common/handler";
import { Login_History } from "../../models/login_history";
let soultRoute: number = 10
// Your Google Client ID
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
import { Admin } from "../../models/admin";
import { forgotPasswordEmail } from "../../common/emailTemplates";
import { sendEmail } from "../../common/sendMail";
import { Doctors } from "../../models/doctor";

class AuthService {

  async generateRandomString(length: number = 10) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  async signUpService(req: any) {
    try {

      const { email } = req.body
      const exitAdmin = await Admin.findOne({ where: { email, is_active: true } })

      if (exitAdmin) {
        return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC409, "An Account With This Email or Username Already Exists!")
      }

      let enPass = await bcrypt.hash(req.body.password, soultRoute)

      const user = await Admin.create({ ...req.body, password: enPass })
      const accessToken = await this.generateRandomString(10)
      const token = await Handler.generateToken({ id: user.dataValues.id, email: user.dataValues.email, verification_token: accessToken }, null)

      return Handler.Success(RES_STATUS.E1, STATUS_CODE.EC200, "Registration Successfully!", null)

    } catch (error: any) {
      console.log('Error :- ', error)
      return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500)
    }
  }

  async loginService(req: any) {
    try {

      const { email, password, type = 'admin' } = req.body

      let exitUser: any = null

      if (type?.toLowerCase() == 'doctor') {
        exitUser = await Doctors.findOne({ where: { email } })
      } else {
        exitUser = await Admin.findOne({ where: { email, is_active: true } })
      }

      if (!exitUser) {
        return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC404, "An Account With This Email Does Not Exist!")
      }

      let dPass = await bcrypt.compare(password, exitUser?.dataValues?.password)

      if (!dPass) {
        return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC401, "The Password You Entered Is Incorrect!")
      }

      if (exitUser.dataValues.login_token != null) {
        const decode = await Handler.verifyToken(exitUser.dataValues.login_token)

        if (decode) {
          return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC409, "Oops! You’re Already Logged In On Another Device!")
        }
      }

      let vr = await this.generateRandomString()
      const token = await Handler.generateToken({ ...exitUser.dataValues, vr, type }, '24h')
      await exitUser.update({ login_token: token, vr })

      let history_data: any = { user_id: exitUser.dataValues.id, email: exitUser.dataValues.email, login_token: token, vr, is_admin: type == 'doctor' ? false : true }
      await Login_History.create(history_data)

      return Handler.Success(RES_STATUS.E1, STATUS_CODE.EC200, "Login Successfully!", { jwt: token, vr, user: { ...exitUser?.dataValues }, type: type?.toLowerCase() == 'doctor' ? 'doctor' : 'admin' })

    } catch (error: any) {
      console.log('Error From Login:- ', error)
      return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500)
    }
  }

  async forgotPasswordService(req: any) {
    try {

      const { email, type } = req.body

      let exitUser: any = null

      if (type?.toLowerCase() == 'doctor') {
        exitUser = await Doctors.findOne({ where: { email } })
      } else {
        exitUser = await Admin.findOne({ where: { email, is_active: true } })
      }

      if (!exitUser) {
        return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC404, "An Account With This Email Does Not Exist!")
      }

      const accessToken = await this.generateRandomString(10)
      const token = await Handler.generateToken({ id: exitUser.dataValues.id, email: exitUser.dataValues.email, verification_token: accessToken, type: type?.toLowerCase() }, '2m')
      console.log("🚀 ~ AuthService ~ signUpService ~ accessToken:", accessToken)
      let url: string = `${process.env.WEB_LINK}reset-password?token=${encodeURIComponent(token)}&accessToken=${accessToken}`

      let html: any = await forgotPasswordEmail({ url })
      const result: any = await sendEmail(email, 'Forgot Password', html)

      if (!result.status) {
        return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC400, "Failed To Send Forgot Password Email!")
      }

      return Handler.Success(RES_STATUS.E1, STATUS_CODE.EC200, "A Forgot Password Email Has Been Sent. Please Check Your Email.", null)

    } catch (error: any) {
      console.log('Error From Sent-Forgot-Password-Email:- ', error)
      return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500)
    }
  }

  async resetPasswordService(req: any) {
    try {

      const { token, password, access_token } = req.body

      const decode = await Handler.verifyToken(token)

      if (!decode) {
        return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC401, "Link Expire!")
      }

      const { verification_token, type } = decode

      if (access_token != verification_token) {
        return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC403, "Access Token Mistmatch!")
      }

      const validPass = await Handler.validatePassword(password)

      if (!validPass.status) {
        return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC400, validPass.message)
      }

      let exitUser: any = null

      if (type?.toLowerCase() == 'doctor') {
        exitUser = await Doctors.findOne({ where: { id: decode.id, email: decode.email } })
      } else {
        exitUser = await Admin.findOne({ where: { id: decode.id, email: decode.email, is_active: true } })
      }

      if (!exitUser) {
        return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC404, "An Account With This Email Does Not Exist!")
      }

      let enPass = await bcrypt.hash(password, soultRoute)
      await exitUser.update({ password: enPass })

      return Handler.Success(RES_STATUS.E1, STATUS_CODE.EC200, "Password Updated!", null)

    } catch (error: any) {
      console.log('Error From Reset-Password:- ', error)
      return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500)
    }
  }

  async logoutService(req: any) {
    try {

      const token: any = await req.header('Authorization')?.replace('Bearer ', '');
      const { userId } = req
      let is_admin = true
      let user: any = await Admin.findOne({ where: { id: userId } })

      if (!user) {
        user = await Doctors.findOne({ where: { id: userId } })
        is_admin = false
        if (!user) {
          return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC404, "An Account With This Email Does Not Exist!")
        }

      }

      let history_data: any = { user_id: user.dataValues.id, email: user.dataValues.email, login_token: token, type: 'Logout', ip: req.user_ip, is_admin }
      await Login_History.create(history_data)

      if (!user.login_token) {
        return Handler.Success(RES_STATUS.E1, STATUS_CODE.EC200, "You Have Already Logged Out!", null)
      }

      await user.update({ login_token: null, vr: null })
      return Handler.Success(RES_STATUS.E1, STATUS_CODE.EC200, "Logout Successfully!", null)

    } catch (error: any) {
      console.log('Error From Logout:- ', error)
      return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500)
    }
  }

}

export default new AuthService();
