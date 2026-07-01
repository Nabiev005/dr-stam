import styled from 'styled-components';
import { IoCheckmarkDone, IoWallet, IoLogoWhatsapp, IoCallOutline } from 'react-icons/io5';
import { type PatientData } from '../types';

const PageWrapper = styled.div` padding: 30px; max-width: 860px; margin: auto; `;

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
  gap: 12px;
  flex-wrap: wrap;

  &:hover { transform: translateY(-2px); }
`;

const IconBox = styled.div<{ color: string }>`
  background: ${props => props.color}15;
  padding: 12px;
  border-radius: 12px;
  color: ${props => props.color};
  margin-right: 16px;
  flex-shrink: 0;
`;

const WhatsAppBtn = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 8px;
  background: #25d366;
  color: white;
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  transition: 0.2s;
  &:hover { background: #1da851; }
`;

const CallBtn = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 8px;
  background: #f1f5f9;
  color: #334155;
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  transition: 0.2s;
  &:hover { background: #e2e8f0; }
`;

function buildWhatsApp(phone: string, name: string, debt: number) {
  const digits = phone.replace(/\D/g, '');
  const intl = digits.startsWith('996') ? digits : '996' + digits.replace(/^0/, '');
  const text = encodeURIComponent(
    `Саламатсызбы, ${name}! Стоматология клиникасынан кабарлайбыз.\nСиздин карызыңыз: ${debt.toLocaleString()} сом.\nТөлөп берүүңүздү сурайбыз. Рахмат!`
  );
  return `https://wa.me/${intl}?text=${text}`;
}

export const NotificationsPage = ({ patients }: { patients: PatientData[] }) => {
  const debtors = patients.filter(p => p.price - p.paid > 0);

  return (
    <PageWrapper>
      <h1 style={{ marginBottom: '25px' }}>Эскертмелер борбору</h1>

      {debtors.length > 0 ? (
        debtors.map(p => (
          <NotificationCard key={p.id} type="debt">
            <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <IconBox color="#ef4444"><IoWallet size={24} /></IconBox>
              <div>
                <h4 style={{ margin: 0 }}>Төлөм боюнча эскертүү</h4>
                <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>
                  <strong>{p.name}</strong> — карыз:{' '}
                  <span style={{ color: '#ef4444', fontWeight: 'bold' }}>{(p.price - p.paid).toLocaleString()} с</span>
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <CallBtn href={`tel:${p.phone}`}>
                <IoCallOutline size={15} /> {p.phone}
              </CallBtn>
              <WhatsAppBtn href={buildWhatsApp(p.phone, p.name, p.price - p.paid)} target="_blank" rel="noreferrer">
                <IoLogoWhatsapp size={15} /> Эскертмени жөнөт
              </WhatsAppBtn>
            </div>
          </NotificationCard>
        ))
      ) : (
        <NotificationCard type="success">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <IconBox color="#10b981"><IoCheckmarkDone size={24} /></IconBox>
            <div>
              <h4 style={{ margin: 0 }}>Бардыгы жайында</h4>
              <p style={{ margin: '5px 0 0', color: '#64748b' }}>
                Учурда бардык эсептер төлөнгөн, жаңы эскертмелер жок.
              </p>
            </div>
          </div>
        </NotificationCard>
      )}
    </PageWrapper>
  );
};
