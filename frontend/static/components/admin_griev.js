import side_bar_admin from "./side_bar_admin.js"
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
                <h1 class="text-center mt-5">ADMIN GRIEVANCE PAGE</h1>
                <div class="card text-center" style="background-color: rgba(255, 255, 255, 0.1); color: #2F4F4F; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
                    <table class="table mt-3" >
                    <thead>
                        <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(grievance, index) in grievances" :key="index">
                        <td>{{ grievance.date }}</td>
                        <td>{{ grievance.description }}</td>
                        <td>
                            <button class="btn btn-sm me-2" style="background-color: #28a745; color: white;" @click="resolveGrievance(grievance)">Resolve</button>
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
                grievances: [
                    { id: 1, date: "2024-11-01", description: "Technical issue with the system" },
                    { id: 2, date: "2023-11-02", description: "User interface bug reported by staff" }
                    // Add more grievances as needed
                  ]
            }
        },
    components:{
        side_bar_admin
    },
    methods: {
        resolveGrievance(grievance) {
          const index = this.grievances.indexOf(grievance);
          if (index !== -1) {
            this.grievances.splice(index, 1);
          }
          console.log("Resolved grievance:", grievance);
        }
      }
}