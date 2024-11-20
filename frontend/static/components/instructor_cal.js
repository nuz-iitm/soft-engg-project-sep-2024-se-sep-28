export default {
    template: `
        <div>
            <div id="calendar"></div>
        </div>
    `,
    name: 'instructor_cal',
    data() {
        return {
            events: [
                { title: 'Meeting', start: '2024-11-28' }
            ],
        };
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
                eventClick: this.handleEventClick,
                events: () => this.getEvents(),
                customButtons: {
                    addEventButton: {
                        text: 'Add Event',
                        click: () => {
                            var dateStr = prompt('Enter a date in YYYY-MM-DD format');
                            var title = prompt('Enter a title');
                            if (dateStr && title) {
                                const parts = dateStr.split('-');
                                if (parts.length !== 3) {
                                    alert('Invalid date format');
                                    return;
                                }
                                const year = parseInt(parts[0], 10);
                                const month = parseInt(parts[1], 10) - 1; // JavaScript months are zero-indexed
                                const day = parseInt(parts[2], 10);

                                if (isNaN(year) || isNaN(month) || isNaN(day)) {
                                    alert('Invalid date, please use valid numbers');
                                    return;
                                }
                                const date = new Date(year, month, day);
                                console.log(date);
                                console.log(date.toISOString());

                                if (!isNaN(date.valueOf())) {
                                    var new_event = {
                                        title: title,
                                        start: date.toISOString(),
                                    };
                                    this.sendEvent(new_event);
                                    this.events.push({ ...new_event });
                                    calendar.render();
                                    alert('Event added');
                                } else {
                                    alert('Invalid date.');
                                }
                            } else {
                                alert('Both date and title are required.');
                            }
                        }
                    }
                }
            });
            calendar.render();
        },
        handleEventClick(info) {
            alert(`Event: ${info.event.title}\nStart: ${info.event.start}`);
        },
        sendEvent(new_event) {
            const authToken = localStorage.getItem('auth-token');
            fetch('http://127.0.0.1:5000/api/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(new_event)
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
            });
        },
        getEvents() {
            return new Promise((resolve) => {
                const authToken = localStorage.getItem('auth-token');
                fetch('http://127.0.0.1:5000/api/events', {
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