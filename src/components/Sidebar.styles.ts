import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

export const SidebarContainer = styled.aside`
  width: 260px;
  background-color: #0f172a;
  color: white;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 20px;
  transition: width 0.3s ease;

  @media (max-width: 768px) {
    width: 70px;
    padding: 20px 10px;
  }
`;

export const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 40px;
  color: white;
  padding-left: 5px;

  @media (max-width: 768px) {
    font-size: 18px;
    text-align: center;
    padding-left: 0;
  }
`;

// MenuItem'ди NavLink катары иштеши үчүн стилдедик
export const MenuItem = styled(NavLink)`
  padding: 12px 15px;
  margin-bottom: 8px;
  cursor: pointer;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: 0.3s;
  color: #94a3b8; /* Өчүрүлгөн түс */
  text-decoration: none; /* Ссылканын астындагы сызыкты алып салуу */

  &:hover {
    background-color: #1e293b;
    color: white;
  }

  /* Активдүү бет болгондогу стил */
  &.active {
    background-color: #1e293b;
    color: #10b981; /* Жашыл түс менен активдүүлүктү белгилейбиз */
    border-left: 4px solid #10b981;
    border-radius: 4px 8px 8px 4px;
  }

  @media (max-width: 768px) {
    justify-content: center;
    span { display: none; }
  }
`;