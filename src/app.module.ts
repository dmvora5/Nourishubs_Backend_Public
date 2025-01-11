import { Module } from '@nestjs/common';
import { RoleModule } from './api/v1/role/role.module';
import { RbacModule } from './modules/rbac/rbac.module';
import { CommonModule } from './modules/common/common.module';
import { UsersModule } from './api/v1/users/users.module';
import { AuthModule } from './api/v1/auth/auth.module';
import { UsernotificationModule } from './api/v1/usernotification/usernotification.module';
import { KidModule } from './modules/kids/kid.module';
import { KidsDashboardModule } from './api/v1/parent/kids-dashboard/kids-dashboard.module';
import { FoodcategoryModule } from './api/v1/vendor/foodcategory/foodcategory.module';
import { DishModule } from './api/v1/vendor/dish/dish.module';
import { ModifierModule } from './api/v1/vendor/modifier/modifier.module';
import { VendorProfileModule } from './api/v1/vendor/vendor-profile/vendor-profile.module';
import { ContactusModule } from './api/v1/contactus/contactus.module';
import { CountriesModule } from './api/v1/countries/countries.module';
import { DisputeResolutionModule } from './api/v1/dispute-resolution/dispute-resolution.module';
import { IssueReportingModule } from './api/v1/issue-reporting/issue-reporting.module';
import { VendorManagementModule } from './modules/vendor-management/vendor-management.module';
import { OrdersModule } from './modules/orders/orders.module';
import { MealSelectionModule } from './modules/meal-selection/meal-selection.module';
import { FoodchartModule } from './modules/foodchart/foodchart.module';
import { ParentMealSelectionModule } from './api/v1/parent/parent-meal-selection/parent-meal-selection.module';
import { StaffMealSelectionModule } from './api/v1/school-staff/staff-meal-selection/staff-meal-selection.module';
import { ParentOrdersModule } from './api/v1/parent/parent-orders/parent-orders.module';
import { ParentDashboardModule } from './api/v1/parent/parent-dashboard/parent-dashboard.module';
import { DistrictExecutiveUserManagementModule } from './api/v1/district-executive/user-management/user-management.module';
import { StateExecutiveUserManagementModule } from './api/v1/state-executive/user-management/user-management.module';
import { AdminUserManagementModule } from './api/v1/admin/user-management/user-management.module';
import { SuperAdminUserManagementModule } from './api/v1/super-admin/user-management/user-management.module';
import { VerificationRequestsModule } from './modules/verification-requests/verification-requests.module';
import { SuperAdminVendormanagementModule } from './api/v1/super-admin/super-admin-vendormanagement/super-admin-vendormanagement.module';
import { SuperAdminOrderManagement } from './api/v1/super-admin/order-management/orders.module';
import { SchoolAdminFoodchartModule } from './api/v1/school-admin/school-admin-foodchart/school-admin-foodchart.module';
import { AreaExecutiveFoodchartModule } from './api/v1/area-executives/area-executive-foodchart/area-executive-foodchart.module';
import { SchoolAdminDashboardModule } from './api/v1/school-admin/school-admin-dashboard/school-admin-dashboard.module';
import { StaffManagementModule } from './api/v1/school-admin/staff-management/staff-management.module';
import { DistricExecutiveFoodchartModule } from './api/v1/district-executive/distric-executive-foodchart/distric-executive-foodchart.module';
import { NewslettersModule } from './api/v1/newsletters/newsletters.module';
import { CommonapisModule } from './api/v1/commonapis/commonapis.module';
import { VendorDashbordModule } from './api/v1/vendor/vendor-dashbord/vendor-dashbord.module';
import { SeederModule } from './seeder/seeder.module';
import { AdminOrderManagement } from './api/v1/admin/order-management/orders.module';
import { StateExecutiveOrderManagement } from './api/v1/state-executive/order-management/orders.module';
import { DistrictExecutiveOrderManagement } from './api/v1/district-executive/order-management/orders.module';
import { AreaExecutiveOrderManagement } from './api/v1/area-executives/order-management/orders.module';
import { SchoolAndVendorVerifyModule } from './api/v1/district-executive/school-and-vendor-verify/school-and-vendor-verify.module';
import { SchoolAndVendorAssosiatesModule } from './api/v1/district-executive/school-and-vendor-assosiates/school-and-vendor-assosiates.module';
@Module({
  imports: [
    CommonModule,
    ContactusModule,
    CountriesModule,
    DisputeResolutionModule,
    IssueReportingModule,
    RoleModule,
    RbacModule,
    UsersModule,
    AuthModule,
    UsernotificationModule,
    KidModule,
    KidsDashboardModule,
    FoodcategoryModule,
    DishModule,
    ModifierModule,
    VendorProfileModule,
    VendorManagementModule,
    OrdersModule,
    MealSelectionModule,
    FoodchartModule,
    ParentMealSelectionModule,
    StaffMealSelectionModule,
    ParentOrdersModule,
    ParentDashboardModule,
    DistrictExecutiveUserManagementModule,
    StateExecutiveUserManagementModule,
    AdminUserManagementModule,
    SuperAdminUserManagementModule,
    VerificationRequestsModule,
    SuperAdminVendormanagementModule,
    SchoolAdminFoodchartModule,
    AreaExecutiveFoodchartModule,
    SchoolAdminDashboardModule,
    StaffManagementModule,
    SuperAdminOrderManagement,
    DistricExecutiveFoodchartModule,
    NewslettersModule,
    CommonapisModule,
    VendorDashbordModule,
    AdminOrderManagement,
    StateExecutiveOrderManagement,
    DistrictExecutiveOrderManagement,
    AreaExecutiveOrderManagement,
    SchoolAndVendorVerifyModule,
    SchoolAndVendorAssosiatesModule,
    // SeederModule
  ]
})
export class AppModule { }
