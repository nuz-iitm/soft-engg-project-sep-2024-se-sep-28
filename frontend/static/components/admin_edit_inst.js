import side_bar_admin from "./side_bar_admin.js"
export default {
    template: `
        <div class="container-fluid" style="background-color: #f8f9fa;">
          <div class="row">
            <div class="col-md-3" style="max-width: 250px; overflow-x: hidden;">
              <side_bar_admin></side_bar_admin>
            </div>
            <div class="col-md-9" style="background-color: #fdfdfe;">
              <h1 class="text-center mt-5">INSTRUCTOR LIST</h1>
              <div class="container-fluid">
                <div>
                  <table class="table mt-3">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Project</th>
                        <th>Role</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(instructor, index) in instructors" :key="index">
                        <td>{{ instructor.name }}</td>
                        <td>{{ instructor.email }}</td>
                        <td>{{ instructor.project }}</td>
                        <td>{{ instructor.role }}</td>
                        <td>
                          <button class="btn btn-sm me-2" style="background-color: #28a745; color: white;" @click="editInstructor(instructor)">Edit</button>
                          <button class="btn btn-sm" style="background-color: #dc3545; color: white;" @click="deleteInstructor(instructor)">Delete</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        `,

    data() {
            return {
              instructors: [
                { id: 1, name: "John Doe", email: "john@example.com", project: "Project A", role: "Instructor" },
                { id: 2, name: "Jane Smith", email: "jane@example.com", project: "Project B", role: "Teaching Assistant" },
                { id: 3, name: "Michael Johnson", email: "michael@example.com", project: "Project C", role: "Instructor" },
                { id: 4, name: "Emily Davis", email: "emily@example.com", project: "Project D", role: "Teaching Assistant" }
              ]
            }
        },
    components:{
        side_bar_admin
    },
    methods: {

        },
}