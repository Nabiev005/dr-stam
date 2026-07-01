import { NavLink } from 'react-router-dom';
import { SidebarContainer, Logo, MenuItem } from './Sidebar.styles';
import { 
  IoHomeOutline, IoPeopleOutline, IoCalendarOutline, 
  IoStatsChartOutline, IoWalletOutline, IoDocumentTextOutline, 
  IoNotificationsOutline, IoSettingsOutline 
} from 'react-icons/io5';



export const Sidebar = () => {
  return (
    <SidebarContainer>
      <Logo>🦷 Dr Omurbek</Logo>
      

      <MenuItem as={NavLink} to="/" end>
        <IoHomeOutline size={22} /> <span>Башкы бет</span>
      </MenuItem>
      
      <MenuItem as={NavLink} to="/patients">
        <IoPeopleOutline size={22} /> <span>Бейтаптар</span>
      </MenuItem>
      
      <MenuItem as={NavLink} to="/calendar">
        <IoCalendarOutline size={22} /> <span>Календар</span>
      </MenuItem>
      
      <MenuItem as={NavLink} to="/reports">
        <IoStatsChartOutline size={22} /> <span>Отчеттор</span>
      </MenuItem>
      
      <MenuItem as={NavLink} to="/debts">
        <IoWalletOutline size={22} /> <span>Карыздар</span>
      </MenuItem>
      
      <MenuItem as={NavLink} to="/invoices">
        <IoDocumentTextOutline size={22} /> <span>Эсептер</span>
      </MenuItem>
      
      <MenuItem as={NavLink} to="/notifications">
        <IoNotificationsOutline size={22} /> <span>Эскертмелер</span>
      </MenuItem>
      
      <MenuItem as={NavLink} to="/settings" style={{ marginTop: 'auto' }}>
        <IoSettingsOutline size={22} /> <span>Орнотуулар</span>
      </MenuItem>
    </SidebarContainer>
  );
};