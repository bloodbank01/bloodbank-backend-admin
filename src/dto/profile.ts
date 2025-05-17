import { IsEmail, IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateAdminProfile {

  @IsNotEmpty()
  @IsString()
  @MinLength(3, { message: 'Minimum length should be 3' })
  @MaxLength(15, { message: 'Maximum length should be 15' })
  first_name?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3, { message: 'Minimum length should be 3' })
  @MaxLength(15, { message: 'Maximum length should be 15' })
  last_name?: string;

  @IsNotEmpty()
  @IsString()
  dob?: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(['Male', 'Female', 'male', 'female'])
  gender?: string;

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
  pincode?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(9, { message: 'Minimum length should be 9' })
  @MaxLength(11, { message: 'Maximum length should be 11' })
  phone_no?: string;

}