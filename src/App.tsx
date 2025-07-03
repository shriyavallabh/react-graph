import { useEffect, useState } from 'react';
import SimpleGraph from './components/SimpleGraph';
import type { GraphData } from './types';
import './App.css';

function App() {
  const [graphData, setGraphData] = useState<GraphData | null>(null);

  useEffect(() => {
    fetch('/demo-kg.json')
      .then(response => response.json())
      .then(data => setGraphData(data))
      .catch(error => console.error('Error loading graph data:', error));
  }, []);

  if (!graphData) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#333'
      }}>
        Loading graph data...
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <SimpleGraph data={graphData} />
    </div>
  );
}

export default App;