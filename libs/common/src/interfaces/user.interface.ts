
export  interface IPermissions {
  permission: string;
  subPermissions: string[];
}

export interface IRole {
    _id: string;
    name: string;
    childRoles: string[];
    permissions: IPermissions[]
  }
  
  export interface IUser {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    role?: IRole;
    createdBy?: string;
    status: 'active' | 'suspended' | 'deleted' | 'pending';
    vendorStatus?: 'pending' | 'approved' | 'rejected' | null;
    thresHoldApprove?: 'pending' | 'approved' | 'rejected' | null;
    permissionList: string[];
    subPermissionsList: string[];
    location: {
      latitude: number;
      longitude: number;
      country:string;
      state:string;
      district:string;
      city: string;
    },
    approvedKids?: string[],
    schoolId?: string
  }