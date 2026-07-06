import { NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import {
  IoHome, IoHomeOutline,
  IoPeople, IoPeopleOutline,
  IoCalendar, IoCalendarOutline,
  IoStatsChart, IoStatsChartOutline,
  IoWallet, IoWalletOutline,
  IoDocumentText, IoDocumentTextOutline,
} from 'react-icons/io5';

const Nav = styled.nav`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: #0f172a;
    border-top: 1px solid rgba(255,255,255,0.06);
    padding-bottom: env(safe-area-inset-bottom, 8px);
    box-shadow: 0 -4px 20px rgba(0,0,0,0.3);
  }
`;

const Item = styled(NavLink)`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px 4px 6px;
  text-decoration: none;
  color: #475569;
  font-size: 10px;
  font-weight: 500;
  gap: 3px;
  position: relative;
  transition: color 0.15s;
  letter-spacing: 0.2px;

  &.active {
    color: var(--primary);
  }
`;

const IconWrap = styled.div<{ active: boolean }>`
  width: 44px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  background: ${p => p.active ? 'rgba(13,148,136,0.18)' : 'transparent'};
  transition: background 0.2s;
`;

const ROUTES = [
  { to: '/',            end: true,  label: 'Башкы',    IconOn: IoHome,         IconOff: IoHomeOutline },
  { to: '/patients',    end: false, label: 'Бейтаптар',IconOn: IoPeople,       IconOff: IoPeopleOutline },
  { to: '/calendar',    end: false, label: 'Календар', IconOn: IoCalendar,     IconOff: IoCalendarOutline },
  { to: '/reports',     end: false, label: 'Отчет',    IconOn: IoStatsChart,   IconOff: IoStatsChartOutline },
  { to: '/debts',       end: false, label: 'Карыз',    IconOn: IoWallet,       IconOff: IoWalletOutline },
  { to: '/invoices',    end: false, label: 'Эсеп',     IconOn: IoDocumentText, IconOff: IoDocumentTextOutline },
];

export const BottomNav = () => {
  const { pathname } = useLocation();

  return (
    <Nav>
      {ROUTES.map(({ to, end, label, IconOn, IconOff }) => {
        const isActive = end ? pathname === to : pathname.startsWith(to);
        return (
          <Item key={to} to={to} end={end}>
            <IconWrap active={isActive}>
              {isActive ? <IconOn size={22} /> : <IconOff size={22} />}
            </IconWrap>
            <span>{label}</span>
          </Item>
        );
      })}
    </Nav>
  );
};
