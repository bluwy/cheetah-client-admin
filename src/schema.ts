// This file was autogenerated by GraphQL Code Generator
// Do not make changes to this file directly

export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] };

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /**
   * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the
   * `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO
   * 8601 standard for representation of dates and times using the Gregorian calendar.
   */
  DateTime: any;
};

export type Action = {
  __typename?: 'Action';
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  remarks: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type ActionInput = {
  id?: Maybe<Scalars['ID']>;
  remarks?: Maybe<Scalars['String']>;
};

export type Admin = {
  __typename?: 'Admin';
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  privilege: AdminPrivilege;
  updatedAt: Scalars['DateTime'];
  username: Scalars['String'];
};

export type AdminCreateInput = {
  password: Scalars['String'];
  privilege: AdminPrivilege;
  username: Scalars['String'];
};

export type AdminOrderByInput = {
  createdAt?: Maybe<OrderByArg>;
  privilege?: Maybe<OrderByArg>;
  updatedAt?: Maybe<OrderByArg>;
  username?: Maybe<OrderByArg>;
};

export enum AdminPrivilege {
  Basic = 'BASIC',
  Full = 'FULL'
}

export type AdminPrivilegeFilter = {
  equals?: Maybe<AdminPrivilege>;
  in?: Maybe<Array<AdminPrivilege>>;
  not?: Maybe<AdminPrivilege>;
  notIn?: Maybe<Array<AdminPrivilege>>;
};

export type AdminWhereInput = {
  AND?: Maybe<Array<AdminWhereInput>>;
  createdAt?: Maybe<DateTimeFilter>;
  NOT?: Maybe<Array<AdminWhereInput>>;
  OR?: Maybe<Array<AdminWhereInput>>;
  privilege?: Maybe<AdminPrivilegeFilter>;
  updatedAt?: Maybe<DateTimeFilter>;
  username?: Maybe<StringFilter>;
};

export type BooleanFilter = {
  equals?: Maybe<Scalars['Boolean']>;
  not?: Maybe<Scalars['Boolean']>;
};

export type Company = {
  __typename?: 'Company';
  alias: Scalars['String'];
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  name: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type CompanyCreateInput = {
  alias: Scalars['String'];
  name: Scalars['String'];
};

export type CompanyOrderByInput = {
  alias?: Maybe<OrderByArg>;
  createdAt?: Maybe<OrderByArg>;
  name?: Maybe<OrderByArg>;
  updatedAt?: Maybe<OrderByArg>;
};

export type CompanyWhereInput = {
  alias?: Maybe<StringFilter>;
  AND?: Maybe<Array<CompanyWhereInput>>;
  createdAt?: Maybe<DateTimeFilter>;
  name?: Maybe<StringFilter>;
  NOT?: Maybe<Array<CompanyWhereInput>>;
  OR?: Maybe<Array<CompanyWhereInput>>;
  updatedAt?: Maybe<DateTimeFilter>;
};

export type Customer = {
  __typename?: 'Customer';
  active: Scalars['Boolean'];
  addresses: Array<Scalars['String']>;
  code: Scalars['String'];
  companyBelong: Company;
  createdAt: Scalars['DateTime'];
  email?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  phoneNumber?: Maybe<Scalars['String']>;
  staffPrimary: Staff;
  staffSecondary?: Maybe<Staff>;
  updatedAt: Scalars['DateTime'];
};

export type CustomerCreateInput = {
  addresses: Array<Scalars['String']>;
  code: Scalars['String'];
  companyBelongId: Scalars['ID'];
  email?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  phoneNumber?: Maybe<Scalars['String']>;
  staffPrimaryId: Scalars['ID'];
  staffSecondaryId?: Maybe<Scalars['ID']>;
};

export type CustomerOrderByInput = {
  active?: Maybe<OrderByArg>;
  code?: Maybe<OrderByArg>;
  companyBelong?: Maybe<CompanyOrderByInput>;
  createdAt?: Maybe<OrderByArg>;
  email?: Maybe<OrderByArg>;
  name?: Maybe<OrderByArg>;
  phoneNumber?: Maybe<OrderByArg>;
  staffPrimary?: Maybe<StaffOrderByInput>;
  staffSecondary?: Maybe<StaffOrderByInput>;
  updatedAt?: Maybe<OrderByArg>;
};

export type CustomerUpdateInput = {
  active?: Maybe<Scalars['Boolean']>;
  addresses?: Maybe<Array<Scalars['String']>>;
  code?: Maybe<Scalars['String']>;
  companyBelongId?: Maybe<Scalars['ID']>;
  email?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  phoneNumber?: Maybe<Scalars['String']>;
  staffPrimaryId?: Maybe<Scalars['ID']>;
  staffSecondaryId?: Maybe<Scalars['ID']>;
};

export type CustomerWhereInput = {
  active?: Maybe<BooleanFilter>;
  AND?: Maybe<Array<CustomerWhereInput>>;
  code?: Maybe<StringFilter>;
  companyBelong?: Maybe<CompanyWhereInput>;
  createdAt?: Maybe<DateTimeFilter>;
  email?: Maybe<StringFilter>;
  name?: Maybe<StringFilter>;
  NOT?: Maybe<Array<CustomerWhereInput>>;
  OR?: Maybe<Array<CustomerWhereInput>>;
  phoneNumber?: Maybe<StringFilter>;
  staffPrimary?: Maybe<StaffWhereInput>;
  staffSecondary?: Maybe<StaffWhereInput>;
  updatedAt?: Maybe<DateTimeFilter>;
};


export type DateTimeFilter = {
  equals?: Maybe<Scalars['DateTime']>;
  gt?: Maybe<Scalars['DateTime']>;
  gte?: Maybe<Scalars['DateTime']>;
  in?: Maybe<Array<Scalars['DateTime']>>;
  lt?: Maybe<Scalars['DateTime']>;
  lte?: Maybe<Scalars['DateTime']>;
  not?: Maybe<Scalars['DateTime']>;
  notIn?: Maybe<Array<Scalars['DateTime']>>;
};

export type FloatFilter = {
  equals?: Maybe<Scalars['Float']>;
  gt?: Maybe<Scalars['Float']>;
  gte?: Maybe<Scalars['Float']>;
  in?: Maybe<Array<Scalars['Float']>>;
  lt?: Maybe<Scalars['Float']>;
  lte?: Maybe<Scalars['Float']>;
  not?: Maybe<Scalars['Float']>;
  notIn?: Maybe<Array<Scalars['Float']>>;
};

export type IntFilter = {
  equals?: Maybe<Scalars['Int']>;
  gt?: Maybe<Scalars['Int']>;
  gte?: Maybe<Scalars['Int']>;
  in?: Maybe<Array<Scalars['Int']>>;
  lt?: Maybe<Scalars['Int']>;
  lte?: Maybe<Scalars['Int']>;
  not?: Maybe<Scalars['Int']>;
  notIn?: Maybe<Array<Scalars['Int']>>;
};

export type Job = {
  __typename?: 'Job';
  actions: Array<Action>;
  address: Scalars['String'];
  checkIn?: Maybe<Scalars['DateTime']>;
  checkOut?: Maybe<Scalars['DateTime']>;
  code: Scalars['String'];
  createdAt: Scalars['DateTime'];
  customer: Customer;
  id: Scalars['ID'];
  staffPrimary: Staff;
  staffSecondary?: Maybe<Staff>;
  startDate: Scalars['DateTime'];
  state?: Maybe<JobState>;
  tasks: Array<Task>;
  updatedAt: Scalars['DateTime'];
};

export type JobCreateInput = {
  address: Scalars['String'];
  customerId: Scalars['ID'];
  staffPrimaryId: Scalars['ID'];
  staffSecondaryId?: Maybe<Scalars['ID']>;
  startDate: Scalars['DateTime'];
  tasks: Array<TaskCreateInput>;
};

export type JobOrderByInput = {
  address?: Maybe<OrderByArg>;
  checkIn?: Maybe<OrderByArg>;
  checkOut?: Maybe<OrderByArg>;
  code?: Maybe<OrderByArg>;
  createdAt?: Maybe<OrderByArg>;
  customer?: Maybe<CustomerOrderByInput>;
  staffPrimary?: Maybe<StaffOrderByInput>;
  staffSecondary?: Maybe<StaffOrderByInput>;
  startDate?: Maybe<OrderByArg>;
  state?: Maybe<OrderByArg>;
  updatedAt?: Maybe<OrderByArg>;
};

export type JobReassignInput = {
  address: Scalars['String'];
  staffPrimaryId: Scalars['ID'];
  staffSecondaryId?: Maybe<Scalars['ID']>;
  startDate: Scalars['DateTime'];
  tasks: Array<TaskCreateInput>;
};

export type JobReassignResponse = {
  __typename?: 'JobReassignResponse';
  newJob: Job;
  oriJob: Job;
};

export enum JobState {
  Done = 'DONE',
  Expired = 'EXPIRED',
  FollowUp = 'FOLLOW_UP',
  Reviewed = 'REVIEWED'
}

export type JobStateFilter = {
  equals?: Maybe<JobState>;
  in?: Maybe<Array<JobState>>;
  not?: Maybe<JobState>;
  notIn?: Maybe<Array<JobState>>;
};

export type JobUpdateByAdminInput = {
  address?: Maybe<Scalars['String']>;
  checkIn?: Maybe<Scalars['DateTime']>;
  checkOut?: Maybe<Scalars['DateTime']>;
  customerId?: Maybe<Scalars['ID']>;
  staffPrimaryId?: Maybe<Scalars['ID']>;
  staffSecondaryId?: Maybe<Scalars['ID']>;
  startDate?: Maybe<Scalars['DateTime']>;
  state?: Maybe<JobState>;
};

export type JobUpdateByStaffInput = {
  checkIn?: Maybe<Scalars['DateTime']>;
  checkOut?: Maybe<Scalars['DateTime']>;
  state?: Maybe<JobState>;
};

export type JobWhereInput = {
  address?: Maybe<StringFilter>;
  AND?: Maybe<Array<JobWhereInput>>;
  checkIn?: Maybe<DateTimeFilter>;
  checkOut?: Maybe<DateTimeFilter>;
  code?: Maybe<StringFilter>;
  createdAt?: Maybe<DateTimeFilter>;
  customer?: Maybe<CustomerWhereInput>;
  NOT?: Maybe<Array<JobWhereInput>>;
  OR?: Maybe<Array<JobWhereInput>>;
  staffPrimary?: Maybe<StaffWhereInput>;
  staffSecondary?: Maybe<StaffWhereInput>;
  startDate?: Maybe<DateTimeFilter>;
  state?: Maybe<JobStateFilter>;
  updatedAt?: Maybe<DateTimeFilter>;
};

export type Mutation = {
  __typename?: 'Mutation';
  adminCheckSession: Scalars['Boolean'];
  adminCreate: Admin;
  adminDelete: Scalars['Boolean'];
  adminGetResetPasswordToken: Scalars['String'];
  adminLogin: Scalars['Boolean'];
  adminLogout: Scalars['Boolean'];
  adminResetPassword: Scalars['Boolean'];
  adminUpdatePassword: Scalars['Boolean'];
  companyCreate: Company;
  companyDelete: Scalars['Boolean'];
  customerCreate: Customer;
  customerDelete: Scalars['Boolean'];
  customerUpdate: Customer;
  jobCreate: Job;
  jobDelete: Scalars['Boolean'];
  jobReassign: JobReassignResponse;
  jobSetActions: Scalars['Boolean'];
  jobSetTasks: Scalars['Boolean'];
  jobSetTasksDone: Scalars['Boolean'];
  jobUpdateByAdmin: Job;
  jobUpdateByStaff: Job;
  staffCheckSession: Scalars['Boolean'];
  staffCreate: Staff;
  staffDelete: Scalars['Boolean'];
  staffLogin: Scalars['Boolean'];
  staffLogout: Scalars['Boolean'];
  staffPairDevice: Scalars['Boolean'];
  staffResetPairing: Scalars['Boolean'];
  staffUpdate: Staff;
};


export type MutationAdminCreateArgs = {
  data: AdminCreateInput;
  sudoPassword?: Maybe<Scalars['String']>;
};


export type MutationAdminDeleteArgs = {
  id?: Maybe<Scalars['ID']>;
};


export type MutationAdminGetResetPasswordTokenArgs = {
  sudoPassword: Scalars['String'];
  username: Scalars['String'];
};


export type MutationAdminLoginArgs = {
  password: Scalars['String'];
  username: Scalars['String'];
};


export type MutationAdminResetPasswordArgs = {
  newPassword: Scalars['String'];
  resetToken: Scalars['String'];
};


export type MutationAdminUpdatePasswordArgs = {
  id?: Maybe<Scalars['ID']>;
  newPassword: Scalars['String'];
  oldPassword: Scalars['String'];
};


export type MutationCompanyCreateArgs = {
  data: CompanyCreateInput;
};


export type MutationCompanyDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationCustomerCreateArgs = {
  data: CustomerCreateInput;
};


export type MutationCustomerDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationCustomerUpdateArgs = {
  data: CustomerUpdateInput;
  id: Scalars['ID'];
};


export type MutationJobCreateArgs = {
  data: JobCreateInput;
};


export type MutationJobDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationJobReassignArgs = {
  data: JobReassignInput;
  id: Scalars['ID'];
};


export type MutationJobSetActionsArgs = {
  data: Array<ActionInput>;
  jobId: Scalars['ID'];
};


export type MutationJobSetTasksArgs = {
  data: Array<TaskInput>;
  jobId: Scalars['ID'];
};


export type MutationJobSetTasksDoneArgs = {
  ids: Array<Scalars['ID']>;
};


export type MutationJobUpdateByAdminArgs = {
  data: JobUpdateByAdminInput;
  id: Scalars['ID'];
};


export type MutationJobUpdateByStaffArgs = {
  data: JobUpdateByStaffInput;
  id: Scalars['ID'];
};


export type MutationStaffCreateArgs = {
  data: StaffCreateInput;
};


export type MutationStaffDeleteArgs = {
  id?: Maybe<Scalars['ID']>;
};


export type MutationStaffLoginArgs = {
  deviceId: Scalars['String'];
  username: Scalars['String'];
};


export type MutationStaffPairDeviceArgs = {
  deviceId: Scalars['String'];
  username: Scalars['String'];
};


export type MutationStaffResetPairingArgs = {
  id: Scalars['ID'];
};


export type MutationStaffUpdateArgs = {
  data: StaffUpdateInput;
  id?: Maybe<Scalars['ID']>;
};

export enum OrderByArg {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type Query = {
  __typename?: 'Query';
  admin: Admin;
  adminCount: Scalars['Int'];
  admins: Array<Admin>;
  companies: Array<Company>;
  company: Company;
  companyCount: Scalars['Int'];
  customer: Customer;
  customerCount: Scalars['Int'];
  customers: Array<Customer>;
  job: Job;
  jobCount: Scalars['Int'];
  jobs: Array<Job>;
  staff: Staff;
  staffCount: Scalars['Int'];
  staffs: Array<Staff>;
};


export type QueryAdminArgs = {
  id?: Maybe<Scalars['ID']>;
};


export type QueryAdminCountArgs = {
  query?: Maybe<Scalars['String']>;
  where?: Maybe<AdminWhereInput>;
};


export type QueryAdminsArgs = {
  orderBy?: Maybe<AdminOrderByInput>;
  query?: Maybe<Scalars['String']>;
  where?: Maybe<AdminWhereInput>;
};


export type QueryCompaniesArgs = {
  orderBy?: Maybe<CompanyOrderByInput>;
  query?: Maybe<Scalars['String']>;
  where?: Maybe<CompanyWhereInput>;
};


export type QueryCompanyArgs = {
  id: Scalars['ID'];
};


export type QueryCompanyCountArgs = {
  query?: Maybe<Scalars['String']>;
  where?: Maybe<CompanyWhereInput>;
};


export type QueryCustomerArgs = {
  id: Scalars['ID'];
};


export type QueryCustomerCountArgs = {
  query?: Maybe<Scalars['String']>;
  where?: Maybe<CustomerWhereInput>;
};


export type QueryCustomersArgs = {
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<CustomerOrderByInput>;
  query?: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<CustomerWhereInput>;
};


export type QueryJobArgs = {
  id: Scalars['ID'];
};


export type QueryJobCountArgs = {
  query?: Maybe<Scalars['String']>;
  where?: Maybe<JobWhereInput>;
};


export type QueryJobsArgs = {
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<JobOrderByInput>;
  query?: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<JobWhereInput>;
};


export type QueryStaffArgs = {
  id?: Maybe<Scalars['ID']>;
};


export type QueryStaffCountArgs = {
  query?: Maybe<Scalars['String']>;
  where?: Maybe<StaffWhereInput>;
};


export type QueryStaffsArgs = {
  orderBy?: Maybe<StaffOrderByInput>;
  query?: Maybe<Scalars['String']>;
  where?: Maybe<StaffWhereInput>;
};

export type Staff = {
  __typename?: 'Staff';
  active: Scalars['Boolean'];
  createdAt: Scalars['DateTime'];
  fullName: Scalars['String'];
  id: Scalars['ID'];
  paired: Scalars['Boolean'];
  updatedAt: Scalars['DateTime'];
  username: Scalars['String'];
};

export type StaffCreateInput = {
  fullName: Scalars['String'];
  username: Scalars['String'];
};

export type StaffOrderByInput = {
  active?: Maybe<OrderByArg>;
  createdAt?: Maybe<OrderByArg>;
  fullName?: Maybe<OrderByArg>;
  updatedAt?: Maybe<OrderByArg>;
  username?: Maybe<OrderByArg>;
};

export type StaffUpdateInput = {
  active?: Maybe<Scalars['Boolean']>;
  fullName?: Maybe<Scalars['String']>;
};

export type StaffWhereInput = {
  active?: Maybe<BooleanFilter>;
  AND?: Maybe<Array<StaffWhereInput>>;
  createdAt?: Maybe<DateTimeFilter>;
  fullName?: Maybe<StringFilter>;
  NOT?: Maybe<Array<StaffWhereInput>>;
  OR?: Maybe<Array<StaffWhereInput>>;
  updatedAt?: Maybe<DateTimeFilter>;
  username?: Maybe<StringFilter>;
};

export type StringFilter = {
  contains?: Maybe<Scalars['String']>;
  endsWith?: Maybe<Scalars['String']>;
  equals?: Maybe<Scalars['String']>;
  gt?: Maybe<Scalars['String']>;
  gte?: Maybe<Scalars['String']>;
  in?: Maybe<Array<Scalars['String']>>;
  lt?: Maybe<Scalars['String']>;
  lte?: Maybe<Scalars['String']>;
  not?: Maybe<Scalars['String']>;
  notIn?: Maybe<Array<Scalars['String']>>;
  startsWith?: Maybe<Scalars['String']>;
};

export type Task = {
  __typename?: 'Task';
  createdAt: Scalars['DateTime'];
  done: Scalars['Boolean'];
  id: Scalars['ID'];
  remarks: Scalars['String'];
  type: TaskType;
  updatedAt: Scalars['DateTime'];
};

export type TaskCreateInput = {
  remarks: Scalars['String'];
  type: TaskType;
};

export type TaskInput = {
  done?: Maybe<Scalars['Boolean']>;
  id?: Maybe<Scalars['ID']>;
  remarks?: Maybe<Scalars['String']>;
  type?: Maybe<TaskType>;
};

export enum TaskType {
  Complaint = 'COMPLAINT',
  Delivery = 'DELIVERY',
  Others = 'OTHERS',
  Service = 'SERVICE',
  Transport = 'TRANSPORT'
}

export type TaskTypeFilter = {
  equals?: Maybe<TaskType>;
  in?: Maybe<Array<TaskType>>;
  not?: Maybe<TaskType>;
  notIn?: Maybe<Array<TaskType>>;
};

export type AuthLoginMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type AuthLoginMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'adminLogin'>
);
