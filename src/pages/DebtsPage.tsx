import styled from 'styled-components';
import { IoLogoWhatsapp, IoCallOutline } from 'react-icons/io5';
import { type PatientData } from '../types';

const DebtsWrapper = styled.div` padding: 30px; `;

const SummaryCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  margin-bottom: 20px;
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
`;

const DebtRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f3f4f6;
  gap: 12px;
  flex-wrap: wrap;
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
  transition: 0.2s;
  &:hover { background: #e2e8f0; }
`;

const DebtBadge = styled.span`
  background: #fee2e2;
  color: #991b1b;
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 14px;
`;

function buildWhatsApp(phone: string, name: string, debt: number) {
  const digits = phone.replace(/\D/g, '');
  const intl = digits.startsWith('996') ? digits : '996' + digits.replace(/^0/, '');
  const text = encodeURIComponent(
    `Саламатсызбы, ${name}! Стоматология клиникасынан кабарлайбыз.\nСиздин карызыңыз: ${debt.toLocaleString()} сом.\nТөлөп берүүңүздү сурайбыз. Рахмат!`
  );
  return `https://wa.me/${intl}?text=${text}`;
}

export const DebtsPage = ({ patients }: { patients: PatientData[] }) => {
  const debtors  = patients.filter(p => p.price - p.paid > 0);
  const totalDebt = debtors.reduce((acc, p) => acc + (p.price - p.paid), 0);

  return (
    <DebtsWrapper>
      <h1 style={{ marginBottom: '20px' }}>Карыздар</h1>

      <SummaryCard>
        <div>
          <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>Жалпы карыз суммасы</p>
          <p style={{ margin: 0, fontSize: 28, fontWeight: 800, color: '#ef4444' }}>
            {totalDebt.toLocaleString()} с
          </p>
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>Карызы бар бейтаптар</p>
          <p style={{ margin: 0, fontSize: 28, fontWeight: 800 }}>{debtors.length}</p>
        </div>
      </SummaryCard>

      <div style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        {debtors.length === 0 ? (
          <p style={{ color: '#10b981', fontWeight: 600 }}>Карызы бар бейтаптар жок. ✅</p>
        ) : (
          debtors.map(p => (
            <DebtRow key={p.id}>
              <div style={{ flex: 1 }}>
                <strong>{p.name}</strong>
                <p style={{ margin: '2px 0 0', color: '#6b7280', fontSize: 13 }}>
                  {p.service} • {p.phone}
                </p>
              </div>
              <DebtBadge>{(p.price - p.paid).toLocaleString()} с</DebtBadge>
              <div style={{ display: 'flex', gap: '8px' }}>
                <CallBtn href={`tel:${p.phone}`}>
                  <IoCallOutline size={15} /> Чалуу
                </CallBtn>
                <WhatsAppBtn href={buildWhatsApp(p.phone, p.name, p.price - p.paid)} target="_blank" rel="noreferrer">
                  <IoLogoWhatsapp size={15} /> WhatsApp
                </WhatsAppBtn>
              </div>
            </DebtRow>
          ))
        )}
      </div>
    </DebtsWrapper>
  );
};
