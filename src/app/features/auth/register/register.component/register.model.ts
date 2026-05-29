export interface RegisterDto {
  email: string;
  password: string;
  role: string;
  phone: string | null;
  address: string | null;
}
