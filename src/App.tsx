import { Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import ManageProduct from './pages/Admin/ManageProduct';
import { SidebarProvider } from './components/context/SidebarContext';
// Import other pages as needed

function App() {
  return (
    <SidebarProvider>
      <Routes>
        <Route path="/" element={
          <AppLayout>
            <div className="p-6">Home Page Content</div>
          </AppLayout>
        } />
        <Route path="/admin/products" element={
          <AppLayout>
            <ManageProduct />
          </AppLayout>
        } />
        {/* Add other routes as needed */}
      </Routes>
    </SidebarProvider>
  );
}

export default App; 