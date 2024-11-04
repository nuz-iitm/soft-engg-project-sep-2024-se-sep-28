
import UserLogin from './components/UserLogin.js';
import UserRegistration from './components/UserRegistration.js';
import LandingPage from './components/LandingPage.js';
import admin_dashboard from './components/admin_dashboard.js'

const routes = [
  { path: '/', name: 'LandingPage', component: LandingPage },
  { path: '/login', name: 'UserLogin', component: UserLogin },
  { path: '/register', name: 'UserRegistration', component: UserRegistration },
  { path: '/admin_dash', name: 'admin_dashboard', component: admin_dashboard },
  // Other routes can be added here, e.g., UserRegistration
];

export default new VueRouter({
  routes,
})