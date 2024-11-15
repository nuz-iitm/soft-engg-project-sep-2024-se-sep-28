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
            <router-link to="/student_faq" class="btn" style="background-color: #D3E9D7; color: #2F4F4F; border-radius: 5px; padding: 0.5rem 1rem;">Go to FAQ</router-link>
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
                  <strong>{{ question.desc }}</strong><br>
                  {{ question.response }}
                </li>
                <li v-if="filteredQuestions.length === 0" style="color: #ffdddd; margin-top: 1rem;">
                  No matching questions found.
                </li>
              </ul>
            </div>
          </div>

          <!-- Section for Asking a New Question -->
          <div class="card text-center mb-5" style="background-color: rgba(255, 255, 255, 0.9); color: #2F4F4F; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(47, 79, 79, 0.2);">
            <div class="d-flex align-items-center justify-content-between">
              <h4 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">Ask a New Question</h4>
              <button @click="showModal = true" class="btn btn-primary btn-sm" style="font-size: 0.875rem;">Ask a New Question</button>
            </div>

            <!-- Modal for Asking a New Question -->
            <div v-if="showModal" class="modal-overlay">
              <div class="modal-content">
                <input type="text" v-model="newQuestion.desc" placeholder="Enter your question..." class="form-control mb-2" style="border-radius: 5px; padding: 0.6rem;" />
                <button @click="submitQuestion" class="btn btn-success btn-sm mr-2" style="font-size: 0.875rem;">Submit</button>
                <button @click="showModal = false" class="btn btn-danger btn-sm" style="font-size: 0.875rem;">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  
  data() {
    return {
      searchQuery: '',
      questions: [
        {q_id:null, desc: 'Question 1', response: 'Answer 1', s_id: null, i_id: null, q_date:"" },
      ],
      newQuestion: {
        desc: '',
        response: ''
      },
      showModal: false
    };
  },
  
  computed: {
    filteredQuestions() {
      return this.questions.filter(q =>
        q.desc.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  mounted() {
    const authToken = localStorage.getItem('auth-token');
    fetch('http://127.0.0.1:5000/api/student_query', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
    })
      .then(response => response.json())
      .then(data => this.questions = data.map(question => ({ ...question, editMode: false })));
  },
  methods: {
    submitQuestion() {
      if (this.newQuestion.desc.trim() !== '') {
        const authToken = localStorage.getItem('auth-token');
        fetch('http://127.0.0.1:5000/api/student_query', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify(this.newQuestion)
        })
        .then(response => response.json())
        .then(data => {
          console.log(data[0].message);
          alert(data[0].message);
          // Add the new question to the local state
          this.questions.push({ question: this.newQuestion.desc, response: '' });
          this.newQuestion.desc= '';
          this.showModal = false;
        })
        .catch(error => {
          console.error('Error adding question:', error);
          alert('Failed to add question');
        });
        
      }
    }
  },

  components: {
    side_bar_stdd,
  },
};
