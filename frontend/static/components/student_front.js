import side_bar_stdd from "./side_bar_stdd.js";

export default {
  template: `
    <div class="container-fluid" style="background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%); color: white; min-height: 100vh;">
      <div class="row">
        <!-- Sidebar -->
        <div class="col-md-3" style="max-width: 300px; overflow-x: hidden; background-color: rgba(0, 0, 0, 0.2); min-height: 100vh; padding: 20px;">
          <side_bar_stdd></side_bar_stdd>
        </div>

        <!-- Main Content -->
        <div class="col-md-9" style="padding: 40px;">
          <!-- Student Calendar Section -->
          <div class="card mb-5" style="background-color: rgba(255, 255, 255, 0.1); color: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
            <h2 style="font-size: 1.8rem; font-weight: bold;">Student Calendar</h2>
            <p style="margin-bottom: 1rem;">Use this space to track important academic deadlines and events.</p>
            <div id="calendar" style="text-align: center; padding: 20px; background-color: rgba(255, 255, 255, 0.05); border-radius: 5px;">
              <!-- Replace this placeholder with an actual calendar component if available -->
              <p style="color: #e0e0e0;">[Calendar Placeholder]</p>
            </div>
          </div>

          <!-- Project Statement and Milestones -->
          <div class="card" style="background-color: rgba(255, 255, 255, 0.1); color: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
            <h2 style="font-size: 1.8rem; font-weight: bold;">Project Statement and Milestones</h2>
            <p style="margin-bottom: 1rem;">Review your project objectives, key milestones, and deadlines here.</p>
            <ul style="list-style-type: none; padding: 0; color: #e0e0e0;">
              <li style="margin-bottom: 0.5rem;"><strong>Milestone 1:</strong> Submit Proposal - <em>Deadline: Nov 10, 2023</em></li>
              <li style="margin-bottom: 0.5rem;"><strong>Milestone 2:</strong> Design Submission - <em>Deadline: Dec 5, 2023</em></li>
              <li style="margin-bottom: 0.5rem;"><strong>Milestone 3:</strong> Final Project Submission - <em>Deadline: Jan 15, 2024</em></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,

  components: {
    side_bar_stdd,
  },
};
