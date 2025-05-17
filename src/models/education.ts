import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'education', timestamps: true })
export class Education extends Model<Education> {

    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
    id: string | undefined;

    @Column({ type: DataType.UUID, allowNull: false })
    user_id?: string;

    @Column({ type: DataType.STRING, allowNull: true })
    institution?: string;

    @Column({ type: DataType.STRING, allowNull: true })
    subject?: string;

    @Column({ type: DataType.STRING, allowNull: true })
    start_date?: string;

    @Column({ type: DataType.STRING, allowNull: true })
    complete_date?: string;

    @Column({ type: DataType.STRING, allowNull: true })
    degree?: string;

    @Column({ type: DataType.STRING, allowNull: true })
    grade?: string;

}
