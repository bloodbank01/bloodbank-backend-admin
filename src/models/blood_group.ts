import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'blood_group', timestamps: true })
export class BloodGroup extends Model<BloodGroup> {

    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
    id: string | undefined;

    @Column({ type: DataType.STRING, allowNull: false })
    name?: string;

}
