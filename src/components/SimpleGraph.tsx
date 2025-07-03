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
        color: '#333',
        fontSize: '24px',
        fontWeight: 'bold'
      }}>
        Code Analysis - Entity & Relationship Extraction
      </div>

      {/* Scan Results Summary Panel */}
      <div style={{
        position: 'absolute',
        top: '80px',
        left: '20px',
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
        zIndex: 1000,
        minWidth: '200px',
        border: '1px solid #e0e0e0'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#333', fontSize: '16px' }}>Scan Results</h3>
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
          color: '#666', 
          fontSize: '14px', 
          borderTop: '1px solid #eee',
          paddingTop: '8px'
        }}>
          Total Entities: {data.nodes.length}
        </div>
        <div style={{ color: '#666', fontSize: '14px' }}>
          Relationships: {data.links.length}
        </div>
      </div>

      {/* Very Basic Graph with Visible Edges */}
      <ForceGraph3D
        ref={graphRef}
        graphData={data}
        nodeColor={(node: any) => {
          if (node.confidence < 0.5) return 'red';
          if (node.confidence < 0.8) return 'orange';
          return 'green';
        }}
        nodeLabel={() => ''}
        linkColor={() => '#666666'}
        linkWidth={1.5}
        linkOpacity={0.7}
        linkDirectionalArrowLength={4}
        linkDirectionalArrowRelPos={1}
        backgroundColor="white"
        onNodeHover={(node) => setHoveredNode(node)}
        enableNodeDrag={false}
        enableNavigationControls={true}
        showNavInfo={false}
      />

      {/* Legend */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '15px',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
        zIndex: 1000,
        border: '1px solid #e0e0e0'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#333', fontSize: '14px' }}>Legend</h4>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
          <div style={{ 
            width: '14px', 
            height: '14px', 
            backgroundColor: 'red', 
            borderRadius: '50%', 
            marginRight: '10px' 
          }}></div>
          <span style={{ fontSize: '12px', color: '#333' }}>Critical - Needs Immediate Fix</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
          <div style={{ 
            width: '14px', 
            height: '14px', 
            backgroundColor: 'orange', 
            borderRadius: '50%', 
            marginRight: '10px' 
          }}></div>
          <span style={{ fontSize: '12px', color: '#333' }}>Warning - Should be Improved</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ 
            width: '14px', 
            height: '14px', 
            backgroundColor: 'green', 
            borderRadius: '50%', 
            marginRight: '10px' 
          }}></div>
          <span style={{ fontSize: '12px', color: '#333' }}>Good - High Quality</span>
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