import styled from 'styled-components';
import { IoAlertCircle, IoCheckmarkDone, IoWallet, IoPerson } from 'react-icons/io5';
import { type PatientData } from '../types';

const PageWrapper = styled.div` padding: 30px; max-width: 800px; margin: auto; `;

const NotificationCard = styled.div<{ type: 'debt' | 'success' }>`
  background: white;
  padding: 20px;
  border-radius: 16px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
  border-left: 6px solid ${props => props.type === 'debt' ? '#ef4444' : '#10b981'};
  transition: transform 0.2s;

  &:hover { transform: translateY(-2px); }
`;

const IconBox = styled.div<{ color: string }>`
  background: ${props => props.color}15;
  padding: 12px;
  border-radius: 12px;
  color: ${props => props.color};
  margin-right: 20px;
`;

export const NotificationsPage = ({ patients }: { patients: PatientData[] }) => {
  const debtors = patients.filter(p => p.price - p.paid > 0);

  return (
    <PageWrapper>
      <h1 style={{ marginBottom: '25px' }}>🔔 Эскертмелер борбору</h1>
      
      {debtors.length > 0 ? (
        debtors.map(p => (
          <NotificationCard key={p.id} type="debt">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <IconBox color="#ef4444"><IoWallet size={24} /></IconBox>
              <div>
                <h4 style={{ margin: 0 }}>Төлөм боюнча эскертүү</h4>
                <p style={{ margin: '5px 0 0 0', color: '#64748b' }}>
                  <strong>{p.name}</strong> бейтаптын карызы: 
                  <span style={{ color: '#ef4444', fontWeight: 'bold' }}> {p.price - p.paid} с</span>
                </p>
              </div>
            </div>
            <button style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#3b82f6', color: 'white', cursor: 'pointer' }}>
              Төлөмдү жабуу
            </button>
          </NotificationCard>
        ))
      ) : (
        <NotificationCard type="success">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <IconBox color="#10b981"><IoCheckmarkDone size={24} /></IconBox>
            <div>
              <h4 style={{ margin: 0 }}>Бардыгы жайында</h4>
              <p style={{ margin: '5px 0 0 0', color: '#64748b' }}>Учурда бардык эсептер төлөнгөн, жаңы эскертмелер жок.</p>
            </div>
          </div>
        </NotificationCard>
      )}
    </PageWrapper>
  );
};