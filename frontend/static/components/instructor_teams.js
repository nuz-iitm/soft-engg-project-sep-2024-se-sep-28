import side_bar_inst from "./side_bar_inst.js";

export default {
  template: `
    <div class="container-fluid" style="background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%); color: white; min-height: 100vh;">
      <div class="row">
        <!-- Sidebar -->
        <div class="col-md-3" style="max-width: 300px; overflow-x: hidden; background-color: rgba(0, 0, 0, 0.2); min-height: 100vh; padding: 20px;">
          <side_bar_inst></side_bar_inst>
        </div>

        <!-- Main Content -->
        <div class="col-md-9" style="padding: 40px;">
          <!-- Statistics Section -->
          <div class="row justify-content-center">
            <div class="col-md-10 mb-5">
              <div class="card" style="background-color: rgba(255, 255, 255, 0.1); color: white; padding: 20px; border-radius: 10px; box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);">
                <h2 class="text-center" style="font-size: 2rem; font-weight: bold; margin-bottom: 20px;">Statistics</h2>
                <div class="row text-center">
                  <div class="col-md-6">
                    <p class="mb-1" style="font-size: 1.2rem;">Teams Formed:</p>
                    <h3 style="font-weight: bold;">{{ numberOfTeams }}</h3>
                  </div>
                  <div class="col-md-6">
                    <p class="mb-1" style="font-size: 1.2rem;">Students Not in Any Team:</p>
                    <h3 style="font-weight: bold;">{{ notInAnyTeam.length }}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Teams Section -->
          <div class="row">
            <div v-for="(team, index) in teams" :key="index" class="col-md-6 mb-4">
              <div class="card" style="background-color: rgba(255, 255, 255, 0.1); color: white; padding: 20px; border-radius: 10px; box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);">
                <h3 class="text-center" style="font-size: 1.5rem; font-weight: bold; margin-bottom: 15px;">{{ team.name }}</h3>
                <div v-if="team.students.length > 0">
                  <p class="text-center">Members:</p>
                  <ul class="list-unstyled text-center" style="font-size: 1.1rem; line-height: 1.5;">
                    <li v-for="(student, studentIndex) in team.students" :key="studentIndex">{{ student.name }}</li>
                  </ul>
                </div>
                <div v-else class="text-center">
                  <p>No members yet.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  `,

  data() {
    return {
      teams: [
        { id: 1, name: "Team 1", students: [{ name: "Student 1" }, { name: "Student 2" }] },
        { id: 2, name: "Team 2", students: [{ name: "Student 3" }] }
      ],
      notInAnyTeam: [
        { name: "Student 3" },
        { name: "Student 4" }
      ]
    };
  },

  computed: {
    numberOfTeams() {
      return this.teams.length;
    }
  },
  
  components: {
    side_bar_inst
  }
};
