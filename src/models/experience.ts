import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'experience', timestamps: true })
export class Experience  extends Model<Experience > {

    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
    id: string | undefined;

    @Column({ type: DataType.UUID, allowNull: false })
    user_id?: string;

    @Column({ type: DataType.STRING, allowNull: true })
    company_name?: string;

    @Column({ type: DataType.STRING, allowNull: true })
    location?: string;

    @Column({ type: DataType.STRING, allowNull: true })
    job_posting?: string;

    @Column({ type: DataType.STRING, allowNull: true })
    period_from?: string;

    @Column({ type: DataType.STRING, allowNull: true })
    period_to?: string;

}
