import side_bar_inst from "./side_bar_inst.js";

export default {
  template: `
    <div class="container-fluid" style="background: linear-gradient(135deg, #F0E5D8 0%, #D3E9D7 100%); color: #2F4F4F; min-height: 100vh;">
      <div class="row">
        <!-- Sidebar -->
        <div class="col-md-3" style="max-width: 300px; overflow-x: hidden; background-color: rgba(0, 0, 0, 0.1); min-height: 100vh; padding: 20px;">
          <side_bar_inst></side_bar_inst>
        </div>

        <!-- Main Content -->
        <div class="col-md-9" style="padding: 40px;">
          <!-- Create Alerts Link -->
          <a href="#" @click.prevent="goToCreateAlertsPage" class="btn mb-4" style="background-color: #6A9F8A; color: white; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3); width: 220px;">Create Alerts</a>

          <!-- Scrollable List of Alerts -->
          <div class="overflow-y-auto" style="max-height: 70vh;">
            <div v-for="(alert, index) in alerts" :key="index" class="mb-4 card text-center" 
                 style="background-color: rgba(255, 255, 255, 0.9); color: #2F4F4F; padding: 20px; border-radius: 10px; box-shadow: 0 6px 12px rgba(47, 79, 79, 0.2);">
              
              <h3 class="mt-3" style="font-size: 1.6rem; font-weight: bold;">{{ alert.time }}</h3>
              <p style="font-size: 1.2rem; margin-bottom: 15px;">{{ alert.info }}</p>
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
      this.$router.push('/create-alerts');
    }
  },

  components: {
    side_bar_inst
  }
};
