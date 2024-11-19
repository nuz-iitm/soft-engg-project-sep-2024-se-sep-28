import side_bar_admin from "./side_bar_admin.js";
export default {
    template: `
      <div class="container-fluid" style="background: linear-gradient(135deg, #F0E5D8 0%, #D3E9D7 100%); color: #2F4F4F; min-height: 100vh;">
        <div class="row" style="display: flex;">
          <!-- Sidebar -->
          <div class="col-md-3" style="max-width: 250px; overflow-x: hidden; background-color: rgba(0, 0, 0, 0.2); min-height: 100vh; padding: 20px;">
            <side_bar_admin></side_bar_admin>
          </div>

          <!-- Main Content -->
          
          <div class="col-md-9" style="padding: 40px;">
            <!-- Add Instructor Button -->
            <button class="btn btn-primary mb-3" @click="addInstructor">Add New Instructor</button>
            <div v-if="showAddForm" class="card text-center" style="background-color: rgba(255, 255, 255, 0.1); color: #2F4F4F; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
              <h2>Add Instructor</h2>
              <form @submit.prevent="addInstructorConfirm">
                <div class="mb-3">
                  <label for="name" class="form-label">Name</label>
                  <input type="text" v-model="newInstructor.name" required class="form-control" id="name">
                </div>
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input type="email" v-model="newInstructor.email" required class="form-control" id="email">
                </div>
                <div class="mb-3">
                  <label for="project" class="form-label">Project</label>
                  <input type="text" v-model="newInstructor.project_id" required class="form-control" id="project">
                </div>
                <div class="mb-3">
                  <label for="role" class="form-label">Designation</label>
                  <input type="text" v-model="newInstructor.designation" required class="form-control" id="role">
                </div>
                <button type="submit" class="btn btn-primary me-2">Submit</button>
                <button @click="showAddForm = false" class="btn btn-secondary">Cancel</button>
              </form>
            </div>
            <!-- Instructor List -->
            <h1 class="text-center mt-5" style="font-size: 2.5rem; font-weight: bold; color: #2F4F4F;">INSTRUCTOR LIST</h1>
            <div class="card text-center" style="background-color: rgba(255, 255, 255, 0.1); color: #2F4F4F; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
              <table class="table mt-3 text-white" style="color: #2F4F4F;">
                <thead>
                  <tr>
                    <th style="color: #2F4F4F; padding: 10px;">Name</th>
                    <th style="color: #2F4F4F; padding: 10px;">Email</th>
                    <th style="color: #2F4F4F; padding: 10px;">Project</th>
                    <th style="color: #2F4F4F; padding: 10px;">Designation</th>
                    <th style="color: #2F4F4F; padding: 10px;">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(instructor, index) in instructors" :key="index" style="text-align: center;">
                    <td v-if="!instructor.editMode" style="color: #2F4F4F; padding: 10px;">{{ instructor.name }}</td>
                    <td v-else><input type="text" v-model="editedInstructor.name" class="form-control"></td>
                    <td v-if="!instructor.editMode" style="color: #2F4F4F; padding: 10px;">{{ instructor.email }}</td>
                    <td v-else><input type="text" v-model="editedInstructor.email" class="form-control"></td>
                    <td v-if="!instructor.editMode" style="color: #2F4F4F; padding: 10px;">{{ instructor.project_id }}</td>
                    <td v-else><input type="text" v-model="editedInstructor.project_id" class="form-control"></td>
                    <td v-if="!instructor.editMode" style="color: #2F4F4F; padding: 10px;">{{ instructor.designation }}</td>
                    <td v-else><input type="text" v-model="editedInstructor.designation" class="form-control"></td>
                    <td style="padding: 10px;">
                      <button v-if="!instructor.editMode" @click="editInstructor(instructor)" class="btn btn-sm me-2" style="background-color: #28a745; color: white; margin-right: 5px;">Edit</button>
                      <button v-if="instructor.editMode" @click="updateInstructor(instructor.i_id, editedInstructor)" class="btn btn-sm me-2" style="background-color: #6A9F8A; color: white;">Update</button>
                      <button v-if="!instructor.editMode" @click="deleteInstructor(instructor.i_id)" class="btn btn-sm" style="background-color: #dc3545; color: white;">Delete</button>
                      <button v-if="instructor.editMode" @click="cancelEdit(instructor)" class="btn btn-sm" style="background-color: #DC3545; color: white;">Cancel</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
        `,

    data() {
            return {
              instructors: [
                { i_id: 1, name: "John Doe", email: "john@example.com", project_id: "Project A", designation: "Instructor", editMode: false },
                { i_id: 2, name: "Jane Smith", email: "jane@example.com", project_id: "Project B", designation: "Teaching Assistant", editMode: false },
                { i_id: 3, name: "Michael Johnson", email: "michael@example.com", project_id: "Project C", designation: "Instructor", editMode: false },
                { i_id: 4, name: "Emily Davis", email: "emily@example.com", project_id: "Project D", designation: "Teaching Assistant", editMode: false }
              ],
              newInstructor: {name:'', email:'', project_id:'', designation:''},
              editedInstructor: { i_id: null, name: '', email: '', project_id: '', designation: '' },
              showAddForm: false,
            }
        },
    mounted() {
      const authToken = localStorage.getItem('auth-token');
      fetch('http://127.0.0.1:5000/api/instructor', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
      })
        .then(response => response.json())
        .then(data => this.instructors = data.map(instructor => ({ ...instructor, editMode: false })));
    },
    methods: {
      addInstructor(){
        this.showAddForm = true;
      },
      addInstructorConfirm() {
        const authToken = localStorage.getItem('auth-token');
        fetch('http://127.0.0.1:5000/api/instructor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify(this.newInstructor)
        })
        .then(response => response.json())
        .then(data => {
          console.log(data.message);
          alert(data.message);
          // Add the new instructor to the local state
          this.instructors.push({ ...this.newInstructor, editMode: false });
          this.showAddForm = false;
        })
        .catch(error => {
          console.error('Error adding Instructor:', error);
          alert('Failed to add Instructor');
        });
    
        // Clear the form after submission
        // this.newInstructor = { name: '', email: '', project_id: '', designation: '' };
      },
      updateInstructor(i_id, editedInstructor) {
        const index = this.instructors.findIndex(i => i.i_id === i_id);
        const authToken = localStorage.getItem('auth-token');
        fetch(`http://127.0.0.1:5000/api/instructor/${i_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify(editedInstructor)
        })
        .then(response => response.json())
        .then(data => {
          console.log(data.message);
          alert(data.message);
          if (index !== -1) {
            this.$set(this.instructors[index], 'name', editedInstructor.name);
            this.$set(this.instructors[index], 'email', editedInstructor.email);
            this.$set(this.instructors[index], 'project_id', editedInstructor.project_id);
            this.$set(this.instructors[index], 'designation', editedInstructor.designation);
            this.$set(this.instructors[index], 'editMode', false);
          }
        })
        .catch(error => {
          console.error('Error updating Student:', error);
          alert('Failed to update Student');
        });
      },
      editInstructor(instructor) {
        this.editedInstructor = { ...instructor };
        instructor.editMode = true;
      },
      cancelEdit(instructor) {
        instructor.name = this.editedInstructor.name;
        instructor.email = this.editedInstructor.email;
        instructor.project_id = this.editedInstructor.project_id;
        instructor.designation = this.editedInstructor.designation;
        instructor.editMode = false;
      },
      deleteInstructor(i_id) {
        const index = this.instructors.findIndex(i => i.i_id === i_id);
        const authToken = localStorage.getItem('auth-token');
        fetch(`http://127.0.0.1:5000/api/instructor/${i_id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          }
        })
        .then(response => response.json())
        .then(data => {
        console.log(data.message);
        alert(data.message);
        // remove instructor from local state
        if (index !== -1) {
          this.instructors.splice(index, 1);
        }
      })
      .catch(error => {
        console.error('Error deleting Instructor:', error);
        alert('Failed to delete Instructor');
      });
    },
  },
  components:{
      side_bar_admin
  },
}
