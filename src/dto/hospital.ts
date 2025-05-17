import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class createHospital {

  @IsNotEmpty()
  @IsString()
  hospital_name?: string;

  @IsNotEmpty()
  @IsString()
  hospital_type?: string;

  @IsNotEmpty()
  @IsString()
  website?: string;

  @IsNotEmpty()
  @IsString()
  contact_no?: string;

  @IsNotEmpty()
  @IsString()
  alt_contact_no?: string;

  @IsNotEmpty()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsString()
  address?: string;

  @IsNotEmpty()
  @IsString()
  state?: string;

  @IsNotEmpty()
  @IsString()
  country?: string;

  @IsNotEmpty()
  @IsString()
  city?: string;

  @IsNotEmpty()
  @IsString()
  pincode?: string;

}

export class updateHospital {
  
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  id?: string;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  hospital_name?: string;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  hospital_type?: string;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  website?: string;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  contact_no?: string;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  alt_contact_no?: string;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  address?: string;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  state?: string;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  country?: string;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  city?: string;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  pincode?: string;

}