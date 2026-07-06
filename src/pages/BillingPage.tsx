import { useState } from 'react';
import styled from 'styled-components';
import {
  IoCheckmarkCircle, IoAlertCircle,
  IoPrint, IoSearchOutline,
} from 'react-icons/io5';
import { type PatientData } from '../types';

/* ── helpers ── */

function refNum(p: PatientData): string {
  const s = (p.id || '') + p.name + p.date;
  let h = 5381;
  for (const c of s) h = ((h * 33) ^ c.charCodeAt(0)) & 0x7fffffff;
  return String(h).padStart(8, '0').slice(-8);
}

function fmt(n: number) {
  return n.toLocaleString('ru-RU');
}

function generateReceiptHTML(
  p: PatientData,
  clinicName: string,
  doctorName: string,
  clinicPhone: string,
): string {
  const debt = Math.max(0, p.price - p.paid);
  const isPaid = debt === 0;
  const ref = refNum(p);
  const printDate = new Date().toLocaleDateString('ru-RU');
  const printTime = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

  return `<!DOCTYPE html>
<html lang="ky">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Квитанция — ${p.name}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{
    font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
    background:#f0fdfa;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:flex-start;
    min-height:100vh;
    padding:32px 16px 48px;
    -webkit-print-color-adjust:exact;
    print-color-adjust:exact;
  }
  @media print{
    body{background:white;padding:0}
    .no-print{display:none!important}
    .receipt{box-shadow:none;border-radius:0;width:100%;max-width:100%}
  }

  .receipt{
    width:100%;
    max-width:400px;
    background:white;
    border-radius:24px;
    overflow:hidden;
    box-shadow:0 20px 50px rgba(0,0,0,0.18);
  }

  /* === HEADER === */
  .header{
    background:linear-gradient(135deg,#0d9488 0%,#0f766e 100%);
    padding:24px 20px 20px;
    display:flex;
    align-items:center;
    gap:14px;
  }
  .logo-circle{
    width:52px;height:52px;border-radius:50%;
    background:white;
    display:flex;align-items:center;justify-content:center;
    font-size:18px;font-weight:800;
    color:#0d9488;
    flex-shrink:0;
    border:2px solid rgba(255,255,255,0.4);
    letter-spacing:-1px;
  }
  .clinic-name{font-size:17px;font-weight:700;color:white;line-height:1.2}
  .clinic-sub{font-size:12px;color:rgba(255,255,255,0.75);margin-top:2px}
  .clinic-phone{font-size:12px;color:rgba(255,255,255,0.65);margin-top:1px}

  /* === STATUS STRIP === */
  .status-strip{
    background:${isPaid ? '#dcfce7' : '#fef3c7'};
    padding:16px 20px;
    display:flex;
    align-items:center;
    gap:12px;
    border-bottom:1px solid ${isPaid ? '#bbf7d0' : '#fde68a'};
  }
  .status-icon{
    width:44px;height:44px;border-radius:50%;
    background:${isPaid ? '#10b981' : '#f59e0b'};
    display:flex;align-items:center;justify-content:center;
    color:white;font-size:22px;font-weight:700;
    flex-shrink:0;
  }
  .status-title{font-size:16px;font-weight:700;color:#0f172a}
  .status-sub{font-size:12px;color:#64748b;margin-top:2px}

  /* === REF ROW === */
  .ref-row{
    display:flex;justify-content:space-between;align-items:center;
    padding:12px 20px;
    background:#f8fafc;
    border-bottom:1px solid #f1f5f9;
    font-size:12.5px;
  }
  .ref-num{font-weight:700;color:#334155;font-family:monospace;font-size:13px;letter-spacing:0.5px}
  .ref-date{color:#64748b}

  /* === DETAILS === */
  .section-title{
    font-size:11px;font-weight:600;
    text-transform:uppercase;letter-spacing:0.07em;
    color:#94a3b8;
    padding:14px 20px 8px;
  }
  .detail-row{
    display:flex;justify-content:space-between;align-items:flex-start;
    padding:10px 20px;
    border-bottom:1px solid #f8fafc;
    gap:12px;
  }
  .detail-row:last-child{border-bottom:none}
  .detail-label{font-size:13px;color:#64748b;flex-shrink:0}
  .detail-value{font-size:13.5px;font-weight:600;color:#0f172a;text-align:right}

  /* === TOTALS === */
  .totals{
    background:#f8fafc;
    padding:14px 20px 10px;
    margin:0 0 0;
    border-top:1px solid #f1f5f9;
  }
  .total-row{
    display:flex;justify-content:space-between;align-items:center;
    padding:7px 0;
  }
  .total-label{font-size:13.5px;color:#334155}
  .total-value{font-size:14px;font-weight:700;color:#0f172a}
  .total-value.green{color:#059669}
  .total-value.red{color:#dc2626}
  .divider{height:1px;background:#e2e8f0;margin:8px 0}
  .total-row.big .total-label{font-size:14px;font-weight:600;color:#0f172a}
  .total-row.big .total-value{font-size:16px;font-weight:800}

  /* === STATUS BADGE === */
  .badge{
    margin:0 20px 20px;
    padding:14px 20px;
    border-radius:14px;
    text-align:center;
    font-size:14px;font-weight:700;
    background:${isPaid ? '#dcfce7' : '#fee2e2'};
    color:${isPaid ? '#065f46' : '#991b1b'};
    border:1.5px solid ${isPaid ? '#86efac' : '#fca5a5'};
    letter-spacing:0.3px;
  }

  /* === TEAR DIVIDER === */
  .tear{
    position:relative;
    height:20px;
    overflow:hidden;
    margin:0 -1px;
  }
  .tear::before{
    content:'';
    display:block;
    height:2px;
    background:repeating-linear-gradient(
      90deg,
      #cbd5e1 0px,#cbd5e1 8px,
      transparent 8px,transparent 14px
    );
    position:absolute;
    top:10px;left:0;right:0;
  }
  .tear-circle{
    position:absolute;top:50%;transform:translateY(-50%);
    width:18px;height:18px;border-radius:50%;background:#f0fdfa;
    border:1px solid #e2e8f0;
  }
  .tear-circle.l{left:-9px}
  .tear-circle.r{right:-9px}

  /* === FOOTER === */
  .footer{
    padding:14px 20px 20px;
    text-align:center;
  }
  .footer-thanks{font-size:14px;font-weight:600;color:#0f172a;margin-bottom:4px}
  .footer-sub{font-size:12px;color:#94a3b8}

  /* === PRINT BUTTON === */
  .print-btn{
    margin-top:20px;
    display:flex;gap:10px;justify-content:center;
  }
  .btn{
    padding:12px 28px;border-radius:12px;font-size:14px;font-weight:600;
    cursor:pointer;border:none;font-family:inherit;transition:0.15s;
  }
  .btn-primary{background:#0d9488;color:white}
  .btn-primary:hover{background:#0f766e}
  .btn-secondary{background:#f1f5f9;color:#334155}
  .btn-secondary:hover{background:#e2e8f0}
</style>
</head>
<body>

<div class="receipt">

  <!-- HEADER -->
  <div class="header">
    <div class="logo-circle">DO</div>
    <div>
      <div class="clinic-name">${clinicName}</div>
      <div class="clinic-sub">Тиш Доктур Клиникасы</div>
      ${clinicPhone ? `<div class="clinic-phone">${clinicPhone}</div>` : ''}
    </div>
  </div>

  <!-- STATUS STRIP -->
  <div class="status-strip">
    <div class="status-icon">${isPaid ? '✓' : '!'}</div>
    <div>
      <div class="status-title">КВИТАНЦИЯ</div>
      <div class="status-sub">${isPaid ? 'Дарылоо акысы толук төлөндү' : `Карыз: ${fmt(debt)} сом`}</div>
    </div>
  </div>

  <!-- REF ROW -->
  <div class="ref-row">
    <span class="ref-num">№ ${ref}</span>
    <span class="ref-date">${p.date}${p.time ? ' · ' + p.time : ''}</span>
  </div>

  <!-- PATIENT DETAILS -->
  <div class="section-title">Бейтаптын маалыматы</div>
  <div class="detail-row">
    <span class="detail-label">Аты-жөнү</span>
    <span class="detail-value">${p.name}</span>
  </div>
  <div class="detail-row">
    <span class="detail-label">Телефон</span>
    <span class="detail-value">${p.phone}</span>
  </div>
  <div class="detail-row">
    <span class="detail-label">Тиш номери</span>
    <span class="detail-value">${p.tooth}</span>
  </div>
  <div class="detail-row">
    <span class="detail-label">Дарылоо</span>
    <span class="detail-value">${p.service}</span>
  </div>
  <div class="detail-row">
    <span class="detail-label">Дарыгер</span>
    <span class="detail-value">${doctorName}</span>
  </div>

  <!-- TOTALS -->
  <div class="totals">
    <div class="total-row">
      <span class="total-label">Жалпы сумма</span>
      <span class="total-value">${fmt(p.price)} сом</span>
    </div>
    <div class="total-row">
      <span class="total-label">Төлөнгөн</span>
      <span class="total-value green">${fmt(p.paid)} сом</span>
    </div>
    <div class="divider"></div>
    <div class="total-row big">
      <span class="total-label">Карыз</span>
      <span class="total-value ${debt > 0 ? 'red' : 'green'}">${fmt(debt)} сом</span>
    </div>
  </div>

  <!-- STATUS BADGE -->
  <div class="badge">
    ${isPaid ? '✓ ТОЛУК ТӨЛӨНГӨН — РАХМАТ!' : `⚠ КАРЫЗ: ${fmt(debt)} СОМ`}
  </div>

  <!-- TEAR DIVIDER -->
  <div class="tear">
    <div class="tear-circle l"></div>
    <div class="tear-circle r"></div>
  </div>

  <!-- FOOTER -->
  <div class="footer">
    <div class="footer-thanks">Соолугуңузга каалоо! 🦷</div>
    <div class="footer-sub">${clinicName} · Басып чыгарылган: ${printDate} ${printTime}</div>
  </div>

</div>

<!-- PRINT BUTTON -->
<div class="print-btn no-print">
  <button class="btn btn-secondary" onclick="window.close()">Жабуу</button>
  <button class="btn btn-primary" onclick="window.print()">🖨 Басып чыгаруу / PDF</button>
</div>

</body>
</html>`;
}

/* ── styled components ── */

const Page = styled.div`
  padding: 28px 24px;
  max-width: 1000px;

  @media (max-width: 768px) {
    padding: 4px 0 0;
  }
`;

const PageTitle = styled.h1`
  font-size: 22px;
  font-weight: 800;
  color: var(--text);
  margin-bottom: 4px;

  @media (max-width: 768px) {
    font-size: 19px;
    padding: 0 16px;
  }
`;

const PageSub = styled.p`
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 20px;

  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

const SummaryRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

const SumCard = styled.div<{ $color: string }>`
  flex: 1;
  min-width: 130px;
  background: white;
  border-radius: 16px;
  padding: 16px 18px;
  border-left: 4px solid ${p => p.$color};
  box-shadow: var(--shadow-sm);

  .label { font-size: 12px; color: var(--text-muted); margin-bottom: 4px; }
  .value { font-size: 18px; font-weight: 800; color: ${p => p.$color}; }
`;

const SearchBar = styled.div`
  position: relative;
  margin-bottom: 16px;

  svg {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-subtle);
  }

  input {
    width: 100%;
    padding: 11px 14px 11px 42px;
    border-radius: 12px;
    border: 1.5px solid var(--border);
    background: white;
    font-size: 14px;
    color: var(--text);
    transition: border-color 0.15s;

    &:focus { border-color: var(--primary); }
    &::placeholder { color: var(--text-subtle); }
  }

  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

const BillList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

const BillCard = styled.div<{ $paid: boolean }>`
  background: white;
  border-radius: 16px;
  padding: 16px 18px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: var(--shadow-sm);
  border-left: 4px solid ${p => p.$paid ? 'var(--green)' : 'var(--red)'};
  transition: transform 0.15s, box-shadow 0.15s;
  flex-wrap: wrap;

  &:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow);
  }
`;

const BillIcon = styled.div<{ $paid: boolean }>`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: ${p => p.$paid ? 'var(--green-bg)' : 'var(--red-bg)'};
  color: ${p => p.$paid ? 'var(--green)' : 'var(--red)'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const BillInfo = styled.div`
  flex: 1;
  min-width: 0;

  .name { font-size: 15px; font-weight: 700; color: var(--text); }
  .meta { font-size: 12.5px; color: var(--text-muted); margin-top: 2px; }
`;

const BillRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const StatusBadge = styled.span<{ $paid: boolean }>`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  border-radius: 99px;
  font-size: 12.5px;
  font-weight: 600;
  background: ${p => p.$paid ? 'var(--green-bg)' : 'var(--red-bg)'};
  color: ${p => p.$paid ? '#065f46' : '#991b1b'};
  white-space: nowrap;
`;

const PrintBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 7px;
  background: var(--primary);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, transform 0.12s;
  white-space: nowrap;

  &:hover {
    background: var(--primary-hover);
    transform: translateY(-1px);
  }

  &:active { transform: translateY(0); }
`;

const Empty = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: var(--text-subtle);
  font-size: 15px;
`;

/* ── component ── */

export const BillingPage = ({ patients }: { patients: PatientData[] }) => {
  const clinicName  = localStorage.getItem('clinicName')  || 'Стоматология клиникасы';
  const doctorName  = localStorage.getItem('doctorName')  || 'Дарыгер';
  const clinicPhone = localStorage.getItem('clinicPhone') || '';

  const [search, setSearch] = useState('');

  const totalRevenue = patients.reduce((s, p) => s + p.paid, 0);
  const totalDebt    = patients.reduce((s, p) => s + Math.max(0, p.price - p.paid), 0);
  const paidCount    = patients.filter(p => p.paid >= p.price).length;

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.service.toLowerCase().includes(search.toLowerCase()),
  );

  const openReceipt = (p: PatientData) => {
    const html = generateReceiptHTML(p, clinicName, doctorName, clinicPhone);
    const win = window.open('', '_blank', 'width=500,height=750');
    if (win) {
      win.document.write(html);
      win.document.close();
    }
  };

  return (
    <Page>
      <PageTitle>Квитанциялар</PageTitle>
      <PageSub>Бейтаптардын төлөм маалыматы</PageSub>

      <SummaryRow>
        <SumCard $color="var(--green)">
          <div className="label">Жалпы киреше</div>
          <div className="value">{totalRevenue.toLocaleString()} с</div>
        </SumCard>
        <SumCard $color="var(--red)">
          <div className="label">Жалпы карыз</div>
          <div className="value">{totalDebt.toLocaleString()} с</div>
        </SumCard>
        <SumCard $color="var(--blue)">
          <div className="label">Толук төлөгөн</div>
          <div className="value">{paidCount} / {patients.length}</div>
        </SumCard>
      </SummaryRow>

      <SearchBar>
        <IoSearchOutline size={18} />
        <input
          type="text"
          placeholder="Издөө (аты же дарылоо)..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </SearchBar>

      <BillList>
        {filtered.length === 0 && <Empty>Маалымат жок</Empty>}
        {[...filtered].reverse().map(p => {
          const isPaid = p.paid >= p.price;
          const debt = p.price - p.paid;
          return (
            <BillCard key={p.id} $paid={isPaid}>
              <BillIcon $paid={isPaid}>
                {isPaid
                  ? <IoCheckmarkCircle size={24} />
                  : <IoAlertCircle size={24} />}
              </BillIcon>

              <BillInfo>
                <div className="name">{p.name}</div>
                <div className="meta">
                  {p.service} · {p.price.toLocaleString()} с · {p.date}
                </div>
              </BillInfo>

              <BillRight>
                <StatusBadge $paid={isPaid}>
                  {isPaid
                    ? <><IoCheckmarkCircle size={13} /> Толук төлөнгөн</>
                    : `Карыз: ${debt.toLocaleString()} с`}
                </StatusBadge>
                <PrintBtn onClick={() => openReceipt(p)}>
                  <IoPrint size={15} /> Квитанция
                </PrintBtn>
              </BillRight>
            </BillCard>
          );
        })}
      </BillList>
    </Page>
  );
};
