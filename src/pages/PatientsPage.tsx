import { useState } from 'react';
import styled from 'styled-components';
import { PatientForm } from '../components/PatientForm';
import { PatientTable } from '../components/PatientTable';
import type { PatientData } from '../types';

const PageWrapper = styled.div` padding: 20px; `;

const StatsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
`;

const Controls = styled.div`
  display: flex;
  gap: 10px;
`;

const SearchInput = styled.input`
  padding: 10px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  width: 250px;
`;

const FilterButton = styled.button<{ active: boolean }>`
  padding: 10px 15px;
  border: none;
  border-radius: 8px;
  background: ${props => props.active ? '#10b981' : '#f3f4f6'};
  color: ${props => props.active ? 'white' : '#374151'};
  cursor: pointer;
  font-weight: 600;
`;

interface PatientsPageProps {
  patients: PatientData[];
  onAdd: (data: PatientData) => void;
  onDelete: (id: string) => void;
}

export const PatientsPage = ({ patients, onAdd, onDelete }: PatientsPageProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyDebt, setShowOnlyDebt] = useState(false);

  // Фильтрлөө логикасы
  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.phone.includes(searchTerm);
    const matchesDebt = showOnlyDebt ? (p.price - p.paid > 0) : true;
    return matchesSearch && matchesDebt;
  });

  return (
    <PageWrapper>
      <StatsHeader>
        <h1>Бейтаптар базасы</h1>
        <Controls>
          <SearchInput 
            placeholder="Издөө (Аты же номери...)" 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
          <FilterButton 
            active={showOnlyDebt} 
            onClick={() => setShowOnlyDebt(!showOnlyDebt)}
          >
            {showOnlyDebt ? 'Бардыгы' : 'Карызы барлар'}
          </FilterButton>
        </Controls>
      </StatsHeader>
      
      <PatientForm onAdd={onAdd} />
      <PatientTable patients={filteredPatients} onDelete={onDelete} />
    </PageWrapper>
  );
};