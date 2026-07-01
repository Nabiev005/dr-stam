import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import styled from 'styled-components';
import { type PatientData } from '../types';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

const CalendarContainer = styled.div`
  height: 80vh;
  background: white;
  padding: 25px;
  border-radius: 20px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);

  .rbc-event {
    background-color: #10b981;
    border-radius: 8px;
    padding: 4px 6px;
    font-weight: 500;
    font-size: 13px;
    transition: transform 0.2s;
  }
  .rbc-event:hover { transform: scale(1.02); background-color: #059669; }
  .rbc-today { background-color: #f0fdf4 !important; }
`;

interface CalendarPageProps {
  patients: PatientData[];
}

export const CalendarPage = ({ patients }: CalendarPageProps) => {
  const events = patients
    .filter(p => p.date)
    .map(p => {
      const startDate = new Date(p.date);

      if (p.appointmentTime) {
        const [h, m] = p.appointmentTime.split(':').map(Number);
        startDate.setHours(h, m, 0, 0);
      }

      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
      const timeLabel = p.appointmentTime ? ` ${p.appointmentTime}` : p.time ? ` (${p.time})` : '';

      return {
        id: p.id,
        title: `👤 ${p.name}${timeLabel}`,
        start: startDate,
        end: endDate,
        resource: p.service,
      };
    });

  return (
    <CalendarContainer>
      <h1 style={{ marginBottom: '20px', color: '#1e293b' }}>Бейтаптар графиги</h1>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '90%' }}
        onSelectEvent={(event: any) =>
          alert(`Бейтап: ${event.title}\nКызмат: ${event.resource}`)
        }
        messages={{
          next: "Кийинки",
          previous: "Мурунку",
          today: "Бүгүн",
          month: "Ай",
          week: "Жума",
          day: "Күн",
          agenda: "Тизме",
          noEventsInRange: "Бул мезгилде бейтаптар жок.",
        }}
        eventPropGetter={() => ({
          style: { backgroundColor: '#10b981', borderRadius: '6px', border: 'none' },
        })}
      />
    </CalendarContainer>
  );
};
