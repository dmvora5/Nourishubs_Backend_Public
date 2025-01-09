import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OtherUsers, OtherUsersSchema, Parent, ParentSchema, School, SchoolMembers, SchoolMembersSchema, SchoolSchema, User, UserSchema, Vendor, VendorSchema } from './models/user.schema';
import { OtherUserRepository, ParentRepository, SchoolMembersRepository, SchoolRepository, UserRepository, VendorRepository } from './user.repository';
import { UsernotificationModule } from '../usernotification/usernotification.module';

@Module({
  imports: [
    UsernotificationModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
        discriminators: [
          { name: OtherUsers.name, schema: OtherUsersSchema },
          { name: Vendor.name, schema: VendorSchema },
          { name: School.name, schema: SchoolSchema },
          { name: Parent.name, schema: ParentSchema },
          { name: SchoolMembers.name, schema: SchoolMembersSchema }
        ]
      }
    ])
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepository, VendorRepository, SchoolRepository, ParentRepository, OtherUserRepository, SchoolMembersRepository],
  exports: [UsersService, UserRepository, VendorRepository, SchoolRepository, ParentRepository, OtherUserRepository, SchoolMembersRepository]
})
export class UsersModule { }
