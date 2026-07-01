import { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, addDays } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import styled from 'styled-components';
import { type PatientData } from '../types';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const CalendarContainer = styled.div`
  height: 70vh;
  background: white;
  padding: 25px;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);

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

const ListSection = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
  overflow: hidden;
`;

const ListHeader = styled.div`
  padding: 20px 24px 16px;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  h2 { margin: 0; font-size: 18px; color: #1e293b; }
`;

const WeekBlock = styled.div`
  border-bottom: 1px solid #f1f5f9;
  &:last-child { border-bottom: none; }
`;

const WeekTitle = styled.div`
  padding: 14px 24px 10px;
  background: #f8fafc;
  display: flex;
  align-items: center;
  gap: 10px;
  h3 {
    margin: 0;
    font-size: 15px;
    color: #0f172a;
    font-weight: 700;
  }
  span {
    font-size: 12px;
    color: #64748b;
    background: #e2e8f0;
    padding: 2px 8px;
    border-radius: 10px;
  }
`;

const PatientRow = styled.div`
  padding: 12px 24px;
  display: flex;
  align-items: center;
  gap: 14px;
  border-bottom: 1px solid #f8fafc;
  &:last-child { border-bottom: none; }
  &:hover { background: #f8fafc; }
`;

const TimeBadge = styled.div`
  background: #10b981;
  color: white;
  font-size: 13px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 8px;
  min-width: 52px;
  text-align: center;
  flex-shrink: 0;
`;

const DateTag = styled.div`
  font-size: 12px;
  color: #94a3b8;
  background: #f1f5f9;
  padding: 3px 8px;
  border-radius: 6px;
  flex-shrink: 0;
`;

const PatientName = styled.div`
  font-weight: 600;
  color: #1e293b;
  font-size: 14px;
`;

const ServiceTag = styled.div`
  font-size: 13px;
  color: #64748b;
`;

const EmptyWeek = styled.div`
  padding: 16px 24px;
  color: #94a3b8;
  font-size: 14px;
`;

const TabRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 4px;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 8px 18px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: 0.2s;
  background: ${p => p.active ? '#10b981' : '#f1f5f9'};
  color: ${p => p.active ? 'white' : '#64748b'};
  &:hover { background: ${p => p.active ? '#059669' : '#e2e8f0'}; }
`;

const MONTHS = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
const DAYS   = ['Жекшемби','Дүйшөмбү','Шейшемби','Шаршемби','Бейшемби','Жума','Ишемби'];

function getMonStart(dateStr: string) {
  const d = new Date(dateStr);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1 - day);
  const mon = new Date(d);
  mon.setDate(d.getDate() + diff);
  mon.setHours(0,0,0,0);
  return mon;
}

function weekLabel(monDate: Date) {
  const sun = addDays(monDate, 6);
  const d1 = monDate.getDate();
  const d2 = sun.getDate();
  const m1 = MONTHS[monDate.getMonth()];
  const m2 = MONTHS[sun.getMonth()];
  if (monDate.getMonth() === sun.getMonth()) return `${d1}-${d2} ${m1}`;
  return `${d1} ${m1} - ${d2} ${m2}`;
}

interface CalendarPageProps {
  patients: PatientData[];
}

export const CalendarPage = ({ patients }: CalendarPageProps) => {
  const [tab, setTab] = useState<'calendar' | 'list'>('calendar');

  const withDate = patients.filter(p => p.date);

  const events = withDate.map(p => {
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

  // Жума боюнча топтоо
  const weekMap: Map<string, { label: string; date: Date; items: PatientData[] }> = new Map();
  [...withDate]
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
    .forEach(p => {
      const mon = getMonStart(p.date);
      const key = mon.toISOString();
      if (!weekMap.has(key)) weekMap.set(key, { label: weekLabel(mon), date: mon, items: [] });
      weekMap.get(key)!.items.push(p);
    });

  const weeks = Array.from(weekMap.values()).sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <PageWrapper>
      <div>
        <h1 style={{ margin: '0 0 16px', color: '#1e293b' }}>Бейтаптар графиги</h1>
        <TabRow>
          <Tab active={tab === 'calendar'} onClick={() => setTab('calendar')}>📅 Календар</Tab>
          <Tab active={tab === 'list'}     onClick={() => setTab('list')}>📋 Жумалык тизме</Tab>
        </TabRow>
      </div>

      {tab === 'calendar' && (
        <CalendarContainer>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
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
      )}

      {tab === 'list' && (
        <ListSection>
          <ListHeader>
            <h2>Бейтаптар тизмеси (жума боюнча)</h2>
            <span style={{ fontSize: 13, color: '#94a3b8' }}>{withDate.length} жазуу</span>
          </ListHeader>

          {weeks.length === 0 ? (
            <EmptyWeek>Азырынча жазуулар жок.</EmptyWeek>
          ) : (
            weeks.map(week => (
              <WeekBlock key={week.date.toISOString()}>
                <WeekTitle>
                  <h3>🗓 Бейтаптар тизмеси: {week.label}</h3>
                  <span>{week.items.length} бейтап</span>
                </WeekTitle>

                {week.items.length === 0 ? (
                  <EmptyWeek>Бейтаптар жок.</EmptyWeek>
                ) : (
                  week.items
                    .sort((a, b) => {
                      const dateCmp = (b.date || '').localeCompare(a.date || '');
                      if (dateCmp !== 0) return dateCmp;
                      return (a.appointmentTime || '').localeCompare(b.appointmentTime || '');
                    })
                    .map(p => {
                      const d = new Date(p.date);
                      const dayName = DAYS[d.getDay()];
                      const dateLabel = `${d.getDate()} ${MONTHS[d.getMonth()]}`;
                      return (
                        <PatientRow key={p.id}>
                          {(p.appointmentTime || p.time) ? (
                            <TimeBadge>{p.appointmentTime || p.time}</TimeBadge>
                          ) : (
                            <TimeBadge style={{ background: '#94a3b8' }}>—</TimeBadge>
                          )}
                          <DateTag>{dateLabel}, {dayName}</DateTag>
                          <div style={{ flex: 1 }}>
                            <PatientName>👤 {p.name}</PatientName>
                            {p.service && <ServiceTag>{p.service}</ServiceTag>}
                          </div>
                        </PatientRow>
                      );
                    })
                )}
              </WeekBlock>
            ))
          )}
        </ListSection>
      )}
    </PageWrapper>
  );
};
