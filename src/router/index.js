import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/HomeView.vue'

const routes = [
  {
    meta: {
      title: 'Dashboard'
    },
    path: '/dashboard',
    name: 'dashboard',
    component: Home
  },
  {
    path: '/universities',
    name: 'universities',
    component: () => import('../views/universities/UniversitiesView.vue')
  },
  {
    path: '/recommendations',
    name: 'recommendations',
    component: () => import('../views/recommendations/RecommendationsView.vue')
  },
  {
    path: '/view-recommendation/:id',
    name: 'view-recommendation',
    component: () => import('../views/recommendations/ViewRecommendation.vue')
  },
  {
    path: '/edit-university/:id',
    name: 'edit-university',
    component: () => import('../views/universities/EditUniversity.vue')
  },
  {
    path: '/recommend-university',
    name: 'recommend-university',
    component: () => import('../views/recommendations/RecommendUniversities.vue')
  },
  {
    path: '/students',
    name: 'students',
    component: () => import('../views/StudentsView.vue')
  },
  {
    path: '/tickets',
    name: 'tickets',
    component: () => import('../views/tickets/TicketsView.vue')
  },
  {
    path: '/applications',
    name: 'applications',
    component: () => import('../views/applications/ApplicationsView.vue')
  },
  {
    path: '/view-application/:id',
    name: 'view-application',
    component: () => import('../views/applications/ViewApplication.vue')
  },
  {
    path: '/add-application',
    name: 'add-application',
    component: () => import('../views/applications/AddApplication.vue')
  },
  {
    path: '/view-ticket/:id',
    name: 'view-ticket',
    component: () => import('../views/tickets/ViewTicket.vue')
  },
  {
    path: '/courses',
    name: 'courses',
    component: () => import('../views/courses/CoursesView.vue')
  },
  {
    path: '/edit-course/:id',
    name: 'edit-course',
    component: () => import('../views/courses/EditCourse.vue')
  },
  {
    path: '/certificate-of-arrival',
    name: 'certificate-of-arrival',
    component: () => import('../views/documents/CertificateOfArrival.vue')
  },
  {
    path: '/activity-report',
    name: 'activity-report',
    component: () => import('../views/documents/ActivityReport.vue')
  },
  {
    path: '/learning-agreement',
    name: 'learning-agreement',
    component: () => import('../views/documents/LearningAgreement.vue')
  },
  {
    path: '/learning-agreement-during',
    name: 'learning-agreement-during',
    component: () => import('../views/documents/DuringMobilityLearningAgreement.vue')
  },
  {
    path: '/learning-agreement-after',
    name: 'learning-agreement-after',
    component: () => import('../views/documents/AfterMobilityLearningAgreement.vue')
  },
  {
    path: '/travel-authorization',
    name: 'travel-authorization',
    component: () => import('../views/documents/TravelAuthorization.vue')
  },
  {
    meta: {
      title: 'Tables'
    },
    path: '/tables',
    name: 'tables',
    component: () => import('@/views/TablesView.vue')
  },
  {
    meta: {
      title: 'Forms'
    },
    path: '/forms',
    name: 'forms',
    component: () => import('@/views/FormsView.vue')
  },
  {
    meta: {
      title: 'Profile'
    },
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfileView.vue')
  },
  {
    meta: {
      title: 'Ui'
    },
    path: '/ui',
    name: 'ui',
    component: () => import('@/views/UiView.vue')
  },
  {
    meta: {
      title: 'Login'
    },
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue')
  },
  {
    meta: {
      title: 'Register'
    },
    path: '/register',
    name: 'register',
    component: () => import('@/views/RegisterView.vue')
  },
  {
    meta: {
      title: 'Error'
    },
    path: '/error',
    name: 'error',
    component: () => import('@/views/ErrorView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
