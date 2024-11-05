export default {
    template: `
        <div class="sidebar bg-light p-4 d-flex flex-column align-items-center w-150" style="height: 90vh; max-width: 270px; overflow-y: auto;">
          <h2 class="text-center mt-5">Welcome Admin</h2>
          <router-link to= "/admin_front" class="btn btn-primary mt-5 mb-3 w-100 text-center">
            Edit Students
          </router-link>
          <router-link to="/admin_edit_inst" class="btn btn-secondary mb-2 w-100 text-center">
            Edit Instructors and TA's
          </router-link>
          <router-link to="" class="btn btn-secondary mb-2 w-100 text-center">
            Technical Grievances
          </router-link>
          <router-link to="" class="btn btn-secondary mb-2 w-100 text-center">
            Settings
          </router-link>
          <router-link to="/" class="btn btn-danger mt-5 w-100 text-center">
            Log out
          </router-link>
        </div>
    `,
    name: 'side_bar_admin',
    methods: {

      }
}

  