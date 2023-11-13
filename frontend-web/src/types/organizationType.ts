import { UserRole } from "./userTypes";

export interface Organization{
    id: string;
    name: string;
    type: UserRole;
    information: string;
}