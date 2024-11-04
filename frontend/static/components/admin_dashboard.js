import side_bar_admin from "./side_bar_admin.js"
export default {
    template: `
        <div class="container-fluid">
          <div class="row">
            <div class="col-md-3">
              <side_bar_admin></side_bar_admin>
            </div>
            <div class="col-md-9">
              <h1 class="text-center mt-5">BULK EDIT OPTION</h1>
              <div class="card">
                <form @submit.prevent="uploadCSV" enctype="multipart/form-data">
                  <input type="file" name="csvFile" accept=".csv" />
                  <button class="btn btn-primary mt-3 me-2">Upload CSV</button>
                </form>
                <hr>
                <div class="d-flex flex-column align-items-center">
                  <div class="d-flex justify-content-between mb-2">
                    <button class="btn btn-sm mr-3" style="width: 100px; background-color: #007bff; color: white;" @click="addStudents()">Add Students</button>
                    <button class="btn btn-sm ml-3" style="width: 100px; background-color: #007bff; color: white;" @click="removeStudents()">Remove Students</button>
                  </div>
                </div>
                <div v-if="uploadingCSV">
                  <p>Uploading CSV file...</p>
                  <progress :value="uploadProgress" max="100"></progress>
                </div>
              </div>
            </div>
          </div>
        </div>
        `,

    data() {
            return {
                uploadingCSV: false,
                uploadProgress: 0
            }
        },
    components:{
        side_bar_admin
    },
    methods: {
        addStudents() {
            // Add logic to add students from uploaded CSV file or other source
          },
        removeStudents() {
            // Remove logic for removing students
          },
        uploadCSV(e) {
            this.uploadingCSV = true;
            const formData = new FormData();
            formData.append('csvFile', e.target.files[0]);
            fetch('/upload-csv', {
              method: 'POST',
              body: formData
            })
            .then(response => response.json())
            .then(data => {
              console.log(data);
              this.uploadProgress = data.progress;
              if (data.complete) {
                this.uploadedCSVData = data.data;
                this.uploadingCSV = false;
              }
            })
            .catch(error => console.error(error));
          }
        },
}