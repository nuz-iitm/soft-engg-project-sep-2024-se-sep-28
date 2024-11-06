import side_bar_stdd from "./side_bar_stdd.js"
export default {
    template: `
        <div class="container-fluid" style="background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%); color: white; min-height: 100vh;">
            <div class="row" style="display: flex;">
                <!-- Sidebar -->
                <div class="col-md-3" style="max-width: 300px; overflow-x: hidden; background-color: rgba(0, 0, 0, 0.2); min-height: 100vh; padding: 20px;">
                    <side_bar_stdd></side_bar_stdd>
                </div>

                <!-- Main Content -->
                <div class="col-md-9 text-center" style="padding: 40px;">
                    <!-- FAQ Section -->
                    <div class="card text-center" style="background-color: rgba(255, 255, 255, 0.1); color: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
                        <h2>FAQ</h2>
                        <p><a href="/faq" class="btn btn-primary btn-sm">Go to FAQ</a></p>
                    </div>

                    <!-- Scrollable List of Previously Asked Questions -->
                    <div class="card text-center mt-4" style="background-color: rgba(255, 255, 255, 0.1); color: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
                        <h3>Previously Asked Questions</h3>
                        <div style="max-height: 400px; overflow-y: auto;">
                            <ul>
                                <li><strong>Question 1:</strong> Answer 1</li>
                                <li><strong>Question 2:</strong> Answer 2</li>
                                <li><strong>Question 3:</strong> Answer 3</li>
                                <li><strong>Question 4:</strong> Answer 4</li>
                                <li><strong>Question 5:</strong> Answer 5</li>
                                <!-- Add more questions here -->
                            </ul>
                        </div>
                    </div>

                    <!-- Link to Ask a New Question -->
                    <p class="mt-3"><a href="/ask-a-question" class="btn btn-primary btn-sm">Ask a New Question</a></p>
                </div>
            </div>
        </div>
        `,

    data() {
            return {

            }
        },
    components:{
        side_bar_stdd
    },
    methods: {

        },
}