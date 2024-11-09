import router from './router.js'


router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('auth-token') !== null;
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  } else {
    next(); // If no requiresAuth meta, just continue
  }
});


new Vue({
  el: '#app',

  template :`<router-view/>`,
  router,

})