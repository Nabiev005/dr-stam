import { NavLink } from 'react-router-dom';
import { SidebarContainer, Logo, MenuItem, NavSection, SettingsItem } from './Sidebar.styles';
import {
  IoHomeOutline, IoPeopleOutline, IoCalendarOutline,
  IoStatsChartOutline, IoWalletOutline, IoDocumentTextOutline,
  IoNotificationsOutline, IoSettingsOutline,
} from 'react-icons/io5';

export const Sidebar = () => {
  return (
    <SidebarContainer>
      <Logo>
        <img src="/logo.png" alt="Dr Omurbek" />
        <div className="logo-text">
          <span className="logo-name">Dr Omurbek</span>
          <span className="logo-sub">Тиш клиникасы</span>
        </div>
      </Logo>

      <NavSection>Негизги</NavSection>

      <MenuItem as={NavLink} to="/" end>
        <IoHomeOutline size={20} /> <span>Башкы бет</span>
      </MenuItem>

      <MenuItem as={NavLink} to="/patients">
        <IoPeopleOutline size={20} /> <span>Бейтаптар</span>
      </MenuItem>

      <MenuItem as={NavLink} to="/calendar">
        <IoCalendarOutline size={20} /> <span>Календар</span>
      </MenuItem>

      <NavSection>Финансы</NavSection>

      <MenuItem as={NavLink} to="/reports">
        <IoStatsChartOutline size={20} /> <span>Отчеттор</span>
      </MenuItem>

      <MenuItem as={NavLink} to="/debts">
        <IoWalletOutline size={20} /> <span>Карыздар</span>
      </MenuItem>

      <MenuItem as={NavLink} to="/invoices">
        <IoDocumentTextOutline size={20} /> <span>Эсептер</span>
      </MenuItem>

      <MenuItem as={NavLink} to="/notifications">
        <IoNotificationsOutline size={20} /> <span>Эскертмелер</span>
      </MenuItem>

      <SettingsItem as={NavLink} to="/settings">
        <IoSettingsOutline size={20} /> <span>Орнотуулар</span>
      </SettingsItem>
    </SidebarContainer>
  );
};
