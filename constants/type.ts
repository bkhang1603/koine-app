export const Role = {
  Adult: 'ADULT',
  Lecturer: 'LECTURER',
  Admin: 'ADMIN',
  Child: 'CHILD',
  Supporter: 'SUPPORTER',
  Accounting: 'ACCOUNTING',
  Content: 'CONTENT_CREATOR',
  Manager: 'MANAGER'
} as const

export const RoleValues = [
  Role.Adult,
  Role.Lecturer,
  Role.Admin,
  Role.Child,
  Role.Supporter,
  Role.Accounting,
  Role.Content,
  Role.Manager
] as const

export const Gender = {
  Male: 'MALE',
  Female: 'FEMALE',
  Other: 'OTHER'
} as const

export const GenderValues = [Gender.Male, Gender.Female, Gender.Other] as const
