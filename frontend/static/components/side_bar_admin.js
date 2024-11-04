export default {
    template: `
      <div class="sidebar bg-light p-4 d-flex flex-column align-items-center" style="height: 90vh; max-width: 270px;">
        <h2 class="text-center mt-5">Welcome Admin</h2>
        <router-link to="/admin_front" class="btn btn-primary mt-5 mb-3 w-100 text-center">Edit Students</router-link>
        <router-link to="/admin_edit_inst" class="btn btn-secondary mb-2 w-100 text-center">Edit Instructors and TA'S</router-link>
        <router-link to="/admin_griev" class="btn btn-secondary mb-2 w-100 text-center">Technical Grievances</router-link>
        <router-link to="/admin_setting" class="btn btn-secondary mb-2 w-100 text-center">Settings</router-link>
      </div>
    `,
    name: 'side_bar_admin',
    methods: {

      }
}

  