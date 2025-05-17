import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'sub_doctors', timestamps: true })
export class SubDoctors extends Model<SubDoctors> {

    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
    id: string | undefined;

    @Column({ type: DataType.STRING, allowNull: true })
    username?: string;

    @Column({ type: DataType.UUID, allowNull: true })
    doctor_id?: string;

    @Column({ type: DataType.UUID, allowNull: true })
    hospital_id?: string;

    @Column({ type: DataType.UUID, allowNull: true })
    profile_id?: string;

}
