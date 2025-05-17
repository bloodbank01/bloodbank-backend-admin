import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class createBloodGroup {

  @IsNotEmpty()
  @IsString()
  name?: string;

}

export class updateBloodGroup {
  
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  id?: string;

  @IsNotEmpty()
  @IsString()
  name?: string;

}