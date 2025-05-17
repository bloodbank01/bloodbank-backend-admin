import { Table, Column, Model, DataType, BelongsTo } from 'sequelize-typescript';
import { Addresses } from './adresses';
import { Admin } from './admin';

@Table({ tableName: 'profile', timestamps: true })
export class Profile extends Model<Profile> {

  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true, })
  id: string | undefined;

  @Column({ type: DataType.UUID, allowNull: false })
  user_id?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  first_name?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  last_name?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  dob?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  gender?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  designation ?: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  profile_pic?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  description ?: string;

  @BelongsTo(() => Addresses, { as: 'address', foreignKey: 'user_id', targetKey: 'user_id' })
  Adrress!: Addresses

  @BelongsTo(() => Admin, { as: 'user', foreignKey: 'user_id' })
  user!: Admin

}
