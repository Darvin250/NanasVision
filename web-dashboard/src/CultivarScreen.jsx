import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import cultivarsData from './data/cultivars.json';
import BottomNav from './BottomNav';
import TopAppBar from './TopAppBar';
import { useAuth } from './AuthContext';

export default function CultivarScreen() {
  const { currentUser } = useAuth();
  const [cultivars, setCultivars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCultivars = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'pineapple_cultivars'));
        if (querySnapshot.empty) {
          console.log("Seeding database with cultivars...");
          for (const item of cultivarsData) {
            await setDoc(doc(db, 'pineapple_cultivars', item.id), item);
          }
          setCultivars(cultivarsData);
        } else {
          const fetched = [];
          querySnapshot.forEach((doc) => {
            fetched.push(doc.data());
          });
          fetched.sort((a, b) => {
            const numA = parseInt(a.id.replace('AC', ''), 10);
            const numB = parseInt(b.id.replace('AC', ''), 10);
            return numA - numB;
          });
          setCultivars(fetched);
        }
      } catch (error) {
        console.error("Error fetching cultivars: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCultivars();
  }, []);

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading Cultivars...</div>;

  return (
    <div style={{ backgroundColor: '#e0e0e0', minHeight: '100vh', paddingBottom: '80px' }}>
      <TopAppBar title="Cultivars" />
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {cultivars.map((c) => (
                <div key={c.id} style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f9f9f9', padding: '15px', borderBottom: '1px solid #eee' }}>
                        <img src={c.imageUrl} alt={c.cultivar} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '50%', marginRight: '15px', border: '2px solid #fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                        <div>
                            <h3 style={{ margin: '0 0 5px 0', color: '#333' }}>{c.id} - {c.cultivar}</h3>
                            <span style={{ backgroundColor: '#e3f2fd', color: '#1976d2', padding: '4px 10px', borderRadius: '12px', fontSize: '13px', fontWeight: 'bold', display: 'inline-block' }}>{c.group} Group</span>
                        </div>
                    </div>
                    <div style={{ padding: '15px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '15px', fontSize: '14px', lineHeight: '1.4' }}>
                        <div><strong style={{ color: '#555' }}>Reproduction:</strong> <br/>{c.reproduction}</div>
                        <div><strong style={{ color: '#555' }}>Weight:</strong> <br/>{c.weight}</div>
                        <div><strong style={{ color: '#555' }}>Fruit Shape:</strong> <br/>{c.fruitShape}</div>
                        <div><strong style={{ color: '#555' }}>Skin Colour:</strong> <br/>{c.skinColour}</div>
                        <div><strong style={{ color: '#555' }}>Fruit Eyes:</strong> <br/>{c.fruitEyes}</div>
                        <div><strong style={{ color: '#555' }}>Fill Colour:</strong> <br/>{c.fillColour}</div>
                        <div><strong style={{ color: '#555' }}>Sugar Content:</strong> <br/>{c.sugarContent}</div>
                        <div><strong style={{ color: '#555' }}>Citric Acid:</strong> <br/>{c.citricAcid}</div>
                        <div style={{ gridColumn: '1 / -1', borderTop: '1px dashed #eee', paddingTop: '10px', marginTop: '5px' }}>
                          <strong style={{ color: '#555' }}>Useability:</strong> <br/>{c.useability}
                        </div>
                    </div>
                </div>
            ))}
        </div>
        <BottomNav />
      </div>
    </div>
  );
}
