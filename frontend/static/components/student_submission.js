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
          <div class="card text-center mb-5" style="background-color: rgba(255, 255, 255, 0.9); color: #2F4F4F; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(47, 79, 79, 0.2);">
            <h2 style="font-size: 1.8rem; font-weight: bold;">Milestone 1 Submission</h2>
            
            <!-- Deadline -->
            <div class="mb-3">
              <span style="font-size: 1.5rem; font-weight: bold; display: block;">Deadline:</span>
              <span style="display: block; color: #696969;">{{ deadline }}</span>
            </div>

            <!-- File Upload -->
            <div class="mb-3">
              <input type="file" @change="handleFileChange" class="form-control-file" style="max-width: 400px; margin: 0 auto;" />
              <button @click="uploadFile" class="btn mt-4" style="background-color: #D3E9D7; color: #2F4F4F; border-radius: 5px; padding: 0.5rem 1rem;">Upload File</button>
            </div>

            <!-- Confirmation Message -->
            <div v-if="fileUploaded" style="color: green; margin-top: 1rem;">
              File uploaded successfully!
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  
  data() {
    return {
      deadline: '2023-12-31', // dummy deadline
      fileUploaded: false,
    };
  },
  
  methods: {
    handleFileChange(event) {
      this.file = event.target.files[0];
    },

    uploadFile() {
      if (this.file) {
        // dummy code
        console.log('Uploading:', this.file);
        this.fileUploaded = true;
      } else {
        alert('Please select a file first.');
      }
    },
  },

  components: {
    side_bar_stdd,
  },
};