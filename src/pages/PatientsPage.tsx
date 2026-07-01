import { useState } from 'react';
import styled from 'styled-components';
import { PatientForm } from '../components/PatientForm';
import { PatientTable } from '../components/PatientTable';
import type { PatientData } from '../types';

const PageWrapper = styled.div` padding: 20px; `;

// --- Статистика блогу ---
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 20px;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const StatCard = styled.div`
  background: white; padding: 20px; border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  h4 { color: #6b7280; margin: 0 0 10px 0; font-size: 14px; }
  p { font-size: 24px; font-weight: bold; color: #111827; margin: 0; }
`;

const StatsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
`;

const Controls = styled.div` display: flex; gap: 10px; `;

const SearchInput = styled.input`
  padding: 10px; border: 1px solid #e5e7eb;
  border-radius: 8px; width: 250px;
`;

const FilterButton = styled.button<{ active: boolean }>`
  padding: 10px 15px; border: none; border-radius: 8px;
  background: ${props => props.active ? '#10b981' : '#f3f4f6'};
  color: ${props => props.active ? 'white' : '#374151'};
  cursor: pointer; font-weight: 600;
`;

interface PatientsPageProps {
  patients: PatientData[];
  onAdd: (data: PatientData) => void;
  onDelete: (id: string) => void;
  onUpdate: (data: PatientData) => void;
}

export const PatientsPage = ({ patients, onAdd, onDelete, onUpdate }: PatientsPageProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyDebt, setShowOnlyDebt] = useState(false);
  const [editingPatient, setEditingPatient] = useState<PatientData | null>(null);

  // Статистиканы эсептөө
  const totalPaid = patients.reduce((acc, p) => acc + p.paid, 0);
  const totalDebt = patients.reduce((acc, p) => acc + (p.price - p.paid), 0);

  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.phone.includes(searchTerm);
    const matchesDebt = showOnlyDebt ? (p.price - p.paid > 0) : true;
    return matchesSearch && matchesDebt;
  });

  return (
    <PageWrapper>
      {/* Статистика карталары */}
      <StatsGrid>
        <StatCard><h4>Жалпы бейтаптар</h4><p>{patients.length}</p></StatCard>
        <StatCard><h4>Төлөнгөн сумма</h4><p>{totalPaid} с</p></StatCard>
        <StatCard><h4>Жалпы карыз</h4><p style={{color: '#ef4444'}}>{totalDebt} с</p></StatCard>
      </StatsGrid>

      <StatsHeader>
        <h1>Бейтаптар базасы</h1>
        <Controls>
          <SearchInput 
            placeholder="Издөө (Аты же номери...)" 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
          <FilterButton active={showOnlyDebt} onClick={() => setShowOnlyDebt(!showOnlyDebt)}>
            {showOnlyDebt ? 'Бардыгы' : 'Карызы барлар'}
          </FilterButton>
        </Controls>
      </StatsHeader>
      
      <PatientForm 
        onAdd={onAdd} 
        onUpdate={onUpdate} 
        initialData={editingPatient} 
        onClearEdit={() => setEditingPatient(null)} 
      />
      
      <PatientTable
        patients={filteredPatients}
        allPatients={patients}
        onDelete={onDelete}
        onEdit={(p) => setEditingPatient(p)}
      />
    </PageWrapper>
  );
};