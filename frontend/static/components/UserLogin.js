export default {
  template: `
    <div style="height: 100vh; background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%); color: white;">
      <router-link to="/" style="color: #fff; text-decoration: underline;position:absolute; font-size:2.5rem; margin-left:1rem;"><i class="bi bi-arrow-left-circle"></i></router-link>
      <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
        <header style="text-align: center; margin-bottom: 2rem;">
          <i class="bi bi-person-circle" style="font-size:4rem; color: white;"></i>
          <h1 style="font-size: 2.5rem; font-weight: bold; margin-top: 0.5rem;">User Login</h1>
          <p style="font-size: 1.25rem; color: #e0e0e0; margin-bottom: 2rem;">Access your projects and track your progress</p>
        </header>

        <main style="max-width: 400px; width: 100%; padding: 20px; background-color: rgba(255, 255, 255, 0.1); border-radius: 10px; text-align: center;">
          <div>
            <h2 style="font-size: 1.8rem; margin-bottom: 1rem;">Welcome Back!</h2>
            <p style="margin-bottom: 1rem;">Please log in to access your dashboard.</p>
            <form @submit.prevent="submitForm" style="display: flex; flex-direction: column; align-items: center;">
              <label for="user-email" style="font-size: 0.9rem; width: 100%; text-align: left; margin-top: 10px;">Email Address</label>
              <input type="email" id="user-email" v-model="userCredentials.email" placeholder="name@example.com" required style="width: 100%; padding: 0.6rem; margin-bottom: 10px; border-radius: 5px; border: none;" />

              <label for="user-password" style="font-size: 0.9rem; width: 100%; text-align: left; margin-top: 10px;">Password</label>
              <input type="password" id="user-password" v-model="userCredentials.password" placeholder="Enter password" required style="width: 100%; padding: 0.6rem; margin-bottom: 10px; border-radius: 5px; border: none;" />

              <button type="submit" style="background-color: #4a90e2; border: none; color: white; padding: 10px 20px; font-size: 1rem; border-radius: 8px; transition: all 0.3s ease; margin-top: 1rem;">Login</button>
            </form>
            <p v-if="loginMessage" style="margin-top: 1rem;">{{ loginMessage }}</p>
            <p style="margin-top: 1rem;">Don't have an account? <router-link to="/register" style="color: #fff; text-decoration: underline;">Sign Up</router-link></p>
          </div>
        </main>
      </div>
    </div>
  `,

  data() {
    return {
      userCredentials: {
        email: '',
        password: ''
      },
      loginMessage: '' // For showing login feedback
    };
  },

  methods: {
    submitForm() {
      fetch('http://127.0.0.1:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.userCredentials)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Invalid credentials');
        }
        return response.json();
      })
      .then(data => {
        console.log(data[0].message);
        console.log(data[0].role_id)
        alert(data[0].message);  // Display success message
        localStorage.setItem('auth-token', data[0].access_token);  // Save token

        if(data[0].role_id === 2){       // check role
          this.$router.push("/instructor_front");
        }else if(data[0].role_id === 3){
          this.$router.push("/student_front");
        }
      })
      .catch(error => {
        console.error("There was an error!", error);
        this.errors.push("Login failed: " + error.message);
      });
    }
  }
};
