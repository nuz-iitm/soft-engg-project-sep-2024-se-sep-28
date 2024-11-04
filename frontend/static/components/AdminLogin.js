export default {
    template: `
    <div style="height: 100vh; background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%); color: white;">
        <router-link to="/" style="color: #fff; text-decoration: underline;position:absolute; font-size:2.5rem; margin-left:1rem;"><i class="bi bi-arrow-left-circle"></i></router-link>
        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
            <header style="text-align: center; margin-bottom: 2rem;">
            <i class="bi bi-shield-lock-fill" style="font-size:4rem; color: white;"></i>
            <h1 style="font-size: 2.5rem; font-weight: bold; margin-top: 0.5rem;">Admin Login</h1>
            <p style="font-size: 1.25rem; color: #e0e0e0; margin-bottom: 2rem;">Access and manage all project tracking functionalities</p>
            </header>
    
            <main style="max-width: 400px; width: 100%; padding: 20px; background-color: rgba(255, 255, 255, 0.1); border-radius: 10px; text-align: center;">
            <div>
                <h2 style="font-size: 1.8rem; margin-bottom: 1rem;">Welcome Admin</h2>
                <p style="margin-bottom: 1rem;">Please log in to access the admin dashboard.</p>
                <form @submit.prevent="submitForm" style="display: flex; flex-direction: column; align-items: center;">
                <label for="admin-email" style="font-size: 0.9rem; width: 100%; text-align: left; margin-top: 10px;">Email Address</label>
                <input type="email" id="admin-email" v-model="adminCredentials.email" placeholder="admin@example.com" required style="width: 100%; padding: 0.6rem; margin-bottom: 10px; border-radius: 5px; border: none;" />
    
                <label for="admin-password" style="font-size: 0.9rem; width: 100%; text-align: left; margin-top: 10px;">Password</label>
                <input type="password" id="admin-password" v-model="adminCredentials.password" placeholder="Enter password" required style="width: 100%; padding: 0.6rem; margin-bottom: 10px; border-radius: 5px; border: none;" />
    
                <button type="submit" style="background-color: #4a90e2; border: none; color: white; padding: 10px 20px; font-size: 1rem; border-radius: 8px; transition: all 0.3s ease; margin-top: 1rem;">Login</button>
                </form>
                <p v-if="loginMessage" style="margin-top: 1rem;">{{ loginMessage }}</p>
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
  