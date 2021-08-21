import { PersonalInformation } from './personal-information';
import { UserAccount } from './user-account';
import { IdentifyInformation } from './identify-information';
export class CreateAccount {
  personalInformation = new PersonalInformation();
  userAccount:UserAccount | undefined;
  identifyInformation: IdentifyInformation | undefined;
  remark: string | undefined;
}
