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
              <div class="card" style="background-color: rgba(255, 255, 255, 0.9); color: #2F4F4F; padding: 20px; border-radius: 10px; box-shadow: 0 6px 12px rgba(47, 79, 79, 0.2);">
                <h2 class="text-center" style="font-size: 2.2rem; font-weight: bold; margin-bottom: 20px;">Project Statement</h2>
                
                <!-- Editable textarea or Submit button based on statement content -->
                <div v-if="!statement && !statementDisplayed">
                  <button @click="editStatement()" class="btn btn-primary" style="font-size: 1rem; padding: 5px 10px;">
                    Add Statement
                  </button>
                </div>
                
                <!-- Form for editing or submitting the statement -->
                <form v-else-if="statementDisplayed">
                  <textarea v-model="statement" rows="4" class="form-control" 
                    style="resize: none; background-color: #F0E5D8; border: none; color: #2F4F4F; padding: 15px; border-radius: 5px;"
                    placeholder="Enter your project statement here..."></textarea>
                  <div class="d-flex justify-content-end mt-3">
                    <button @click="submitStatement()" class="btn btn-success mr-2" style="font-size: 0.8rem; padding: 3px 6px;">
                      Submit
                    </button>
                    <button @click="cancelEdit()" class="btn btn-secondary" style="font-size: 0.8rem; padding: 3px 6px;">
                      Cancel
                    </button>
                  </div>
                </form>

                <!-- Displayed statement -->
                <p v-else-if="statement" class="mt-4 text-center" style="font-size: 1.2rem; color: #4F4F4F;">{{ statement }}</p>
                
                <!-- Edit button if there is a statement -->
                <div v-if="statement">
                  <button @click="editStatement()" class="btn btn-primary mt-3" style="font-size: 0.8rem; padding: 3px 6px;">
                    Edit Statement
                  </button>
                </div>
              </div>
            </div>

            <!-- Milestones Section -->
            <div class="col-md-10 mb-5">
              <div class="card" style="background-color: rgba(255, 255, 255, 0.9); color: #2F4F4F; padding: 20px; border-radius: 10px; box-shadow: 0 6px 12px rgba(47, 79, 79, 0.2);">
                <h2 class="text-center" style="font-size: 2.2rem; font-weight: bold; margin-bottom: 20px;">Milestones</h2>
                <!-- Form for adding a new milestone -->
                <form @submit.prevent="addMilestone()">
                  <div class="row align-items-center mb-3">
                    <div class="col-md-8 mb-2">
                      <input type="text" v-model="newMilestone.desc" class="form-control"
                        style="background-color: #F0E5D8; border: none; color: #2F4F4F; padding: 10px; border-radius: 5px;"
                        placeholder="Enter milestone description...">
                    </div>
                    <div class="col-md-3 mb-2">
                      <input type="date" v-model="newMilestone.deadline" class="form-control"
                        style="background-color: rgba(211, 233, 215, 0.9); color: #2F4F4F; border: none; padding: 10px; border-radius: 5px;">
                    </div>
                  </div>
                  <button type="submit" class="btn mt-3" 
                    style="background-color: #4CAF50; color: white; font-weight: bold; padding: 10px 20px; border-radius: 5px;">
                    + Add Milestone
                  </button>
                </form>

                <!-- List of milestones -->
                <div v-for="(milestone, index) in milestones" :key="index" class="row align-items-center mb-3">
                  <div class="col-md-8 mb-2">
                    <span v-if="!milestone.editMode">{{ milestone.desc }}</span>
                    <input type="text" v-else v-model="milestone.desc" class="form-control"
                      style="background-color: #F0E5D8; border: none; color: #2F4F4F; padding: 10px; border-radius: 5px;">
                  </div>
                  <div class="col-md-3 mb-2">
                    <span v-if="!milestone.editMode">{{ milestone.deadline }}</span>
                    <input type="date" v-else v-model="milestone.deadline" class="form-control"
                      style="background-color: rgba(211, 233, 215, 0.9); color: #2F4F4F; border: none; padding: 10px; border-radius: 5px;">
                  </div>
                  <div class="col-md-1 mb-2">
                    <button v-if="!milestone.editMode" @click="editMilestone(index)" class="btn btn-primary" style="font-size: 0.8rem; padding: 3px 6px;">
                      Edit
                    </button>
                    <div v-else>
                      <button @click="saveEditedMilestone(index,milestone.m_id)" class="btn btn-success mr-2" style="font-size: 0.8rem; padding: 3px 6px;">
                        Save
                      </button>
                      <button @click="cancelEdit(milestone)" class="btn btn-secondary" style="font-size: 0.8rem; padding: 3px 6px;">
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
  `,

  data() {
    return {
      statement: "",
      statementDisplayed: false,
      milestones: [
        { m_id: null, desc: "Something Something?", deadline: "", editMode: false },
      ],
      newMilestone: { desc: "", deadline: "" }
    };
  },

  components: {
    side_bar_inst
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
    displayStatement() {
      this.statementDisplayed = !this.statementDisplayed;
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
          this.milestones.push({ ...this.newMilestone, m_id: data[0].m_id });
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
    
    editStatement() {
      this.statementDisplayed = true;
    },
    
    submitStatement() {
      if (this.statement.trim() !== '') {
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
    
    cancelEdit() {
      this.newMilestone = { desc: "", deadline: "" };
      this.statementDisplayed = false;
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
      this.newMilestone = { desc: "", deadline: "" };
    }
  }
};