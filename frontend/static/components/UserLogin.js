export default {
  template: `
    <div>
    <p><router-link to="/"><i style="font-size:2.5rem"  class="bi bi-arrow-left-short"></i></router-link></p>

     <h1 style="text-align:center">User Login</h1>
      <div class='d-flex justify-content-center' style="margin-top: 10vh">
       
        <div class="mb-3 p-5 bg-light">
          <form @submit.prevent='checkForm'>
            <p v-if="errors.length">
              <b>Please correct the following error(s):</b>
              <ul>
                <li v-for="error in errors">{{ error }}</li>
              </ul>
            </p>
            
            <label for="user-email" class="form-label">Email address</label>
            <input type="email" class="form-control" id="user-email" placeholder="name@example.com" v-model="cred.email" required>
            <label for="user-password" class="form-label">Password</label>
            <input type="password" class="form-control" id="user-password" v-model="cred.password" required>
            <button class="btn btn-primary mt-2">Login</button>
          </form>
          <p>Don't have an account? <router-link to="/register">Register</router-link></p>
        </div> 
      </div>
    </div>
  `,
  data() {
    return {
      cred: {
        email: '',
        password: ''
      },
      errors: [],
      message: ''
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

      if (this.errors.length === 0) {
        this.login();
      }
    },
    login() {
      fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.cred)
      })
      .then(this.$router.push('admin_front'))
      .then(response => {
        if (!response.ok) {
          throw new Error('Invalid credentials');
        }
        return response.json();
      })
      .then(data => {
        alert(data.message);  // Display success message
        localStorage.setItem('auth-token', data.token);  // Save token
      })
      .catch(error => {
        console.error("There was an error!", error);
        this.errors.push("Login failed: " + error.message);
      });
    }
  }
};
