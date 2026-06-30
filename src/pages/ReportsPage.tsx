import styled from 'styled-components';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { type PatientData } from '../types';

const ReportsWrapper = styled.div` padding: 30px; `;
const ChartContainer = styled.div` 
  background: white; 
  padding: 20px; 
  border-radius: 20px; 
  box-shadow: 0 4px 6px rgba(0,0,0,0.05); 
  height: 400px;
  margin-top: 20px;
`;

export const ReportsPage = ({ patients }: { patients: PatientData[] }) => {
  // Статистиканы эсептөө
  const data = patients.map(p => ({
    name: p.name,
    Төлөнгөн: p.paid,
    Карыз: p.price - p.paid
  }));

  return (
    <ReportsWrapper>
      <h1>📊 Отчеттор жана Аналитика</h1>
      
      <ChartContainer>
        <h3>Киреше жана Карыз анализи</h3>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Төлөнгөн" fill="#10b981" />
            <Bar dataKey="Карыз" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </ReportsWrapper>
  );
};