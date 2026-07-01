import styled from 'styled-components';
import { IoClose, IoCallOutline, IoLogoWhatsapp, IoTimeOutline, IoCalendarOutline, IoWalletOutline } from 'react-icons/io5';
import { type PatientData } from '../types';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

const Modal = styled.div`
  background: #f9fafb;
  border-radius: 20px;
  width: 100%;
  max-width: 640px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0,0,0,0.25);
`;

const Header = styled.div`
  background: #0f172a;
  color: white;
  padding: 24px;
  border-radius: 20px 20px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const CloseBtn = styled.button`
  background: rgba(255,255,255,0.1);
  border: none;
  color: white;
  border-radius: 8px;
  padding: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  &:hover { background: rgba(255,255,255,0.2); }
`;

const Body = styled.div` padding: 20px; `;

const InfoRow = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 16px;
`;

const Badge = styled.span<{ color?: string }>`
  background: ${p => p.color || '#f3f4f6'};
  color: ${p => p.color ? 'white' : '#374151'};
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 5px;
`;

const SummaryRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 20px;
`;

const SummaryCard = styled.div<{ accent: string }>`
  background: white;
  border-radius: 12px;
  padding: 14px;
  border-top: 3px solid ${p => p.accent};
  text-align: center;
  p { margin: 4px 0 0; font-size: 18px; font-weight: 800; color: #111827; }
  span { font-size: 12px; color: #6b7280; }
`;

const VisitCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 10px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
`;

const ContactRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const LinkBtn = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
  transition: 0.2s;
`;

interface Props {
  patient: PatientData;
  allPatients: PatientData[];
  onClose: () => void;
}

export const PatientProfileModal = ({ patient, allPatients, onClose }: Props) => {
  const visits = allPatients
    .filter(p => p.phone === patient.phone)
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  const totalPaid  = visits.reduce((s, p) => s + p.paid, 0);
  const totalDebt  = visits.reduce((s, p) => s + Math.max(0, p.price - p.paid), 0);
  const totalPrice = visits.reduce((s, p) => s + p.price, 0);

  const digits = patient.phone.replace(/\D/g, '');
  const intl   = digits.startsWith('996') ? digits : '996' + digits.replace(/^0/, '');
  const waText = encodeURIComponent(`Саламатсызбы, ${patient.name}! Стоматология клиникасынан кабарлайбыз.`);

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <Header>
          <div>
            <h2 style={{ margin: '0 0 6px' }}>{patient.name}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: 14 }}>
              <IoCallOutline size={15} /> {patient.phone}
            </div>
          </div>
          <CloseBtn onClick={onClose}><IoClose size={20} /></CloseBtn>
        </Header>

        <Body>
          <ContactRow>
            <LinkBtn href={`tel:${patient.phone}`} style={{ background: '#f1f5f9', color: '#334155' }}>
              <IoCallOutline size={15} /> Чалуу
            </LinkBtn>
            <LinkBtn href={`https://wa.me/${intl}?text=${waText}`} target="_blank" rel="noreferrer"
              style={{ background: '#25d366', color: 'white' }}>
              <IoLogoWhatsapp size={15} /> WhatsApp
            </LinkBtn>
          </ContactRow>

          <SummaryRow>
            <SummaryCard accent="#3b82f6">
              <span>Барыш саны</span>
              <p>{visits.length}</p>
            </SummaryCard>
            <SummaryCard accent="#10b981">
              <span>Төлөнгөн</span>
              <p>{totalPaid.toLocaleString()} с</p>
            </SummaryCard>
            <SummaryCard accent="#ef4444">
              <span>Карыз</span>
              <p style={{ color: totalDebt > 0 ? '#ef4444' : '#10b981' }}>{totalDebt.toLocaleString()} с</p>
            </SummaryCard>
          </SummaryRow>

          <h4 style={{ margin: '0 0 12px', color: '#374151' }}>Барыш тарыхы ({visits.length})</h4>

          {visits.map(v => {
            const debt = v.price - v.paid;
            return (
              <VisitCard key={v.id}>
                <div>
                  <strong style={{ fontSize: 14 }}>{v.service || '—'}</strong>
                  {v.tooth && <span style={{ color: '#6b7280', fontSize: 13 }}> • Тиш: {v.tooth}</span>}
                  <InfoRow style={{ marginTop: 6, marginBottom: 0 }}>
                    {v.date && (
                      <Badge>
                        <IoCalendarOutline size={12} /> {v.date}
                      </Badge>
                    )}
                    {v.appointmentTime && (
                      <Badge>
                        <IoTimeOutline size={12} /> {v.appointmentTime}
                      </Badge>
                    )}
                    {v.time && !v.appointmentTime && (
                      <Badge>
                        <IoTimeOutline size={12} /> {v.time}
                      </Badge>
                    )}
                  </InfoRow>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <Badge color={debt > 0 ? '#ef4444' : '#10b981'}>
                    <IoWalletOutline size={12} />
                    {debt > 0 ? `Карыз: ${debt.toLocaleString()} с` : 'Төлөндү'}
                  </Badge>
                  <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
                    {v.price.toLocaleString()} с / {v.paid.toLocaleString()} с
                  </div>
                </div>
              </VisitCard>
            );
          })}

          {totalPrice > 0 && (
            <div style={{ background: '#f8fafc', borderRadius: 10, padding: '12px 16px', marginTop: 8, fontSize: 13, color: '#64748b' }}>
              Жалпы: <strong style={{ color: '#111827' }}>{totalPrice.toLocaleString()} с</strong> • Төлөнгөн:{' '}
              <strong style={{ color: '#10b981' }}>{totalPaid.toLocaleString()} с</strong>
              {totalDebt > 0 && <> • Карыз: <strong style={{ color: '#ef4444' }}>{totalDebt.toLocaleString()} с</strong></>}
            </div>
          )}
        </Body>
      </Modal>
    </Overlay>
  );
};
