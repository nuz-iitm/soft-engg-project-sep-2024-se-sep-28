import side_bar_inst from "./side_bar_inst.js";

export default {
  template: `
    <div class="container-fluid" style="background: linear-gradient(135deg, #F0E5D8 0%, #D3E9D7 100%); color: #2F4F4F; min-height: 100vh;">
      <div class="row">
        <!-- Sidebar -->
        <div class="col-md-3" style="max-width: 280px; overflow-x: hidden; background-color: rgba(0, 0, 0, 0.1); min-height: 100vh; padding: 20px;">
          <side_bar_inst></side_bar_inst>
        </div>

        <!-- Main Content -->
        <div class="col-md-9" style="padding: 40px;">
          <!-- FAQ Page Link -->
          <router-link 
            to="/instructor_faq" 
            class="btn btn-secondary mb-4" 
            style="width: 200px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3); background-color: #6A9F8A; border: none; font-weight: bold;">
            Go to FAQ
          </router-link>

          <!-- No Queries Section -->
          <div v-if="studentQuestions.length === 0" class="text-center" style="margin-top: 50px;">
            <p style="font-size: 1.2rem; color: #6A9F8A;">No student queries available at the moment.</p>
          </div>

          <!-- Queries Section -->
          <div v-else class="queries-container" style="max-height: calc(100vh - 150px); overflow-y: auto;">
            <div 
              v-for="(question, index) in studentQuestions" 
              :key="index" 
              class="card mb-4"
              style="background-color: #FFFFFF; color: #2F4F4F; padding: 20px; border-radius: 10px; box-shadow: 0 6px 12px rgba(47, 79, 79, 0.2);">
              
              <!-- Query Header -->
              <h3 class="text-center" style="font-size: 1.5rem; font-weight: bold; color: #4F4F4F;">Student ID: {{ question.s_id }}</h3>
              <p style="font-size: 1.3rem; margin-bottom: 15px; color: #6A9F8A;">Q. {{ question.desc }}</p>

              <!-- Response Form -->
              <div class="form-group">
                <label for="responseText" style="font-size: 1rem; font-weight: bold; color: #4F4F4F;">Your Response:</label>
                <textarea 
                  v-model="question.response" 
                  class="form-control" 
                  rows="3" 
                  placeholder="Enter your response here..."
                  style="background-color: #F9F9F9; color: #2F4F4F; border: 1px solid #D1D1D1; border-radius: 5px; padding: 10px;">
                </textarea>
              </div>

              <!-- Submit Button -->
              <div class="text-center mt-3">
                <button 
                  @click="submitResponse(index)" 
                  class="btn" 
                  style="background-color: #6A9F8A; color: white; font-weight: bold; padding: 10px 20px; border-radius: 5px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);">
                  Submit Response
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
      studentQuestions: [] 
    };
  },

  mounted() {
    this.fetchQueries();
  },

  methods: {
    fetchQueries() {
      const authToken = localStorage.getItem('auth-token');
      fetch('http://127.0.0.1:5000/api/instructor_query', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          const queries = data[0];
          this.studentQuestions = queries.map(query => ({
            q_id: query.q_id,
            desc: query.desc,
            s_id: query.s_id,
            i_id: query.i_id,
            qdate: query.qdate,
            response: query.response || "",
            project_id: query.project_id,
          }));
        })
        .catch(error => {
          console.error('Error fetching queries:', error);
          alert('Failed to fetch student queries.');
        });
    },

    submitResponse(index) {
      const question = this.studentQuestions[index];

      if (question.response.trim()) {
        const authToken = localStorage.getItem('auth-token');
        fetch(`http://127.0.0.1:5000/api/instructor_query/${question.q_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify({ response: question.response })
        })
          .then(response => response.json())
          .then(data => {
            console.log(data[0].message);
            alert(data[0].message);
          })
          .catch(error => {
            console.error('Error submitting response:', error);
            alert('Failed to submit response.');
          });
      } else {
        alert("Please enter a response.");
      }
    }
  },

  components: {
    side_bar_inst
  }
};
