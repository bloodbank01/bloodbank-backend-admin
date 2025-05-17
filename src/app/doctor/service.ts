import dotenv from "dotenv"
dotenv.config();
import { RES_MESSAGE, RES_STATUS, STATUS_CODE } from "../../common/satusMessageCode";
import Handler from "../../common/handler";
import bcrypt from 'bcrypt';
import { Addresses } from "../../models/adresses";
import { Doctors } from "../../models/doctor";
import { Profile } from "../../models/profile";
import { sendDoctorCredential } from "../../common/emailTemplates";
import { sendEmail } from "../../common/sendMail";
import { Hospitals } from "../../models/hospital";
import { Sequelize } from "sequelize";
import { Admin } from "../../models/admin";
const saltRoute = 10;

class DoctorService {

  async createDoctorService(req: any) {
    try {
      const { userId } = req
      const { first_name, last_name, username, phone_no, email, password, dob, designation, hospital_id, address, city, country, state, pincode } = req.body
      const gender = await Handler.capitalizeFirstLetter(req.body.gender)

      const find_doctor = await Doctors.findOne({ where: { email } })

      if (find_doctor) {
        return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC400, "Doctor Already Exists!")
      }

      const enPass = await bcrypt.hash(password, saltRoute)
      let doctor_obj: any = { username, email, password: enPass, hospital_id, admin_id: userId }
      const doctor = await Doctors.create(doctor_obj)

      let address_obj: any = { user_id: doctor.id, address, state, country, pincode, phone_no, city }
      await Addresses.create(address_obj)

      let profile_obj: any = { user_id: doctor.id, first_name, last_name, dob, gender, designation }
      await Profile.create(profile_obj)

      const html: any = await sendDoctorCredential({ email, password })
      const sendMail = await sendEmail(email, "Credential", html)

      if (!sendMail) {
        return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC400, "Email Not Sent!")
      }

      return Handler.Success(RES_STATUS.E1, STATUS_CODE.EC200, "Doctor Create Successfully!", null)

    } catch (error: any) {
      console.log('Error :- ', error)
      return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500)
    }
  }

  async getDoctorService(req: any) {
    try {
      const { userId, type } = req
      let user: any = null;

      if (type != 'admin') {
        user = await Doctors.findOne({ where: { id: userId }, raw: true })
      }

      console.log("🚀 ~ DoctorService ~ getDoctorService ~ user:", user)

      const find_doctors = await Doctors.findAll({
        include: [
          {
            model: Profile,
            as: 'profile',
            attributes: {
              include: [
                [
                  Sequelize.literal(`CASE 
                    WHEN profile.profile_pic IS NOT NULL THEN CONCAT('${process.env.IMAGE_BASE_URL}', profile.profile_pic)
                    ELSE NULL 
                  END`),
                  'profile_pic'
                ]
              ]
            }
          },
          {
            model: Addresses,
            as: 'address'
          },
          {
            model: Hospitals,
            as: 'hospital',
            where: user ? { id: user.hospital_id } : {},
            required: user ? true : false
          }
        ],
        where: user ? {} : { admin_id: userId },
        order: [['createdAt', 'DESC']]
      })
      return Handler.Success(RES_STATUS.E1, STATUS_CODE.EC200, "Doctors Data Get Successfully!", find_doctors)

    } catch (error: any) {
      console.log('Error :- ', error)
      return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500)
    }
  }

  async getDoctorByIdService(req: any) {
    try {
      const { id } = req.params

      if (!id) {
        return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC400, "Id Require!")
      }

      const find_doctor = await Doctors.findOne({
        where: { id },
        include: [
          {
            model: Profile,
            as: 'profile',
            attributes: {
              include: [
                [
                  Sequelize.literal(`CASE 
                    WHEN profile.profile_pic IS NOT NULL THEN CONCAT('${process.env.IMAGE_BASE_URL}', profile.profile_pic)
                    ELSE NULL 
                  END`),
                  'profile_pic'
                ]
              ]
            }
          },
          {
            model: Addresses,
            as: 'address'
          },
          {
            model: Hospitals,
            as: 'hospital'
          }
        ]
      })

      if (!find_doctor) {
        return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC400, "Data Not Found!")
      }

      return Handler.Success(RES_STATUS.E1, STATUS_CODE.EC200, "Doctors Data Get Successfully!", find_doctor)

    } catch (error: any) {
      console.log('Error :- ', error)
      return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500)
    }
  }

  async updateDoctorService(req: any) {
    try {
      const { id } = req.body

      if (req.body.gender) {
        const gender = await Handler.capitalizeFirstLetter(req.body.gender)
        req.body.gender = gender
      }

      const find_doctor: any = await Doctors.findOne({ where: { id } })

      if (!find_doctor) {
        return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC400, "Data Not Exists!")
      }

      delete req.body.email
      delete req.body.password
      delete req.body.user_id
      delete req.body.admin_id

      await find_doctor.update({ ...req.body })
      await Profile.update({ ...req.body }, { where: { user_id: find_doctor.dataValues.id } })

      return Handler.Success(RES_STATUS.E1, STATUS_CODE.EC200, "Data Update Successfully!", null)

    } catch (error: any) {
      console.log('Error :- ', error)
      return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500)
    }
  }

  async deleteDoctorService(req: any) {
    try {
      const { id } = req.params

      if (!id) {
        return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC400, "Id Require!")
      }

      const find_doctor = await Doctors.findOne({
        where: { id }
      })

      if (!find_doctor) {
        return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC400, "Data Not Found!")
      }

      await find_doctor.destroy()
      await Addresses.destroy({ where: { user_id: id } })
      await Profile.destroy({ where: { user_id: id } })

      return Handler.Success(RES_STATUS.E1, STATUS_CODE.EC200, "Data Delete Successfully!", null)

    } catch (error: any) {
      console.log('Error :- ', error)
      return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500)
    }
  }

}

export default new DoctorService();
