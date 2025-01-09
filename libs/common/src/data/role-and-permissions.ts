import { PERMISSIONS, ROLES } from "../constant";


export const ALL_PERMISSION = {
    USERMANAGEMENT: {
        _id: PERMISSIONS.USERMANAGEMENT.permission,
        name: "User Management",
        subPermissions: [
            {
                _id: PERMISSIONS.USERMANAGEMENT.subPermissions.CREATEUSERS,
                name: 'Create User',
            },
            {
                _id: PERMISSIONS.USERMANAGEMENT.subPermissions.UPDATEUSERS,
                name: 'Edit User',
            },
            {
                _id: PERMISSIONS.USERMANAGEMENT.subPermissions.DELETEUSERS,
                name: 'Delete User',
            },
            {
                _id: PERMISSIONS.USERMANAGEMENT.subPermissions.GETALLUSERS,
                name: 'Get User',
            },
            {
                _id: PERMISSIONS.USERMANAGEMENT.subPermissions.GETUSERDETAILS,
                name: 'Get User Details',
            },
            {
                _id: PERMISSIONS.USERMANAGEMENT.subPermissions.SUSPENDUSERS,
                name: 'Suspend User',
            },
            {
                _id: PERMISSIONS.USERMANAGEMENT.subPermissions.REACTIVATEUSERS,
                name: 'Reactivate User',
            },
            {
                _id: PERMISSIONS.USERMANAGEMENT.subPermissions.TRACKUSERS,
                name: 'Track User Activity',
            },
            {
                _id: PERMISSIONS.USERMANAGEMENT.subPermissions.TRACKUSERSENGAGEMENT,
                name: 'Track User Engagement',
            },
        ]
    },
    VENDORMANAGEMENT: {
        _id: PERMISSIONS.VENDORMANAGEMENT.permission,
        name: 'Vendor Management',
        subPermissions: [
            {
                _id: PERMISSIONS.VENDORMANAGEMENT.subPermissions.CREATEVENDORS,
                name: 'Create Vendor',
            },
            {
                _id: PERMISSIONS.VENDORMANAGEMENT.subPermissions.UPDATEVENDORS,
                name: 'Edit Vendor',
            },
            {
                _id: PERMISSIONS.VENDORMANAGEMENT.subPermissions.DELETEVENDORS,
                name: 'Delete Vendor',
            },
            {
                _id: PERMISSIONS.VENDORMANAGEMENT.subPermissions.DOCUMENTVERIFICATIONLIST,
                name: 'Document List',
            },
            {
                _id: PERMISSIONS.VENDORMANAGEMENT.subPermissions.SUSPENDVENDORS,
                name: 'Suspend Vendor',
            },
            {
                _id: PERMISSIONS.VENDORMANAGEMENT.subPermissions.GETALLVENDORS,
                name: 'Vendor Listr',
            },
            {
                _id: PERMISSIONS.VENDORMANAGEMENT.subPermissions.GETVENDORDETAILS,
                name: 'Vendor Detail',
            },
            {
                _id: PERMISSIONS.VENDORMANAGEMENT.subPermissions.DOCUMENTVERIFICATIONLIST,
                name: 'Document Verification List',
            },
            {
                _id: PERMISSIONS.VENDORMANAGEMENT.subPermissions.VERIFYDOCUMENTS,
                name: 'Verify Document',
            },
            {
                _id: PERMISSIONS.VENDORMANAGEMENT.subPermissions.THRESHOLDVERIFICATIONLIST,
                name: 'ThresHold Verification',
            },
            {
                _id: PERMISSIONS.VENDORMANAGEMENT.subPermissions.APPROVETHRESHOLD,
                name: 'Approve ThresHold',
            },

        ]
    },
    ROLEMANAGEMENT: {
        _id: PERMISSIONS.ROLEMANAGEMENT.permission,
        name: 'Role Management',
        subPermissions: [
            {
                _id: PERMISSIONS.ROLEMANAGEMENT.subPermissions.GETROLES,
                name: 'Get Roles List',
            },
            {
                _id: PERMISSIONS.ROLEMANAGEMENT.subPermissions.GETPERMISSIONLIST,
                name: 'Get Permission List',
            },
            {
                _id: PERMISSIONS.ROLEMANAGEMENT.subPermissions.GETPERMISSIONDETAILS,
                name: 'Get PermissionDetails',
            },

        ]
    },
    STAFFMANAGEMENT: {
        _id: PERMISSIONS.STAFFMANAGEMENT.permission,
        name: 'Staff Management',
        subPermissions: [
            {
                _id: PERMISSIONS.STAFFMANAGEMENT.subPermissions.CREATESTAFF,
                name: 'Create Staff Member',
            },
            {
                _id: PERMISSIONS.STAFFMANAGEMENT.subPermissions.GETALLSTAFF,
                name: 'Staff List',
            },
            {
                _id: PERMISSIONS.STAFFMANAGEMENT.subPermissions.UPDATESTAFF,
                name: 'Update Staff Member',
            },
            {
                _id: PERMISSIONS.STAFFMANAGEMENT.subPermissions.DELETESTAFF,
                name: 'Delete Staff Member',
            },
            {
                _id: PERMISSIONS.STAFFMANAGEMENT.subPermissions.GETSTAFFDETAILS,
                name: 'View Staff Member Detail',
            },

        ]
    },
    PARENTMANAGEMENT: {
        _id: PERMISSIONS.PARENTMANAGEMENT.permission,
        name: 'Parent Management',
        subPermissions: [
            {
                _id: PERMISSIONS.PARENTMANAGEMENT.subPermissions.APPROVEPARENT,
                name: 'Approve parent',
            },

        ]
    },
    SCHOOLADMINDASHBOARD: {
        _id: PERMISSIONS.SCHOOLADMINDASHBOARD.permission,
        name: 'School Admin Dashboard',
        subPermissions: [
            {
                _id: PERMISSIONS.SCHOOLADMINDASHBOARD.subPermissions.PARENTREGISTRATIONREQUESTLIST,
                name: 'Get Parent Ragistration list',
            },
            {
                _id: PERMISSIONS.SCHOOLADMINDASHBOARD.subPermissions.HANDLEREGISTRATIONREQUEST,
                name: 'Handle Registration request',
            },
            {
                _id: PERMISSIONS.SCHOOLADMINDASHBOARD.subPermissions.UPDATEPSCHOOLADMINROFILE,
                name: 'Update School Admin Profile',
            },

        ]
    },
    FOOCHARTMANAGEMENT: {
        _id: PERMISSIONS.FOOCHARTMANAGEMENT.permission,
        name: 'FoodChart Management',
        subPermissions: [
            {
                _id: PERMISSIONS.FOOCHARTMANAGEMENT.subPermissions.CREATEFOODCHART,
                name: 'Create Food Chart',
            },
            {
                _id: PERMISSIONS.FOOCHARTMANAGEMENT.subPermissions.APPROVEFOODCHART,
                name: 'Approve Food Chart',
            }
        ]
    },
    MEALSELECTION: {
        _id: PERMISSIONS.MEALSELECTION.permission,
        name: 'Meal Selection',
        subPermissions: [
            {
                _id: PERMISSIONS.MEALSELECTION.subPermissions.ORDERMEAL,
                name: 'Order Meal',
            },

        ]
    },
    PARENTSPROFILE: {
        _id: PERMISSIONS.PARENTSPROFILE.permission,
        name: 'Parent Profile',
        subPermissions: [
            {
                _id: PERMISSIONS.PARENTSPROFILE.subPermissions.GETDETAILS,
                name: 'Profile Details',
            },
            {
                _id: PERMISSIONS.PARENTSPROFILE.subPermissions.UPDATEPROFILE,
                name: 'Update Parent Profile',
            },

        ]
    },
    KIDSMANAGEMENT: {
        _id: PERMISSIONS.KIDSMANAGEMENT.permission,
        name: 'Kids Management',
        subPermissions: [
            {
                _id: PERMISSIONS.KIDSMANAGEMENT.subPermissions.CREATEKID,
                name: 'Create Kid',
            },
            {
                _id: PERMISSIONS.KIDSMANAGEMENT.subPermissions.UPDATEKID,
                name: 'Update Kid',
            },
            {
                _id: PERMISSIONS.KIDSMANAGEMENT.subPermissions.GETALLKIDS,
                name: 'Get Kid List',
            },
            {
                _id: PERMISSIONS.KIDSMANAGEMENT.subPermissions.GETKIDDETAILS,
                name: 'Get Kid Details',
            },

        ]
    },
    VENDORPERMISSIONS: {
        _id: PERMISSIONS.VENDORPERMISSIONS.permission,
        name: 'Vendor Permissions',
        subPermissions: [
            {
                _id: PERMISSIONS.VENDORPERMISSIONS.subPermissions.UPDATEPROFILE,
                name: 'Update Profile',
            },
            {
                _id: PERMISSIONS.VENDORPERMISSIONS.subPermissions.THRESHOLDREQUEST,
                name: 'Thresshold Request',
            },
            {
                _id: PERMISSIONS.VENDORPERMISSIONS.subPermissions.DOCUMENTVERIFICATIONREQUEST,
                name: 'Documnet verification request',
            },
            // {
            //     _id: PERMISSIONS.VENDORPERMISSIONS.subPermissions.ADDFOODCATEGORY,
            //     name: 'Add Food Category',
            // },
            // {
            //     _id: PERMISSIONS.VENDORPERMISSIONS.subPermissions.UPDATEFOODCATEGORY,
            //     name: 'Update Food Category',
            // },
            // {
            //     _id: PERMISSIONS.VENDORPERMISSIONS.subPermissions.DELETEFOODCATEGORY,
            //     name: 'Delete Food Category',
            // },
        ]
    },
    MENUMANAGEMENT: {
        _id: PERMISSIONS.MENUMANAGEMENT.permission,
        name: 'Menu Management',
        subPermissions: [
            {
                _id: PERMISSIONS.MENUMANAGEMENT.subPermissions.CREATEDISH,
                name: 'Create Dish',
            },
            {
                _id: PERMISSIONS.MENUMANAGEMENT.subPermissions.UPDATEDISH,
                name: 'Update Dish',
            },
            {
                _id: PERMISSIONS.MENUMANAGEMENT.subPermissions.DELETEDISH,
                name: 'Delete Dish',
            },
            {
                _id: PERMISSIONS.MENUMANAGEMENT.subPermissions.GETALLDISHES,
                name: 'Get All Dishesh',
            },
            {
                _id: PERMISSIONS.MENUMANAGEMENT.subPermissions.CREATEMODIFIER,
                name: 'Create Modifier',
            },
            {
                _id: PERMISSIONS.MENUMANAGEMENT.subPermissions.UPDATEMODIFIER,
                name: 'Update Modifier',
            },
            {
                _id: PERMISSIONS.MENUMANAGEMENT.subPermissions.DELETEMODIFIER,
                name: 'Delete Modifier',
            },
            {
                _id: PERMISSIONS.MENUMANAGEMENT.subPermissions.GETALLMODIFIERS,
                name: 'Get Modifiers List',
            },
            {
                _id: PERMISSIONS.MENUMANAGEMENT.subPermissions.CREATECATEGORY,
                name: 'Create Food Catogory',
            },
            {
                _id: PERMISSIONS.MENUMANAGEMENT.subPermissions.UPDATECATEGORY,
                name: 'Update Food Catogory',
            },
            {
                _id: PERMISSIONS.MENUMANAGEMENT.subPermissions.DELETECATEGORY,
                name: 'Delete Food Catogory',
            },
            {
                _id: PERMISSIONS.MENUMANAGEMENT.subPermissions.GETALLCATEGORY,
                name: 'Get Vendors FoodCatogories',
            },
        ]
    }
}


export const INSERT_RBAC_DATA = {
    [ROLES.SUPER_ADMIN]: {
        _id: ROLES.SUPER_ADMIN,
        name: "Super Admin",
        childRoles: [
            ROLES.ADMIN,
            ROLES.STATE_EXECUTIVE,
            ROLES.DISTRICT_EXECUTIVE,
            ROLES.AREA_EXECUTIVE,
            ROLES.SCHOOL,
            ROLES.TEACHER,
            ROLES.SCHOOLOTHERS,
            ROLES.PARENT,
            ROLES.VENDOR
        ],
        permissions: [
            {
                permission: PERMISSIONS.USERMANAGEMENT.permission,
                subPermissions: [
                    ...Object.values(PERMISSIONS.USERMANAGEMENT.subPermissions)
                ]
            },
            {
                permission: PERMISSIONS.VENDORMANAGEMENT.permission,
                subPermissions: [
                    ...Object.values(PERMISSIONS.VENDORMANAGEMENT.subPermissions)
                ]
            },
            {
                permission: PERMISSIONS.ROLEMANAGEMENT.permission,
                subPermissions: [
                    ...Object.values(PERMISSIONS.ROLEMANAGEMENT.subPermissions)
                ]
            }
        ]
    },
    [ROLES.ADMIN]: {
        _id: ROLES.ADMIN,
        name: "Admin",
        childRoles: [
            ROLES.STATE_EXECUTIVE,
            ROLES.DISTRICT_EXECUTIVE,
            ROLES.AREA_EXECUTIVE,
            ROLES.SCHOOL,
            ROLES.TEACHER,
            ROLES.SCHOOLOTHERS,
            ROLES.PARENT,
            ROLES.VENDOR
        ],
        permissions: [
            {
                permission: PERMISSIONS.USERMANAGEMENT.permission,
                subPermissions: [
                    ...Object.values(PERMISSIONS.USERMANAGEMENT.subPermissions)
                ]
            },
            {
                permission: PERMISSIONS.VENDORMANAGEMENT.permission,
                subPermissions: [
                    ...Object.values(PERMISSIONS.VENDORMANAGEMENT.subPermissions)
                ]
            },
            {
                permission: PERMISSIONS.ROLEMANAGEMENT.permission,
                subPermissions: [
                    ...Object.values(PERMISSIONS.ROLEMANAGEMENT.subPermissions)
                ]
            }
        ]
    },
    [ROLES.STATE_EXECUTIVE]: {
        _id: ROLES.STATE_EXECUTIVE,
        name: "State Executive",
        childRoles: [
            ROLES.DISTRICT_EXECUTIVE,
            ROLES.AREA_EXECUTIVE,
            ROLES.SCHOOL,
            ROLES.TEACHER,
            ROLES.SCHOOLOTHERS,
            ROLES.PARENT,
            ROLES.VENDOR
        ],
        permissions: [
            {
                permission: PERMISSIONS.USERMANAGEMENT.permission,
                subPermissions: [
                    ...Object.values(PERMISSIONS.USERMANAGEMENT.subPermissions)
                ]
            },
            {
                permission: PERMISSIONS.VENDORMANAGEMENT.permission,
                subPermissions: [
                    ...Object.values(PERMISSIONS.VENDORMANAGEMENT.subPermissions)
                ]
            },
            {
                permission: PERMISSIONS.ROLEMANAGEMENT.permission,
                subPermissions: [
                    ...Object.values(PERMISSIONS.ROLEMANAGEMENT.subPermissions)
                ]
            },
            {
                permission: PERMISSIONS.FOOCHARTMANAGEMENT.permission,
                subPermissions: [
                    ...Object.values(PERMISSIONS.FOOCHARTMANAGEMENT.subPermissions)
                ]
            }
        ]
    },
    [ROLES.DISTRICT_EXECUTIVE]: {
        _id: ROLES.DISTRICT_EXECUTIVE,
        name: "District Executive",
        childRoles: [
            ROLES.AREA_EXECUTIVE,
            ROLES.SCHOOL,
            ROLES.TEACHER,
            ROLES.SCHOOLOTHERS,
            ROLES.PARENT,
            ROLES.VENDOR
        ],
        permissions: [
            {
                permission: PERMISSIONS.USERMANAGEMENT.permission,
                subPermissions: [
                    ...Object.values(PERMISSIONS.USERMANAGEMENT.subPermissions)
                ]
            },
            {
                permission: PERMISSIONS.VENDORMANAGEMENT.permission,
                subPermissions: [
                    ...Object.values(PERMISSIONS.VENDORMANAGEMENT.subPermissions)
                ]
            },
            {
                permission: PERMISSIONS.ROLEMANAGEMENT.permission,
                subPermissions: [
                    ...Object.values(PERMISSIONS.ROLEMANAGEMENT.subPermissions)
                ]
            },
            {
                permission: PERMISSIONS.FOOCHARTMANAGEMENT.permission,
                subPermissions: [
                    ...Object.values(PERMISSIONS.FOOCHARTMANAGEMENT.subPermissions)
                ]
            }
        ]
    },
    [ROLES.AREA_EXECUTIVE]: {
        _id: ROLES.AREA_EXECUTIVE,
        name: "Area Executive",
        childRoles: [
            ROLES.SCHOOL,
            ROLES.TEACHER,
            ROLES.SCHOOLOTHERS,
            ROLES.PARENT,
            ROLES.VENDOR
        ],
        permissions: [
            {
                permission: PERMISSIONS.VENDORMANAGEMENT.permission,
                subPermissions: [
                    ...Object.values(PERMISSIONS.VENDORMANAGEMENT.subPermissions)
                ]
            },
            {
                permission: PERMISSIONS.FOOCHARTMANAGEMENT.permission,
                subPermissions: [
                    ...Object.values(PERMISSIONS.FOOCHARTMANAGEMENT.subPermissions)
                ]
            }
        ]
    },
    [ROLES.SCHOOL]: {
        _id: ROLES.SCHOOL,
        name: "School",
        childRoles: [
            ROLES.TEACHER,
            ROLES.SCHOOLOTHERS,
            ROLES.PARENT,
            ROLES.VENDOR
        ],
        permissions: [
            {
                permission: PERMISSIONS.STAFFMANAGEMENT.permission,
                subPermissions: [
                    ...Object.values(PERMISSIONS.STAFFMANAGEMENT.subPermissions)
                ]
            },
            {
                permission: PERMISSIONS.PARENTMANAGEMENT.permission,
                subPermissions: [
                    ...Object.values(PERMISSIONS.PARENTMANAGEMENT.subPermissions)
                ]
            },
            {
                permission: PERMISSIONS.ROLEMANAGEMENT.permission,
                subPermissions: [
                    ...Object.values(PERMISSIONS.ROLEMANAGEMENT.subPermissions)
                ]
            },
            {
                permission: PERMISSIONS.SCHOOLADMINDASHBOARD.permission,
                subPermissions: [
                    ...Object.values(PERMISSIONS.SCHOOLADMINDASHBOARD.subPermissions)
                ]
            },
            {
                permission: PERMISSIONS.FOOCHARTMANAGEMENT.permission,
                subPermissions: [
                    ...Object.values(PERMISSIONS.FOOCHARTMANAGEMENT.subPermissions)
                ]
            }
        ]
    },
    [ROLES.TEACHER]: {
        _id: ROLES.TEACHER,
        name: "Teacher",
        childRoles: [],
        permissions: [
            {
                permission: PERMISSIONS.MEALSELECTION.permission,
                subPermissions: [
                    ...Object.values(PERMISSIONS.MEALSELECTION.subPermissions)
                ]
            }
        ]
    },
    [ROLES.SCHOOLOTHERS]: {
        _id: ROLES.SCHOOLOTHERS,
        name: "School Others",
        childRoles: [],
        permissions: [
            {
                permission: PERMISSIONS.MEALSELECTION.permission,
                subPermissions: [
                    ...Object.values(PERMISSIONS.MEALSELECTION.subPermissions)
                ]
            }
        ]
    },
    [ROLES.PARENT]: {
        _id: ROLES.PARENT,
        name: "Parent",
        childRoles: [],
        permissions: [
            {
                permission: PERMISSIONS.PARENTSPROFILE.permission,
                subPermissions: [
                    ...Object.values(PERMISSIONS.PARENTSPROFILE.subPermissions)
                ]
            },
            {
                permission: PERMISSIONS.KIDSMANAGEMENT.permission,
                subPermissions: [
                    ...Object.values(PERMISSIONS.KIDSMANAGEMENT.subPermissions)
                ]
            }
        ]
    },
    [ROLES.VENDOR]: {
        _id: ROLES.VENDOR,
        name: "Vendor",
        childRoles: [],
        permissions: [
            {
                permission: PERMISSIONS.VENDORPERMISSIONS.permission,
                subPermissions: [
                    ...Object.values(PERMISSIONS.VENDORPERMISSIONS.subPermissions)
                ]
            },
            {
                permission: PERMISSIONS.MENUMANAGEMENT.permission,
                subPermissions: [
                    ...Object.values(PERMISSIONS.MENUMANAGEMENT.subPermissions)
                ]
            }
        ]
    },
}