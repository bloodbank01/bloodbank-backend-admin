import dotenv from "dotenv"
dotenv.config();
import { RES_MESSAGE, RES_STATUS, STATUS_CODE } from "../../common/satusMessageCode";
import Handler from "../../common/handler";
import { Appointment } from "../../models/appointment";
import { Doctors } from "../../models/doctor";
import { Users } from "../../models/users";
import { Hospitals } from "../../models/hospital";
import { BloodGroup } from "../../models/blood_group";
import { Profile } from "../../models/profile";
import { Op, Sequelize } from "sequelize";

class AppointmentService {

  async getAppointmentService(req: any) {
    try {

      const { type } = req

      const find_appointments = await Appointment.findAll({
        include: [
          {
            model: Hospitals,
            as: 'hospital',
            attributes: ['id', 'name']
          },
          {
            model: BloodGroup,
            as: 'blood_group',
            attributes: ['id', 'name']
          },
          {
            model: Doctors,
            as: 'doctor'
          },
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
          }
        ]
      })
      return Handler.Success(RES_STATUS.E1, STATUS_CODE.EC200, "Appointment Data Get Successfully!", find_appointments)

    } catch (error: any) {
      console.log('Error :- ', error)
      return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500)
    }
  }

  async getAppointmentByIdService(req: any) {
    try {
      const { id } = req.params

      if (!id) {
        return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC400, "Id Require!")
      }

      const find_appointment = await Appointment.findOne({ where: { id } })

      if (!find_appointment) {
        return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC400, "Data Not Found!")
      }

      return Handler.Success(RES_STATUS.E1, STATUS_CODE.EC200, "Appointment Data Get Successfully!", find_appointment)

    } catch (error: any) {
      console.log('Error :- ', error)
      return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500)
    }
  }

  async updateAppointmentService(req: any) {
    try {
      const { id } = req.body

      if (req.body.gender) {
        const gender = await Handler.capitalizeFirstLetter(req.body.gender)
        req.body.gender = gender
      }

      const find_appointment: any = await Appointment.findOne({ where: { id } })

      if (!find_appointment) {
        return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC400, "Data Not Exists!")
      }

      delete req.body.email
      delete req.body.user_id

      await find_appointment.update({ ...req.body })
      // await Profile.update({ ...req.body }, { where: { user_id: find_appointment.dataValues.id } })

      const find_updated_appointment = await Appointment.findOne({
        where: { id },
        include: [
          {
            model: Hospitals,
            as: 'hospital',
            attributes: ['id', 'name']
          },
          {
            model: BloodGroup,
            as: 'blood_group',
            attributes: ['id', 'name']
          },
          {
            model: Doctors,
            as: 'doctor',
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
              }
            ]
          },
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
            model: Users,
            as: 'user'
          }
        ]
      })

      return Handler.Success(RES_STATUS.E1, STATUS_CODE.EC200, "Data Update Successfully!", find_updated_appointment)

    } catch (error: any) {
      console.log('Error :- ', error)
      return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500)
    }
  }

  async deleteAppointmentService(req: any) {
    try {
      const { id } = req.params

      if (!id) {
        return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC400, "Id Require!")
      }

      const find_appointment = await Appointment.findOne({
        where: { id }
      })

      if (!find_appointment) {
        return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC400, "Data Not Found!")
      }

      await find_appointment.destroy()
      return Handler.Success(RES_STATUS.E1, STATUS_CODE.EC200, "Data Delete Successfully!", null)

    } catch (error: any) {
      console.log('Error :- ', error)
      return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500)
    }
  }

  async getHospitalAppointmentService(req: any) {
    try {

      const { type, userId } = req

      const doctor = await Doctors.findOne({ where: { id: userId } })

      if (!doctor) {
        return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC400, "Doctor Not Found!")
      }

      const find_appointments = await Appointment.findAll({
        where: { hospital_id: doctor?.dataValues?.hospital_id },
        include: [
          {
            model: Users,
            as: 'user',
            attributes: ['id', 'email']
          },
          {
            model: Hospitals,
            as: 'hospital',
            attributes: ['id', 'name']
          },
          {
            model: BloodGroup,
            as: 'blood_group',
            attributes: ['id', 'name']
          },
          {
            model: Doctors,
            as: 'doctor',
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
              }
            ]
          },
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
          }
        ],
        order: [['createdAt', 'DESC']]
      })

      return Handler.Success(RES_STATUS.E1, STATUS_CODE.EC200, "Appointment Data Get Successfully!", find_appointments)

    } catch (error: any) {
      console.log('Error :- ', error)
      return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500)
    }
  }

  async getHospitalDoctorsService(req: any) {
    try {

      const { type, userId } = req

      const doctor = await Doctors.findOne({ where: { id: userId } })

      if (!doctor) {
        return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC400, "Doctor Not Found!")
      }

      const find_doctors = await Doctors.findAll({
        where: { hospital_id: doctor?.dataValues?.hospital_id },
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
          }
        ],
        order: [['createdAt', 'ASC']]
      })

      return Handler.Success(RES_STATUS.E1, STATUS_CODE.EC200, "Doctor's Data Get Successfully!", find_doctors)

    } catch (error: any) {
      console.log('Error :- ', error)
      return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500)
    }
  }

  async filterAppointmentService(req: any) {
    try {

      const { userId } = req
      const { status } = req.body

      const doctor = await Doctors.findOne({ where: { id: userId } })

      if (!doctor) {
        return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC400, "Doctor Not Found!")
      }

      let array: any = []

      for (let index = 0; index < status.length; index++) {
        const element = status[index];
        let name = await Handler.capitalizeFirstLetter(element)
        array.push(name)
      }

      const all = status.includes('all')

      const find_appointments = await Appointment.findAll({
        where: all ? {hospital_id: doctor?.dataValues?.hospital_id} : {
          status: {
            [Op.in]: array
          },
          hospital_id: doctor?.dataValues?.hospital_id
        },
        include: [
          {
            model: Hospitals,
            as: 'hospital',
            attributes: ['id', 'name']
          },
          {
            model: BloodGroup,
            as: 'blood_group',
            attributes: ['id', 'name']
          },
          {
            model: Doctors,
            as: 'doctor'
          },
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
          }
        ]
      })

      return Handler.Success(RES_STATUS.E1, STATUS_CODE.EC200, "Appointment's Get Successfully!", find_appointments)

    } catch (error: any) {
      console.log('Error :- ', error)
      return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500)
    }
  }

}

export default new AppointmentService();
