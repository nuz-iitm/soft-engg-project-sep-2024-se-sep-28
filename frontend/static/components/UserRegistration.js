export default {
  template: `
    <div style="height: 100vh; background: linear-gradient(135deg, #F0E5D8 0%, #D3E9D7 100%); color: #2F4F4F; overflow: scroll;">
      <p>
        <router-link to="/" style="color: #2F4F4F; text-decoration: underline; position: absolute; font-size: 2.5rem; margin-left: 1rem;">
          <i class="bi bi-arrow-left-circle"></i>
        </router-link>
      </p>
      <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100%;">
        <header style="text-align: center; margin-bottom: 2rem;">
          <i class="bi bi-person-circle" style="font-size: 4rem; color: #2F4F4F;"></i>
          <h1 style="font-size: 2.5rem; font-weight: bold; margin-top: 0.5rem;">User Registration</h1>
          <p style="font-size: 1.25rem; color: #A4C3B2; margin-bottom: 2rem;">Create a new account and access your projects</p>
        </header>

        <main style="max-width: 400px; width: 100%; padding: 20px; background-color: rgba(255, 255, 255, 0.7); border-radius: 10px; text-align: center;">
          <div>
            <h2 style="font-size: 1.8rem; margin-bottom: 1rem; color: #2F4F4F;">Welcome!</h2>
            <p style="margin-bottom: 1rem; color: #2F4F4F;">Please fill in the information to create a new account.</p>
            <form @submit.prevent='checkForm' style="display: flex; flex-direction: column; align-items: center;">
              <div class='d-flex justify-content-center'>
                <div>
                  <label for="user-email" style="font-size: 0.9rem; width: 100%; text-align: left; margin-top: 10px; color: #2F4F4F;">Email Address</label>
                  <input type="email" id="user-email" v-model="cred.email" placeholder="name@example.com" required style="width: 100%; padding: 0.6rem; margin-bottom: 10px; border-radius: 5px; border: none;" />

                  <label for="user-password" style="font-size: 0.9rem; width: 100%; text-align: left; margin-top: 10px; color: #2F4F4F;">Password</label>
                  <input type="password" id="user-password" v-model="cred.password" placeholder="Enter password" required style="width: 100%; padding: 0.6rem; margin-bottom: 10px; border-radius: 5px; border: none;" />

                  <label for="confirm-password" style="font-size: 0.9rem; width: 100%; text-align: left; margin-top: 10px; color: #2F4F4F;">Confirm Password</label>
                  <input type="password" id="confirm-password" v-model="cred.password_confirm" placeholder="Enter password again" required style="width: 100%; padding: 0.6rem; margin-bottom: 10px; border-radius: 5px; border: none;" />

                  <label class="form-label mt-3" style="font-size: 0.9rem; color: #2F4F4F;">Role</label>
                  <div>
                    <input type="radio" id="student" value="student" v-model="cred.role">
                    <label for="student" style="font-size: 0.9rem; color: #2F4F4F;">Student</label>
                    
                    <input type="radio" id="instructor" value="instructor" v-model="cred.role" class="ml-3">
                    <label for="instructor" style="font-size: 0.9rem; color: #2F4F4F;">Instructor</label>
                  </div>

                  <button type="submit" style="background-color: #A4C3B2; border: none; color: #2F4F4F; padding: 10px 20px; font-size: 1rem; border-radius: 8px; transition: all 0.3s ease; margin-top: 1rem;">Register</button>
                </div>
              </div>

              <p v-if="errors.length" style="margin-top: 1rem; color: #2F4F4F;">
                <b>Please correct the following error(s):</b>
                <ul>
                  <li v-for="error in errors" :key="error">{{ error }}</li>
                </ul>
              </p>

              <p style="margin-top: 1rem; color: #2F4F4F;">Already have an account? <router-link to="/login" style="color: #2F4F4F; text-decoration: underline;">Login</router-link></p>
              <p style="margin-top: 1rem;"><router-link to="/admin-login" style="color: #2F4F4F; text-decoration: underline;">Administrator Login</router-link></p>

            </form>
          </div>
        </main>
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
      fetch('http://127.0.0.1:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.cred)
      })
      .then(response => {
        console.log(response);
        if (response.status === 400) {
          alert(response.statusText);
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
