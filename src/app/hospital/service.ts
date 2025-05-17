import dotenv from "dotenv"
dotenv.config();
import { RES_MESSAGE, RES_STATUS, STATUS_CODE } from "../../common/satusMessageCode";
import Handler from "../../common/handler";
let soultRoute: number = 10
import { Admin } from "../../models/admin";
import { Addresses } from "../../models/adresses";
import { Sequelize, where } from "sequelize";
import { Hospitals } from "../../models/hospital";
import { Doctors } from "../../models/doctor";

class HospitalService {

  async createHospitalService(req: any) {
    try {
      const { userId } = req
      const { hospital_name, hospital_type, website, contact_no, alt_contact_no, description, address, state, city, country, pincode } = req.body
      const slug = await Handler.stringToSlug(hospital_name)

      const find_hospital = await Hospitals.findOne({ where: { slug } })

      if (find_hospital) {
        return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC400, "Hospital Already Exists!")
      }

      let hospital_obj: any = { name: hospital_name, type: hospital_type, website, contact_no, alternat_no: alt_contact_no, description, slug }
      const hospital = await Hospitals.create(hospital_obj)

      let address_obj: any = { hospital_id: hospital.id, address, state, city, country, pincode, phone_no: contact_no }
      await Addresses.create(address_obj)

      return Handler.Success(RES_STATUS.E1, STATUS_CODE.EC200, "Hospital Create Successfully!", null)

    } catch (error: any) {
      console.log('Error :- ', error)
      return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500)
    }
  }

  async getHospitalService(req: any) {
    try {

      const find_hospitals = await Hospitals.findAll({
        include: [
          {
            model: Addresses,
            as: 'address',
            attributes: { exclude: ['createdAt', 'updatedAt'] }
          },
          {
            model: Doctors,
            as: 'doctors',
            attributes: { exclude: ['createdAt', 'updatedAt'] }
          }
        ],
        order: [['createdAt', 'DESC']]
      })
      return Handler.Success(RES_STATUS.E1, STATUS_CODE.EC200, "Hospital Data Get Successfully!", find_hospitals)

    } catch (error: any) {
      console.log('Error :- ', error)
      return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500)
    }
  }

  async getHospitalByIdService(req: any) {
    try {

      const { id } = req.params

      if (!id) {
        return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC400, "Id Require!")
      }

      const find_hospital = await Hospitals.findOne({
        where: { id },
        include: [
          {
            model: Addresses,
            as: 'address',
            attributes: { exclude: ['createdAt', 'updatedAt'] }
          }
        ]
      })

      if (!find_hospital) {
        return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC400, "Hospital Data Not Found!")
      }

      return Handler.Success(RES_STATUS.E1, STATUS_CODE.EC200, "Hospital Data Get Successfully!", find_hospital)

    } catch (error: any) {
      console.log('Error :- ', error)
      return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500)
    }
  }

  async updateHospitalService(req: any) {
    try {
      const { userId } = req
      const { id, hospital_name = null, hospital_type = null, website = null, contact_no = null, alt_contact_no = null, description = null, address = null, state = null, city = null, country = null, pincode = null } = req.body

      let slug: any = null;

      if (hospital_name) {

        slug = await Handler.stringToSlug(hospital_name);
        const find_hospital: any = await Hospitals.findOne({ where: { slug } });

        if (find_hospital && find_hospital.id != id) {
          return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC400, "Hospital Already Exists!");
        }

      }

      const find_hospital: any = await Hospitals.findOne({ where: { slug } })

      if (find_hospital && find_hospital.id != id) {
        return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC400, "Hospital Already Exists!")
      }

      let hospital_obj: any = { name: hospital_name, type: hospital_type, website, contact_no, alternat_no: alt_contact_no, description, slug }

      for (const key in hospital_obj) {
        if (hospital_obj[key] === null) {
          delete hospital_obj[key];
        }
      }


      if (Object.keys(hospital_obj).length > 0) {
        await Hospitals.update(hospital_obj, { where: { id } });
      }

      let address_obj: any = { hospital_id: id, address, state, city, country, pincode, phone_no: contact_no }

      for (const key in address_obj) {
        if (address_obj[key] === null) {
          delete address_obj[key];
        }
      }


      if (Object.keys(address_obj).length > 0) {
        await Addresses.update(address_obj, { where: { hospital_id: id } });
      }

      return Handler.Success(RES_STATUS.E1, STATUS_CODE.EC200, "Data Update Successfully!", null)

    } catch (error: any) {
      console.log('Error :- ', error)
      return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500)
    }
  }

  async deleteHospitalService(req: any) {
    try {

      const { id } = req.params

      if (!id) {
        return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC400, "Id Require!")
      }

      const find_hospital = await Hospitals.findOne({ where: { id } })

      if (!find_hospital) {
        return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC400, "Data Not Found!")
      }

      await find_hospital.destroy()
      await Addresses.destroy({ where: { hospital_id: id } })

      return Handler.Success(RES_STATUS.E1, STATUS_CODE.EC200, "Data Delete Successfully!", null)

    } catch (error: any) {
      console.log('Error :- ', error)
      return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500)
    }
  }

}

export default new HospitalService();
