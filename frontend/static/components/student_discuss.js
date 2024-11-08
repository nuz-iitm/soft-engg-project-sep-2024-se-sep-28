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
          <!-- FAQ Section -->
          <div class="card text-center mb-5" style="background-color: rgba(255, 255, 255, 0.9); color: #2F4F4F; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(47, 79, 79, 0.2);">
            <h2 style="font-size: 1.8rem; font-weight: bold;">FAQ</h2>
            <p>Find answers to commonly asked questions or ask a new one.</p>
            <a href="/faq" class="btn" style="background-color: #D3E9D7; color: #2F4F4F; border-radius: 5px; padding: 0.5rem 1rem;">Go to FAQ</a>
          </div>

          <!-- Search and Previously Asked Questions -->
          <div class="card text-center" style="background-color: rgba(255, 255, 255, 0.9); color: #2F4F4F; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(47, 79, 79, 0.2);">
            <h3 style="font-size: 1.5rem; font-weight: bold;">Previously Asked Questions</h3>
            
            <!-- Search Bar for Questions -->
            <div class="my-3">
              <input type="text" v-model="searchQuery" placeholder="Search questions..." class="form-control" style="max-width: 400px; margin: 0 auto; border-radius: 5px; padding: 0.6rem;" />
            </div>

            <!-- Scrollable List of Questions -->
            <div style="max-height: 400px; overflow-y: auto;">
              <ul style="list-style: none; padding: 0; color: #2F4F4F;">
                <li v-for="(question, index) in filteredQuestions" :key="index" style="margin-bottom: 0.8rem;">
                  <strong>{{ question.question }}</strong>: {{ question.answer }}
                </li>
                <li v-if="filteredQuestions.length === 0" style="color: #ffdddd; margin-top: 1rem;">
                  No matching questions found.
                </li>
              </ul>
            </div>
          </div>

          <!-- Link to Ask a New Question -->
          <div class="text-center mt-4">
            <a href="/ask-a-question" class="btn" style="background-color: #D3E9D7; color: #2F4F4F; border-radius: 5px; padding: 0.5rem 1rem;">Ask a New Question</a>
          </div>
        </div>
      </div>
    </div>
  `,
  
  data() {
    return {
      searchQuery: '',
      questions: [
        { question: 'Question 1', answer: 'Answer 1' },
        { question: 'Question 2', answer: 'Answer 2' },
        { question: 'Question 3', answer: 'Answer 3' },
        { question: 'Question 4', answer: 'Answer 4' },
        { question: 'Question 5', answer: 'Answer 5' },
      ],
    };
  },
  
  computed: {
    filteredQuestions() {
      return this.questions.filter(q => 
        q.question.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },

  components: {
    side_bar_stdd,
  },
};
