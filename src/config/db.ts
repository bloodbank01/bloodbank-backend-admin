import dotenv from 'dotenv'
dotenv.config()
import { Sequelize } from "sequelize-typescript";
import { Users } from '../models/users';
import { Login_History } from '../models/login_history';
import { Admin } from '../models/admin';
import { Addresses } from '../models/adresses';
import { Education } from '../models/education';
import { Experience } from '../models/experience';
import { Profile } from '../models/profile';
import { Hospitals } from '../models/hospital';
import { Doctors } from '../models/doctor';
import { BloodGroup } from '../models/blood_group';
import { Contacts } from '../models/contact';
import { Appointment } from '../models/appointment';

let dbName = process.env.DB_NAME || 'cness'
let dbUser = process.env.DB_USER || 'user'
let dbPassword = process.env.DB_PASSWORD || 'password'
let dbHost = process.env.DB_HOST || 'localhost'
let dbPort = process.env.DB_PORT || '0000'


const dialectOptions: any = {};
dialectOptions.ssl = {
  require: true,
  rejectUnauthorized: false,
};
export const db: Sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: Number(dbPort),
  dialect: "postgres", //|'sqlite'|'postgres'|'mssql'
  // dialectOptions,
  // logging: true,
  // pool: {
  //   max: 5,
  //   min: 0,
  //   acquire: 30000,
  //   idle: 10000
  // },
  models: [Users, Login_History, Admin, Addresses, Education, Experience, Profile, Hospitals, Doctors, BloodGroup, Contacts, Appointment]
});

