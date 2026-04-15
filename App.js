import React, { useState } from 'react';
import { FACTS } from './data';

function App() {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);

  const fact = FACTS[currentFactIndex];

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ background: '#fff', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', padding: '20px' }}>
        
        {/* Badge Catégorie */}
        <span style={{ background: '#3498db', color: '#fff', padding: '5px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
          {fact.category}
        </span>

        <h1 style={{ color: '#2c3e50', marginTop: '15px' }}>{fact.title}</h1>
        <p style={{ fontSize: '1.2rem', lineHeight: '1.5', color: '#34495e' }}>{fact.text}</p>

        {/* Bouton pour afficher plus */}
        <button 
          onClick={() => setShowMore(!showMore)}
          style={{ background: 'none', border: '1px solid #3498db', color: '#3498db', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}
        >
          {showMore ? "Voir moins" : "En savoir plus"}
        </button>

        {/* Section Détails + Vocabulaire */}
        {showMore && (
          <div style={{ marginTop: '20px', padding: '15px', borderTop: '1px solid #eee' }}>
            <p style={{ color: '#7f8c8d', fontStyle: 'italic', marginBottom: '15px' }}>{fact.moreInfo}</p>
            
            {/* AFFICHAGE DES MOTS COMPLIQUÉS */}
            {fact.hardWords && fact.hardWords.length > 0 && (
              <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #3498db' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>💡 Vocabulaire</h4>
                <ul style={{ paddingLeft: '20px', margin: 0 }}>
                  {fact.hardWords.map((hw, index) => (
                    <li key={index} style={{ marginBottom: '5px', color: '#2c3e50' }}>
                      <strong>{hw.word} :</strong> {hw.definition}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between' }}>
          <button 
            disabled={currentFactIndex === 0}
            onClick={() => { setCurrentFactIndex(currentFactIndex - 1); setShowMore(false); }}
            style={{ padding: '10px', opacity: currentFactIndex === 0 ? 0.5 : 1 }}
          > Précédent </button>
          
          <button 
            disabled={currentFactIndex === FACTS.length - 1}
            onClick={() => { setCurrentFactIndex(currentFactIndex + 1); setShowMore(false); }}
            style={{ padding: '10px', opacity: currentFactIndex === FACTS.length - 1 ? 0.5 : 1 }}
          > Suivant </button>
        </div>

      </div>
    </div>
  );
}

export default App;
