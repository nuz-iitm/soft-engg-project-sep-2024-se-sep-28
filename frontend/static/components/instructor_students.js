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
          
          <!-- Header Section -->
          <div class="row justify-content-center mb-5">
            <div class="col-md-10">
              <div class="card text-center" style="background-color: rgba(255, 255, 255, 0.95); padding: 30px; border-radius: 10px; box-shadow: 0 8px 16px rgba(47, 79, 79, 0.2);">
                <h2 class="mb-0" style="font-size: 2rem; font-weight: bold; color: #2F4F4F;">Students Overview</h2>
              </div>
            </div>
          </div>

          <!-- Students Section -->
          <div class="row">
            <div v-for="(student, index) in students" :key="index" class="col-lg-6 col-md-12 mb-4">
              <div class="card" style="background-color: rgba(255, 255, 255, 0.95); padding: 25px; border-radius: 10px; box-shadow: 0 8px 16px rgba(47, 79, 79, 0.2);">
                <h3 class="text-center" style="font-size: 1.5rem; font-weight: bold; margin-bottom: 10px; color: #2F4F4F;">{{ student.name }}</h3>
                <p class="text-center" style="font-size: 1rem; color: #6A9F8A; margin-bottom: 15px;">Account Created: {{ student.is_registered }}</p>
                <p class="text-center" style="font-size: 1rem; color: #2F4F4F;">Project ID: {{ student.project_id || "N/A" }}</p>
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
        { s_id: 1, name: "Student 1", email: "", project_id: 1, is_registered: "Yes" },
      ],
    };
  },

  mounted() {
    const authToken = localStorage.getItem('auth-token');
    fetch('http://127.0.0.1:5000/api/student', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
    })
      .then(response => response.json())
      .then(data => this.students = data.map(student => ({ ...student })))
      .catch(error => console.error("Error fetching students:", error));
  },

  components: {
    side_bar_inst
  }
};
