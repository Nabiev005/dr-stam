import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

import { Sidebar } from './components/Sidebar';
import { PatientsPage } from './pages/PatientsPage';
import { HomePage } from './pages/HomePage';
import { type PatientData } from './types'; 
import { CalendarPage } from './pages/CalendarPage';
import { ReportsPage } from './pages/ReportsPage';
import { DebtsPage } from './pages/DebtsPage';
import { BillingPage } from './pages/BillingPage';
import { NotificationsPage } from './pages/NotificationsPage';

const Container = styled.div` display: flex; min-height: 100vh; background-color: #f9fafb; `;
const MainContent = styled.main` flex: 1; padding: 30px; overflow-y: auto; `;

export function App() {
  const [patients, setPatients] = useState<PatientData[]>([]);

  // 1. Firebase'ден маалыматтарды жүктөө
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "patients"));
        const patientsList = querySnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        } as PatientData));
        setPatients(patientsList);
      } catch (error) {
        console.error("Маалыматты окууда ката кетти: ", error);
      }
    };
    fetchPatients();
  }, []);

  // 2. Жаңы бейтапты Firebase'ге кошуу
  const handleAddPatient = async (newPatient: PatientData) => {
    try {
      const docRef = await addDoc(collection(db, "patients"), newPatient);
      setPatients(prev => [...prev, { ...newPatient, id: docRef.id }]);
      alert("Бейтап ийгиликтүү кошулду!");
    } catch (error) {
      console.error("Кошууда ката кетти: ", error);
    }
  };

  // 3. Бейтапты Firebase'ден өчүрүү
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

  // 4. Бейтапты жаңыртуу (Update)
  const handleUpdatePatient = async (updatedPatient: PatientData) => {
    try {
      if (!updatedPatient.id) return;
      const patientDoc = doc(db, "patients", updatedPatient.id);
      await updateDoc(patientDoc, { ...updatedPatient });
      
      setPatients(prev => prev.map(p => p.id === updatedPatient.id ? updatedPatient : p));
      alert("Бейтаптын маалыматы ийгиликтүү жаңыланды!");
    } catch (error) {
      console.error("Жаңыртууда ката кетти: ", error);
    }
  };

  return (
    <Router>
      <Container>
        <Sidebar />
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
            <Route path="/settings" element={<h1>⚙️ Орнотуулар бети</h1>} />
          </Routes>
        </MainContent>
      </Container>
    </Router>
  );
}