export default {
    template: `
        <div>
            <div id="calendar"></div>
        </div>
    `,
    name: 'instructor_cal',
    data() {
        return {

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
                headerToolbar: {
                    center: 'addEventButton'
                },
                editable: true,
                selectable: true,
                selectMirror: true,
                eventAdd: this.handleEventAdd,
                eventClick: this.handleEventClick,
                events: [
                    { title: 'Meeting', start: '2024-11-28 10:00' }
                ],
                customButtons: {
                    addEventButton: {
                        text: 'Add Event',
                        click: function(){
                            var dateStr = prompt('Enter a date in YYYY-MM-DD format');
                            var title = prompt('Enter a title')
                            var date = new Date(dateStr + '00:00:00');

                            if(!isNaN(date.valueOf())){
                                calendar.addEvent({
                                    title: title,
                                    start: date,
                                });
                                alert('Event added');
                            }else{
                                alert('Invalid date.')
                            }
                        }
                    }
                }
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