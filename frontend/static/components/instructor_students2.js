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
            <h1>Student Page</h1>
            <p v-if="student">Name: {{ student.name }}</p>
            <p v-if="student">Email: {{ student.email }}</p>

            <!-- Display Milestone Status List -->
            <h2>Milestone Status</h2>
            <ul>
            <li v-for="milestone in milestoneStatusList" :key="milestone.m_id">
                {{ milestone.desc }} - Deadline: {{ milestone.deadline }} - Completed: {{ milestone.status }}
            </li>
            </ul>

            <!-- Display Commit List -->
            <h2>Commit History</h2>
            <ul>
            <li v-for="commit in commitList" :key="commit.g_id">
                {{ commit.commit_date }} - Message: {{ commit.message }}
            </li>
            </ul>
        </div>
        </div>
    </div>
  `,

  data() {
    return {
      student: null,
      milestoneStatusList: [],
      commitList: []
    };
  },
  mounted() {
    const s_id = this.$route.params.s_id;
    const authToken = localStorage.getItem('auth-token');
    fetch(`http://127.0.0.1:5000/api/student_all/${s_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
    })
      .then(response => response.json())
      .then(data => {
        this.student = data.student;
        this.milestoneStatusList = data.milestone_status_list;
        this.commitList = data.commit_list;
      })
      .catch(error => console.error("Error fetching student:", error));
  },


  components: {
    side_bar_inst
  }
};
