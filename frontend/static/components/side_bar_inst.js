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
      
      <router-link to="/instructor_alerts" class="btn mb-2 w-100 text-center" 
                   style="background:none; border:2px black solid; font-size: 1.1rem; padding: 10px; font-weight: 500;">
        Alerts
      </router-link>
      
      <button  @click="logout" class="btn mt-4 w-100 text-center" 
                   style=" background:none; border:2px red solid; font-size: 1.1rem; padding: 10px; font-weight: 500;">
        Log out
      </button>
    </div>
  `,
  name: 'side_bar_inst',
  methods: {
    logout() {
      const authToken = localStorage.getItem('auth-token');
      localStorage.removeItem('auth-token');

      fetch('http://127.0.0.1:5000/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('logout failed!');
        }
        return response.json();
      })
      .then(data =>{
        alert('Logged out successfully');
        this.$router.push("/");  // Redirect to the landing page
      })
    }
  }
};
