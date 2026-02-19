export const ADMIN_TABS = {
  'User Management': ['Users'],
  'Job': ['Job Titles', 'Pay Grades', 'Employment Status', 'Job Categories', 'Work Shifts'],
  'Organization': ['General Information', 'Locations', 'Structure'],
  'Qualifications': ['Skills', 'Education', 'Licenses', 'Languages', 'Memberships'],
  'Configuration': [
    'Email Configuration',
    'Email Subscriptions',
    'Localization',
    'Language Packages',
    'Modules',
    'Social Media Authentication',
    'Register OAuth Client',
    'LDAP Configuration'
  ]
} as const;

export const TABLE_COLUMN_HEADERS = [
  "Username",
  "User Role",
  "Employee Name",
  "Status",
  "Actions"
] as const;