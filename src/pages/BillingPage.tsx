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
  flex-wrap: wrap;
  gap: 12px;
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

const SummaryBar = styled.div`
  background: white;
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.06);
  margin-bottom: 20px;
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
  span { font-size: 14px; color: #6b7280; }
  strong { font-size: 16px; color: #111827; }
`;

export const BillingPage = ({ patients }: { patients: PatientData[] }) => {
  const clinicName  = localStorage.getItem('clinicName')  || 'Стоматология клиникасы';
  const doctorName  = localStorage.getItem('doctorName')  || 'Дарыгер';
  const clinicPhone = localStorage.getItem('clinicPhone') || '';

  const totalRevenue = patients.reduce((s, p) => s + p.paid, 0);
  const totalDebt    = patients.reduce((s, p) => s + Math.max(0, p.price - p.paid), 0);
  const paidCount    = patients.filter(p => p.paid >= p.price).length;

  const generatePDF = (p: PatientData) => {
    const doc = new jsPDF();

    doc.setFillColor(16, 185, 129);
    doc.rect(0, 0, 210, 35, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(clinicName, 15, 15);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    if (clinicPhone) doc.text(`Tel: ${clinicPhone}`, 15, 23);
    doc.text(`Daryger: ${doctorName}`, 15, 30);

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('KVITANTSIYA / КВИТАНЦИЯ', 15, 50);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Sana / Дата: ${p.date || new Date().toLocaleDateString('ru-RU')}`, 15, 60);
    if (p.time) doc.text(`Убакыт: ${p.time}`, 15, 67);

    doc.setFillColor(248, 250, 252);
    doc.rect(10, 75, 190, 70, 'F');

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Бейтаптын маалыматы:', 15, 85);

    doc.setFont('helvetica', 'normal');
    doc.text(`Аты-жону: ${p.name}`, 15, 95);
    doc.text(`Telefon: ${p.phone}`, 15, 103);
    doc.text(`Tish nomeri: ${p.tooth}`, 110, 95);
    doc.text(`Daryloo: ${p.service}`, 110, 103);

    doc.setLineWidth(0.5);
    doc.setDrawColor(229, 231, 235);
    doc.line(10, 115, 200, 115);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Толомдун маалыматы:', 15, 125);

    doc.setFont('helvetica', 'normal');
    doc.text(`Жалпы сумма:`, 15, 135);
    doc.text(`${p.price.toLocaleString()} som`, 130, 135);

    doc.text(`Tolondu:`, 15, 143);
    doc.setTextColor(16, 185, 129);
    doc.text(`${p.paid.toLocaleString()} som`, 130, 143);

    const debt = p.price - p.paid;
    doc.setTextColor(debt > 0 ? 239 : 16, debt > 0 ? 68 : 185, debt > 0 ? 68 : 129);
    doc.text(`Kalgan karyz:`, 15, 151);
    doc.text(`${debt.toLocaleString()} som`, 130, 151);

    doc.setTextColor(30, 41, 59);
    doc.setFillColor(debt > 0 ? 254 : 220, debt > 0 ? 226 : 252, debt > 0 ? 226 : 231);
    doc.rect(10, 160, 190, 14, 'F');
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(debt > 0 ? 153 : 22, debt > 0 ? 27 : 101, debt > 0 ? 27 : 52);
    doc.text(debt > 0 ? `Karyz: ${debt.toLocaleString()} som` : 'TOLUK TOLONDU ✓', 15, 170);

    doc.setTextColor(148, 163, 184);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`${clinicName} — ${new Date().toLocaleDateString('ru-RU')}`, 15, 285);

    doc.save(`kvitantsiya_${p.name.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <BillingWrapper>
      <h1 style={{ marginBottom: '20px' }}>Төлөмдөр жана Квитанциялар</h1>

      <SummaryBar>
        <div><span>Жалпы киреше</span><br /><strong style={{ color: '#10b981' }}>{totalRevenue.toLocaleString()} с</strong></div>
        <div><span>Жалпы карыз</span><br /><strong style={{ color: '#ef4444' }}>{totalDebt.toLocaleString()} с</strong></div>
        <div><span>Толук төлөгөн</span><br /><strong>{paidCount} / {patients.length}</strong></div>
      </SummaryBar>

      {patients.length === 0 && <p style={{ color: '#9ca3af' }}>Бейтаптар жок.</p>}

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
                <p style={{ margin: '2px 0 0', color: '#64748b', fontSize: '14px' }}>
                  {p.service} • {p.price.toLocaleString()} с • {p.date}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <StatusBadge status={isPaid ? 'paid' : 'pending'}>
                {isPaid ? <IoCheckmarkCircle /> : <IoAlertCircle />}
                {isPaid ? 'Толук төлөнгөн' : `Карыз: ${(p.price - p.paid).toLocaleString()} с`}
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
