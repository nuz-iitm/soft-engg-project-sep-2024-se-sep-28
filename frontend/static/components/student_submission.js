import side_bar_stdd from "./side_bar_stdd.js";

export default {
  template: `
    <div class="container-fluid" style="background: linear-gradient(135deg, #F0E5D8 0%, #D3E9D7 100%); color: #2F4F4F; min-height: 100vh;">
      <div class="row">
        <!-- Sidebar -->
        <div class="col-md-3" style="max-width: 300px; overflow-x: hidden; background-color: rgba(0, 0, 0, 0.1); min-height: 100vh; padding: 20px;">
          <side_bar_stdd></side_bar_stdd>
        </div>

        <!-- Main Content -->
        <div class="col-md-9" style="padding: 40px;">
          <!-- Milestone Submission Section -->
          <div v-for="(milestone, index) in milestones" :key="index" class="card text-center mb-5" style="background-color: rgba(255, 255, 255, 0.9); color: #2F4F4F; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(47, 79, 79, 0.2);">
            <h2 style="font-size: 1.8rem; font-weight: bold;">Milestone {{ milestone.m_id }}</h2>
            
            <!-- Description -->
            <div class="mb-3">
              <span style="font-size: 1.5rem; font-weight: bold; display: block;">Description:</span>
              <span style="display: block; color: #696969;">{{ milestone.desc }}</span>
            </div>

            <!-- Deadline -->
            <div class="mb-3">
              <span style="font-size: 1.5rem; font-weight: bold; display: block;">Deadline:</span>
              <span style="display: block; color: #696969;">{{ milestone.deadline }}</span>
            </div>

            <!-- File Upload -->
            <div class="mb-3">
              <form @submit.prevent="uploadPDF(index)" v-if="!milestone.status">
                <input type="file" ref="pdfInput" accept=".pdf" class="form-control-file" style="max-width: 400px; margin: 0 auto;" />
                <button type="submit" class="btn mt-4" style="background-color: #D3E9D7; color: #2F4F4F; border-radius: 5px; padding: 0.5rem 1rem;">Upload PDF</button>
              </form>
              <span v-if="milestone.status" style="color: green; margin-top: 1rem;">
                File already submitted.
              </span>
            </div>

            <!-- Confirmation Message -->
            <div v-if="fileUploaded[index]" style="color: green; margin-top: 1rem;">
              File uploaded successfully!
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  
  data() {
    return {
      milestones: [
        { m_id: null, desc: "Something Something?", deadline: "", status: null},
      ],
      fileUploaded: [],
      submission_date: '',
    };
  },
  mounted() {
    const authToken = localStorage.getItem('auth-token');
    fetch('http://127.0.0.1:5000/api/milestone_student', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    })
    .then(response => response.json())
    .then(data => this.milestones = data.map(milestone => ({
        ...milestone
    })));
  },
  
  methods: {
    uploadPDF(index) {
      const formData = new FormData();
      const authToken = localStorage.getItem('auth-token');
    
      if (!this.$refs.pdfInput[index] || this.$refs.pdfInput[index].files.length === 0) {
        alert('Please select a PDF file');
        return;
      }
    
      formData.append('pdfFile', this.$refs.pdfInput[index].files[0]);
    
      fetch(`http://127.0.0.1:5000/api/milestone_sub/${this.milestones[index].m_id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        body: formData
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          this.fileUploaded[index] = true;
          this.milestones[index].submitted = true; // Update the submitted status
          this.milestones[index].submission_date = new Date().toISOString(); // Set submission date
        })
        .catch(error => console.error(error));
    },
  },

  components: {
    side_bar_stdd,
  },
};