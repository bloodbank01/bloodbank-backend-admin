import dotenv from "dotenv"
dotenv.config();
import { RES_MESSAGE, RES_STATUS, STATUS_CODE } from "../../common/satusMessageCode";
import Handler from "../../common/handler";
let soultRoute: number = 10
import { Admin } from "../../models/admin";
import { Addresses } from "../../models/adresses";
import { Op, Sequelize, where } from "sequelize";
import { Contacts } from "../../models/contact";

class ContactService {

  async getContactService(req: any) {
    try {

      const { filter } = req.params

      const find_contacts = await Contacts.findAll({
        where: filter == 'all' ? {} : { status: filter },
        order: [['createdAt', 'ASC']]
      })

      return Handler.Success(RES_STATUS.E1, STATUS_CODE.EC200, "Contact Data Get Successfully!", find_contacts)

    } catch (error: any) {
      console.log('Error :- ', error)
      return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500)
    }
  }

  async getContactByIdService(req: any) {
    try {

      const { id } = req.params

      if (!id) {
        return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC400, "Id Require!")
      }

      const find_contact = await Contacts.findOne({
        where: { id }
      })

      if (!find_contact) {
        return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC400, "Contact Data Not Found!")
      }

      return Handler.Success(RES_STATUS.E1, STATUS_CODE.EC200, "Contact Data Get Successfully!", find_contact)

    } catch (error: any) {
      console.log('Error :- ', error)
      return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500)
    }
  }

  async updateContactService(req: any) {
    try {
      const { userId } = req
      const { id } = req.body
      const status = await Handler.capitalizeFirstLetter(req.body.status)

      const find_contact: any = await Contacts.findOne({ where: { id } })

      if (!find_contact) {
        return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC400, "Contact Not Exists!")
      }

      await find_contact.update({ status });

      return Handler.Success(RES_STATUS.E1, STATUS_CODE.EC200, "Data Update Successfully!", null)

    } catch (error: any) {
      console.log('Error :- ', error)
      return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500)
    }
  }

  async deleteContactService(req: any) {
    try {

      const { id } = req.params

      if (!id) {
        return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC400, "Id Require!")
      }

      const find_contact = await Contacts.findOne({ where: { id } })

      if (!find_contact) {
        return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC400, "Data Not Found!")
      }

      await find_contact.destroy()
      return Handler.Success(RES_STATUS.E1, STATUS_CODE.EC200, "Data Delete Successfully!", null)

    } catch (error: any) {
      console.log('Error :- ', error)
      return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500)
    }
  }

  async filterContactService(req: any) {
    try {

      const { status } = req.body

      let array: any = []

      for (let index = 0; index < status.length; index++) {
        const element = status[index];
        let name = await Handler.capitalizeFirstLetter(element)
        array.push(name)
      }

      const all = status.includes('all')

      const find_contacts = await Contacts.findAll({
        where: all ? {} : {
          status: {
            [Op.in]: array
          }
        }
      });

      return Handler.Success(RES_STATUS.E1, STATUS_CODE.EC200, "Contact Data Get Successfully!", find_contacts)

    } catch (error: any) {
      console.log('Error :- ', error)
      return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500)
    }
  }

}

export default new ContactService();
