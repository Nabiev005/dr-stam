import { useState } from 'react';
import styled from 'styled-components';
import { IoPencilOutline, IoTrashOutline, IoDownloadOutline, IoPersonCircleOutline } from 'react-icons/io5';
import * as XLSX from 'xlsx';
import { type PatientData } from '../types';
import { PatientProfileModal } from './PatientProfileModal';

const TableWrapper = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: var(--shadow-sm);
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  border-bottom: 1px solid #f1f5f9;
`;

const TableTitle = styled.h3`
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
`;

const ExportBtn = styled.button`
  background: var(--primary-light);
  color: var(--primary-hover);
  border: none;
  padding: 8px 16px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 13px;
  font-weight: 600;
  transition: background 0.15s;

  &:hover { background: #a7f3d0; }
`;

const Scroll = styled.div`
  overflow-x: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
`;

const Th = styled.th`
  text-align: left;
  padding: 11px 14px;
  background: #f8fafc;
  color: var(--text-muted);
  font-size: 11.5px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
  border-bottom: 1px solid #f1f5f9;
`;

const Td = styled.td`
  padding: 12px 14px;
  border-bottom: 1px solid #f8fafc;
  font-size: 13.5px;
  color: var(--text);
  vertical-align: middle;
`;

const Tr = styled.tr`
  transition: background 0.1s;
  &:hover { background: #f0fdfa; }
  &:last-child td { border-bottom: none; }
`;

const NameBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 600;
  color: var(--text);
  padding: 0;
  text-align: left;
  font-size: 14px;
  text-decoration: underline dotted #94a3b8;
  &:hover { color: var(--primary); }
`;

const DebtBadge = styled.span<{ $debt: number }>`
  font-size: 12.5px;
  font-weight: 700;
  color: ${p => p.$debt > 0 ? '#dc2626' : '#059669'};
  background: ${p => p.$debt > 0 ? '#fee2e2' : '#dcfce7'};
  padding: 3px 9px;
  border-radius: 99px;
`;

const TimeTag = styled.span`
  font-size: 11.5px;
  color: var(--text-muted);
  background: #f1f5f9;
  padding: 2px 8px;
  border-radius: 8px;
  display: inline-block;
  margin-top: 2px;
`;

const ActionCell = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
`;

const ActionBtn = styled.button<{ $variant?: 'edit' | 'delete' | 'profile' }>`
  width: 32px;
  height: 32px;
  border-radius: 9px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  color: var(--text-muted);
  background: ${p =>
    p.$variant === 'delete' ? '#fef2f2' :
    p.$variant === 'profile' ? '#eff6ff' :
    '#f1f5f9'};

  &:hover {
    background: ${p =>
      p.$variant === 'delete' ? '#fee2e2' :
      p.$variant === 'profile' ? '#dbeafe' :
      '#e2e8f0'};
    color: ${p =>
      p.$variant === 'delete' ? '#dc2626' :
      p.$variant === 'profile' ? '#2563eb' :
      '#0d9488'};
  }
`;

const Empty = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: var(--text-subtle);
  font-size: 15px;
`;

interface PatientTableProps {
  patients: PatientData[];
  allPatients: PatientData[];
  onDelete: (id: string) => void;
  onEdit: (patient: PatientData) => void;
}

export const PatientTable = ({ patients, allPatients, onDelete, onEdit }: PatientTableProps) => {
  const [profilePatient, setProfilePatient] = useState<PatientData | null>(null);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(patients);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Бейтаптар');
    XLSX.writeFile(workbook, 'Beytaptar_Tizmesi.xlsx');
  };

  return (
    <TableWrapper>
      <TableHeader>
        <TableTitle>Бейтаптар тизмеси — {patients.length}</TableTitle>
        <ExportBtn onClick={exportToExcel}>
          <IoDownloadOutline size={16} /> Excel
        </ExportBtn>
      </TableHeader>

      {patients.length === 0 ? (
        <Empty>Бейтаптардын базасы бош</Empty>
      ) : (
        <Scroll>
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
                <Th>Дата / Убакыт</Th>
                <Th>Аракет</Th>
              </tr>
            </thead>
            <tbody>
              {patients.map(p => {
                const debt = p.price - p.paid;
                return (
                  <Tr key={p.id}>
                    <Td>
                      <NameBtn onClick={() => setProfilePatient(p)}>{p.name}</NameBtn>
                    </Td>
                    <Td>{p.phone}</Td>
                    <Td>{p.tooth}</Td>
                    <Td>{p.service}</Td>
                    <Td>{p.price.toLocaleString()} с</Td>
                    <Td>{p.paid.toLocaleString()} с</Td>
                    <Td>
                      <DebtBadge $debt={debt}>{debt.toLocaleString()} с</DebtBadge>
                    </Td>
                    <Td>
                      <div>
                        {p.date && <div style={{ fontSize: 13 }}>{p.date}</div>}
                        {(p.appointmentTime || p.time) && (
                          <TimeTag>{p.appointmentTime || p.time}</TimeTag>
                        )}
                        {!p.date && !p.time && !p.appointmentTime && (
                          <span style={{ color: '#d1d5db' }}>—</span>
                        )}
                      </div>
                    </Td>
                    <Td>
                      <ActionCell>
                        <ActionBtn $variant="profile" title="Профиль" onClick={() => setProfilePatient(p)}>
                          <IoPersonCircleOutline size={16} />
                        </ActionBtn>
                        <ActionBtn title="Өзгөртүү" onClick={() => onEdit(p)}>
                          <IoPencilOutline size={15} />
                        </ActionBtn>
                        <ActionBtn $variant="delete" title="Өчүрүү" onClick={() => p.id && onDelete(p.id)}>
                          <IoTrashOutline size={15} />
                        </ActionBtn>
                      </ActionCell>
                    </Td>
                  </Tr>
                );
              })}
            </tbody>
          </StyledTable>
        </Scroll>
      )}

      {profilePatient && (
        <PatientProfileModal
          patient={profilePatient}
          allPatients={allPatients}
          onClose={() => setProfilePatient(null)}
        />
      )}
    </TableWrapper>
  );
};
