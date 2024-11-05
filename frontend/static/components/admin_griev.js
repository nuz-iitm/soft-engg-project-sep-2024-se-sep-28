import side_bar_admin from "./side_bar_admin.js"
export default {
    template: `
        <div class="container-fluid">
            <div class="row">
            <div class="col-md-3" style="max-width: 300px; overflow-x: hidden;">
                <side_bar_admin></side_bar_admin>
            </div>
            <div class="col-md-9">
                <h1 class="text-center mt-5" style="margin-top: 200px;">ADMIN GRIEVANCE PAGE</h1>
                <div class="card">
                <table class="table mt-3">
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