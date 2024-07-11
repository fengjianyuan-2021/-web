export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    overviewAdmin: '/dashboard',
    overviewStduent: '/dashboardStudent',
    overviewTeacher: '/dashboardTeacher',
    customersAdmin: '/dashboard/customers',
    customerStduent: '/dashboardStudent/customerStduent',
    customersTeacher: '/dashboardTeacher/customersTeacher',
    account: '/dashboard/account',
    integrations: '/dashboard/integrations',
    settings: '/dashboard/settings',
  },
  errors: { notFound: '/errors/not-found' },
} as const;
