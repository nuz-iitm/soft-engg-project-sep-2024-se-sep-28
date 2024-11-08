export default {
  template: `
    <div style="height: 100vh; background: linear-gradient(135deg, #F0E5D8 0%, #D3E9D7 100%); color: #2F4F4F;">
        <router-link to="/" style="color: #2F4F4F; text-decoration: underline; position: absolute; font-size: 2.5rem; margin-left: 1rem;"><i class="bi bi-arrow-left-circle"></i></router-link>
        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
            <header style="text-align: center; margin-bottom: 2rem;">
                <i class="bi bi-shield-lock-fill" style="font-size: 4rem; color: #2F4F4F;"></i>
                <h1 style="font-size: 2.5rem; font-weight: bold; margin-top: 0.5rem;">Admin Login</h1>
                <p style="font-size: 1.25rem; color: #6b8e23; margin-bottom: 2rem;">Access and manage all project tracking functionalities</p>
            </header>
    
            <main style="max-width: 400px; width: 100%; padding: 20px; background-color: rgba(255, 255, 255, 0.9); border-radius: 10px; text-align: center;">
                <div>
                    <h2 style="font-size: 1.8rem; margin-bottom: 1rem; color: #2F4F4F;">Welcome Admin</h2>
                    <p style="margin-bottom: 1rem; color: #2F4F4F;">Please log in to access the admin dashboard.</p>
                    <form @submit.prevent="submitForm" style="display: flex; flex-direction: column; align-items: center;">
                        <label for="admin-email" style="font-size: 0.9rem; width: 100%; text-align: left; margin-top: 10px; color: #2F4F4F;">Email Address</label>
                        <input type="email" id="admin-email" v-model="adminCredentials.email" placeholder="admin@example.com" required style="width: 100%; padding: 0.6rem; margin-bottom: 10px; border-radius: 5px; border: none; background-color: #F0E5D8; color: #2F4F4F;" />
    
                        <label for="admin-password" style="font-size: 0.9rem; width: 100%; text-align: left; margin-top: 10px; color: #2F4F4F;">Password</label>
                        <input type="password" id="admin-password" v-model="adminCredentials.password" placeholder="Enter password" required style="width: 100%; padding: 0.6rem; margin-bottom: 10px; border-radius: 5px; border: none; background-color: #F0E5D8; color: #2F4F4F;" />
    
                        <button type="submit" style="background-color: #D3E9D7; border: none; color: #2F4F4F; padding: 10px 20px; font-size: 1rem; border-radius: 8px; transition: all 0.3s ease; margin-top: 1rem;">Login</button>
                    </form>
                    <p v-if="loginMessage" style="margin-top: 1rem; color: #FF6347;">{{ loginMessage }}</p>
                </div>
            </main>
        </div>
    </div>
  `,
  
  data() {
    return {
      adminCredentials: {
        email: '',
        password: ''
      },
      loginMessage: '' // For showing login feedback
    };
  },
  
  methods: {
    submitForm() {
      fetch('http://127.0.0.1:5000/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.adminCredentials)
      })
        .then(this.$router.push('admin_front'))    // by pass to admin front page
        .then(response => response.json().then(data => ({ status: response.status, body: data })))
        .then(({ status, body }) => {
          if (status === 200) {
            this.loginMessage = body.message;
            console.log("Login successful:", body);
          } else {
            this.loginMessage = body.message;
          }
        })
        .catch(error => {
          console.error("There was an error with the login request!", error);
          this.loginMessage = "An error occurred. Please try again later.";
        });
    }
  }
};
