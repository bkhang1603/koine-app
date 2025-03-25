export const Role = {
  Adult: 'ADULT',
  Expert: 'EXPERT',
  Admin: 'ADMIN',
  Child: 'CHILD',
  Supporter: 'SUPPORTER',
  Salesman: 'SALESMAN',
  Content: 'CONTENT_CREATOR',
  Manager: 'MANAGER'
} as const

export const RoleValues = [
  Role.Adult,
  Role.Expert,
  Role.Admin,
  Role.Child,
  Role.Supporter,
  Role.Salesman,
  Role.Content,
  Role.Manager
] as const

export const Gender = {
  Male: 'MALE',
  Female: 'FEMALE',
  Other: 'OTHER'
} as const

export const GenderValues = [Gender.Male, Gender.Female, Gender.Other] as const
