
import UserLogin from './components/UserLogin.js';
import UserRegistration from './components/UserRegistration.js';
import LandingPage from './components/LandingPage.js';
import AdminLogin from './components/AdminLogin.js';
import admin_front from './components/admin_front.js';
import admin_edit_inst from './components/admin_edit_inst.js';
import admin_griev from './components/admin_griev.js';
import instructor_front from './components/instructor_front.js';
import instructor_project from './components/instructor_project.js';
import instructor_teams from './components/instructor_teams.js';
import instructor_discuss from './components/instructor_discuss.js';
import instructor_faq from './components/instructor_faq.js';
import instructor_alerts from './components/instructor_alerts.js';
import student_front from './components/student_front.js'
import student_discuss from './components/student_discuss.js';

const routes = [
  { path: '/', name: 'LandingPage', component: LandingPage },
  { path: '/login', name: 'UserLogin', component: UserLogin },
  { path: '/register', name: 'UserRegistration', component: UserRegistration },
  { path: '/admin_front', name: 'admin_front', component: admin_front },
  { path: '/admin_edit_inst', name: 'admin_edit_inst', component: admin_edit_inst },
  { path: '/admin_griev', name: 'admin_griev', component: admin_griev },
  { path: '/admin-login', name:'AdminLogin', component:AdminLogin},
  { path: '/instructor_front', name:'instructor_front', component:instructor_front},
  { path: '/instructor_project', name:'instructor_project', component:instructor_project},
  { path: '/instructor_teams', name:'instructor_teams', component:instructor_teams},
  { path: '/instructor_discuss', name:'instructor_discuss', component:instructor_discuss},
  { path: '/instructor_faq', name:'instructor_faq', component:instructor_faq},
  { path: '/instructor_alerts', name:'instructor_alerts', component:instructor_alerts},
  { path: '/student_front', name:'student_front', component:student_front},
  { path: '/student_discuss', name:'student_discuss', component:student_discuss},
  // Other routes can be added here, e.g., UserRegistration
];

export default new VueRouter({
  routes,
})