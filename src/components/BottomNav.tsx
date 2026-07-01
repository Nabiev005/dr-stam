import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import {
  IoHomeOutline, IoPeopleOutline, IoCalendarOutline,
  IoStatsChartOutline, IoWalletOutline, IoDocumentTextOutline,
} from 'react-icons/io5';

const Nav = styled.nav`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #0f172a;
    border-top: 1px solid #1e293b;
    z-index: 1000;
    padding-bottom: env(safe-area-inset-bottom, 8px);
  }
`;

const NavItem = styled(NavLink)`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px 4px 8px;
  color: #64748b;
  text-decoration: none;
  font-size: 10px;
  gap: 4px;
  transition: color 0.2s;

  &.active {
    color: #10b981;
  }

  &:hover {
    color: #94a3b8;
  }
`;

export const BottomNav = () => (
  <Nav>
    <NavItem to="/" end>
      <IoHomeOutline size={22} />
      <span>Башкы</span>
    </NavItem>
    <NavItem to="/patients">
      <IoPeopleOutline size={22} />
      <span>Бейтаптар</span>
    </NavItem>
    <NavItem to="/calendar">
      <IoCalendarOutline size={22} />
      <span>Календар</span>
    </NavItem>
    <NavItem to="/reports">
      <IoStatsChartOutline size={22} />
      <span>Отчет</span>
    </NavItem>
    <NavItem to="/debts">
      <IoWalletOutline size={22} />
      <span>Карыз</span>
    </NavItem>
    <NavItem to="/invoices">
      <IoDocumentTextOutline size={22} />
      <span>Эсеп</span>
    </NavItem>
  </Nav>
);
