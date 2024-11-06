import side_bar_inst from "./side_bar_inst.js";

export default {
  template: `
    <div class="container-fluid" style="background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%); color: white; min-height: 100vh;">
      <div class="row" style="display: flex;">
        <!-- Sidebar -->
        <div class="col-md-3" style="max-width: 300px; overflow-x: hidden; background-color: rgba(0, 0, 0, 0.2); min-height: 100vh; padding: 20px;">
          <side_bar_inst></side_bar_inst>
        </div>

        <!-- Main Content -->
        <div class="col-md-9" style="padding: 40px;">
          <!-- Link to Create Alerts Page -->
          <a href="#" @click.prevent="goToCreateAlertsPage" class="btn btn-primary mb-3">Create Alerts</a>

          <!-- Scrollable List of Alerts -->
          <div class="overflow-y-auto max-h-screen h-full">
            <div v-for="(alert, index) in alerts" :key="index" class="mb-4 card text-center" style="background-color: rgba(255, 255, 255, 0.1); color: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
              <h3 class="mt-3" style="font-size: 1.5rem; font-weight: bold;">{{ alert.time }}</h3>
              <p>{{ alert.info }}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  `,

  data() {
    return {
      alerts: [
        { 
          time: "2023-10-05 14:00",
          info: "Team A has not made any commits to GitHub in the last week."
        },
        { 
          time: "2023-10-06 16:00",
          info: "Student B is late on their project deadline."
        }
      ]
    };
  },

  methods: {
    goToCreateAlertsPage() {
      // Navigate to the Create Alerts page (this example assumes you have a route for the Create Alerts page)
      this.$router.push('/create-alerts');
    }
  },
  
  components: {
    side_bar_inst
  }
};