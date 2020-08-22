import store from '@/state/store'

export default [{
    path: '/',
    name: 'default',
    meta: {
      authRequired: true,
    },
    component: () => import('./view/default'),
  },
  {
    path: '/employee-dashboard',
    name: 'employee dashboard',
    meta: {
      authRequired: true
    },
    component: () => import('./view/employee-dashboard'),
  },
  {
    path: '/visitor-dashboard',
    name: 'visitor dashboard',
    meta: {
      authRequired: true
    },
    component: () => import('./view/visitor-dashboard'),
  },
  {
    path: '/risk-dashboard',
    name: 'risk dashboard',
    meta: {
      authRequired: true
    },
    component: () => import('./view/risk-dashboard'),
  },
  {
    path: '/companies',
    name: 'companies',
    meta: {
      authRequired: true
    },
    component: () => import('./view/companies'),
  },
  {
    path: '/owners',
    name: 'owners',
    meta: {
      authRequired: true
    },
    component: () => import('./view/owners'),
  },
  {
    path: '/employees',
    name: 'employees',
    meta: {
      authRequired: true
    },
    component: () => import('./view/employees'),
  },
  {
    path: '/view-employee',
    name: 'view employee',
    meta: {
      authRequired: true
    },
    component: () => import('./view/employee'),
  },
  {
    path: '/view-company',
    name: 'view company',
    meta: {
      authRequired: true
    },
    component: () => import('./view/company'),
  },
  {
    path: '/risk-management',
    name: 'risk management',
    meta: {
      authRequired: true
    },
    component: () => import('./view/risks'),
  },
  {
    path: '/contact-tracing',
    name: 'contact tracing',
    meta: {
      authRequired: true
    },
    component: () => import('./view/blank'),
  },
  {
    path: '/reports',
    name: 'get reports',
    meta: {
      authRequired: true
    },
    component: () => import('./view/get-reports'),
  },
  {
    path: '/print-reports',
    name: 'print reports',
    meta: {
      authRequired: true
    },
    component: () => import('./view/print-reports'),
  },
  {
    path: '/print-walkthrough',
    name: 'print walkthrough',
    meta: {
      authRequired: true
    },
    component: () => import('./view/print-walkthroughs'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('./view/account/login'),
    meta: {
      beforeResolve(routeTo, routeFrom, next) {
        // If the user is already logged in
          if (store.getters['authfack/loggedIn']) {
          // Redirect to the home page instead
          next({
            name: 'default'
          })
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
        console.log('logout before resolve');
        next({
          name: 'default'
        })
        store.dispatch('authfack/logout')

      },
    },
  },
]