import { useRef, useState, useEffect } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import type { GraphData } from '../types';

interface SimpleGraphProps {
  data: GraphData;
}

const SimpleGraph = ({ data }: SimpleGraphProps) => {
  const graphRef = useRef<any>(null);
  const [hoveredNode, setHoveredNode] = useState<any>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Initialize graph to prevent nodes going off-screen
  useEffect(() => {
    if (graphRef.current) {
      const graph = graphRef.current;
      
      // Wait for initial layout, then zoom to fit
      setTimeout(() => {
        graph.zoomToFit(1000, 50);
      }, 2000);
    }
  }, [data]);

  // Calculate statistics
  const criticalIssues = data.nodes.filter(n => n.confidence < 0.5).length;
  const warnings = data.nodes.filter(n => n.confidence >= 0.5 && n.confidence < 0.8).length;
  const goodCode = data.nodes.filter(n => n.confidence >= 0.8).length;

  // Update tooltip position when hovering over a node
  useEffect(() => {
    const handleMouseMove = () => {
      if (hoveredNode && graphRef.current) {
        const graph = graphRef.current;
        const nodePosition = graph.graph2ScreenCoords(
          hoveredNode.x || 0,
          hoveredNode.y || 0,
          hoveredNode.z || 0
        );
        setTooltipPosition({ x: nodePosition.x, y: nodePosition.y });
      }
    };

    const animationFrame = requestAnimationFrame(function animate() {
      handleMouseMove();
      requestAnimationFrame(animate);
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [hoveredNode]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Title */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 1000,
        color: '#ffffff',
        fontSize: '24px',
        fontWeight: 'bold',
        textShadow: '0 0 10px rgba(100, 200, 255, 0.5)'
      }}>
        Code Analysis - Entity & Relationship Extraction
      </div>

      {/* Scan Results Summary Panel */}
      <div className="panel" style={{
        position: 'absolute',
        top: '80px',
        left: '20px',
        background: 'rgba(10, 10, 30, 0.9)',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0, 100, 200, 0.3)',
        zIndex: 1000,
        minWidth: '200px',
        border: '1px solid rgba(100, 200, 255, 0.3)',
        backdropFilter: 'blur(10px)'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#ffffff', fontSize: '16px' }}>Scan Results</h3>
        <div style={{ 
          color: '#ff0000', 
          fontWeight: 'bold', 
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '16px', marginRight: '8px' }}>🔴</span>
          Critical Issues: {criticalIssues}
        </div>
        <div style={{ 
          color: '#ff8800', 
          fontWeight: 'bold', 
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '16px', marginRight: '8px' }}>🟡</span>
          Warnings: {warnings}
        </div>
        <div style={{ 
          color: '#00aa00', 
          fontWeight: 'bold', 
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '16px', marginRight: '8px' }}>🟢</span>
          Good Code: {goodCode}
        </div>
        <div style={{ 
          color: '#aaaaaa', 
          fontSize: '14px', 
          borderTop: '1px solid rgba(100, 200, 255, 0.3)',
          paddingTop: '8px'
        }}>
          Total Entities: {data.nodes.length}
        </div>
        <div style={{ color: '#aaaaaa', fontSize: '14px' }}>
          Relationships: {data.links.length}
        </div>
      </div>

      {/* Beautiful Curved Graph with Flowing Edges */}
      <ForceGraph3D
        ref={graphRef}
        graphData={data}
        nodeColor={(node: any) => {
          if (node.confidence < 0.5) return '#ff4444';
          if (node.confidence < 0.8) return '#ff8800';
          return '#44ff44';
        }}
        nodeSize={8}
        nodeLabel={() => ''}
        linkColor={(link: any) => {
          // Color edges based on relationship type
          const colors = {
            'contains': '#ff69b4',      // Pink
            'uses': '#00ffff',          // Cyan
            'calls': '#90ee90',         // Light Green
            'exports': '#ffa500',       // Orange
            'routes_to': '#9370db',     // Purple
            'accesses': '#ff6347',      // Tomato
            'reads': '#20b2aa',         // Light Sea Green
            'validates': '#dda0dd',     // Plum
            'assigns': '#f0e68c',       // Khaki
            'imports': '#87ceeb',       // Sky Blue
            'protected_by': '#dc143c',  // Crimson
            'logs_via': '#32cd32',      // Lime Green
            'configures_with': '#ff1493', // Deep Pink
            'queues_via': '#00ced1',    // Dark Turquoise
            'stores_in': '#ffd700',     // Gold
            'decrypts_with': '#ba55d3', // Medium Orchid
            'called_by': '#ff7f50',     // Coral
            'logs_to': '#98fb98',       // Pale Green
            'caches': '#add8e6',        // Light Blue
            'protects': '#f4a460'       // Sandy Brown
          };
          return colors[link.label] || '#66ffff';
        }}
        linkWidth={(link: any) => {
          // Vary width based on relationship importance
          const importantTypes = ['contains', 'uses', 'calls', 'exports'];
          return importantTypes.includes(link.label) ? 3 : 2;
        }}
        linkOpacity={0.8}
        linkCurvature={(link: any) => {
          // Create beautiful curved edges with varying curvature
          const curvatures = {
            'contains': 0.3,
            'uses': 0.5,
            'calls': 0.4,
            'exports': 0.2,
            'routes_to': 0.6,
            'accesses': 0.35,
            'reads': 0.45,
            'validates': 0.25,
            'assigns': 0.55,
            'imports': 0.4,
            'protected_by': 0.3,
            'logs_via': 0.5,
            'configures_with': 0.6,
            'queues_via': 0.35,
            'stores_in': 0.4,
            'decrypts_with': 0.55,
            'called_by': 0.3,
            'logs_to': 0.45,
            'caches': 0.25,
            'protects': 0.5
          };
          return curvatures[link.label] || 0.4;
        }}
        linkDirectionalArrowLength={6}
        linkDirectionalArrowRelPos={1}
        linkDirectionalArrowColor={(link: any) => {
          // Match arrow color to link color
          const colors = {
            'contains': '#ff69b4',
            'uses': '#00ffff',
            'calls': '#90ee90',
            'exports': '#ffa500',
            'routes_to': '#9370db',
            'accesses': '#ff6347',
            'reads': '#20b2aa',
            'validates': '#dda0dd',
            'assigns': '#f0e68c',
            'imports': '#87ceeb',
            'protected_by': '#dc143c',
            'logs_via': '#32cd32',
            'configures_with': '#ff1493',
            'queues_via': '#00ced1',
            'stores_in': '#ffd700',
            'decrypts_with': '#ba55d3',
            'called_by': '#ff7f50',
            'logs_to': '#98fb98',
            'caches': '#add8e6',
            'protects': '#f4a460'
          };
          return colors[link.label] || '#66ffff';
        }}
        backgroundColor="#000011"
        onNodeHover={(node) => setHoveredNode(node)}
        enableNodeDrag={false}
        enableNavigationControls={true}
        showNavInfo={false}
      />

      {/* Legend */}
      <div className="panel" style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        background: 'rgba(10, 10, 30, 0.9)',
        padding: '15px',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0, 100, 200, 0.3)',
        zIndex: 1000,
        border: '1px solid rgba(100, 200, 255, 0.3)',
        backdropFilter: 'blur(10px)'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#ffffff', fontSize: '14px' }}>Legend</h4>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
          <div style={{ 
            width: '14px', 
            height: '14px', 
            backgroundColor: 'red', 
            borderRadius: '50%', 
            marginRight: '10px' 
          }}></div>
          <span style={{ fontSize: '12px', color: '#ffffff' }}>Critical - Needs Immediate Fix</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
          <div style={{ 
            width: '14px', 
            height: '14px', 
            backgroundColor: 'orange', 
            borderRadius: '50%', 
            marginRight: '10px' 
          }}></div>
          <span style={{ fontSize: '12px', color: '#ffffff' }}>Warning - Should be Improved</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ 
            width: '14px', 
            height: '14px', 
            backgroundColor: 'green', 
            borderRadius: '50%', 
            marginRight: '10px' 
          }}></div>
          <span style={{ fontSize: '12px', color: '#ffffff' }}>Good - High Quality</span>
        </div>
      </div>

      {/* Enhanced Tooltip - Positioned Near Node */}
      {hoveredNode && (
        <div style={{
          position: 'absolute',
          left: tooltipPosition.x + 15,
          top: tooltipPosition.y - 10,
          background: 'rgba(0, 0, 0, 0.9)',
          color: 'white',
          padding: '12px',
          borderRadius: '8px',
          zIndex: 1000,
          maxWidth: '320px',
          fontSize: '12px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
          pointerEvents: 'none'
        }}>
          <div style={{ marginBottom: '6px', fontSize: '14px', fontWeight: 'bold' }}>
            📁 {hoveredNode.name}
          </div>
          <div style={{ marginBottom: '3px' }}><strong>Type:</strong> {hoveredNode.type}</div>
          <div style={{ marginBottom: '3px' }}><strong>Description:</strong> {hoveredNode.description}</div>
          <div style={{ marginBottom: '3px' }}><strong>Recommendation:</strong> {hoveredNode.recommendation}</div>
          <div style={{ marginBottom: '6px' }}><strong>Reasoning:</strong> {hoveredNode.reasoning}</div>
          <div style={{ 
            padding: '3px 6px',
            borderRadius: '4px',
            background: hoveredNode.confidence < 0.5 ? 'rgba(255,0,0,0.3)' : 
                        hoveredNode.confidence < 0.8 ? 'rgba(255,136,0,0.3)' : 'rgba(0,170,0,0.3)',
            color: hoveredNode.confidence < 0.5 ? '#ff6666' : 
                   hoveredNode.confidence < 0.8 ? '#ffaa66' : '#66ff66',
            fontWeight: 'bold',
            fontSize: '11px'
          }}>
            Confidence: {(hoveredNode.confidence * 100).toFixed(0)}%
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleGraph;