export default {
    template: `
      <div class="sidebar bg-light">
        <button @click="navigate('editStudents')" class="btn btn-primary mb-2">Edit Students</button>
        <button @click="navigate('editInstructors')" class="btn btn-primary mb-2">Edit Instructors and TAs</button>
        <button @click="navigate('technicalGrievances')" class="btn btn-primary mb-2">Technical Grievances</button>
        <button @click="navigate('settings')" class="btn btn-primary mb-2">Settings</button>
      </div>
    `,
    name: 'side_bar_admin',
    methods: {

      }
}

  