import side_bar_admin from "./side_bar_admin.js"
export default {
    template: `
      <div class="container-fluid" style="background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%); color: white; min-height: 100vh;">
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
                  <h2 class="mt-3" style="font-size: 2rem; font-weight: bold;">BULK EDIT OPTION</h2>
                  <div class="row">
                    <div class="col-md-6 mb-4">
                      <form @submit.prevent="uploadCSV" enctype="multipart/form-data">
                        <input type="file" name="csvFile" accept=".csv" />
                        <button class="btn btn-primary mt-2 mb-2 me-2">Add Students</button>
                        <button class="btn btn-primary mt-2 mb-2 me-2">Remove Students</button>
                      </form>
                    </div>

                    <div class="col-md-6 mb-4">
                      <div v-if="uploadingCSV" style="text-align: center;">
                        <p>Uploading CSV file...</p>
                        <progress :value="uploadProgress" max="100"></progress>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- STUDENT LIST -->
              <div class="col-md-12 mb-4">
                <div class="card text-center" style="background-color: rgba(255, 255, 255, 0.1); color: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
                  <h2 class="mt-3" style="font-size: 2rem; font-weight: bold;">STUDENT LIST</h2>
                  <table class="table mt-3 text-white">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Project</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(student, index) in students" :key="index">
                        <td>{{ student.name }}</td>
                        <td>{{ student.email }}</td>
                        <td>{{ student.project }}</td>
                        <td>
                          <button class="btn btn-sm me-2" style="background-color: #28a745; color: white;" @click="editStudent(student)">Edit</button>
                          <button class="btn btn-sm" style="background-color: #dc3545; color: white;" @click="deleteStudent(student)">Delete</button>
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
                  { id: 1, name: "John Doe", email: "john@example.com", project: "Project A" },
                  { id: 2, name: "Jane Smith", email: "jane@example.com", project: "Project B"},
                  // dummy students
                ],
            }
        },
    components:{
        side_bar_admin
    },
    methods: {
        addStudents() {
            // Add logic to add students from uploaded CSV file or other source
          },
        removeStudents() {
            // Remove logic for removing students
          },
          editStudent(student) {
            // Add logic to handle editing a student
            console.log("Edit student:", student);
          },
          deleteStudent(student) {
            // Add logic to handle deleting a student
            const index = this.students.indexOf(student);
            if (index !== -1) {
              this.students.splice(index, 1);
            }
            console.log("Delete student:", student);
          },
        uploadCSV(e) {
            this.uploadingCSV = true;
            const formData = new FormData();
            formData.append('csvFile', e.target.files[0]);
            fetch('/upload-csv', {
              method: 'POST',
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
        },
}