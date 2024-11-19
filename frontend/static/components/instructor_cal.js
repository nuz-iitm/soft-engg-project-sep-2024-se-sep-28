export default {
    template: `
        <div id="calendar"></div>
    `,
    name: 'instructor_cal',
    mounted() {
        this.initCalendar();
      },
    methods: {
        initCalendar() {
            const calendarEl = document.getElementById('calendar');
            
            const calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'dayGridMonth',
                events: [
                    { title: 'Meeting', start: new Date() }
                  ]
              })
            calendar.render()
          }
        }
  };