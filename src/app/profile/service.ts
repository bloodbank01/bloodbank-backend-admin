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
import { Profile } from "../../models/profile";
import { Addresses } from "../../models/adresses";
import { Sequelize } from "sequelize";
import { Doctors } from "../../models/doctor";

class ProfileService {

  async updateAdminProfileService(req: any) {
    try {
      const { userId } = req
      const { first_name, city, last_name, dob, address, state, country, pincode, phone_no, description } = req.body
      const gender = await Handler.capitalizeFirstLetter(req.body.gender)

      const find_profile = await Profile.findOne({ where: { user_id: userId } })
      const find_address = await Addresses.findOne({ where: { user_id: userId } })

      if (!find_profile) {
        let obj: any = { user_id: userId }
        const save = await Profile.create(obj)
      }

      if (!find_address) {
        let obj: any = { user_id: userId }
        const save = await Addresses.create(obj)
      }

      let profile_obj: any = { first_name, last_name, dob, gender, description }
      await Profile.update({ ...profile_obj }, { where: { user_id: userId } })

      let address_obj: any = { address, state, country, pincode, phone_no, city }
      await Addresses.update({ ...address_obj }, { where: { user_id: userId } })

      return Handler.Success(RES_STATUS.E1, STATUS_CODE.EC200, "Profile Update Successfully!", null)

    } catch (error: any) {
      console.log('Error :- ', error)
      return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500)
    }
  }

  async updateProfilePicService(req: any) {
    try {
      const { userId } = req

      if (!req.file) {
        return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC400, "File Require!")
      }

      const find_profile = await Profile.findOne({ where: { user_id: userId } })

      if (!find_profile) {
        let obj: any = { user_id: userId }
        const save = await Profile.create(obj)
      }

      let profile_obj: any = { profile_pic: req.file.key }
      await Profile.update({ ...profile_obj }, { where: { user_id: userId } })

      return Handler.Success(RES_STATUS.E1, STATUS_CODE.EC200, "Profile Picture Update Successfully!", { profile_pic: `${process.env.IMAGE_BASE_URL}${req.file.key}` })

    } catch (error: any) {
      console.log('Error :- ', error)
      return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500)
    }
  }

  async getProfileService(req: any) {
    try {
      const { userId, type } = req

      const find_profile = await Profile.findOne({ where: { user_id: userId } })
      const find_address = await Addresses.findOne({ where: { user_id: userId } })

      if (!find_profile) {
        let obj: any = { user_id: userId }
        const save = await Profile.create(obj)
      }

      if (!find_address) {
        let obj: any = { user_id: userId }
        const save = await Addresses.create(obj)
      }

      const profile: any = await Profile.findOne({
        where: {
          user_id: userId
        },
        attributes: { exclude: ['createdAt', 'updatedAt'], include: [[Sequelize.literal(`CASE  WHEN "Profile"."profile_pic" IS NULL  THEN NULL   ELSE CONCAT('${process.env.IMAGE_BASE_URL}', "Profile"."profile_pic")  END`), 'profile_pic']] },
        include: [
          {
            model: Addresses,
            as: 'address',
            attributes: { exclude: ['createdAt', 'updatedAt'] }
          }
        ]
      })

      let user: any = await Admin.findOne({ where: { id: userId }, attributes: ['email', 'id'], raw: true });
      if (!user) {
        user = await Doctors.findOne({ where: { id: userId }, attributes: ['email', 'id', 'username'], raw: true });
      }

      let plain = await profile.get({ plain: true })
      return Handler.Success(RES_STATUS.E1, STATUS_CODE.EC200, "Profile Get Successfully!", { ...plain, user })

    } catch (error: any) {
      console.log('Error :- ', error)
      return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500)
    }
  }

  async getProfileByIdService(req: any) {
    try {
      const { id } = req.params

      if (!id) {
        return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC400, "Id Require!")
      }

      const find_profile = await Profile.findOne({ where: { user_id: id } })
      const find_address = await Addresses.findOne({ where: { user_id: id } })

      if (!find_profile) {
        let obj: any = { user_id: id }
        const save = await Profile.create(obj)
      }

      if (!find_address) {
        let obj: any = { user_id: id }
        const save = await Addresses.create(obj)
      }

      let profile: any = await Profile.findOne({
        where: {
          user_id: id
        },
        attributes: { exclude: ['createdAt', 'updatedAt'], include: [[Sequelize.literal(`CASE  WHEN "Profile"."profile_pic" IS NULL  THEN NULL   ELSE CONCAT('${process.env.IMAGE_BASE_URL}', "Profile"."profile_pic")  END`), 'profile_pic']] },
        include: [
          {
            model: Addresses,
            as: 'address',
            attributes: { exclude: ['createdAt', 'updatedAt'] }
          }
        ]
      })

      let user: any = await Admin.findOne({ where: { id }, attributes: ['email', 'id'], raw: true });
      if (!user) {
        user = await Doctors.findOne({ where: { id }, attributes: ['email', 'id', 'username'], raw: true });
      }

      let plain = await profile.get({ plain: true })
      return Handler.Success(RES_STATUS.E1, STATUS_CODE.EC200, "Profile Get Successfully!", { ...plain, user })

    } catch (error: any) {
      console.log('Error :- ', error)
      return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500)
    }
  }

}

export default new ProfileService();
