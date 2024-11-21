import side_bar_stdd from "./side_bar_stdd.js";

export default {
  template: `
    <div class="container-fluid" style="background: linear-gradient(135deg, #F0E5D8 0%, #D3E9D7 100%); color: #2F4F4F; min-height: 100vh;">
        <div class="row" style="display: flex;">
            <!-- Sidebar -->
            <div class="col-md-3" style="max-width: 300px; overflow-x: hidden; background-color: rgba(0, 0, 0, 0.1); min-height: 100vh; padding: 20px;">
                <side_bar_stdd></side_bar_stdd>
            </div>
            <div class="col-md-9" style="padding: 40px;">
                <!-- Display FAQs List -->
                <div class="overflow-y-auto" style="max-height: 70vh;">
                    <div v-for="(faq, index) in faqs" :key="index" class="mb-4 card" style="background-color: rgba(255, 255, 255, 0.9); padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(47, 79, 79, 0.2);">
                        <div class="d-flex justify-content-between align-items-center">
                            <h3 class="m-0" style="font-size: 1.5rem; font-weight: bold;">{{ faq.question }}</h3>
                        </div>
                        <p class="mt-3" style="font-size: 1.1rem; color: #2F4F4F;">
                            {{ faq.answer || "No answer provided yet." }}
                        </p>
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
  
  components: {
    side_bar_stdd
  }
};
