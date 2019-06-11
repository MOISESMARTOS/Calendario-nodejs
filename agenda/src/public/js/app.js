
class EventManager {
    constructor() {
        this.urlBase = "/main"
        this.obtenerDataInicial()
        this.inicializarFormulario()
        this.guardarEvento()
    }

    obtenerDataInicial() {
        let url = this.urlBase + "/all"
        $.get(url, (response) => {
            this.inicializarCalendario(response);
        })
    }

    eliminarEvento(evento) {
        let eventId = evento._id
        $.post('/main/all/delete/'+eventId, {id: eventId}, (response) => {
            alert(response)
            this.obtenerDataInicial();
        })
    }

    // actualizarEvento(evento) {
    //     let eventId = evento._id
    //     $.post('/main/update/'+eventId, {id: eventId}, (response) => {
    //         alert(response)
    //     })
    // }

    guardarEvento() {
        $('.addButton').on('click', (ev) => {
            ev.preventDefault()
            let nombre = $('#titulo').val(),
            start = $('#start_date').val(),
            title = $('#titulo').val(),
            end = '',
            start_hour = '',
            end_hour = '';

            if (!$('#allDay').is(':checked')) {
                end = $('#end_date').val()
                start_hour = $('#start_hour').val()
                end_hour = $('#end_hour').val()
                start = start + 'T' + start_hour
                end = end + 'T' + end_hour
            }
            let url = this.urlBase + "/new"
            if (title != "" && start != "") {
                let ev = {
                    title: title,
                    start: start,
                    end: end
                }
            console.log(start + ' y ' + title);
            console.log(ev);
            $.post(url, ev, function(confirm) {
                alert(confirm);
                location.reload()
            })
            } else {
                alert("Complete los campos obligatorios para el evento")
            }
        })
    }

    inicializarFormulario() {
        $('#start_date, #titulo, #end_date').val('');
        $('#start_date, #end_date').datepicker({
            dateFormat: "yy-mm-dd"
        });
        $('.timepicker').timepicker({
            timeFormat: 'HH:mm:ss',
            interval: 30,
            minTime: '5',
            maxTime: '23:59:59',
            defaultTime: '',
            startTime: '5:00',
            dynamic: false,
            dropdown: true,
            scrollbar: true
        });
        $('#allDay').on('change', function(){
            if (this.checked) {
                $('.timepicker, #end_date').attr("disabled", "disabled")
            }else {
                $('.timepicker, #end_date').removeAttr("disabled")
            }
        })
    }

    inicializarCalendario(eventos) {
      var fecha_actual = new Date();
      var year = fecha_actual.getFullYear();
      var month = fecha_actual.getMonth();
      var day = fecha_actual.getDate();
        $('.calendario').fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,basicDay'
            },
            defaultDate: '"'+year+'-'+(month+1)+'-'+day+'"',
            navLinks: true,
            editable: true,
            eventLimit: true,
            droppable: true,
            dragRevertDuration: 0,
            timeFormat: 'H:mm',
            eventDrop: (event) => {
                this.actualizarEvento(event)
            },
            events: eventos,
            eventDragStart: (event,jsEvent) => {
                $('.delete').find('img').attr('src', "./img/delete.png");
                $('.delete').css('background-color', '#a70f19')
            },
            eventDragStop: (event,jsEvent) => {
                var trashEl = $('.delete');
                var ofs = trashEl.offset();
                var x1 = ofs.left;
                var x2 = ofs.left + trashEl.outerWidth(true);
                var y1 = ofs.top;
                var y2 = ofs.top + trashEl.outerHeight(true);
                if (jsEvent.pageX >= x1 && jsEvent.pageX<= x2 &&
                    jsEvent.pageY >= y1 && jsEvent.pageY <= y2) {
                      console.log(event._id);
                        this.eliminarEvento(event)
                        $('.calendario').fullCalendar('removeEvents', event.id);
                    }
                }
            })
        }
//
        actualizarEvento(evento) {
          let id = evento._id,
              start = moment(evento.start).format('YYYY-MM-DD HH:mm:ss'),
              end = moment(evento.end).format('YYYY-MM-DD HH:mm:ss'),
              start_date,
              end_date,
              start_hour,
              end_hour
          start_date = start.substr(0,10)
          end_date = end.substr(0,10)
          console.log('el date es ' + start_date+ ' y el end es '+ end)
          start_hour = start.substr(11,8)
          end_hour = end.substr(11,8)

          let actev = {
              start: start_date,
              end: end_date,
              start_hour: start_hour,
              end_hour: end_hour
          }
console.log(actev)

          $.post('/main/update/'+id, actev, function(confirm) {
              alert(confirm);
          })
      }
    }

    const Manager = new EventManager()
