export default {
  template: `
    <div class="sidebar bg-light p-4 d-flex flex-column align-items-center" 
         style="height: 90vh; max-width: 270px; overflow-y: auto; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); border-radius: 8px;">
      
      <h2 class="text-center mt-4" style="font-weight: bold; color: #333;">Welcome User</h2>
      
      <router-link to="/instructor_front" class="btn btn-primary mt-4 mb-3 w-100 text-center" 
                   style="font-size: 1.1rem; padding: 10px; font-weight: 500;">
        Dashboard
      </router-link>
      
      <router-link to="/instructor_project" class="btn mb-2 w-100 text-center" 
                   style="background:none; border:2px black solid; font-size: 1.1rem; padding: 10px; font-weight: 500;">
        Project
      </router-link>
      
      <router-link to="/instructor_teams" class="btn mb-2 w-100 text-center" 
                   style="background:none; border:2px black solid; font-size: 1.1rem; padding: 10px; font-weight: 500;">
        Teams
      </router-link>
      
      <router-link to="/instructor_discuss" class="btn mb-2 w-100 text-center" 
                   style="background:none; border:2px black solid; font-size: 1.1rem; padding: 10px; font-weight: 500;">
        Discuss
      </router-link>
      
      <router-link to="" class="btn mb-2 w-100 text-center" 
                   style="background:none; border:2px black solid; font-size: 1.1rem; padding: 10px; font-weight: 500;">
        Alerts
      </router-link>
      
      <router-link to="/" class="btn mt-4 w-100 text-center" 
                   style=" background:none; border:2px red solid; font-size: 1.1rem; padding: 10px; font-weight: 500;">
        Log out
      </router-link>
    </div>
  `,
  name: 'side_bar_inst',
  methods: {}
};
