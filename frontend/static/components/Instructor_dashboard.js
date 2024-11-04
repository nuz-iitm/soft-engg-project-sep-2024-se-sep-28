// Sidebar component
// Vue.component('sidebar', {
//   template: `
//     <div class="sidebar">
//       <button @click="navigate('editStudents')">Edit Students</button>
//       <button @click="navigate('editInstructors')">Edit Instructors and TAs</button>
//       <button @click="navigate('technicalGrievances')">Technical Grievances</button>
//       <button @click="navigate('settings')">Settings</button>
//     </div>
//   `,
//   methods: {
//     navigate(page) {
//       this.$emit('navigate', page);
//     }
//   }
// });

// // Bulk Edit Students Page component
// Vue.component('bulk-edit-students', {
//   template: `
//     <div class="bulk-edit">
//       <h2>Bulk Edit Students</h2>
//       <div class="actions">
//         <button @click="addStudent">Add Students</button>
//         <button @click="uploadCsv">Upload CSV</button>
//       </div>
//       <div class="actions">
//         <button @click="removeStudent">Remove Students</button>
//         <button @click="uploadCsv">Upload CSV</button>
//       </div>
//       <div class="progress-bars">
//         <h3>Progress Bars</h3>
//         <!-- Placeholder for progress bars -->
//         <div v-for="progress in progressBars" :key="progress.id" class="progress-bar">
//           {{ progress.name }}: {{ progress.percentage }}%
//         </div>
//       </div>
//     </div>
//   `,
//   data() {
//     return {
//       progressBars: [
//         { id: 1, name: 'Student 1', percentage: 70 },
//         { id: 2, name: 'Student 2', percentage: 50 },
//         { id: 3, name: 'Student 3', percentage: 80 }
//       ]
//     };
//   },
//   methods: {
//     addStudent() {
//       alert('Add Student clicked');
//     },
//     uploadCsv() {
//       alert('CSV Upload clicked');
//     },
//     removeStudent() {
//       alert('Remove Student clicked');
//     }
//   }
// });

// // Main Instructor Dashboard component
// Vue.component('instructor-dashboard', {
//   template: `
//     <div class="dashboard">
//       <sidebar @navigate="setPage"></sidebar>
//       <div class="content">
//         <bulk-edit-students v-if="currentPage === 'editStudents'"></bulk-edit-students>
//         <div v-else>
//           <h2>{{ currentPage }} Page</h2>
//           <p>Content for {{ currentPage }} will go here.</p>
//         </div>
//       </div>
//     </div>
//   `,
//   data() {
//     return {
//       currentPage: 'editStudents'
//     };
//   },
//   methods: {
//     setPage(page) {
//       this.currentPage = page;
//     }
//   }
// });

// Create Vue instance
// new Vue({
//   el: '#app'
// });
