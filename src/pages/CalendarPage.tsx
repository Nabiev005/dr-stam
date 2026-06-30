import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import styled from 'styled-components';
import { type PatientData } from '../types';

// Календарды локализациялоо (Кыргызча/Англисче форматта)
const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Заманбап стиль
const CalendarContainer = styled.div`
  height: 80vh;
  background: white;
  padding: 25px;
  border-radius: 20px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);

  .rbc-event {
    background-color: #3b82f6;
    border-radius: 8px;
    padding: 5px;
    font-weight: 500;
    transition: transform 0.2s;
  }
  .rbc-event:hover { transform: scale(1.02); background-color: #2563eb; }
  .rbc-today { background-color: #eff6ff !important; }
`;

interface CalendarPageProps {
  patients: PatientData[];
}

export const CalendarPage = ({ patients }: CalendarPageProps) => {
  // Бейтаптарды календардык окуяларга (events) айландыруу
  const events = patients
    .filter((p) => p.appointmentDate) // Датасы барларды гана алабыз
    .map((p) => {
      const startDate = new Date(p.appointmentDate as string | Date);
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 сааттык кабыл алуу

      return {
        id: p.id,
        title: `👤 ${p.name}`, // Аты жана иконкасы
        start: startDate,
        end: endDate,
        resource: p.service, // Кызмат түрү
      };
    });

  return (
    <CalendarContainer>
      <h1 style={{ marginBottom: '20px', color: '#1e293b' }}>🗓 Бейтаптар графиги</h1>
      <Calendar
        localizer={localizer}
        events={events} // Динамикалык бейтаптар тизмеси
        startAccessor="start"
        endAccessor="end"
        style={{ height: '90%' }}
        // Окуяны басканда бейтаптын атын жана кызматын көрсөтүү
        onSelectEvent={(event: any) => alert(`Бейтап: ${event.title}\nКызмат: ${event.resource}`)}
        messages={{
          next: "Кийинки",
          previous: "Мурунку",
          today: "Бүгүн",
          month: "Ай",
          week: "Жума",
          day: "Күн",
        }}
        // Календар окуяларынын стилин кошумча жөндөө
        eventPropGetter={() => ({
          style: {
            backgroundColor: '#3b82f6',
            borderRadius: '6px',
            border: 'none',
          },
        })}
      />
    </CalendarContainer>
  );
};