export const ROLES = {
    SUPER_ADMIN: "super_admin_role",
    ADMIN: "admin_role",
    STATE_EXECUTIVE: "state_executive_role",
    DISTRICT_EXECUTIVE: "district_executive_role",
    AREA_EXECUTIVE: "area_executive_role",
    SCHOOL: "school_role",
    TEACHER: "teacher_role",
    SCHOOLOTHERS: "school_otherers_role",
    PARENT: "parent_role",
    VENDOR: "vendor_role"
}

export const PERMISSIONS = {
    USERMANAGEMENT: {
        permission: "user_management",
        subPermissions: {
            CREATEUSERS: "create_user",
            UPDATEUSERS: "update_user",
            DELETEUSERS: "delete_user",
            GETUSERDETAILS: "get_user_details",
            GETALLUSERS: "get_users",
            SUSPENDUSERS: "suspend_users",
            REACTIVATEUSERS: "reactivate_users",
            TRACKUSERS: "track_users",
            TRACKUSERSENGAGEMENT: "track_user_engagement",
            VERIFICATIONREQUESTS: "verification_requests",
            VERIFYUSER: "verify_user",
        }
    },
    ROLEMANAGEMENT: {
        permission: "role_management",
        subPermissions: {
            GETROLES: "get_roles_list",
            GETPERMISSIONLIST: "get_permissions_list",
            GETPERMISSIONDETAILS: "get_permissions_details",

        }
    },
    // VENDORMANAGEMENT: {
    //     permission: "vendor_management",
    //     subPermissions: {
    //         CREATEVENDORS: "create_vendor",
    //         UPDATEVENDORS: "update_vendor",
    //         DELETEVENDORS: "delete_vendor",
    //         GETALLVENDORS: "get_vendors",
    //         GETVENDORDETAILS: "get_vendordetails",
    //         SUSPENDVENDORS: "suspend_vendors",
    //         DOCUMENTVERIFICATIONLIST: "document_verification_list",
    //         THRESHOLDVERIFICATIONLIST: "threshold_verification_list",
    //         VERIFYDOCUMENTS: "verify_documents",
    //         APPROVETHRESHOLD: "approve_threshold"
    //     }
    // },
    MENUMANAGEMENT: {
        permission: "menu_management",
        subPermissions: {
            CREATEDISH: "create_dish",
            UPDATEDISH: "update_dish",
            DELETEDISH: "delete_dish",
            GETALLDISHES: "getdishes",
            CREATEMODIFIER: "create_modifier",
            UPDATEMODIFIER: "update_modifier",
            DELETEMODIFIER: "delete_modifier",
            GETALLMODIFIERS: "get_modifieres",
            CREATECATEGORY: "create_category",
            UPDATECATEGORY: "update_category",
            DELETECATEGORY: "delete_category",
            GETALLCATEGORY: "get_categories",
        }
    },
    // USERPERMISSIONS: {
    //     permission: "user_permissions",
    //     subPermissions: {
    //         VERIFICATION_REQUEST: "verification_request",
    //     }
    // },
    STAFFMANAGEMENT: {
        permission: "staff_management",
        subPermissions: {
            CREATESTAFF: "create_staff",
            UPDATESTAFF: "update_staff",
            DELETESTAFF: "delete_staff",
            GETALLSTAFF: "get_staff",
            GETSTAFFDETAILS: "get_staff_details",
        }
    },
    SCHOOLADMINDASHBOARD: {
        permission: "schooladmin_dashboard_management",
        subPermissions: {
            PARENTREGISTRATIONREQUESTLIST: "parent_registration_list",
            HANDLEREGISTRATIONREQUEST: "handle_registration_requests",
            UPDATEPSCHOOLADMINROFILE: "update_schooladmin_profile",
        }
    },
    FOOCHARTMANAGEMENT: {
        permission: "foodchart_management",
        subPermissions: {
            CREATEFOODCHART: "create_foodchart",
            APPROVEFOODCHART: "approve_foodchart",
            GETFOODCHARTREQUESTS: "get_foodchart_requests",
        }
    },
    PARENTMANAGEMENT: {
        permission: "parent_management",
        subPermissions: {
            APPROVEPARENT: "approve_parent",
        }
    },
    PARENTSPROFILE: {
        permission: "parent_dashboard",
        subPermissions: {
            GETDETAILS: "get_details",
            UPDATEPROFILE: "update_profile"
        }
    },
    KIDSMANAGEMENT: {
        permission: "kids_management",
        subPermissions: {
            CREATEKID: "create_kid",
            UPDATEKID: "update_kid",
            GETALLKIDS: "get_kids_list",
            GETKIDDETAILS: "get_kid_details",
        }
    },
    MEALSELECTION: {
        permission: "meal_selection",
        subPermissions: {
            ORDERMEAL: "order_meal",
        }
    }
}