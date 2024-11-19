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
                editable: true,
                selectable: true,
                selectMirror: true,
                eventAdd: this.handleEventAdd,
                eventClick: this.handleEventClick,
                events: [
                    { title: 'Meeting', start: '2024-11-28 10:00' }
                  ]
              })
            calendar.render()
          },
        handleEventAdd(info){
            const newEvent = {
                title: info.event.title,
                start: info.event.start.toISOString(),
            };
            },
        handleEventClick(info){
            alert(`Event: ${info.event.title}\nStart: ${info.event.start}`);
        },
    }
  };