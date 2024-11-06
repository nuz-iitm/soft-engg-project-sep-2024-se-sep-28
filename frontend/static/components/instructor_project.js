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
          <div class="row justify-content-center">
            <!-- Project Statement Section -->
            <div class="col-md-10 mb-5">
              <div class="card" style="background-color: rgba(255, 255, 255, 0.1); color: white; padding: 20px; border-radius: 10px; box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);">
                <h2 class="text-center" style="font-size: 2.2rem; font-weight: bold; margin-bottom: 20px;">Project Statement</h2>
                <textarea v-model="projectStatement" @click="displayStatement()" rows="4" class="form-control" 
                  style="resize: none; background-color:white; border: none; color: white; padding: 15px; border-radius: 5px;"
                  placeholder="Enter your project statement here..."></textarea>
                <p v-if="statementDisplayed" class="mt-4 text-center" style="font-size: 1.2rem; color: #f0f0f0;">{{ projectStatement }}</p>
              </div>
            </div>

            <!-- Milestones Section -->
            <div class="col-md-10 mb-5">
              <div class="card" style="background-color: rgba(255, 255, 255, 0.1); color: white; padding: 20px; border-radius: 10px; box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);">
                <h2 class="text-center" style="font-size: 2.2rem; font-weight: bold; margin-bottom: 20px;">Milestones</h2>
                <div v-for="(milestone, index) in milestones" :key="index" class="row align-items-center mb-3">
                  <div class="col-md-8 mb-2">
                    <input type="text" v-model="milestone.text" placeholder="Milestone Description" class="form-control"
                      style="background-color: white; border: none; padding: 10px; border-radius: 5px;">
                  </div>
                  <div class="col-md-4 mb-2">
                    <input type="date" v-model="milestone.deadline" class="form-control"
                      style="background-color: rgba(255, 255, 255, 0.15); color: white; border: none; padding: 10px; border-radius: 5px;">
                  </div>
                </div>
                <button @click="addMilestone()" class="btn btn-primary mt-3" 
                  style="background-color: #2575fc; border: none; font-weight: bold; padding: 10px 20px; border-radius: 5px;">
                  + Add Milestone
                </button>
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
