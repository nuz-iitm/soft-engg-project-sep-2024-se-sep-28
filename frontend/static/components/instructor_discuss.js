import side_bar_inst from "./side_bar_inst.js";

export default {
  template: `
    <div class="container-fluid" style="background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%); color: white; min-height: 100vh;">
      <div class="row" style="display: flex;">
        <!-- Sidebar -->
        <div class="col-md-3" style="max-width: 300px; overflow-x: hidden; background-color: rgba(0, 0, 0, 0.2); min-height: 100vh; padding: 20px;">
          <side_bar_inst></side_bar_inst>
        </div>

        <!-- Main Content -->
        <div class="col-md-9" style="padding: 40px;">
          <!-- Link to FAQ Page -->
          <router-link to="/instructor_faq" class="btn btn-secondary mb-3">Go to FAQ</router-link>

          <!-- Scrollable List of Student Questions -->
          <div class="overflow-y-auto max-h-screen h-full">
            <div v-for="(question, index) in studentQuestions" :key="index" class="mb-4 card text-center" style="background-color: rgba(255, 255, 255, 0.1); color: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
              <h3 class="mt-3" style="font-size: 1.5rem; font-weight: bold;">{{ question.studentName }}</h3>
              <p>{{ question.questionText }}</p>
              <div class="form-group">
                <label for="responseText">Your Response:</label>
                <textarea id="responseText" v-model="question.responseText" class="form-control" rows="2"></textarea>
              </div>
              <button @click="submitResponse(index)" class="btn btn-primary" style="width: 200px;">Submit Response</button>
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
          questionText: "what do 100 push ups? I can do 200", 
          responseText: ""
        },
        { 
          studentName: "Student B", 
          questionText: "Do a marathon? what? Whaaaattt?", 
          responseText: ""
        }
      ]
    };
  },

  methods: {
    goToFaqPage() {
      // Navigate to the FAQ page (this example assumes you have a route for the FAQ page)
      this.$router.push('/faq');
    },
    
    submitResponse(index) {
      const question = this.studentQuestions[index];
      if (question.responseText.trim()) {
        alert(`Your response to ${question.studentName}: \n${question.responseText}`);
        // You can implement further logic here, like sending the response to a server
        question.responseText = ""; // Clear the input field after submission
      } else {
        alert("Please enter a response.");
      }
    }
  },
  
  components: {
    side_bar_inst
  }
};