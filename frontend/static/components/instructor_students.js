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
          
          <!-- Statistics Section -->
          <div class="row justify-content-center">
            <div class="col-md-10 mb-5">
              <div class="card" style="background-color: rgba(255, 255, 255, 0.9); color: #2F4F4F; padding: 20px; border-radius: 10px; box-shadow: 0 6px 12px rgba(47, 79, 79, 0.2);">
                <h2 class="text-center" style="font-size: 2rem; font-weight: bold; margin-bottom: 20px;">Students</h2>
            </div>
          </div>

          <!-- Teams Section -->
          <div class="row">
            <div v-for="(student, index) in students" :key="index" class="col-md-6 mb-4">
              <div class="card" style="background-color: rgba(255, 255, 255, 0.9); color: #2F4F4F; padding: 20px; border-radius: 10px; box-shadow: 0 6px 12px rgba(47, 79, 79, 0.2);">
                <h3 class="text-center" style="font-size: 1.5rem; font-weight: bold; margin-bottom: 15px;">{{ student.name }}</h3>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  `,

  data() {
    return {
      students: [
        { s_id: 1, name: "Student 1", },
        { s_id: 2, name: "Student 2", },
        { s_id: 3, name: "Student 3", },
        { s_id: 4, name: "Student 4", },
        { s_id: 5, name: "Student 5", },
        { s_id: 6, name: "Student 6", }
      ],
    };
  },

  computed: {

  },

  components: {
    side_bar_inst
  }
};
