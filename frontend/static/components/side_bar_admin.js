export default {
  template: `
      <div class="sidebar bg-light p-4 d-flex flex-column align-items-center" style="height: 90vh; max-width: 270px; overflow-y: auto; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); border-radius: 8px;">
        <h2 class="text-center mt-5" style="font-weight: bold; color: #333;">Welcome Admin</h2>
        <router-link to="/admin_front" class="btn btn-primary mt-4 mb-3 w-100 text-center" style="font-size: 1.1rem; padding: 10px; font-weight: 500;">
          Edit Students
        </router-link>
        <router-link to="/admin_edit_inst" class="btn mb-2 w-100 text-center" 
                     style="background:none; border:2px black solid; font-size: 1.1rem; padding: 10px; font-weight: 500;">
          Edit Instructors and TA's
        </router-link>
        <router-link to="/admin_griev" class="btn mb-2 w-100 text-center" 
                     style="background:none; border:2px black solid; font-size: 1.1rem; padding: 10px; font-weight: 500;">
          Technical Grievances
        </router-link>
        <router-link to="/" class="btn mt-4 w-100 text-center" 
                     style="background:none; border:2px red solid; font-size: 1.1rem; padding: 10px; font-weight: 500;">
          Log out
        </router-link>
      </div>
  `,
  name: 'side_bar_admin',
  methods: {}
}

  