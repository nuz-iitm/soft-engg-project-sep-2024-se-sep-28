export default {
    template: `
        <div id="calendar"></div>
    `,
    name: 'student_cal',

    data() {
      return {
        events: [{
          title: '',
          start: ''
        }]
      }
    },
    mounted() {
        this.initCalendar();
      },
    methods: {
        initCalendar() {
            const calendarEl = document.getElementById('calendar');
            
            const calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'dayGridMonth',
                eventClick: this.handleEventClick,
                selectable: true,
                events: () => this.getEvents(),
              })
              calendar.render()
          },
        handleEventClick(info){
            alert(`Event: ${info.event.title}\nStart: ${info.event.start}`);
        },
        getEvents() {
          return new Promise((resolve) => {
              const authToken = localStorage.getItem('auth-token');
              fetch('http://127.0.0.1:5000/api/student_events', {
                  method: 'GET',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${authToken}`
                  },
              })
              .then(response => response.json())
              .then(data => resolve(data.map(event => ({ ...event }))));
          });
        }
      }
  };