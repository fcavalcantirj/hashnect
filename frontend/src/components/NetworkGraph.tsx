import React from 'react';
import styled from 'styled-components';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';
import { useEffect, useRef, useState } from 'react';
import { graphService, userService } from '../services/api';
import Modal from 'react-modal';

const GraphContainer = styled.div`
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
`;

interface Node {
  id: string;
  name: string;
  val: number;
  color: string;
  verificationLevel: number;
  type: 'user' | 'hashtag' | 'subdomain';
  avatar?: string;
  hashtags?: string[];
  connectionsCount?: number;
  subdomains?: string[];
  bio?: string;
}

interface Link {
  source: string;
  target: string;
  strength: number;
}

interface GraphData {
  nodes: Node[];
  links: Link[];
}

const NetworkGraph: React.FC = () => {
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const graphRef = useRef<any>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await graphService.getGraphData();
        setGraphData(data);
      } catch (error) {
        console.error('Error fetching graph data:', error);
      }
    };

    fetchData();
  }, []);

  const handleNodeClick = async (node: Node) => {
    if (node.type === 'user') {
      setModalLoading(true);
      setSelectedNode({ ...node }); // Show modal immediately with stale data
      try {
        const freshProfile = await userService.getProfile(node.id);
        setSelectedNode({ ...node, ...freshProfile });
      } catch (err) {
        console.error('Failed to fetch latest profile:', err);
        setSelectedNode(node); // fallback to stale data
      } finally {
        setModalLoading(false);
      }
    }
  };

  return (
    <GraphContainer>
      {graphData.nodes.length > 0 && (
        <ForceGraph3D
          ref={graphRef}
          graphData={graphData}
          nodeLabel="name"
          nodeColor={(node: any) => node.color}
          nodeVal={(node: any) => node.val}
          linkWidth={(link: any) => link.strength * 3}
          linkColor={() => '#03dac6'}
          backgroundColor="#121212"
          onNodeClick={handleNodeClick}
          nodeThreeObject={(node: any) => {
            // Create custom node objects
            const group = new THREE.Group();
            
            // Base sphere for all nodes
            const geometry = new THREE.SphereGeometry(node.val / 3, 32, 32);
            const material = new THREE.MeshLambertMaterial({
              color: node.color,
              transparent: true,
              opacity: 0.8
            });
            const sphere = new THREE.Mesh(geometry, material);
            group.add(sphere);
            
            // Add glow effect for verification level
            if (node.type === 'user' && node.verificationLevel > 0) {
              const glowGeometry = new THREE.SphereGeometry((node.val / 3) * 1.2, 32, 32);
              const glowMaterial = new THREE.MeshBasicMaterial({
                color: '#bb86fc',
                transparent: true,
                opacity: 0.1 * node.verificationLevel
              });
              const glowSphere = new THREE.Mesh(glowGeometry, glowMaterial);
              group.add(glowSphere);
            }
            
            return group;
          }}
          linkThreeObject={(link: any) => {
            // Create custom link objects with glow effect
            const geometry = new THREE.TubeGeometry(
              new THREE.CatmullRomCurve3([
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(1, 0, 0)
              ]),
              20,
              0.5,
              8,
              false
            );
            const material = new THREE.MeshBasicMaterial({
              color: '#03dac6',
              transparent: true,
              opacity: link.strength * 0.5
            });
            return new THREE.Mesh(geometry, material);
          }}
          linkPositionUpdate={(line: any, { start, end }) => {
            // Update link positions
            const startR = (typeof (start as any).val === 'number' ? (start as any).val : 3) / 3;
            const endR = (typeof (end as any).val === 'number' ? (end as any).val : 3) / 3;
            const lineLen = Math.sqrt(
              Math.pow(end.x - start.x, 2) +
              Math.pow(end.y - start.y, 2) +
              Math.pow(end.z - start.z, 2)
            );
            
            if (lineLen > startR + endR) {
              const startLen = startR / lineLen;
              const endLen = endR / lineLen;
              
              const newStart = {
                x: start.x + (end.x - start.x) * startLen,
                y: start.y + (end.y - start.y) * startLen,
                z: start.z + (end.z - start.z) * startLen
              };
              
              const newEnd = {
                x: end.x - (end.x - start.x) * endLen,
                y: end.y - (end.y - start.y) * endLen,
                z: end.z - (end.z - start.z) * endLen
              };
              
              line.position.set(newStart.x, newStart.y, newStart.z);
              line.lookAt(newEnd.x, newEnd.y, newEnd.z);
              line.scale.set(1, 1, lineLen - startR - endR);
              return true;
            }
            return false;
          }}
        />
      )}
      {selectedNode && (
        <Modal
          isOpen={!!selectedNode}
          onRequestClose={() => setSelectedNode(null)}
          style={{
            content: {
              top: '50%', left: '50%', right: 'auto', bottom: 'auto',
              marginRight: '-50%', transform: 'translate(-50%, -50%)',
              background: 'radial-gradient(circle at 60% 40%, #23234d 0%, #181824 100%)', color: '#fff', borderRadius: '18px', padding: '48px 64px 48px 64px', minWidth: '600px', maxWidth: '1200px', boxShadow: '0 8px 40px #000a', border: '2px solid #bb86fc', position: 'relative', overflow: 'visible', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
            },
            overlay: { backgroundColor: 'rgba(10,10,30,0.88)' }
          }}
          ariaHideApp={false}
        >
          {/* Cosmic particle effect */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
            <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
              {[...Array(18)].map((_, i) => (
                <circle key={i} cx={Math.random()*340} cy={Math.random()*340} r={Math.random()*2+1} fill="#bb86fc" opacity={Math.random()*0.2+0.1} />
              ))}
            </svg>
          </div>
          {modalLoading ? (
            <div style={{ minHeight: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
              <div style={{ fontSize: 22, color: '#bb86fc', marginBottom: 16 }}>Loading profile...</div>
              <div className="spinner" style={{ border: '4px solid #23234d', borderTop: '4px solid #bb86fc', borderRadius: '50%', width: 48, height: 48, animation: 'spin 1s linear infinite' }} />
              <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
          ) : (
            <h2 style={{ marginTop: 0, fontSize: 28, marginBottom: 12, textAlign: 'center', background: 'linear-gradient(90deg, #bb86fc, #03dac6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', zIndex: 1, position: 'relative' }}>{selectedNode.name}</h2>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24, zIndex: 1, position: 'relative' }}>
            <div style={{
              width: 100, height: 100, borderRadius: '50%', overflow: 'hidden',
              border: `3px solid #bb86fc`, boxShadow: selectedNode.verificationLevel > 0 ? `0 0 ${selectedNode.verificationLevel * 16}px 6px #bb86fc88, 0 0 32px #03dac6aa` : '0 0 24px #222', marginBottom: 12,
              animation: selectedNode.verificationLevel > 0 ? 'glowPulse 2s infinite alternate' : 'none',
              background: 'radial-gradient(circle at 60% 40%, #23234d 0%, #181824 100%)'
            }}>
              <img src={selectedNode.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(selectedNode.name)} alt={selectedNode.name} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: selectedNode.verificationLevel > 0 ? 'drop-shadow(0 0 8px #bb86fc)' : 'none' }} />
            </div>
            <div style={{ color: '#aaa', fontSize: 14, marginBottom: 8, wordBreak: 'break-all', textAlign: 'center' }}>ID: {selectedNode.id}</div>
            <div style={{ color: '#fff', fontWeight: 600, fontSize: 16, marginBottom: 8 }}>Verification Level: <span style={{ color: '#bb86fc' }}>{selectedNode.verificationLevel}</span></div>
          </div>
          {/* Hashtags, Connections, Subdomains */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginBottom: 18, zIndex: 1, position: 'relative' }}>
            {/* Hashtags as chips or prompt */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              <div style={{ marginBottom: 8, width: '100%' }}>
                <span style={{ color: '#03dac6', fontWeight: 500, fontSize: 15 }}>Hashtags:</span>
                {selectedNode.hashtags && selectedNode.hashtags.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
                    {selectedNode.hashtags.map((h: string) => (
                      <span key={h} style={{ background: 'linear-gradient(90deg, #bb86fc, #03dac6)', color: '#181824', borderRadius: 12, padding: '4px 12px', fontSize: 14, fontWeight: 600 }}>{`#${h}`}</span>
                    ))}
                  </div>
                ) : (
                  <div style={{ color: '#888', fontSize: 14, marginTop: 6 }}>
                    No interests yet. <span style={{ color: '#bb86fc', cursor: 'pointer', textDecoration: 'underline' }}>Add your first hashtag!</span>
                    <div style={{ color: '#03dac6', fontSize: 13, marginTop: 6, fontStyle: 'italic', maxWidth: 420, lineHeight: 1.5 }}>
                      Hashnect connects you through shared interests—no ads, no algorithmic BS. Hashtags are how you find your people and build real communities here.
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Bio section */}
            <div style={{ width: '100%', margin: '8px 0 0 0', textAlign: 'center' }}>
              <span style={{ color: '#03dac6', fontWeight: 500, fontSize: 15 }}>Bio:</span>
              <div style={{ color: '#fff', fontSize: 15, marginTop: 4, minHeight: 24 }}>
                {selectedNode.bio && selectedNode.bio.trim() !== '' ? selectedNode.bio : <span style={{ color: '#888', fontStyle: 'italic' }}>No bio yet. <span style={{ color: '#bb86fc', cursor: 'pointer', textDecoration: 'underline' }}>Add something about yourself!</span></span>}
              </div>
            </div>
            {selectedNode.connectionsCount !== undefined && (
              <div style={{ color: '#fff', fontSize: 14, marginTop: 8 }}>Connections: <span style={{ color: '#bb86fc', fontWeight: 600 }}>{selectedNode.connectionsCount}</span></div>
            )}
            {selectedNode.subdomains && selectedNode.subdomains.length > 0 && (
              <div style={{ color: '#fff', fontSize: 14, marginTop: 4 }}>Subdomains: <span style={{ color: '#03dac6', fontWeight: 600 }}>{selectedNode.subdomains.join(', ')}</span></div>
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 16, zIndex: 1, position: 'relative' }}>
            <a href="/api/auth/google" title="Connect Google" style={{ background: '#fff', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px #0002' }}><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="Google" style={{ width: 20, height: 20 }} /></a>
            <a href="/api/auth/facebook" title="Connect Facebook" style={{ background: '#1877f3', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px #0002' }}><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg" alt="Facebook" style={{ width: 20, height: 20 }} /></a>
            <a href="/api/auth/instagram" title="Connect Instagram" style={{ background: 'radial-gradient(circle at 30% 110%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fd5949', boxShadow: '0 0 8px 2px #fd5949, 0 2px 8px #0002' }}><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/instagram/instagram-original.svg" alt="Instagram" style={{ width: 20, height: 20, filter: 'drop-shadow(0 0 4px #fd5949)' }} /></a>
            <a href="/api/auth/linkedin" title="Connect LinkedIn" style={{ background: '#0077b5', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px #0002' }}><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg" alt="LinkedIn" style={{ width: 20, height: 20 }} /></a>
          </div>
          <div style={{ color: '#888', fontSize: 13, textAlign: 'center', marginBottom: 12, maxWidth: 480, margin: '0 auto 18px auto', lineHeight: 1.5 }}>
            Connect your other networks to find lifelong friends and unlock more connections here—Hashnect helps you bring your real social graph to life.
          </div>
          <button onClick={() => setSelectedNode(null)} style={{ marginTop: 12, padding: '10px 24px', borderRadius: 8, background: 'linear-gradient(90deg, #bb86fc, #03dac6)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 16, letterSpacing: 1, zIndex: 1, position: 'relative' }}>Close</button>
          <style>{`
            @keyframes glowPulse {
              0% { box-shadow: 0 0 24px #bb86fc, 0 0 32px #03dac6aa; }
              100% { box-shadow: 0 0 48px #bb86fc, 0 0 64px #03dac6aa; }
            }
          `}</style>
        </Modal>
      )}
    </GraphContainer>
  );
};

export default NetworkGraph;
