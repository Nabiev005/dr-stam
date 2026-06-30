import styled from 'styled-components';
import { type PatientData } from '../types';
import { IoPeople, IoWallet, IoCalendarNumber } from 'react-icons/io5';

const HomeWrapper = styled.div` padding: 30px; `;

const StatsGrid = styled.div` 
  display: grid; 
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
  gap: 24px; 
  margin-bottom: 40px; 
`;

const Card = styled.div` 
  background: white; 
  padding: 24px; 
  border-radius: 20px; 
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05);
  display: flex;
  align-items: center;
  gap: 20px;
`;

const TableSection = styled.div`
  background: white;
  padding: 24px;
  border-radius: 20px;
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05);
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  padding: 15px 0;
  border-bottom: 1px solid #f3f4f6;
`;

export const HomePage = ({ patients }: { patients: PatientData[] }) => {
  const totalPatients = patients.length;
  const totalDebt = patients.reduce((acc, p) => acc + (p.price - p.paid), 0);
  // Акыркы 5 бейтап
  const recentPatients = [...patients].reverse().slice(0, 5);

  return (
    <HomeWrapper>
      <h1>Башкы бет</h1>
      
      <StatsGrid>
        <Card>
          <IoPeople size={40} color="#3b82f6" />
          <div>
            <h3>Бейтаптар</h3>
            <p style={{fontSize: '24px', fontWeight: '800'}}>{totalPatients}</p>
          </div>
        </Card>
        <Card>
          <IoWallet size={40} color="#ef4444" />
          <div>
            <h3>Жалпы карыз</h3>
            <p style={{fontSize: '24px', fontWeight: '800'}}>{totalDebt.toLocaleString()} с</p>
          </div>
        </Card>
        <Card>
          <IoCalendarNumber size={40} color="#10b981" />
          <div>
            <h3>Бүгүн</h3>
            <p style={{fontSize: '20px', fontWeight: '600'}}>{new Date().toLocaleDateString('ky-KG')}</p>
          </div>
        </Card>
      </StatsGrid>

      <TableSection>
        <h2>Акыркы катталган бейтаптар</h2>
        {recentPatients.length > 0 ? (
          <>
            <Row style={{fontWeight: 'bold', color: '#6b7280'}}>
              <span>Аты-жөнү</span>
              <span>Дарылоо</span>
              <span>Карызы</span>
            </Row>
            {recentPatients.map((p) => (
              <Row key={p.id}>
                <span>{p.name}</span>
                <span>{p.service}</span>
                <span style={{color: p.price - p.paid > 0 ? '#ef4444' : '#10b981'}}>
                  {p.price - p.paid} с
                </span>
              </Row>
            ))}
          </> 
        ) : (
          <p>Азырынча маалымат жок.</p>
        )}
      </TableSection>
    </HomeWrapper>
  );
};