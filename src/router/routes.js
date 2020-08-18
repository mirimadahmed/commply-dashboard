import store from '@/state/store'

export default [
  {
    path: '',
    name: 'home',
    meta: { authRequired: true },
    component: () => import('./view/blank'),
  },
  {
    path: '/employee-dashboard',
    name: 'employee dashboard',
    meta: { authRequired: true },
    component: () => import('./view/employee-dashboard'),
  },
  {
    path: '/visitor-dashboard',
    name: 'visitor dashboard',
    meta: { authRequired: true },
    component: () => import('./view/visitor-dashboard'),
  },
  {
    path: '/risk-dashboard',
    name: 'risk dashboard',
    meta: { authRequired: true },
    component: () => import('./view/risk-dashboard'),
  },
  {
    path: '/companies',
    name: 'companies',
    meta: { authRequired: true },
    component: () => import('./view/companies'),
  },
  {
    path: '/owners',
    name: 'owners',
    meta: { authRequired: true },
    component: () => import('./view/owners'),
  },
  {
    path: '/employees',
    name: 'employees',
    meta: { authRequired: true },
    component: () => import('./view/employees'),
  },
  {
    path: '/view-employee',
    name: 'view employee',
    meta: { authRequired: true },
    component: () => import('./view/employee'),
  },
  {
    path: '/view-company',
    name: 'view company',
    meta: { authRequired: true },
    component: () => import('./view/company'),
  },
  {
    path: '/risk-management',
    name: 'risk management',
    meta: { authRequired: true },
    component: () => import('./view/risks'),
  },
  {
    path: '/contact-tracing',
    name: 'contact tracing',
    meta: { authRequired: true },
    component: () => import('./view/blank'),
  },
  {
    path: '/reports',
    name: 'get reports',
    meta: { authRequired: true },
    component: () => import('./view/get-reports'),
  },
  {
    path: '/print-reports',
    name: 'print reports',
    meta: { authRequired: true },
    component: () => import('./view/print-reports'),
  },
  {
    path: '/print-walkthrough',
    name: 'print walkthrough',
    meta: { authRequired: true },
    component: () => import('./view/print-walkthroughs'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('./view/account/login'),
    meta: {
      beforeResolve(routeTo, routeFrom, next) {
        // If the user is already logged in
        if (store.getters['auth/loggedIn']) {
          // Redirect to the home page instead
          next({ name: 'home' })
        } else {
          // Continue to the login page
          next()
        }
      },
    },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('./view/account/register'),
    meta: {
      beforeResolve(routeTo, routeFrom, next) {
        // If the user is already logged in
        if (store.getters['auth/loggedIn']) {
          // Redirect to the home page instead
          next({ name: 'home' })
        } else {
          // Continue to the login page
          next()
        }
      },
    },
  },
  {
    path: '/forgot-password',
    name: 'Forgot password',
    component: () => import('./view/account/forgot-password'),
    meta: {
      beforeResolve(routeTo, routeFrom, next) {
        // If the user is already logged in
        if (store.getters['auth/loggedIn']) {
          // Redirect to the home page instead
          next({ name: 'home' })
        } else {
          // Continue to the login page
          next()
        }
      },
    },
  },
  {
    path: '/logout',
    name: 'logout',
    meta: {
      authRequired: true,
      beforeResolve(routeTo, routeFrom, next) {
        if (process.env.VUE_APP_DEFAULT_AUTH === "firebase") {
          store.dispatch('auth/logOut')
        } else {
          store.dispatch('authfack/logout')
        }
        const authRequiredOnPreviousRoute = routeFrom.matched.some(
          (route) => route.push('/login')
        )
        // Navigate back to previous page, or home as a fallback
        next(authRequiredOnPreviousRoute ? { name: 'default' } : { ...routeFrom })
      },
    },
  },
]
