import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import BottomNav from './BottomNav';
import TopAppBar from './TopAppBar';

export default function FarmerDashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: '#e0e0e0', color: '#101010', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopAppBar />

      <div style={{ flex: 1, overflowY: 'auto', padding: '30px 20px 100px 20px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>

        {/* Header */}
        <header style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 8px 0', color: '#101010' }}>Welcome, {currentUser?.displayName?.split(' ')[0] || 'Farmer'}!</h1>
          <p style={{ fontSize: '18px', color: '#555', margin: 0 }}>Ready to check your pineapple harvest?</p>
        </header>

        {/* About Section */}
        <section style={{ marginBottom: '40px', backgroundColor: '#ffffff', padding: '20px', borderRadius: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '700', borderBottom: '2px solid #4060a0', paddingBottom: '10px', marginBottom: '16px' }}>What is NanasVision?</h2>
          <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#555' }}>
            NanasVision is a powerful tool designed to help pineapple farmers identify different cultivars instantly. By using advanced computer vision, our app analyzes images of pineapples to provide quick and accurate classification, helping you manage your crops more effectively.
          </p>
        </section>

        {/* How it Works Section */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '700', textAlign: 'center', marginBottom: '24px' }}>How It Works</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Step 1 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', backgroundColor: '#ffffff', padding: '16px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '24px', color: '#e0a040' }}>📷</div>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '18px' }}>1. Scan Pineapple</h3>
                <p style={{ margin: 0, color: '#555' }}>Use your phone's camera to take a clear picture of the pineapple.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', backgroundColor: '#ffffff', padding: '16px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '24px', color: '#e0a040' }}>🧠</div>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '18px' }}>2. AI Analysis</h3>
                <p style={{ margin: 0, color: '#555' }}>Our AI model analyzes the image to identify the cultivar.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', backgroundColor: '#ffffff', padding: '16px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '24px', color: '#e0a040' }}>📋</div>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '18px' }}>3. Get Results</h3>
                <p style={{ margin: 0, color: '#555' }}>Receive an instant classification with a confidence score.</p>
              </div>
            </div>

          </div>
        </section>

        {/* Get Started Button */}
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button
            onClick={() => navigate('/farmer/capture')}
            style={{
              backgroundColor: '#4060a0',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              padding: '16px 32px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(64, 96, 160, 0.4)',
              transition: 'transform 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Start Scanning
          </button>
        </div>

      </div>
      <BottomNav />
    </div>
  );
}