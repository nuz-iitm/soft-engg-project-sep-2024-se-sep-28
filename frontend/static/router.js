
import UserLogin from './components/UserLogin.js';
import UserRegistration from './components/UserRegistration.js';
import LandingPage from './components/LandingPage.js';
import admin_front from './components/admin_front.js';
import admin_edit_inst from './components/admin_edit_inst.js';

const routes = [
  { path: '/', name: 'LandingPage', component: LandingPage },
  { path: '/login', name: 'UserLogin', component: UserLogin },
  { path: '/register', name: 'UserRegistration', component: UserRegistration },
  { path: '/admin_front', name: 'admin_front', component: admin_front },
  { path: '/admin_edit_inst', name: 'admin_edit_inst', component: admin_edit_inst },
  // Other routes can be added here, e.g., UserRegistration
];

export default new VueRouter({
  routes,
})