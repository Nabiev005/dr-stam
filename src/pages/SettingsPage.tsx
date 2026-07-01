import { useState } from 'react';
import styled from 'styled-components';
import { IoCheckmarkCircle, IoSaveOutline } from 'react-icons/io5';

const Wrapper = styled.div` padding: 30px; max-width: 600px; `;

const Card = styled.div`
  background: white;
  padding: 28px;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.06);
  margin-bottom: 24px;
  h3 { margin: 0 0 20px; color: #1e293b; }
`;

const Field = styled.div`
  margin-bottom: 16px;
  label { display: block; font-size: 13px; color: #6b7280; margin-bottom: 6px; }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  box-sizing: border-box;
  &:focus { outline: none; border-color: #10b981; }
`;

const SaveBtn = styled.button`
  background: #10b981;
  color: white;
  border: none;
  padding: 11px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: 0.2s;
  &:hover { background: #059669; }
`;

const Toast = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #10b981;
  font-weight: 600;
  margin-top: 12px;
  font-size: 14px;
`;

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
    <Wrapper>
      <h1 style={{ marginBottom: '24px' }}>Орнотуулар</h1>

      <Card>
        <h3>Клиника маалыматтары</h3>
        <Field>
          <label>Клиниканын аты</label>
          <Input value={clinicName} onChange={e => setClinicName(e.target.value)} placeholder="Стоматология клиникасы" />
        </Field>
        <Field>
          <label>Дарыгердин аты-жөнү</label>
          <Input value={doctorName} onChange={e => setDoctorName(e.target.value)} placeholder="Иванов Иван Иванович" />
        </Field>
        <Field>
          <label>Клиниканын телефону</label>
          <Input value={clinicPhone} onChange={e => setClinicPhone(e.target.value)} placeholder="+996 700 000 000" />
        </Field>
        <Field>
          <label>Дареги</label>
          <Input value={address} onChange={e => setAddress(e.target.value)} placeholder="Бишкек, Ленин кеч., 1" />
        </Field>

        <SaveBtn onClick={handleSave}>
          <IoSaveOutline size={18} /> Сактоо
        </SaveBtn>

        {saved && (
          <Toast>
            <IoCheckmarkCircle size={18} /> Маалыматтар сакталды!
          </Toast>
        )}
      </Card>

      <Card>
        <h3>Квитанция маалыматтары</h3>
        <p style={{ margin: 0, color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>
          Жогорудагы маалыматтар квитанция (PDF) басып чыгарганда автоматтык колдонулат.
          Клиниканын аты, дарыгердин аты жана телефон номери квитанцияда чыгат.
        </p>
      </Card>
    </Wrapper>
  );
};
