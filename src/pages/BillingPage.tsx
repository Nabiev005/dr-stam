import styled from 'styled-components';
import { jsPDF } from 'jspdf';
import { IoReceiptOutline, IoCheckmarkCircle, IoAlertCircle, IoPrint } from 'react-icons/io5';
import { type PatientData } from '../types';

const BillingWrapper = styled.div` padding: 30px; `;

const BillCard = styled.div<{ color: string }>`
  background: white;
  padding: 20px;
  border-radius: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
  border-left: 6px solid ${props => props.color};
`;

const StatusBadge = styled.span<{ status: 'paid' | 'pending' }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  background: ${props => props.status === 'paid' ? '#dcfce7' : '#fee2e2'};
  color: ${props => props.status === 'paid' ? '#166534' : '#991b1b'};
`;

const PrintButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f1f5f9;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.2s;
  &:hover { background: #e2e8f0; }
`;

export const BillingPage = ({ patients }: { patients: PatientData[] }) => {
  
  // PDF түзүүчү функция
  const generatePDF = (p: PatientData) => {
    const doc = new jsPDF();
    doc.text("Clinic Receipt", 20, 20);
    doc.text(`Patient: ${p.name}`, 20, 30);
    doc.text(`Service: ${p.service}`, 20, 40);
    doc.text(`Price: ${p.price} s`, 20, 50);
    doc.text(`Paid: ${p.paid} s`, 20, 60);
    doc.text(`Debt: ${p.price - p.paid} s`, 20, 70);
    doc.save(`${p.name}_receipt.pdf`);
  };

  return (
    <BillingWrapper>
      <h1>🧾 Төлөмдөр жана Квитанциялар</h1>
      
      {patients.map(p => {
        const isPaid = p.paid >= p.price;
        return (
          <BillCard key={p.id} color={isPaid ? '#10b981' : '#ef4444'}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ padding: '10px', background: '#f8fafc', borderRadius: '12px' }}>
                <IoReceiptOutline size={24} />
              </div>
              <div>
                <h3 style={{ margin: 0 }}>{p.name}</h3>
                <p style={{ margin: 0, color: '#64748b' }}>{p.service} • {p.price} с</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <StatusBadge status={isPaid ? 'paid' : 'pending'}>
                {isPaid ? <IoCheckmarkCircle /> : <IoAlertCircle />}
                {isPaid ? 'Толук төлөнгөн' : 'Карыз: ' + (p.price - p.paid) + ' с'}
              </StatusBadge>
              
              <PrintButton onClick={() => generatePDF(p)}>
                <IoPrint /> Квитанция
              </PrintButton>
            </div>
          </BillCard>
        );
      })}
    </BillingWrapper>
  );
};