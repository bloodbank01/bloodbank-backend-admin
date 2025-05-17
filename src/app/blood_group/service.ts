import dotenv from "dotenv"
dotenv.config();
import { RES_MESSAGE, RES_STATUS, STATUS_CODE } from "../../common/satusMessageCode";
import Handler from "../../common/handler";
import { Addresses } from "../../models/adresses";
import { BloodGroup } from "../../models/blood_group";

class BloodGroupService {

  async createBloodGroupService(req: any) {
    try {
      const name = await Handler.capitalizeFirstLetter(req.body.name)
      const find_blood_group = await BloodGroup.findOne({ where: { name } })

      if (find_blood_group) {
        return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC400, "BloodGroup Already Exists!")
      }

      let blood_group_obj: any = { name }
      const blood_group = await BloodGroup.create(blood_group_obj)

      return Handler.Success(RES_STATUS.E1, STATUS_CODE.EC200, "BloodGroup Create Successfully!", blood_group)

    } catch (error: any) {
      console.log('Error :- ', error)
      return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500)
    }
  }

  async getBloodGroupService(req: any) {
    try {

      const find_blood_groups = await BloodGroup.findAll({
        order: [['name', 'ASC']]
      })

      return Handler.Success(RES_STATUS.E1, STATUS_CODE.EC200, "BloodGroup Data Get Successfully!", find_blood_groups)

    } catch (error: any) {
      console.log('Error :- ', error)
      return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500)
    }
  }

  async getBloodGroupByIdService(req: any) {
    try {

      const { id } = req.params

      if (!id) {
        return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC400, "Id Require!")
      }

      const find_blood_group = await BloodGroup.findOne({
        where: { id },
        order: [['name', 'ASC']]
      })

      if (!find_blood_group) {
        return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC400, "BloodGroup Data Not Found!")
      }

      return Handler.Success(RES_STATUS.E1, STATUS_CODE.EC200, "BloodGroup Data Get Successfully!", find_blood_group)

    } catch (error: any) {
      console.log('Error :- ', error)
      return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500)
    }
  }

  async updateBloodGroupService(req: any) {
    try {
      const { userId } = req
      const { id } = req.body
      const name = await Handler.capitalizeFirstLetter(req.body.name)
      const find_blood_group: any = await BloodGroup.findOne({ where: { name } })

      if (find_blood_group && find_blood_group.id != id) {
        return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC400, "BloodGroup Already Exists!")
      }

      let blood_group_obj: any = { name }
      await BloodGroup.update(blood_group_obj, { where: { id } });

      return Handler.Success(RES_STATUS.E1, STATUS_CODE.EC200, "Data Update Successfully!", null)

    } catch (error: any) {
      console.log('Error :- ', error)
      return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500)
    }
  }

  async deleteBloodGroupService(req: any) {
    try {

      const { id } = req.params

      if (!id) {
        return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC400, "Id Require!")
      }

      const find_blood_group = await BloodGroup.findOne({ where: { id } })

      if (!find_blood_group) {
        return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC400, "Data Not Found!")
      }

      await find_blood_group.destroy()
      return Handler.Success(RES_STATUS.E1, STATUS_CODE.EC200, "Data Delete Successfully!", null)

    } catch (error: any) {
      console.log('Error :- ', error)
      return Handler.Error(RES_STATUS.E2, STATUS_CODE.EC500, RES_MESSAGE.EM500)
    }
  }

}

export default new BloodGroupService();
