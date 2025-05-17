import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class updateContact {

    @IsNotEmpty()
    @IsUUID()
    @IsString()
    id?: string;

    @IsNotEmpty()
    @IsString()
    status?: string;

}