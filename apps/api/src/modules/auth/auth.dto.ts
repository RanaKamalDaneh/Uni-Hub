import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEmail, IsIn, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

const trimLower = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim().toLowerCase() : value);
const trim = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value);

export class RegisterDto {
  @ApiProperty() @Transform(trim) @IsString() @MinLength(2) @MaxLength(100)
  fullName: string;

  @ApiProperty() @Transform(trimLower) @IsEmail() @MaxLength(254)
  email: string;

  @ApiProperty({ description: 'Min 8 chars with at least one letter and one number' })
  @IsString() @MinLength(8) @MaxLength(128)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, { message: 'password must contain letters and numbers' })
  password: string;

  @ApiProperty({ enum: ['STUDENT', 'PROVIDER'] }) @IsIn(['STUDENT', 'PROVIDER'])
  accountType: 'STUDENT' | 'PROVIDER';

  @ApiProperty({ enum: ['en', 'ar'], required: false }) @IsOptional() @IsIn(['en', 'ar'])
  locale?: 'en' | 'ar';

  @ApiProperty({ description: 'Acceptance of terms and academic integrity policy' }) @IsBoolean()
  acceptTerms: boolean;
}

export class LoginDto {
  @ApiProperty() @Transform(trimLower) @IsEmail()
  email: string;

  @ApiProperty() @IsString() @MinLength(1) @MaxLength(128)
  password: string;
}

export class ChangePasswordDto {
  @ApiProperty() @IsString() @MinLength(1)
  currentPassword: string;

  @ApiProperty() @IsString() @MinLength(8) @MaxLength(128)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, { message: 'password must contain letters and numbers' })
  newPassword: string;
}
