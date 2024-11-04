export default {
    template: `
      <div class="sidebar bg-light p-4 d-flex flex-column align-items-center" style="height: 90vh">
        <h2 class="text-center mt-5">Welcome Admin</h2>
        <button @click="navigate('editStudents')" class="btn btn-primary mt-5 mb-3 w-100 text-center">Edit Students</button>
        <button @click="navigate('editInstructors')" class="btn btn-secondary mb-2 w-100 text-center">Edit Instructors and TAs</button>
        <button @click="navigate('technicalGrievances')" class="btn btn-secondary mb-2 w-100 text-center">Technical Grievances</button>
        <button @click="navigate('settings')" class="btn btn-secondary mb-2 w-100 text-center">Settings</button>
      </div>
    `,
    name: 'side_bar_admin',
    methods: {

      }
}

  