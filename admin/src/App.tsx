import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<BaseDashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="properties" element={<PropertiesPage />} />
            <Route path="properties/new" element={<CreatePropertyPage />} />
            <Route path="properties/:id" element={<PropertyDetailsPage />} />
            <Route path="properties/:id/edit" element={<EditPropertyPage />} />
            <Route path="leads" element={<LeadsPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="settings" element={<div className="p-4">Settings Page (Coming Soon)</div>} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
