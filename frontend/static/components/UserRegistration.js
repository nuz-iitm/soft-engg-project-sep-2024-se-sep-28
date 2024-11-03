export default {
  template: `
  
    <div>
    <p><router-link to="/"><i style="font-size:2.5rem" class="bi bi-arrow-left-short"></i></router-link></p>
    <h1 style="text-align:center">Registration</h1>
      <div class='d-flex justify-content-center' style="margin-top: 10vh">
        <div class="mb-3 p-5 bg-light">
          <form @submit.prevent='checkForm'>
            <p v-if="errors.length">
              <b>Please correct the following error(s):</b>
              <ul>
                <li v-for="error in errors" :key="error">{{ error }}</li>
              </ul>
            </p>
            
            <label for="user-email" class="form-label">Email address</label>
            <input type="email" class="form-control" id="user-email" placeholder="name@example.com" v-model="cred.email" required>

            <label for="user-password" class="form-label">Password</label>
            <input type="password" class="form-control" id="user-password" v-model="cred.password" required>

            <label for="confirm-password" class="form-label">Confirm Password</label>
            <input type="password" class="form-control" id="user-password" v-model="cred.password_confirm" required>

            <label class="form-label mt-3">Role</label>
            <div>
              <input type="radio" id="student" value="student" v-model="cred.role">
              <label for="student">Student</label>
              
              <input type="radio" id="instructor" value="instructor" v-model="cred.role" class="ml-3">
              <label for="instructor">Instructor</label>
            </div>
            
            <button class="btn btn-primary mt-2">Register</button>
          </form>
          <p>Already have an account? <router-link to="/login">Login</router-link></p>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      cred: {
        email: '',
        password: '',
        password_confirm: '',
        role: '' // Added role field
      },
      errors: []
    };
  },
  methods: {
    checkForm() {
      this.errors = [];
      
      if (!this.cred.email) {
        this.errors.push("Email required.");
      }
      if (!this.cred.password) {
        this.errors.push("Password required.");
      }
      if (this.cred.password != this.cred.password_confirm){
        this.errors.push("Confirm password wrong")
      }
      if (!this.cred.role) {
        this.errors.push("Please select a role.");
      }

      if (this.errors.length === 0) {
        this.register();
      }
    },
    register() {
      fetch('http://127.0.0.1:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.cred)
      })
      .then(response => {
        if (response.status === 409) {
          throw new Error('User already exists');
        }
        if (!response.ok) {
          throw new Error('Registration failed');
        }
        return response.json();
      })
      .then(data => {
        alert(data.message);  // Show success message
        this.$router.push('/login');  // Redirect to login page
      })
      .catch(error => {
        console.error("There was an error!", error);
        this.errors.push(error.message);
      });
    }
  }
};
