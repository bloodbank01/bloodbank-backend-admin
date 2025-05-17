import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'contact', timestamps: true })
export class Contacts extends Model<Contacts> {

    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
    id: string | undefined;

    @Column({ type: DataType.STRING, allowNull: false })
    first_name?: string;

    @Column({ type: DataType.STRING, allowNull: false })
    last_name?: string;

    @Column({ type: DataType.STRING, allowNull: false })
    email?: string;

    @Column({ type: DataType.BIGINT, allowNull: false })
    phone_no?: number;

    @Column({ type: DataType.STRING, allowNull: false })
    message?: string;

    @Column({ type: DataType.STRING, allowNull: false, defaultValue : 'Pending' })
    status?: string;

}
