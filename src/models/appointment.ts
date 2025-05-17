import { Table, Column, Model, DataType, BelongsTo } from 'sequelize-typescript';
import { Users } from './users';
import { Profile } from './profile';
import { Doctors } from './doctor';
import { Hospitals } from './hospital';
import { BloodGroup } from './blood_group';

@Table({ tableName: 'appointment', timestamps: true })
export class Appointment extends Model<Appointment> {

    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
    id: string | undefined;

    @Column({ type: DataType.UUID, allowNull: false })
    user_id?: string;

    @Column({ type: DataType.STRING, allowNull: false })
    first_name?: string;

    @Column({ type: DataType.STRING, allowNull: false })
    last_name?: string;

    @Column({ type: DataType.STRING, allowNull: false })
    phone_no?: string;

    @Column({ type: DataType.UUID, allowNull: false })
    blood_id?: string;

    @Column({ type: DataType.STRING, allowNull: false })
    message?: string;

    @Column({ type: DataType.STRING, allowNull: false })
    request_type?: string;

    @Column({ type: DataType.STRING, allowNull: false, defaultValue : 'Pending' })
    status?: string;

    @Column({ type: DataType.UUID, allowNull: true })
    doctor_id?: string;

    @Column({ type: DataType.UUID, allowNull: false })
    hospital_id?: string;

    @Column({ type: DataType.STRING, allowNull: true })
    appointment_date?: string;

    @Column({ type: DataType.STRING, allowNull: true })
    appointment_time?: string;

    @BelongsTo(() => Users, { as: 'user', foreignKey: 'user_id' })
    user?: Users

    @BelongsTo(() => Profile, { as: 'profile', foreignKey: 'user_id', targetKey : 'user_id' })
    profile?: Profile

    @BelongsTo(() => Doctors, { as: 'doctor', foreignKey: 'doctor_id' })
    doctor?: Doctors

    @BelongsTo(() => Hospitals, { as: 'hospital', foreignKey: 'hospital_id' })
    hospitals?: Hospitals

    @BelongsTo(() => BloodGroup, { as: 'blood_group', foreignKey: 'blood_id' })
    bloodGroup?: BloodGroup

}
