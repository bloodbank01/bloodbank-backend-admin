import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class updateAppointment {

  @IsNotEmpty()
  @IsUUID()
  @IsString()
  id?: string;

}
