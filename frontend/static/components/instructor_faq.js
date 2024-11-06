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
            <!-- Add New FAQ Form -->
            <form @submit.prevent="addFaq" class="mb-4 card text-center" style="background-color: rgba(255, 255, 255, 0.1); color: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
                <h3 class="mt-3" style="font-size: 1.5rem; font-weight: bold;">Add New FAQ</h3>
                <div class="form-group">
                    <label for="newQuestion">Question:</label>
                    <input type="text" id="newQuestion" v-model="newFaq.question" class="form-control" placeholder="Enter your question here..." required>
                </div>
                <div class="form-group">
                    <label for="newAnswer">Answer:</label>
                    <textarea id="newAnswer" v-model="newFaq.answer" class="form-control" rows="3" placeholder="Provide the answer here..." required></textarea>
                </div>
                <button type="submit" class="btn btn-success small-btn" style="width: 150px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);">Add FAQ</button>
            </form>

            <!-- Display FAQs List -->
            <div class="overflow-y-auto" style="max-height: 70vh;">
                <div v-for="(faq, index) in faqs" :key="index" class="mb-4 card text-center" style="background-color: rgba(255, 255, 255, 0.1); color: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
                    <h3 class="mt-3" style="font-size: 1.5rem; font-weight: bold;">{{ faq.question }}</h3>
                    <p style="font-size: 1.2rem;">{{ faq.answer || "No answer provided yet." }}</p>
                    <div style="position: absolute; top: 10px; left: 10px;">
                        <button @click="editFaq(index)" class="btn btn-warning small-btn" style="box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);">Edit</button>
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
        { question: "Something Something?", answer: "" },
        { question: "How is this even possible to do?", answer: "I don't know" }
      ],
      newFaq: { question: "", answer: "" }
    };
  },

  methods: {
    addFaq() {
      if (this.newFaq.question && this.newFaq.answer) {
        this.faqs.push({ ...this.newFaq });
        this.newFaq = { question: "", answer: "" };
      } else {
        alert("Please fill in both the question and the answer.");
      }
    },
    
    editFaq(index) {
      // You can implement the edit functionality here
      console.log("Edit FAQ at index:", index);
      // For now, just log the index to demonstrate editing
    }
  },
  
  components: {
    side_bar_inst
  }
};
