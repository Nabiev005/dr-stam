import styled from 'styled-components';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, LineChart, Line
} from 'recharts';
import { type PatientData } from '../types';

const Wrapper = styled.div` padding: 30px; `;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 30px;
`;

const SummaryCard = styled.div<{ accent: string }>`
  background: white;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  border-top: 4px solid ${p => p.accent};
  h4 { margin: 0 0 8px 0; color: #6b7280; font-size: 13px; font-weight: 500; }
  p  { margin: 0; font-size: 26px; font-weight: 800; color: #111827; }
`;

const ChartCard = styled.div`
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  margin-bottom: 24px;
  h3 { margin: 0 0 20px 0; color: #1e293b; }
`;

const MONTH_NAMES: Record<string, string> = {
  '01': 'Янв', '02': 'Фев', '03': 'Мар', '04': 'Апр',
  '05': 'Май', '06': 'Июн', '07': 'Июл', '08': 'Авг',
  '09': 'Сен', '10': 'Окт', '11': 'Ноя', '12': 'Дек',
};

export const ReportsPage = ({ patients }: { patients: PatientData[] }) => {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const thisMonth = todayStr.substring(0, 7);
  const thisWeekStart = new Date(today);
  thisWeekStart.setDate(today.getDate() - today.getDay());

  const todayPatients    = patients.filter(p => p.date === todayStr).length;
  const monthPatients    = patients.filter(p => p.date?.startsWith(thisMonth)).length;
  const monthRevenue     = patients.filter(p => p.date?.startsWith(thisMonth)).reduce((s, p) => s + p.paid, 0);
  const totalDebt        = patients.reduce((s, p) => s + Math.max(0, p.price - p.paid), 0);

  // Ай боюнча топтоо
  const monthMap: Record<string, { label: string; Бейтаптар: number; Киреше: number; Карыз: number }> = {};
  patients.forEach(p => {
    if (!p.date) return;
    const key = p.date.substring(0, 7);
    const [year, mon] = key.split('-');
    if (!monthMap[key]) monthMap[key] = { label: `${MONTH_NAMES[mon]} ${year}`, Бейтаптар: 0, Киреше: 0, Карыз: 0 };
    monthMap[key].Бейтаптар++;
    monthMap[key].Киреше  += p.paid;
    monthMap[key].Карыз   += Math.max(0, p.price - p.paid);
  });
  const monthlyData = Object.entries(monthMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, v]) => v);

  // Кызмат түрү боюнча топтоо
  const serviceMap: Record<string, number> = {};
  patients.forEach(p => {
    if (!p.service) return;
    serviceMap[p.service] = (serviceMap[p.service] || 0) + 1;
  });
  const serviceData = Object.entries(serviceMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count]) => ({ name, Саны: count }));

  return (
    <Wrapper>
      <h1 style={{ marginBottom: '24px' }}>Отчеттор жана Аналитика</h1>

      <SummaryGrid>
        <SummaryCard accent="#3b82f6">
          <h4>Бүгүн</h4>
          <p>{todayPatients} бейтап</p>
        </SummaryCard>
        <SummaryCard accent="#10b981">
          <h4>Бул айда бейтап</h4>
          <p>{monthPatients}</p>
        </SummaryCard>
        <SummaryCard accent="#8b5cf6">
          <h4>Бул айдагы киреше</h4>
          <p>{monthRevenue.toLocaleString()} с</p>
        </SummaryCard>
        <SummaryCard accent="#ef4444">
          <h4>Жалпы карыз</h4>
          <p>{totalDebt.toLocaleString()} с</p>
        </SummaryCard>
      </SummaryGrid>

      <ChartCard>
        <h3>Айлык киреше жана карыз (сом)</h3>
        {monthlyData.length === 0 ? (
          <p style={{ color: '#9ca3af' }}>Азырынча маалымат жок.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip formatter={(v: any) => `${Number(v).toLocaleString()} с`} />
              <Legend />
              <Bar dataKey="Киреше" fill="#10b981" radius={[4,4,0,0]} />
              <Bar dataKey="Карыз"  fill="#ef4444" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      <ChartCard>
        <h3>Айлык бейтаптар саны</h3>
        {monthlyData.length === 0 ? (
          <p style={{ color: '#9ca3af' }}>Азырынча маалымат жок.</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="Бейтаптар" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      <ChartCard>
        <h3>Эң көп кездешкен дарылоолор</h3>
        {serviceData.length === 0 ? (
          <p style={{ color: '#9ca3af' }}>Азырынча маалымат жок.</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={serviceData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" allowDecimals={false} />
              <YAxis type="category" dataKey="name" width={140} />
              <Tooltip />
              <Bar dataKey="Саны" fill="#8b5cf6" radius={[0,4,4,0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>
    </Wrapper>
  );
};
