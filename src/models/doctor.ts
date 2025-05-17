import { Table, Column, Model, DataType, BelongsTo } from 'sequelize-typescript';
import { Profile } from './profile';
import { Addresses } from './adresses';
import { Hospitals } from './hospital';

@Table({ tableName: 'doctors', timestamps: true })
export class Doctors extends Model<Doctors> {

    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
    id: string | undefined;

    @Column({ type: DataType.UUID, allowNull: false })
    admin_id?: string;

    @Column({ type: DataType.UUID, allowNull: false })
    hospital_id?: string;

    @Column({ type: DataType.STRING, allowNull: true })
    username?: string;

    @Column({ type: DataType.STRING, allowNull: true })
    email?: string;

    @Column({ type: DataType.STRING, allowNull: true })
    password?: string;

    @Column({ type: DataType.TEXT, allowNull: true })
    login_token?: string;

    @Column({ type: DataType.STRING, allowNull: true })
    vr?: string;

    @BelongsTo(() => Profile, { as: 'profile', foreignKey: 'id', targetKey: 'user_id' })
    profile?: Profile;

    @BelongsTo(() => Addresses, { as: 'address', foreignKey: 'id', targetKey: 'user_id' })
    address?: Addresses;

    @BelongsTo(() => Hospitals, { as: 'hospital', foreignKey: 'hospital_id' })
    hospitals?: Hospitals;

}
