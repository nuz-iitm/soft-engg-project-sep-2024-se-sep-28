import side_bar_inst from "./side_bar_inst.js";

export default {
  template: `
    <div class="container-fluid" style="background: linear-gradient(135deg, #F0E5D8 0%, #D3E9D7 100%); color: #2F4F4F; min-height: 100vh;">
      <div class="row" style="display: flex;">
        <!-- Sidebar -->
        <div class="col-md-3" style="max-width: 300px; overflow-x: hidden; background-color: rgba(0, 0, 0, 0.1); min-height: 100vh; padding: 20px;">
          <side_bar_inst></side_bar_inst>
        </div>

        <!-- Main Content -->
        <div class="col-md-9" style="padding: 40px;">
          <div class="row">
            <!-- Dashboard Card -->
            <div class="col-md-6 mb-4">
              <div class="card text-center" style="background-color: rgba(255, 255, 255, 0.9); color: #2F4F4F; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(47, 79, 79, 0.2);">
                <h2 class="mt-3" style="font-size: 2rem; font-weight: bold;">Dashboard</h2>
                <p>Manage all your project tracking in one place.</p>
              </div>
            </div>

            <!-- Visualization Card -->
            <div class="col-md-6 mb-4">
              <div class="card text-center" style="background-color: rgba(255, 255, 255, 0.9); color: #2F4F4F; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(47, 79, 79, 0.2);">
                <h2 class="mt-3" style="font-size: 2rem; font-weight: bold;">Visualizations</h2>
                <p>View insights on student and project performance.</p>
                <canvas id="commitsChart" style="max-width: 100%; height: 300px;"></canvas>
              </div>
            </div>
          </div>

          <!-- Top Students Section -->
          <div class="row">
            <div class="col-md-12 mb-4">
              <div class="card text-center" style="background-color: rgba(255, 255, 255, 0.9); color: #2F4F4F; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(47, 79, 79, 0.2);">
                <h2 class="mt-3" style="font-size: 2rem; font-weight: bold;">Top Students</h2>
                <p>Explore the top performing students based on commits and progress.</p>

                <div class="row" style="justify-content: center; padding: 20px;">
                  <!-- Student Cards -->
                  <div class="col-md-4 mb-4" v-for="(student, index) in topStudents" :key="index">
                    <div class="card" style="background-color: rgba(47, 79, 79, 0.1); color: #2F4F4F; padding: 15px; border-radius: 10px; box-shadow: 0 4px 8px rgba(47, 79, 79, 0.2);">
                      <div class="card-body">
                        <h5 class="card-title" style="font-size: 1.2rem; font-weight: bold;">{{ student.name }}</h5>
                        <p class="card-text">Commits: {{ student.commits }}</p>
                      </div>
                    </div>
                  </div>
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
      topStudents: [
        { id: 1, name: "Student A", commits: 100 },
        { id: 2, name: "Student B", commits: 80 },
        { id: 3, name: "Student C", commits: 60 }
      ]
    };
  },

  mounted() {
    const authToken = localStorage.getItem('auth-token');
    fetch('http://127.0.0.1:5000/api/dash_top_studd', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
    })
      .then(response => response.json())
      .then(data => {
        this.topStudents = data.map(student => ({ ...student }));
        this.renderChart();
      });
  },

  methods: {
    renderChart() {
      const ctx = document.getElementById("commitsChart").getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: this.topStudents.map(student => student.name),
          datasets: [
            {
              label: "Commits",
              data: this.topStudents.map(student => student.commits),
              backgroundColor: "rgba(47, 79, 79, 0.7)",
              borderColor: "rgba(47, 79, 79, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Number of Commits",
              },
            },
            x: {
              title: {
                display: true,
                text: "Students",
              },
            },
          },
          plugins: {
            legend: {
              display: true,
              position: "top",
            },
          },
        },
      });
    },
  },

  components: {
    side_bar_inst,
  },
};
