import { useState } from 'react';
import styled from 'styled-components';
import {
  IoCheckmarkCircle, IoSaveOutline,
  IoBusinessOutline, IoPersonOutline, IoCallOutline, IoLocationOutline,
  IoReceiptOutline,
} from 'react-icons/io5';

/* ── styles ── */

const Page = styled.div`
  padding: 28px 24px;
  max-width: 620px;

  @media (max-width: 768px) {
    padding: 4px 16px 0;
  }
`;

const PageTitle = styled.h1`
  font-size: 22px;
  font-weight: 800;
  color: var(--text);
  margin-bottom: 6px;
`;

const PageSub = styled.p`
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 24px;
`;

const Card = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  margin-bottom: 16px;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 22px 14px;
  border-bottom: 1px solid #f1f5f9;

  .icon-wrap {
    width: 38px;
    height: 38px;
    border-radius: 11px;
    background: var(--primary-light);
    color: var(--primary);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  h3 {
    font-size: 15px;
    font-weight: 700;
    color: var(--text);
    margin: 0;
  }
`;

const CardBody = styled.div`
  padding: 20px 22px;
`;

const Field = styled.div`
  margin-bottom: 14px;

  &:last-of-type { margin-bottom: 0; }
`;

const FieldLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11.5px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 6px;

  svg { color: var(--text-subtle); }
`;

const Input = styled.input`
  width: 100%;
  padding: 11px 14px;
  border: 1.5px solid var(--border);
  border-radius: 11px;
  font-size: 14px;
  color: var(--text);
  background: #f8fafc;
  transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;

  &:focus {
    border-color: var(--primary);
    background: white;
    box-shadow: 0 0 0 3px rgba(13,148,136,0.1);
  }

  &::placeholder { color: var(--text-subtle); }
`;

const SaveBtn = styled.button<{ $saved: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  width: 100%;
  padding: 13px;
  border-radius: 13px;
  border: none;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 20px;
  transition: all 0.2s;
  background: ${p => p.$saved
    ? 'linear-gradient(135deg,#10b981,#059669)'
    : 'linear-gradient(135deg,#0d9488,#0f766e)'};
  color: white;
  box-shadow: ${p => p.$saved ? '0 4px 14px rgba(16,185,129,0.4)' : '0 4px 14px rgba(13,148,136,0.3)'};

  &:hover { filter: brightness(1.06); transform: translateY(-1px); }
  &:active { transform: scale(0.99); }
`;

const InfoCard = styled.div`
  display: flex;
  gap: 14px;
  padding: 20px 22px;
  background: var(--primary-faint);
  border-radius: 16px;
  border: 1px solid var(--primary-light);

  svg { color: var(--primary); flex-shrink: 0; margin-top: 2px; }

  p {
    font-size: 13.5px;
    color: var(--text-2);
    line-height: 1.6;
    margin: 0;
  }

  strong { color: var(--primary); }
`;

/* ── component ── */

export const SettingsPage = () => {
  const [clinicName,  setClinicName]  = useState(() => localStorage.getItem('clinicName')  || '');
  const [doctorName,  setDoctorName]  = useState(() => localStorage.getItem('doctorName')  || '');
  const [clinicPhone, setClinicPhone] = useState(() => localStorage.getItem('clinicPhone') || '');
  const [address,     setAddress]     = useState(() => localStorage.getItem('address')     || '');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem('clinicName',  clinicName);
    localStorage.setItem('doctorName',  doctorName);
    localStorage.setItem('clinicPhone', clinicPhone);
    localStorage.setItem('address',     address);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <Page>
      <PageTitle>Орнотуулар</PageTitle>
      <PageSub>Клиника жана квитанция маалыматтары</PageSub>

      <Card>
        <CardHeader>
          <div className="icon-wrap"><IoBusinessOutline size={20} /></div>
          <h3>Клиника маалыматтары</h3>
        </CardHeader>
        <CardBody>
          <Field>
            <FieldLabel>
              <IoBusinessOutline size={13} /> Клиниканын аты
            </FieldLabel>
            <Input
              value={clinicName}
              onChange={e => setClinicName(e.target.value)}
              placeholder="Стоматология клиникасы"
            />
          </Field>

          <Field>
            <FieldLabel>
              <IoPersonOutline size={13} /> Дарыгердин аты-жөнү
            </FieldLabel>
            <Input
              value={doctorName}
              onChange={e => setDoctorName(e.target.value)}
              placeholder="Иванов Иван Иванович"
            />
          </Field>

          <Field>
            <FieldLabel>
              <IoCallOutline size={13} /> Телефон номери
            </FieldLabel>
            <Input
              value={clinicPhone}
              onChange={e => setClinicPhone(e.target.value)}
              placeholder="+996 700 000 000"
            />
          </Field>

          <Field>
            <FieldLabel>
              <IoLocationOutline size={13} /> Дарек
            </FieldLabel>
            <Input
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="Бишкек, Ленин кеч., 1"
            />
          </Field>

          <SaveBtn $saved={saved} onClick={handleSave}>
            {saved
              ? <><IoCheckmarkCircle size={19} /> Сакталды!</>
              : <><IoSaveOutline size={19} /> Сактоо</>}
          </SaveBtn>
        </CardBody>
      </Card>

      <InfoCard>
        <IoReceiptOutline size={20} />
        <p>
          Жогорудагы маалыматтар <strong>квитанцияда</strong> автоматтык
          колдонулат — клиниканын аты, дарыгердин аты жана телефон номери
          ар бир квитанцияда чыгат.
        </p>
      </InfoCard>
    </Page>
  );
};
