
import UserLogin from './components/UserLogin.js';
import UserRegistration from './components/UserRegistration.js';
import LandingPage from './components/LandingPage.js';
import AdminLogin from './components/AdminLogin.js';

const routes = [
  { path: '/', name: 'LandingPage', component: LandingPage },
  { path: '/login', name: 'UserLogin', component: UserLogin },
  { path: '/register', name: 'UserRegistration', component: UserRegistration },
  { path: '/admin-login', name:'AdminLogin', component:AdminLogin},
  // Other routes can be added here, e.g., UserRegistration
];

export default new VueRouter({
  routes,
})