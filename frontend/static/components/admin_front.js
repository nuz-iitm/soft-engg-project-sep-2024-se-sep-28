import side_bar_admin from "./side_bar_admin.js";

export default {
  template: `
    <div class="container-fluid" style="background: linear-gradient(135deg, #F0E5D8 0%, #D3E9D7 100%); color: #2F4F4F; min-height: 100vh;">
      <div class="row" style="display: flex;">
        <!-- Sidebar -->
        <div class="col-md-3" style="max-width: 300px; overflow-x: hidden; background-color: rgba(0, 0, 0, 0.2); min-height: 100vh; padding: 20px;">
          <side_bar_admin></side_bar_admin>
        </div>

        <!-- Main Content -->
        <div class="col-md-9" style="padding: 40px;">
          <div class="row">
            <!-- BULK EDIT OPTION -->
            <div class="col-md-12 mb-4">
              <div class="card text-center" style="background-color: rgba(255, 255, 255, 0.1); color: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
                <h2 style="font-size: 2rem; font-weight: bold; color: #2F4F4F;">BULK EDIT OPTION</h2>
                <div class="row">
                  <div class="col-md-6 mb-4 d-flex flex-column align-items-center" style="text-align: center;">
                    <form @submit.prevent="uploadCSV" enctype="multipart/form-data">
                      <input type="file" name="csvFile" accept=".csv" ref="csvInput" style="margin: 10px; background-color: #F0E5D8; color: #2F4F4F;">
                      <button class="btn" style="background-color: #A4C3B2; color: #2F4F4F; margin-top: 10px;">Add Students</button>
                      <button class="btn" style="border: 2px solid #FF6347; color: #ff6347; margin-top: 10px;">Remove Students</button>
                    </form>
                  </div>
                  <div class="col-md-6 mb-4 d-flex flex-column align-items-center" style="text-align: center;">
                    <div v-if="uploadingCSV">
                      <p>Uploading CSV file...</p>
                      <progress :value="uploadProgress" max="100" style="background-color: #F0E5D8;"></progress>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- STUDENT LIST -->
            <div class="col-md-12 mb-4">
              <div class="card text-center" style="background-color: rgba(255, 255, 255, 0.1); color: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
                <h2 style="font-size: 2rem; font-weight: bold; color: #2F4F4F;">STUDENT LIST</h2>
                <table class="table mt-3 text-white" style="color:#2F4F4F;">
                  <thead>
                    <tr style="color:#2f4f4f;">
                      <th>Name</th>
                      <th>Email</th>
                      <th>Project</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style="color:#2F4F4F;" v-for="(student, index) in students" :key="index">
                      <td v-if="!student.editMode">{{ student.name }}</td>
                      <td v-else><input type="text" v-model="editedStudent.name" class="form-control"></td>
                      <td v-if="!student.editMode">{{ student.email }}</td>
                      <td v-else><input type="email" v-model="editedStudent.email" class="form-control"></td>
                      <td v-if="!student.editMode">{{ student.project_id }}</td>
                      <td v-else><input type="text" v-model="editedStudent.project_id" class="form-control"></td>
                      <td>
                        <button v-if="!student.editMode" @click="editStudent(student)" class="btn btn-sm me-2" style="background-color: #28a745; color: white;">Edit</button>
                        <button v-if="student.editMode" @click="updateStudent(student.id, editedStudent)" class="btn btn-sm me-2" style="background-color: #6A9F8A; color: white;">Update</button>
                        <button v-if="!student.editMode" @click="deleteStudent(student.id)" class="btn btn-sm" style="background-color: #dc3545; color: white;">Delete</button>
                        <button v-if="student.editMode" @click="cancelEdit(student)" class="btn btn-sm" style="background-color: #DC3545; color: white;">Cancel</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,

  data() {
    return {
      uploadingCSV: false,
      uploadProgress: 0,
      students: [
        { id: 1, name: "John Doe", email: "john@example.com", project_id: "Project A", editMode: false },
        { id: 2, name: "Jane Smith", email: "jane@example.com", project_id: "Project B", editMode: false },
        // dummy students
      ],
      editedStudent: { id: null, name: '', email: '', project_id: '' }
    };
  },
  components: {
    side_bar_admin
  },

  mounted() {
    const authToken = localStorage.getItem('auth-token');
    fetch('http://127.0.0.1:5000/api/student_data', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
    })
      .then(response => response.json())
      // .then(data => console.log(data))
      .then(data => this.students = data.map(student => ({ ...student, editMode: false })));
  },

  methods: {
    updateStudent(id, editedStudent) {
      const index = this.students.findIndex(s => s.id === id);
      if (index !== -1) {
        this.$set(this.students[index], 'name', editedStudent.name);
        this.$set(this.students[index], 'email', editedStudent.email);
        this.$set(this.students[index], 'project', editedStudent.project);
        this.$set(this.students[index], 'editMode', false);
      }
    },
    editStudent(student) {
      this.editedStudent = { ...student };
      student.editMode = true;
    },
    deleteStudent(id) {
      const index = this.students.findIndex(s => s.id === id);
      if (index !== -1) {
        this.students.splice(index, 1);
      }
    },
    cancelEdit(student) {
      student.name = this.editedStudent.name;
      student.email = this.editedStudent.email;
      student.project = this.editedStudent.project;
      student.editMode = false;
    },
    uploadCSV(e) {
      this.uploadingCSV = true;
      const formData = new FormData();
      const authToken = localStorage.getItem('auth-token');

      if (!this.$refs.csvInput || this.$refs.csvInput.files.length === 0) {
        alert('Please select a CSV file');
        this.uploadingCSV = false;
        return;
      }

      formData.append('csvFile', this.$refs.csvInput.files[0]);

      fetch('http://127.0.0.1:5000/api/upload_csv', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        body: formData
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          this.uploadProgress = data.progress;
          if (data.complete) {
            this.uploadedCSVData = data.data;
            this.uploadingCSV = false;
          }
        })
        .catch(error => console.error(error));
    }
  }
};
