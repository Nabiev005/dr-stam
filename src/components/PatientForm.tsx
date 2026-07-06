import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { type PatientData } from '../types';

const FormWrapper = styled.div`
  background: white;
  padding: 22px 22px 18px;
  border-radius: 20px;
  box-shadow: var(--shadow-sm);
  margin-bottom: 20px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;

  @media (max-width: 1024px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 600px)  { grid-template-columns: 1fr; }
`;

const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 5px;

  .field-label {
    font-size: 11.5px;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`;

const Input = styled.input`
  padding: 10px 13px;
  border: 1.5px solid var(--border);
  border-radius: 10px;
  width: 100%;
  font-size: 14px;
  color: var(--text);
  background: #f8fafc;
  transition: border-color 0.15s, background 0.15s;

  &:focus {
    border-color: var(--primary);
    background: white;
    box-shadow: 0 0 0 3px rgba(13,148,136,0.1);
  }

  &::placeholder { color: var(--text-subtle); }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  grid-column: 1 / -1;
  padding-top: 2px;
`;

const SubmitBtn = styled.button<{ $isEdit: boolean }>`
  flex: 1;
  padding: 11px;
  border-radius: 11px;
  border: none;
  font-size: 14.5px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s, transform 0.12s;
  background: ${p => p.$isEdit
    ? 'linear-gradient(135deg,#f59e0b,#d97706)'
    : 'linear-gradient(135deg,#0d9488,#059669)'};
  color: white;

  &:hover { filter: brightness(1.07); }
  &:active { transform: scale(0.98); }
`;

const CancelBtn = styled.button`
  padding: 11px 20px;
  border-radius: 11px;
  border: 1.5px solid var(--border);
  background: white;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-muted);
  cursor: pointer;

  &:hover { background: #f1f5f9; }
`;

interface PatientFormProps {
  onAdd: (data: PatientData) => void;
  onUpdate: (data: PatientData) => void;
  initialData?: PatientData | null;
  onClearEdit?: () => void;
}

const emptyForm: PatientData = {
  name: '', phone: '', tooth: '', service: '', price: 0, paid: 0, date: '', appointmentTime: '',
};

export const PatientForm = ({ onAdd, onUpdate, initialData, onClearEdit }: PatientFormProps) => {
  const [formData, setFormData] = useState<PatientData>(emptyForm);

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? 0 : Number(value)) : value,
    }));
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) return alert('Аты-жөнүн жазыңыз!');

    if (initialData) {
      onUpdate(formData);
      onClearEdit?.();
    } else {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
      onAdd({ ...formData, time: timeStr });
    }
    setFormData(emptyForm);
  };

  return (
    <FormWrapper>
      <Field>
        <span className="field-label">Аты-жөнү</span>
        <Input name="name" value={formData.name} onChange={handleChange} placeholder="Дүйшөн Матанов" />
      </Field>
      <Field>
        <span className="field-label">Телефон</span>
        <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="+996 700 000 000" />
      </Field>
      <Field>
        <span className="field-label">Тиш номери</span>
        <Input name="tooth" value={formData.tooth} onChange={handleChange} placeholder="11, 12" />
      </Field>
      <Field>
        <span className="field-label">Дарылоо</span>
        <Input name="service" value={formData.service} onChange={handleChange} placeholder="Тазалоо, пломба..." />
      </Field>

      <Field>
        <span className="field-label">Жалпы баасы (с)</span>
        <Input name="price" type="number" value={formData.price || ''} onChange={handleChange} placeholder="2500" />
      </Field>
      <Field>
        <span className="field-label">Төлөнгөн (с)</span>
        <Input name="paid" type="number" value={formData.paid || ''} onChange={handleChange} placeholder="2000" />
      </Field>
      <Field>
        <span className="field-label">Дата</span>
        <Input name="date" type="date" value={formData.date} onChange={handleChange} />
      </Field>
      <Field>
        <span className="field-label">Кабыл алуу убакыты</span>
        <Input name="appointmentTime" type="time" value={formData.appointmentTime || ''} onChange={handleChange} />
      </Field>

      <ButtonRow>
        <SubmitBtn $isEdit={!!initialData} onClick={handleSubmit}>
          {initialData ? '✓ Сактоо' : '+ Кошуу'}
        </SubmitBtn>
        {initialData && (
          <CancelBtn onClick={onClearEdit}>Жок кылуу</CancelBtn>
        )}
      </ButtonRow>
    </FormWrapper>
  );
};
