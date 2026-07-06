import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { type PatientData } from '../types';
import {
  IoPeople, IoTrendingUp, IoWallet, IoCalendarNumber, IoChevronForward,
} from 'react-icons/io5';

const DAYS = ['Жекшемби', 'Дүйшөмбү', 'Шейшемби', 'Шаршемби', 'Бейшемби', 'Жума', 'Ишемби'];
const MONTHS = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
  'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'];

function initials(name: string) {
  return name.split(' ').slice(0, 2).map(n => n[0] || '').join('').toUpperCase() || '?';
}

function avatarColor(name: string) {
  const palette = ['#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#0d9488', '#6366f1', '#0ea5e9'];
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) & 0x7fffffff;
  return palette[h % palette.length];
}

/* ── styled components ── */

const Page = styled.div`
  padding: 28px 24px;
  max-width: 1100px;

  @media (max-width: 768px) {
    padding: 4px 0 0;
  }
`;

const WelcomeRow = styled.div`
  margin-bottom: 22px;

  h1 {
    font-size: 22px;
    font-weight: 800;
    color: var(--text);
  }

  .date-label {
    font-size: 13px;
    color: var(--text-muted);
    margin-top: 3px;
  }

  @media (max-width: 768px) {
    padding: 0 16px;
    h1 { font-size: 19px; }
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  margin-bottom: 22px;

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: 768px) {
    padding: 0 16px;
    gap: 12px;
  }
`;

const StatCard = styled.div<{ $grad: string }>`
  background: ${p => p.$grad};
  padding: 20px 18px 16px;
  border-radius: 20px;
  color: white;
  position: relative;
  overflow: hidden;
  cursor: default;
  transition: transform 0.18s, box-shadow 0.18s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 30px rgba(0,0,0,0.18);
  }

  &::before {
    content: '';
    position: absolute;
    top: -28px;
    right: -28px;
    width: 90px;
    height: 90px;
    border-radius: 50%;
    background: rgba(255,255,255,0.12);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -20px;
    left: -10px;
    width: 70px;
    height: 70px;
    border-radius: 50%;
    background: rgba(255,255,255,0.07);
  }

  .icon-wrap {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: rgba(255,255,255,0.18);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 14px;
  }

  .value {
    font-size: 26px;
    font-weight: 800;
    line-height: 1;
    position: relative;

    @media (max-width: 480px) {
      font-size: 22px;
    }
  }

  .label {
    font-size: 12px;
    opacity: 0.82;
    margin-top: 5px;
    font-weight: 500;
    position: relative;
  }
`;

const Card = styled.div`
  background: var(--card);
  border-radius: 20px;
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    border-radius: 0;
    margin-bottom: 12px;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px 14px;
  border-bottom: 1px solid #f1f5f9;

  h2 {
    font-size: 15px;
    font-weight: 700;
    color: var(--text);
  }

  a {
    font-size: 13px;
    color: var(--primary);
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 2px;
  }
`;

const PatientRow = styled.div`
  display: flex;
  align-items: center;
  padding: 13px 20px;
  gap: 14px;
  border-bottom: 1px solid #f8fafc;
  transition: background 0.12s;

  &:last-child { border-bottom: none; }
  &:hover { background: var(--primary-faint); }
`;

const Avatar = styled.div<{ $color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${p => p.$color};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
  letter-spacing: 0.5px;
`;

const Info = styled.div`
  flex: 1;
  min-width: 0;

  .name {
    font-size: 14.5px;
    font-weight: 600;
    color: var(--text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .meta {
    font-size: 12.5px;
    color: var(--text-muted);
    margin-top: 1px;
  }
`;

const Badge = styled.span<{ $debt: boolean }>`
  font-size: 12px;
  font-weight: 700;
  color: ${p => p.$debt ? '#dc2626' : '#059669'};
  background: ${p => p.$debt ? '#fee2e2' : '#dcfce7'};
  padding: 4px 10px;
  border-radius: 99px;
  white-space: nowrap;
  flex-shrink: 0;
`;

const Empty = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: var(--text-subtle);
  font-size: 14px;
`;

/* ── component ── */

export const HomePage = ({ patients }: { patients: PatientData[] }) => {
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const dateLabel = `${DAYS[now.getDay()]}, ${now.getDate()} ${MONTHS[now.getMonth()]} ${now.getFullYear()}`;

  const totalRevenue = patients.reduce((s, p) => s + p.paid, 0);
  const totalDebt    = patients.reduce((s, p) => s + Math.max(0, p.price - p.paid), 0);
  const todayCount   = patients.filter(p => p.date === todayStr).length;
  const recent       = [...patients].reverse().slice(0, 8);

  return (
    <Page>
      <WelcomeRow>
        <h1>Башкы бет</h1>
        <div className="date-label">{dateLabel}</div>
      </WelcomeRow>

      <Grid>
        <StatCard $grad="linear-gradient(135deg,#3b82f6 0%,#6366f1 100%)">
          <div className="icon-wrap"><IoPeople size={20} /></div>
          <div className="value">{patients.length}</div>
          <div className="label">Жалпы бейтап</div>
        </StatCard>

        <StatCard $grad="linear-gradient(135deg,#0d9488 0%,#059669 100%)">
          <div className="icon-wrap"><IoTrendingUp size={20} /></div>
          <div className="value">{totalRevenue >= 1000 ? `${(totalRevenue/1000).toFixed(1)}к` : totalRevenue.toLocaleString()}</div>
          <div className="label">Жалпы киреше (с)</div>
        </StatCard>

        <StatCard $grad="linear-gradient(135deg,#f97316 0%,#ef4444 100%)">
          <div className="icon-wrap"><IoWallet size={20} /></div>
          <div className="value">{totalDebt >= 1000 ? `${(totalDebt/1000).toFixed(1)}к` : totalDebt.toLocaleString()}</div>
          <div className="label">Жалпы карыз (с)</div>
        </StatCard>

        <StatCard $grad="linear-gradient(135deg,#8b5cf6 0%,#ec4899 100%)">
          <div className="icon-wrap"><IoCalendarNumber size={20} /></div>
          <div className="value">{todayCount}</div>
          <div className="label">Бүгүнкү бейтап</div>
        </StatCard>
      </Grid>

      <Card>
        <CardHeader>
          <h2>Акыркы бейтаптар</h2>
          <Link to="/patients">Баары <IoChevronForward size={14} /></Link>
        </CardHeader>

        {recent.length === 0 ? (
          <Empty>Азырынча маалымат жок</Empty>
        ) : (
          recent.map(p => {
            const debt = p.price - p.paid;
            return (
              <PatientRow key={p.id}>
                <Avatar $color={avatarColor(p.name)}>{initials(p.name)}</Avatar>
                <Info>
                  <div className="name">{p.name}</div>
                  <div className="meta">{p.service} · {p.date}</div>
                </Info>
                <Badge $debt={debt > 0}>
                  {debt > 0 ? `${debt.toLocaleString()} с` : '✓ Төлөндү'}
                </Badge>
              </PatientRow>
            );
          })
        )}
      </Card>
    </Page>
  );
};
