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
        <div class="col-md-9" style="padding: 40px; width: 100%; height: 100%;">
          <!-- FAQ Page Link -->
          <router-link to="/instructor_faq" class="btn btn-secondary mb-4" 
            style="width: 200px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);">
            Go to FAQ
          </router-link>

          <!-- Scrollable Student Questions Section -->
          <div style="max-height: calc(100vh - 150px); overflow-y: auto;">
            <div v-for="(question, index) in studentQuestions" :key="index" class="mb-4 card text-center" 
                 style="background-color: rgba(255, 255, 255, 0.1); color: #2F4F4F; padding: 20px; border-radius: 10px; box-shadow: 0 6px 12px rgba(47, 79, 79, 0.2);">
              
              <h3 class="mt-3" style="font-size: 1.5rem; font-weight: bold;">{{ question.studentName }}</h3>
              <p style="font-size: 1.1rem; margin-bottom: 15px;">{{ question.questionText }}</p>
              
              <div class="form-group" style="text-align: left;">
                <label for="responseText" style="font-size: 1rem;">Your Response:</label>
                <textarea v-model="question.responseText" class="form-control" rows="2" 
                  placeholder="Enter your response here..."
                  style="background-color: #F5F5F5; color: #2F4F4F; border: 1px solid #d1d1d1; border-radius: 5px; padding: 10px;">
                </textarea>
              </div>

              <button @click="submitResponse(index)" class="btn btn-primary mt-3" 
                style="width: 200px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3); background-color: #6A9F8A; border: none;">
                Submit Response
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,

  data() {
    return {
      studentQuestions: [
        { 
          studentName: "Student A", 
          questionText: "What about doing 100 push-ups daily?", 
          responseText: ""
        },
        { 
          studentName: "Student B", 
          questionText: "Is it feasible to train for a marathon?", 
          responseText: ""
        }
      ]
    };
  },

  methods: {
    submitResponse(index) {
      const question = this.studentQuestions[index];
      if (question.responseText.trim()) {
        alert(`Your response to ${question.studentName}: \n${question.responseText}`);
        question.responseText = ""; // Clear the response after submission
      } else {
        alert("Please enter a response.");
      }
    }
  },

  components: {
    side_bar_inst
  }
};
