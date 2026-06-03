import { createBrowserRouter, Navigate } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout'
import Dashboard from '../pages/Dashboard'
import Incidents from '../pages/Incidents'
import IncidentDetails from '../pages/IncidentDetails'
import CreateIncident from '../pages/CreateIncident'
import Analysis from '../pages/Analysis'
import Monitoring from '../pages/Monitoring'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'dashboard', element: <Navigate to="/" replace /> },
      { path: 'incidents', element: <Incidents /> },
      { path: 'incidents/create', element: <CreateIncident /> },
      { path: 'incidents/:id', element: <IncidentDetails /> },
      { path: 'analysis', element: <Analysis /> },
      { path: 'monitoring', element: <Monitoring /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])
