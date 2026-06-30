import { useState } from 'react';
import styled from 'styled-components';

const FormWrapper = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  margin-bottom: 24px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;

  @media (max-width: 1024px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 600px) { grid-template-columns: 1fr; }
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  width: 100%;
  &:focus { outline: none; border-color: #10b981; }
`;

const AddButton = styled.button`
  background: #10b981;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: 0.2s;
  &:hover { background: #059669; }
`;

export interface PatientData {
  id?: string;
  name: string;
  phone: string;
  tooth: string;
  service: string;
  price: number;
  paid: number;
  date: string;
  appointmentDate?: string | Date; // Календар үчүн кошулду
}

interface PatientFormProps {
  onAdd: (data: PatientData) => void;
}

export const PatientForm = ({ onAdd }: PatientFormProps) => {
  const [formData, setFormData] = useState<PatientData>({
    name: '', phone: '', tooth: '', service: '', price: 0, paid: 0, date: '', appointmentDate: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'number' ? (value === '' ? 0 : Number(value)) : value 
    }));
  };

  const handleSubmit = () => {
    if (!formData.name) return alert("Аты-жөнүн жазыңыз!");
    
    onAdd({
      ...formData,
      appointmentDate: formData.date // Формадагы датаны календар үчүн колдонобуз
    });
    
    // Форманы тазалоо
    setFormData({ name: '', phone: '', tooth: '', service: '', price: 0, paid: 0, date: '', appointmentDate: '' });
  };

  return (
    <FormWrapper>
      <Input name="name" value={formData.name} onChange={handleChange} placeholder="ФИО (Аты-жөнү)" />
      <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="Телефон номери" />
      <Input name="tooth" value={formData.tooth} onChange={handleChange} placeholder="Тиш номери" />
      <Input name="service" value={formData.service} onChange={handleChange} placeholder="Дарылоо себеби" />
      
      <Input 
        name="price" 
        type="number" 
        value={formData.price === 0 ? '' : formData.price} 
        onChange={handleChange} 
        placeholder="Жалпы баасы (сом)" 
      />
      <Input 
        name="paid" 
        type="number" 
        value={formData.paid === 0 ? '' : formData.paid} 
        onChange={handleChange} 
        placeholder="Төлөнгөн сумма (сом)" 
      />
      
      <Input 
        name="date" 
        type="date" 
        value={formData.date} 
        onChange={handleChange} 
      />
      
      <AddButton onClick={handleSubmit}>+ Бейтапты базага каттоо</AddButton>
    </FormWrapper>
  );
};