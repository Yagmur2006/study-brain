import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { AppProvider, useApp } from './context/AppContext';
import { ApiKeyPage } from './components/ApiKeyPage';
import { MainLayout } from './components/MainLayout';

function AppContent() {
  const { apiKey } = useApp();

  return (
    <AnimatePresence mode="wait">
      {!apiKey ? (
        <motion.div
          key="api-key"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ApiKeyPage />
        </motion.div>
      ) : (
        <motion.div
          key="main"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="h-screen"
        >
          <MainLayout />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1C1C1C',
            color: '#fff',
            border: '1px solid #2C303D',
            borderRadius: '12px',
            fontFamily: 'Vazirmatn, sans-serif',
            fontSize: '13px',
            direction: 'rtl',
            padding: '10px 16px',
          },
          success: {
            iconTheme: {
              primary: '#A089E6',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <AppContent />
    </AppProvider>
  );
}
