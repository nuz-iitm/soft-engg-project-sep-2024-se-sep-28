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
                    <div class="card text-center" style="background-color: rgba(255, 255, 255, 0.1); color: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
                        <!-- Student Calendar Section -->
                        <h2>Student Calendar</h2>
                        <p>This is a dummy section for the student calendar. Here you can integrate your actual calendar component or list events.</p>      
                    </div>

                        <!-- Project Statement and Milestones -->
                    <div class="mt-5">
                        <div class="card text-center" style="background-color: rgba(255, 255, 255, 0.1); color: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
                            <h2>Project Statement and Milestones</h2>
                            <p>This is a dummy section to detail the project statement, milestones, and deadlines. Replace this with your actual content.</p>
                            <ul>
                                <li><strong>Milestone 1:</strong> Submit Proposal - Deadline: Nov 10, 2023</li>
                                <li><strong>Milestone 2:</strong> Design Submission - Deadline: Dec 5, 2023</li>
                                <li><strong>Milestone 3:</strong> Final Project Submission - Deadline: Jan 15, 2024</li>
                            </ul>
                        </div>
                    </div>
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