import side_bar_inst from "./side_bar_inst.js";

export default {
  template: `
    <div class="container-fluid" style="background: linear-gradient(135deg, #F0E5D8 0%, #D3E9D7 100%); color: #2F4F4F; min-height: 100vh;">
      <div class="row">
        <!-- Sidebar -->
        <div class="col-md-3" style="max-width: 300px; overflow-x: hidden; background-color: rgba(0, 0, 0, 0.1); min-height: 100vh; padding: 20px;">
          <side_bar_inst></side_bar_inst>
        </div>

        <!-- Main Content -->
        <div class="col-md-9" style="padding: 40px;">
          <div class="row justify-content-center">
            <!-- Project Statement Section -->
            <div class="col-md-10 mb-5">
              <div class="card" style="background-color: rgba(255, 255, 255, 0.95); color: #2F4F4F; padding: 30px; border-radius: 10px; box-shadow: 0 8px 16px rgba(47, 79, 79, 0.2);">
                <h2 class="text-center mb-4" style="font-size: 2.2rem; font-weight: bold;">Project Statement</h2>

                <!-- Add or Edit Statement -->
                <div v-if="!statement && !statementDisplayed" class="text-center">
                  <button @click="editStatement()" class="btn btn-primary" style="font-size: 1rem; padding: 10px 20px; border-radius: 5px;">
                    Add Statement
                  </button>
                </div>
                
                <form v-else-if="statementDisplayed">
                  <textarea v-model="statement" rows="4" class="form-control"
                    style="resize: none; background-color: #F0E5D8; border: none; color: #2F4F4F; padding: 15px; border-radius: 5px;"
                    placeholder="Enter your project statement here..."></textarea>
                  <div class="d-flex justify-content-end mt-3">
                    <button @click="submitStatement()" class="btn btn-success mr-2" style="padding: 10px 20px; border-radius: 5px;">
                      Submit
                    </button>
                    <button @click="cancelStatementEdit()" class="btn btn-secondary" style="padding: 10px 20px; border-radius: 5px;">
                      Cancel
                    </button>
                  </div>
                </form>

                <p v-else-if="statement" class="mt-4 text-center" style="font-size: 1.2rem; color: #4F4F4F;">{{ statement }}</p>
                
                <div v-if="statement" class="text-center">
                  <button @click="editStatement()" class="btn btn-primary mt-3" style="padding: 10px 20px; border-radius: 5px;">
                    Edit Statement
                  </button>
                </div>
              </div>
            </div>

            <!-- Milestones Section -->
            <div class="col-md-10 mb-5">
              <div class="card" style="background-color: rgba(255, 255, 255, 0.95); color: #2F4F4F; padding: 30px; border-radius: 10px; box-shadow: 0 8px 16px rgba(47, 79, 79, 0.2);">
                <h2 class="text-center mb-4" style="font-size: 2.2rem; font-weight: bold;">Milestones</h2>

                <!-- Add Milestone Form -->
                <form @submit.prevent="addMilestone()" class="mb-4">
                  <div class="row">
                    <div class="col-md-8 mb-3">
                      <input type="text" v-model="newMilestone.desc" class="form-control"
                        style="background-color: #F0E5D8; border: none; color: #2F4F4F; padding: 10px; border-radius: 5px;"
                        placeholder="Enter milestone description...">
                    </div>
                    <div class="col-md-4 mb-3">
                      <input type="date" v-model="newMilestone.deadline" class="form-control"
                        style="background-color: rgba(211, 233, 215, 0.9); color: #2F4F4F; border: none; padding: 10px; border-radius: 5px;">
                    </div>
                  </div>
                  <div class="text-center">
                    <button type="submit" class="btn btn-success" style="padding: 10px 20px; border-radius: 5px;">
                      + Add Milestone
                    </button>
                  </div>
                </form>

                <!-- Milestones List -->
                <div v-for="(milestone, index) in milestones" :key="index" class="mb-3">
                  <div class="row align-items-center">
                    <div class="col-md-8 mb-2">
                      <span v-if="!milestone.editMode">{{ milestone.desc }}</span>
                      <input v-else v-model="milestone.desc" class="form-control"
                        style="background-color: #F0E5D8; border: none; color: #2F4F4F; padding: 10px; border-radius: 5px;">
                    </div>
                    <div class="col-md-3 mb-2">
                      <span v-if="!milestone.editMode">{{ milestone.deadline }}</span>
                      <input v-else v-model="milestone.deadline" class="form-control"
                        style="background-color: rgba(211, 233, 215, 0.9); color: #2F4F4F; border: none; padding: 10px; border-radius: 5px;">
                    </div>
                    <div class="col-md-1">
                      <button v-if="!milestone.editMode" @click="editMilestone(index)" class="btn btn-primary btn-sm">
                        Edit
                      </button>
                      <div v-else>
                        <button @click="saveEditedMilestone(index, milestone.m_id)" class="btn btn-success btn-sm mr-1">
                          Save
                        </button>
                        <button @click="cancelEdit(milestone)" class="btn btn-secondary btn-sm">
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,

  data() {
    return {
      statement: "",
      statementDisplayed: false,
      milestones: [
        { m_id: null, desc: "Initial milestone", deadline: "2024-11-15", editMode: false },
      ],
      newMilestone: { desc: "", deadline: "" },
    };
  },
  mounted() {
    const authToken = localStorage.getItem('auth-token');
    fetch('http://127.0.0.1:5000/api/project_statement', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
    })
      .then(response => response.json())
      .then(data => {
        this.statement = data[0].statement;
    });
    fetch('http://127.0.0.1:5000/api/milestone', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
    })
      .then(response => response.json())
      .then(data => this.milestones = data.map(milestone => ({ ...milestone, editMode: false })));
  },

  methods: {
    editStatement() {
      this.statementDisplayed = true;
    },
    submitStatement() {
      if (this.statement.trim()) {
        const authToken = localStorage.getItem('auth-token');
        fetch('http://127.0.0.1:5000/api/project_statement', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify({ statement: this.statement })
        })
        .then(response => response.json())
        .then(data => {
          console.log(data[0].message);
          alert(data[0].message);
          console.log("Submitted Statement:", this.statement);
          this.statementDisplayed = false;  // Hide the form after submission
        })
        .catch(error => {
          console.error('Error adding statement:', error);
          alert('Failed to add statement');
        });
      }
    },
    cancelStatementEdit() {
      this.statementDisplayed = false;
    },
    addMilestone() {
      if (this.newMilestone.desc.trim() !== '' && this.newMilestone.deadline) {
        const authToken = localStorage.getItem('auth-token');
        fetch('http://127.0.0.1:5000/api/milestone', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify(this.newMilestone)
        })
        .then(response => response.json())
        .then(data => {
          console.log(data[0].message);
          alert(data[0].message);
          this.milestones.push({ ...this.newMilestone, editMode: false });
          this.newMilestone = { desc: "", deadline: "" };
        })
        .catch(error => {
          console.error('Error adding milestone:', error);
          alert('Failed to add milestone');
        });
      } else {
        alert('Please fill in all fields.');
      }
    },
    editMilestone(index) {
      this.milestones[index].editMode = true;
    },
    saveEditedMilestone(index,m_id) {
      const authToken = localStorage.getItem('auth-token');
      fetch(`http://127.0.0.1:5000/api/milestone/${m_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(this.milestones[index])
      })
      .then(response => response.json())
      .then(data => {
        console.log(data[0].message);
        alert(data[0].message);
        this.milestones[index].editMode = false;
      })
      .catch(error => {
        console.error('Error updating milestone:', error);
        alert('Failed to update milestone');
      });
    },
    cancelEdit(milestone) {
      milestone.editMode = false;
    },
  },

  components: {
    side_bar_inst,
  },
};
