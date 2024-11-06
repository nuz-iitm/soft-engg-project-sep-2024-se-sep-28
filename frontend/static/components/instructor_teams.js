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
          <!-- Statistics Section -->
          <div class="row">
            <div class="col-md-12 mb-4">
              <div class="card text-center" style="background-color: rgba(255, 255, 255, 0.1); color: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
                <h2 class="mt-3" style="font-size: 2rem; font-weight: bold;">Statistics</h2>
                <div class="row">
                  <div class="col-md-6 mb-2">
                    <p class="mb-0">Teams Formed:</p>
                    <h5>{{ numberOfTeams }}</h5>
                  </div>
                  <div class="col-md-6 mb-2">
                    <p class="mb-0">Students Not in Any Team:</p>
                    <h5>{{ notInAnyTeam.length }}</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Teams Section -->
          <div class="row">
            <div v-for="(team, index) in teams" :key="index" class="col-md-6 mb-4">
              <div class="card text-center" style="background-color: rgba(255, 255, 255, 0.1); color: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
                <h3 class="mt-3" style="font-size: 1.5rem; font-weight: bold;">{{ team.name }}</h3>
                <div v-if="team.students.length > 0">
                  <p>Members:</p>
                  <ul>
                    <li v-for="(student, studentIndex) in team.students" :key="studentIndex">{{ student.name }}</li>
                  </ul>
                </div>
                <div v-else>
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
        { id: 2, name: "Team 2", students: [{name: "Student 3"}] }
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