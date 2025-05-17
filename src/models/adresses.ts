import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'adresses', timestamps: true })
export class Addresses extends Model<Addresses> {

    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
    id: string | undefined;

    @Column({ type: DataType.UUID, allowNull: true })
    user_id?: string;

    @Column({ type: DataType.UUID, allowNull: true })
    hospital_id?: string;

    @Column({ type: DataType.STRING, allowNull: true })
    address?: string;

    @Column({ type: DataType.STRING, allowNull: true })
    state?: string;

    @Column({ type: DataType.STRING, allowNull: true })
    country?: string;

    @Column({ type: DataType.STRING, allowNull: true })
    city?: string;

    @Column({ type: DataType.STRING, allowNull: true })
    pincode?: string;

    @Column({ type: DataType.STRING, allowNull: true })
    phone_no?: string;

}
