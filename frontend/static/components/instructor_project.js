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
          <div class="row">
            <!-- Project Statement Section -->
            <div class="col-md-12 mb-4">
              <div class="card text-center" style="background-color: rgba(255, 255, 255, 0.1); color: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
                <h2 class="mt-3" style="font-size: 2rem; font-weight: bold;">Project Statement</h2>
                <textarea v-model="projectStatement" @click="displayStatement()" rows="4" placeholder="Enter your project statement here..."></textarea>
                <p v-if="statementDisplayed" class="mt-3" style="font-size: 1.5rem; font-weight: bold;">{{ projectStatement }}</p>
              </div>
            </div>

            <!-- Milestones Section -->
            <div class="col-md-12 mb-4">
              <div class="card text-center" style="background-color: rgba(255, 255, 255, 0.1); color: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
                <h2 class="mt-3" style="font-size: 2rem; font-weight: bold;">Milestones</h2>
                <div v-for="(milestone, index) in milestones" :key="index" class="row">
                  <div class="col-md-8 mb-2">
                    <input type="text" v-model="milestone.text" placeholder="Milestone Text" class="form-control">
                  </div>
                  <div class="col-md-4 mb-2">
                    <input type="date" v-model="milestone.deadline" class="form-control">
                  </div>
                </div>
                <button @click="addMilestone()" class="btn btn-primary">Add Milestone</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,

  data() {
    return {
      projectStatement: "",
      statementDisplayed: false,
      milestones: []
    };
  },
  
  components: {
    side_bar_inst
  },

  methods: {
    displayStatement() {
      this.statementDisplayed = !this.statementDisplayed;
    },
    
    addMilestone() {
      this.milestones.push({ text: "", deadline: "" });
    }
  }
};
