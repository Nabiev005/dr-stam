import styled from 'styled-components';
import { IoPencilOutline, IoTrashOutline, IoDownloadOutline } from 'react-icons/io5';
import * as XLSX from 'xlsx';
import type { PatientData } from './PatientForm';

const TableWrapper = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  overflow-x: auto;
`;

const ExportButton = styled.button`
  background: #10b981;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  margin-bottom: 15px;
  transition: 0.2s;

  &:hover { background: #059669; }
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  min-width: 800px;
`;

const Th = styled.th` 
  text-align: left; 
  padding: 12px; 
  border-bottom: 2px solid #f3f4f6; 
  color: #6b7280; 
  font-size: 14px; 
  white-space: nowrap;
`;

const Td = styled.td` 
  padding: 12px; 
  border-bottom: 1px solid #f3f4f6; 
  font-size: 14px; 
`;

const DebtCell = styled.span<{ amount: number }>`
  color: ${props => (props.amount > 0 ? '#ef4444' : '#10b981')};
  font-weight: bold;
`;

const ActionButton = styled.button`
  background: #f3f4f6;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  margin-right: 5px;
  display: inline-flex;
  align-items: center;
  transition: 0.2s;

  &:hover { background: #e5e7eb; }
  &.delete:hover { background: #fee2e2; color: #ef4444; }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #9ca3af;
`;

interface PatientTableProps {
  patients: PatientData[];
  onDelete: (id: string) => void;
}

export const PatientTable = ({ patients, onDelete }: PatientTableProps) => {
  
  // Excelге экспорттоо функциясы
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(patients);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Бейтаптар");
    XLSX.writeFile(workbook, "Beytaptar_Tizmesi.xlsx");
  };

  return (
    <TableWrapper>
      <ExportButton onClick={exportToExcel}>
        <IoDownloadOutline size={18} /> Excelге экспорттоо
      </ExportButton>

      {patients.length === 0 ? (
        <EmptyState>Бейтаптардын базасы бош.</EmptyState>
      ) : (
        <StyledTable>
          <thead>
            <tr>
              <Th>Аты-жөнү</Th>
              <Th>Телефон</Th>
              <Th>Тиш</Th>
              <Th>Дарылоо</Th>
              <Th>Баасы</Th>
              <Th>Төлөндү</Th>
              <Th>Карыз</Th>
              <Th>Аракет</Th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr key={p.id}>
                <Td><strong>{p.name}</strong></Td>
                <Td>{p.phone}</Td>
                <Td>{p.tooth}</Td>
                <Td>{p.service}</Td>
                <Td>{p.price}с</Td>
                <Td>{p.paid}с</Td>
                <Td>
                  <DebtCell amount={p.price - p.paid}>
                    {p.price - p.paid}с
                  </DebtCell>
                </Td>
                <Td>
                  <ActionButton onClick={() => alert("Түзөтүү функциясы")}>
                    <IoPencilOutline size={16} />
                  </ActionButton>
                  <ActionButton className="delete" onClick={() => onDelete(p.id!)}>
                    <IoTrashOutline size={16} />
                  </ActionButton>
                </Td>
              </tr>
            ))}
          </tbody>
        </StyledTable>
      )}
    </TableWrapper>
  );
};