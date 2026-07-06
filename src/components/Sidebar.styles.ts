import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

export const SidebarContainer = styled.aside`
  width: 240px;
  background: linear-gradient(180deg, #0f172a 0%, #0c1424 100%);
  color: white;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 16px 10px;
  flex-shrink: 0;
  border-right: 1px solid rgba(255,255,255,0.05);

  @media (max-width: 768px) {
    width: 68px;
    padding: 16px 6px;
  }
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
  padding: 10px 8px;
  border-radius: 14px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.07);

  img {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid rgba(13,148,136,0.7);
    background: white;
    flex-shrink: 0;
  }

  .logo-text {
    overflow: hidden;
  }

  .logo-name {
    display: block;
    font-size: 15px;
    font-weight: 700;
    color: white;
    white-space: nowrap;
  }

  .logo-sub {
    display: block;
    font-size: 11px;
    color: #64748b;
    white-space: nowrap;
  }

  @media (max-width: 768px) {
    justify-content: center;
    padding: 8px 4px;
    .logo-text { display: none; }
    img { width: 38px; height: 38px; }
  }
`;

export const NavSection = styled.div`
  font-size: 10.5px;
  font-weight: 600;
  color: #3d5275;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 12px 10px 5px;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const MenuItem = styled(NavLink)`
  padding: 10px 12px;
  margin-bottom: 2px;
  cursor: pointer;
  border-radius: 11px;
  display: flex;
  align-items: center;
  gap: 11px;
  transition: all 0.18s;
  color: #64748b;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;

  svg { flex-shrink: 0; }

  &:hover {
    background: rgba(255,255,255,0.07);
    color: #cbd5e1;
  }

  &.active {
    background: linear-gradient(135deg, rgba(13,148,136,0.22), rgba(13,148,136,0.12));
    color: #2dd4bf;
    border: 1px solid rgba(13,148,136,0.28);
    font-weight: 600;
  }

  @media (max-width: 768px) {
    justify-content: center;
    padding: 10px 8px;
    span { display: none; }
  }
`;

export const SettingsItem = styled(MenuItem)`
  margin-top: auto;
`;
