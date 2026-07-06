import { useState } from 'react';
import styled from 'styled-components';
import { IoSearchOutline, IoFunnelOutline } from 'react-icons/io5';
import { PatientForm } from '../components/PatientForm';
import { PatientTable } from '../components/PatientTable';
import type { PatientData } from '../types';

const Page = styled.div`
  padding: 28px 24px;
  max-width: 1200px;

  @media (max-width: 768px) {
    padding: 4px 0 0;
  }
`;

const PageTitle = styled.h1`
  font-size: 22px;
  font-weight: 800;
  color: var(--text);
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 19px;
    padding: 0 16px;
  }
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    padding: 0 16px;
    gap: 10px;
  }

  @media (max-width: 500px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const StatCard = styled.div<{ $color?: string }>`
  background: white;
  border-radius: 16px;
  padding: 14px 16px;
  box-shadow: var(--shadow-sm);
  border-left: 4px solid ${p => p.$color || 'var(--primary)'};

  .label { font-size: 11.5px; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; }
  .value { font-size: 20px; font-weight: 800; color: ${p => p.$color || 'var(--text)'}; margin-top: 4px; }
`;

const ControlsRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

const SearchWrap = styled.div`
  position: relative;
  flex: 1;
  min-width: 180px;

  svg {
    position: absolute;
    left: 13px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-subtle);
    pointer-events: none;
  }

  input {
    width: 100%;
    padding: 10px 13px 10px 40px;
    border: 1.5px solid var(--border);
    border-radius: 11px;
    background: white;
    font-size: 14px;
    color: var(--text);
    transition: border-color 0.15s;

    &:focus { border-color: var(--primary); }
    &::placeholder { color: var(--text-subtle); }
  }
`;

const FilterBtn = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 10px 16px;
  border-radius: 11px;
  border: 1.5px solid ${p => p.$active ? 'var(--red)' : 'var(--border)'};
  background: ${p => p.$active ? '#fee2e2' : 'white'};
  color: ${p => p.$active ? '#dc2626' : 'var(--text-muted)'};
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s;

  &:hover {
    background: ${p => p.$active ? '#fecaca' : '#f8fafc'};
  }
`;

const FormSection = styled.div`
  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

const TableSection = styled.div`
  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

interface PatientsPageProps {
  patients: PatientData[];
  onAdd: (data: PatientData) => void;
  onDelete: (id: string) => void;
  onUpdate: (data: PatientData) => void;
}

export const PatientsPage = ({ patients, onAdd, onDelete, onUpdate }: PatientsPageProps) => {
  const [searchTerm, setSearchTerm]     = useState('');
  const [showOnlyDebt, setShowOnlyDebt] = useState(false);
  const [editingPatient, setEditingPatient] = useState<PatientData | null>(null);

  const totalPaid = patients.reduce((a, p) => a + p.paid, 0);
  const totalDebt = patients.reduce((a, p) => a + Math.max(0, p.price - p.paid), 0);

  const filtered = patients.filter(p => {
    const q = searchTerm.toLowerCase();
    const matchSearch = p.name.toLowerCase().includes(q) || p.phone.includes(q);
    const matchDebt   = showOnlyDebt ? p.price - p.paid > 0 : true;
    return matchSearch && matchDebt;
  });

  return (
    <Page>
      <PageTitle>Бейтаптар базасы</PageTitle>

      <StatsRow>
        <StatCard $color="var(--blue)">
          <div className="label">Жалпы бейтап</div>
          <div className="value">{patients.length}</div>
        </StatCard>
        <StatCard $color="var(--green)">
          <div className="label">Төлөнгөн</div>
          <div className="value">{(totalPaid / 1000).toFixed(1)}к с</div>
        </StatCard>
        <StatCard $color="var(--red)">
          <div className="label">Карыз</div>
          <div className="value">{(totalDebt / 1000).toFixed(1)}к с</div>
        </StatCard>
      </StatsRow>

      <ControlsRow>
        <SearchWrap>
          <IoSearchOutline size={17} />
          <input
            placeholder="Издөө (аты же телефон)..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </SearchWrap>
        <FilterBtn
          $active={showOnlyDebt}
          onClick={() => setShowOnlyDebt(v => !v)}
        >
          <IoFunnelOutline size={15} />
          {showOnlyDebt ? 'Бардыгы' : 'Карызы барлар'}
        </FilterBtn>
      </ControlsRow>

      <FormSection>
        <PatientForm
          onAdd={onAdd}
          onUpdate={onUpdate}
          initialData={editingPatient}
          onClearEdit={() => setEditingPatient(null)}
        />
      </FormSection>

      <TableSection>
        <PatientTable
          patients={filtered}
          allPatients={patients}
          onDelete={onDelete}
          onEdit={p => setEditingPatient(p)}
        />
      </TableSection>
    </Page>
  );
};
