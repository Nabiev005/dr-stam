import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

const Header = styled.header`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 999;
    height: 58px;
    padding: 0 16px;
    padding-top: env(safe-area-inset-top, 0px);
    background: linear-gradient(135deg, #0f172a 0%, #0c1424 100%);
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 1px 0 rgba(255,255,255,0.05), 0 4px 12px rgba(0,0,0,0.3);
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
`;

const LogoArea = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;

  img {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid rgba(13,148,136,0.7);
    background: white;
  }

  .name {
    font-size: 15px;
    font-weight: 700;
    color: white;
  }
`;

const PageTitle = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  background: rgba(255,255,255,0.05);
  padding: 4px 12px;
  border-radius: 99px;
  border: 1px solid rgba(255,255,255,0.07);
`;

const PAGE_TITLES: Record<string, string> = {
  '/':              'Башкы бет',
  '/patients':      'Бейтаптар',
  '/calendar':      'Календар',
  '/reports':       'Отчеттор',
  '/debts':         'Карыздар',
  '/invoices':      'Эсептер',
  '/notifications': 'Эскертмелер',
  '/settings':      'Орнотуулар',
};

export const MobileHeader = () => {
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] || '';

  return (
    <Header>
      <LogoArea>
        <img src="/logo.png" alt="Dr Omurbek" />
        <span className="name">Dr Omurbek</span>
      </LogoArea>
      {title && <PageTitle>{title}</PageTitle>}
    </Header>
  );
};
