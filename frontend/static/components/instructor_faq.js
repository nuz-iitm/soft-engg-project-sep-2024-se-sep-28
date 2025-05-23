import side_bar_inst from "./side_bar_inst.js";

export default {
  template: `
    <div class="container-fluid" style="background: linear-gradient(135deg, #F0E5D8 0%, #D3E9D7 100%); color: #2F4F4F; min-height: 100vh;">
        <div class="row" style="display: flex;">
            <!-- Sidebar -->
            <div class="col-md-3" style="max-width: 300px; overflow-x: hidden; background-color: rgba(0, 0, 0, 0.1); min-height: 100vh; padding: 20px;">
                <side_bar_inst></side_bar_inst>
            </div>

            <!-- Main Content -->
            <div class="col-md-9" style="padding: 40px;">
                <!-- Add New FAQ Form -->
                <form @submit.prevent="addFaq" class="mb-4 card" style="background-color: rgba(255, 255, 255, 0.9); padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(47, 79, 79, 0.2);">
                    <h3 class="text-center mb-4" style="font-size: 1.8rem; font-weight: bold;">Add New FAQ</h3>
                    <div class="form-group">
                        <label for="newQuestion" style="font-size: 1.1rem;">Question:</label>
                        <input type="text" id="newQuestion" v-model="newFaq.question" class="form-control mb-3" placeholder="Enter your question here..." required>
                    </div>
                    <div class="form-group">
                        <label for="newAnswer" style="font-size: 1.1rem;">Answer:</label>
                        <textarea id="newAnswer" v-model="newFaq.answer" class="form-control mb-3" rows="3" placeholder="Provide the answer here..." required></textarea>
                    </div>
                    <button type="submit" class="btn btn-lg" style="background-color: #6A9F8A; color: white; width: 100%; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);">Add FAQ</button>
                </form>

                <!-- Display FAQs List -->
                <div class="overflow-y-auto" style="max-height: 70vh;">
                    <div v-for="(faq, index) in faqs" :key="index" class="mb-4 card" style="background-color: rgba(255, 255, 255, 0.9); padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(47, 79, 79, 0.2);">
                        <div class="d-flex justify-content-between align-items-center">
                            <h3 class="m-0" style="font-size: 1.5rem; font-weight: bold;">{{ faq.question }}</h3>
                            <div v-if="!faq.editMode" class="d-flex align-items-center">
                                <button @click="editFaq(index)" class="btn btn-sm mx-2" style="background-color: #007BFF; color: white; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);">Edit</button>
                                <button @click="deleteFaq(faq.f_id)" class="btn btn-sm" style="background-color: #DC3545; color: white; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);">Delete</button>
                            </div>
                        </div>
                        <p v-if="!faq.editMode" class="mt-3" style="font-size: 1.1rem; color: #2F4F4F;">
                            {{ faq.answer || "No answer provided yet." }}
                        </p>
                        <div v-else class="mt-3">
                            <input type="text" v-model="faq.question" class="form-control mb-2" placeholder="Edit question here..." required>
                            <textarea v-model="faq.answer" class="form-control mb-3" rows="3" placeholder="Edit answer here..." required></textarea>
                            <button @click="updateFaq(faq.f_id, faq.question, faq.answer)" class="btn btn-sm btn-block" style="background-color: #6A9F8A; color: white; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);">Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  `,

  data() {
    return {
      faqs: [
        { f_id: null, question: "Something Something?", answer: "", editMode: false },
        { f_id: null, question: "How is this even possible to do?", answer: "I don't know", editMode: false }
      ],
      newFaq: { question: "", answer: "" }
    };
  },

  mounted() {
    const authToken = localStorage.getItem('auth-token');
    fetch('http://127.0.0.1:5000/api/faq', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
    })
      .then(response => response.json())
      .then(data => this.faqs = data.map(faq => ({ ...faq, editMode: false })));
  },

  methods: {
    addFaq() {
      const authToken = localStorage.getItem('auth-token');
      if (this.newFaq.question && this.newFaq.answer) {
        fetch('http://127.0.0.1:5000/api/faq', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify(this.newFaq)
        })
        .then(response => response.json())
        .then(data => {
          alert(data.message);
          this.newFaq = { question: "", answer: "" };
          this.faqs.push({ ...data.faq, editMode: false });
        });
      } else {
        alert("Please fill in both the question and the answer.");
      }
    },

    editFaq(index) {
      this.$set(this.faqs[index], 'editMode', true);
    },

    updateFaq(f_id, question, answer) {
      const authToken = localStorage.getItem('auth-token');
      fetch(`http://127.0.0.1:5000/api/faq/${f_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ question, answer })
      })
      .then(response => response.json())
      .then(data => {
        alert(data.message);
        this.$set(this.faqs.find(faq => faq.f_id === f_id), 'editMode', false);
      })
      .catch(error => {
        console.error('Error updating FAQ:', error);
        alert('Failed to update FAQ');
      });
    },

    deleteFaq(f_id) {
      const authToken = localStorage.getItem('auth-token');
      fetch(`http://127.0.0.1:5000/api/faq/${f_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      })
      .then(response => response.json())
      .then(data => {
        alert(data.message);
        this.faqs = this.faqs.filter(faq => faq.f_id !== f_id);
      })
      .catch(error => {
        console.error('Error deleting FAQ:', error);
        alert('Failed to delete FAQ');
      });
    }
  },
  
  components: {
    side_bar_inst
  }
};
