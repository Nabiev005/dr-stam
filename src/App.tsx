import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { PatientsPage } from './pages/PatientsPage';
import { HomePage } from './pages/HomePage';
import { type PatientData } from './types';
import { CalendarPage } from './pages/CalendarPage';
import { ReportsPage } from './pages/ReportsPage';
import { DebtsPage } from './pages/DebtsPage';
import { BillingPage } from './pages/BillingPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SettingsPage } from './pages/SettingsPage';

const Container = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
  background-color: #f9fafb;

  @media (max-width: 768px) {
    height: auto;
    min-height: 100vh;
    overflow: visible;
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: 30px;
  overflow-y: auto;
  height: 100%;

  @media (max-width: 768px) {
    height: auto;
    padding: 16px 12px;
    padding-bottom: 80px;
  }
`;

const SidebarWrapper = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`;

export function App() {
  const [patients, setPatients] = useState<PatientData[]>([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "patients"));
        const patientsList = querySnapshot.docs.map(d => ({
          id: d.id,
          ...d.data()
        } as PatientData));
        setPatients(patientsList);
      } catch (error) {
        console.error("Маалыматты окууда ката кетти: ", error);
      }
    };
    fetchPatients();
  }, []);

  const handleAddPatient = async (newPatient: PatientData) => {
    try {
      const docRef = await addDoc(collection(db, "patients"), newPatient);
      setPatients(prev => [...prev, { ...newPatient, id: docRef.id }]);
    } catch (error) {
      console.error("Кошууда ката кетти: ", error);
    }
  };

  const handleDeletePatient = async (id: string) => {
    if (window.confirm("Бул бейтапты өчүрүүнү каалайсызбы?")) {
      try {
        await deleteDoc(doc(db, "patients", id));
        setPatients(prev => prev.filter(p => p.id !== id));
      } catch (error) {
        console.error("Өчүрүүдө ката кетти: ", error);
      }
    }
  };

  const handleUpdatePatient = async (updatedPatient: PatientData) => {
    try {
      if (!updatedPatient.id) return;
      const patientDoc = doc(db, "patients", updatedPatient.id);
      const { id, ...dataToUpdate } = updatedPatient;
      await updateDoc(patientDoc, { ...dataToUpdate });
      setPatients(prev => prev.map(p => p.id === updatedPatient.id ? updatedPatient : p));
    } catch (error) {
      console.error("Жаңыртууда ката кетти: ", error);
    }
  };

  return (
    <Router>
      <Container>
        <SidebarWrapper>
          <Sidebar />
        </SidebarWrapper>
        <MainContent>
          <Routes>
            <Route path="/" element={<HomePage patients={patients} />} />
            <Route path="/patients" element={
              <PatientsPage
                patients={patients}
                onAdd={handleAddPatient}
                onDelete={handleDeletePatient}
                onUpdate={handleUpdatePatient}
              />
            } />
            <Route path="/calendar" element={<CalendarPage patients={patients} />} />
            <Route path="/reports" element={<ReportsPage patients={patients} />} />
            <Route path="/debts" element={<DebtsPage patients={patients} />} />
            <Route path="/invoices" element={<BillingPage patients={patients} />} />
            <Route path="/notifications" element={<NotificationsPage patients={patients} />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </MainContent>
        <BottomNav />
      </Container>
    </Router>
  );
}
