export default {
    template: `
        <div id="calendar"></div>
    `,
    name: 'student_cal',
    mounted() {
        this.initCalendar();
      },
    methods: {
        initCalendar() {
            const calendarEl = document.getElementById('calendar');
            
            const calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'dayGridMonth'
              })
              calendar.render()
          }
        }
  };