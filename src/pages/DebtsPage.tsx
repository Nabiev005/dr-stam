import styled from 'styled-components';
import { type PatientData } from '../types';

const DebtsWrapper = styled.div` padding: 30px; `;
const DebtCard = styled.div` 
  background: white; 
  padding: 20px; 
  border-radius: 15px; 
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  margin-bottom: 20px;
`;

const DebtRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 15px 0;
  border-bottom: 1px solid #f3f4f6;
`;

export const DebtsPage = ({ patients }: { patients: PatientData[] }) => {
  // Карызы бар бейтаптарды фильтрлөө
  const debtors = patients.filter(p => p.price - p.paid > 0);
  const totalDebt = debtors.reduce((acc, p) => acc + (p.price - p.paid), 0);

  return (
    <DebtsWrapper>
      <h1>💰 Карыздар</h1>
      
      <DebtCard>
        <h3 style={{color: '#ef4444'}}>Жалпы карыз суммасы: {totalDebt.toLocaleString()} с</h3>
      </DebtCard>

      <div style={{ background: 'white', padding: '20px', borderRadius: '15px' }}>
        {debtors.length > 0 ? (
          debtors.map(p => (
            <DebtRow key={p.id}>
              <div>
                <strong>{p.name}</strong>
                <p style={{margin: 0, color: '#6b7280'}}>{p.service}</p>
              </div>
              <div style={{textAlign: 'right'}}>
                <span style={{color: '#ef4444', fontWeight: 'bold'}}>
                  {p.price - p.paid} с
                </span>
                <p style={{margin: 0, fontSize: '12px'}}>Төлөнгөн: {p.paid} с</p>
              </div>
            </DebtRow>
          ))
        ) : (
          <p>Учурда карызы бар бейтаптар жок. ✅</p>
        )}
      </div>
    </DebtsWrapper>
  );
};