export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    overviewAdmin: '/dashboard',
    customersAdmin: '/dashboard/customers',
    account: '/dashboard/account',
    // integrations: '/dashboard/integrations',
    settings: '/dashboard/settings',
  },
  dashboardStudent:{
    overviewStudent : '/dashboardStudent',
    customerStudent: '/dashboard/customers',
    accountStudent:'/dashboard/account'
  },
  dashboardTeacher:{
    overviewTeacher: '/dashboardTeacher',
    customersTeacher: '/dashboard/customers',
    accountTeacher:'/dashboard/account'
  },
  errors: { notFound: '/errors/not-found' },
} as const;
