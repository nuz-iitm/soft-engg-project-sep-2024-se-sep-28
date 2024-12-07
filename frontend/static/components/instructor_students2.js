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
                  {{ milestone.desc }} - Deadline: {{ milestone.deadline }} - Completion Status: {{ milestone.status }}
                  <a 
                      v-if="milestone.submission_url"
                      @click.prevent='get_file(milestone.m_id, student.s_id, milestone.submission_url)'
                      class="btn btn-secondary ml-2"
                  >
                      Download PDF
                  </a>
              </li>
            </ul>

            <!-- Summary Button -->
            <button 
              class="btn btn-primary my-3" 
              @click="generateSummary"
              :disabled="!hasCompletedMilestones"
              style="font-size: 1rem; padding: 0.5rem 1rem;">
              Generate Summary
            </button>

            <!-- Display Summary -->
            <div v-if="summaryText" class="alert alert-success mt-3" style="white-space: pre-line;">
              <h3>Generated Summary</h3>
              <p>{{ summaryText }}</p>
            </div>

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
      commitList: [],
      summaryText: '' // To store the generated summary
    };
  },
  computed: {
    hasCompletedMilestones() {
      return this.milestoneStatusList.some(milestone => milestone.status === true);
    }
  },
  methods: {
    get_file(m_id, s_id, submission_url) {
        // Retrieve the JWT token from local storage
        const authToken = localStorage.getItem('auth-token');
      
        // Set the URL of the file to download
        const url = `http://127.0.0.1:5000/api/milestone_down/${m_id}/${s_id}`;
      
        // Configure the fetch request with headers and credentials
        fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`, // Add the JWT token to the Authorization header
            'Content-Type': 'application/json'
          }
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
          }
          return response.blob();
        })
        .then(blob => {
          // Create a URL for the blob
          const url = window.URL.createObjectURL(blob);
      
          // Create a hidden anchor element
          const link = document.createElement('a');
          link.style.display = 'none';
          link.href = url;
          link.download = `${submission_url}.pdf`; // Set the filename for the downloaded file
      
          // Append the anchor to the body and trigger the download
          document.body.appendChild(link);
          link.click();
      
          // Clean up
          window.URL.revokeObjectURL(url);
          document.body.removeChild(link);
        })
        .catch(error => {
          console.error("Error downloading PDF:", error);
        });
    },
    generateSummary() {
      const authToken = localStorage.getItem('auth-token');
  
      // Prepare data for the API
      const milestones = this.milestoneStatusList.map(milestone => ({
        desc: milestone.desc,
        deadline: milestone.deadline,
        status: milestone.status
      }));
  
      const commits = this.commitList.map(commit => ({
        commit_date: commit.commit_date,
        message: commit.message
      }));
  
      // Send a POST request to the summary API
      fetch(`http://127.0.0.1:5000/api/generate_summary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ milestones, commits })
      })
        .then(response => response.json())
        .then(data => {
          if (data.summary) {
            this.summaryText = data.summary;
          } else {
            this.summaryText = 'No summary could be generated.';
          }
        })
        .catch(error => {
          console.error("Error generating summary:", error);
          this.summaryText = 'An error occurred while generating the summary.';
        });
    }
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
