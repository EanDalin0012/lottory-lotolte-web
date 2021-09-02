export interface User{
  id: number;
    first_name: string;
    last_name: string;
    birt_date: string;
    resource_info_id: string;
    email: string;
    contact: string;
    description: string;
    password: string;
}


export interface UserInfomation{
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
  dateBirth: string;
  gender: string;
  resourceID: number;
  phoneNumber: string;
  otherPhoneNumber: string;
  createDate: string;
  address: string;
  isFirstLogin?: string;

}
