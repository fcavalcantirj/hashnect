import React, { useEffect, useRef, useState, useCallback } from 'react';
import styled from 'styled-components';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';
import { graphService, userService } from '../services/api';

const GraphContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #121212;
`;

const MobileAvatar = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #bb86fc;
  box-shadow: 0 0 24px #222;
  margin: 0 auto 12px;
  background: radial-gradient(circle at 60% 40%, #23234d 0%, #181824 100%);
`;

const MobileTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  margin-bottom: 8px;
  text-align: center;
  background: linear-gradient(90deg, #bb86fc, #03dac6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const MobileSection = styled.div`
  width: 100%;
  margin-bottom: 16px;
`;

const MobileButton = styled.button`
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  background: linear-gradient(90deg, #bb86fc, #03dac6);
  color: #fff;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
  margin-top: 16px;
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
  x?: number;
  y?: number;
  z?: number;
}

interface Link {
  source: string;
  target: string;
  strength: number;
  type?: 'friend' | 'hashtag';
  hashtagId?: string;
}

interface GraphData {
  nodes: Node[];
  links: Link[];
}

const createNodeObject = (node: Node) => {
  const group = new THREE.Group();
  const nodeSize = typeof node.val === 'number' && !isNaN(node.val) ? Math.sqrt(node.val) * 8 : 12;
  
  const geometry = new THREE.SphereGeometry(nodeSize, 32, 32);
  const material = new THREE.MeshPhongMaterial({
    color: node.type === 'user' 
      ? (node.verificationLevel > 0 ? '#bb86fc' : '#6200ea')
      : (node.type === 'hashtag' ? '#03dac6' : '#cf6679'),
    transparent: true,
    opacity: 0.9,
    shininess: 50,
    specular: 0x666666
  });
  const sphere = new THREE.Mesh(geometry, material);
  group.add(sphere);
  
  return group;
};

const NetworkGraphMobile: React.FC = () => {
  const [graph, setGraph] = useState<GraphData>({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const graphRef = useRef<any>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevNodesRef = useRef<Node[] | null>(null);
  const hasAnimatedRef = useRef(false);
  const animationRef = useRef<number | undefined>(undefined);
  const [isCameraPositioning, setIsCameraPositioning] = useState(false);

  useEffect(() => {
    const fetchGraph = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await graphService.getFullGraph();
        const validatedNodes = data.users.map((user: any) => ({
          ...user,
          val: typeof user.val === 'number' && !isNaN(user.val) ? user.val : 15,
          color: user.color || '#6200ea',
          verificationLevel: user.verificationLevel || 0,
          type: user.type || 'user'
        }));

        const links = [
          ...data.connections.map((c: any) => ({
            source: c.fromUserId,
            target: c.toUserId,
            type: 'friend',
            strength: typeof c.strength === 'number' && !isNaN(c.strength) ? c.strength : 0.5
          })),
          ...data.hashtagLinks.map((h: any) => ({
            source: h.source,
            target: h.target,
            type: 'hashtag',
            hashtagId: h.hashtagId,
            strength: typeof h.strength === 'number' && !isNaN(h.strength) ? h.strength : 0.5
          }))
        ];

        setGraph({ nodes: validatedNodes, links });
        hasAnimatedRef.current = false;
      } catch (e) {
        console.error('Error fetching graph data:', e);
        setError('Failed to load network data. Please try again.');
        setGraph({ nodes: [], links: [] });
      }
      setLoading(false);
    };
    fetchGraph();
  }, []);

  const handleNodeClick = useCallback((node: Node) => {
    if (node.type !== 'user' || isAnimating) return;
    setSelectedNode(node);
  }, [isAnimating]);

  const handleEngineStop = useCallback(() => {
    if (isAnimating) return;

    if (graphRef.current && !isAnimating && !hasAnimatedRef.current && !isCameraPositioning) {
      setIsCameraPositioning(true);
      hasAnimatedRef.current = true;
      
      try {
        const scene = graphRef.current.scene();
        if (!scene) {
          setIsCameraReady(true);
          setIsCameraPositioning(false);
          return;
        }

        // Add lights if needed
        if (!scene.children.some((child: THREE.Object3D) => child instanceof THREE.AmbientLight)) {
          const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
          scene.add(ambientLight);
        }
        if (!scene.children.some((child: THREE.Object3D) => child instanceof THREE.DirectionalLight)) {
          const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
          directionalLight.position.set(1, 1, 1);
          scene.add(directionalLight);
        }

        const camera = graphRef.current.camera();
        if (!camera) {
          setIsCameraReady(true);
          setIsCameraPositioning(false);
          return;
        }

        const nodes = graph.nodes;
        if (nodes.length === 0) {
          setIsCameraReady(true);
          setIsCameraPositioning(false);
          return;
        }

        // Calculate camera position
        const bounds = nodes.reduce((acc, node) => {
          const x = node.x || 0;
          const y = node.y || 0;
          const z = node.z || 0;
          const size = typeof node.val === 'number' && !isNaN(node.val) ? Math.sqrt(node.val) * 8 : 12;
          return {
            minX: Math.min(acc.minX, x),
            maxX: Math.max(acc.maxX, x),
            minY: Math.min(acc.minY, y),
            maxY: Math.max(acc.maxY, y),
            minZ: Math.min(acc.minZ, z),
            maxZ: Math.max(acc.maxZ, z),
            maxSize: Math.max(acc.maxSize, size)
          };
        }, {
          minX: Infinity,
          maxX: -Infinity,
          minY: Infinity,
          maxY: -Infinity,
          minZ: Infinity,
          maxZ: -Infinity,
          maxSize: 0
        });

        if (bounds.minX === Infinity) {
          bounds.minX = -100;
          bounds.maxX = 100;
          bounds.minY = -100;
          bounds.maxY = 100;
          bounds.minZ = -100;
          bounds.maxZ = 100;
        }

        const centerX = (bounds.minX + bounds.maxX) / 2;
        const centerY = (bounds.minY + bounds.maxY) / 2;
        const centerZ = (bounds.minZ + bounds.maxZ) / 2;
        const maxDimension = Math.max(
          bounds.maxX - bounds.minX,
          bounds.maxY - bounds.minY,
          bounds.maxZ - bounds.minZ
        );

        const baseDistance = Math.max(maxDimension, 100);
        const targetDistance = (baseDistance + bounds.maxSize * 2) * 1.8; // More zoomed out for mobile

        const angle = Math.PI / 4;
        const initialDistance = Math.max(maxDimension * 0.5, 50);
        camera.position.set(
          centerX + initialDistance * Math.cos(angle),
          centerY + initialDistance * Math.sin(angle),
          centerZ + initialDistance * Math.sin(angle)
        );
        camera.lookAt(centerX, centerY, centerZ);
        camera.fov = 45;
        camera.updateProjectionMatrix();

        setIsAnimating(true);
        animateCamera(camera, targetDistance, new THREE.Vector3(centerX, centerY, centerZ));
        setIsCameraReady(true);
      } catch (error) {
        console.error('[NetworkGraphMobile] Error during camera positioning:', error);
        setIsCameraReady(true);
      } finally {
        setIsCameraPositioning(false);
      }
    }
  }, [isAnimating, isCameraPositioning, graph.nodes]);

  const animateCamera = (camera: THREE.PerspectiveCamera, targetDistance: number, center: THREE.Vector3) => {
    const startDistance = camera.position.distanceTo(center);
    const startTime = performance.now();
    const duration = 2000;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentDistance = startDistance + (targetDistance - startDistance) * easedProgress;
      
      const angle = Math.PI / 4;
      camera.position.set(
        center.x + currentDistance * Math.cos(angle),
        center.y + currentDistance * Math.sin(angle),
        center.z + currentDistance * Math.sin(angle)
      );
      camera.lookAt(center);
      camera.updateProjectionMatrix();

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  const nodeThreeObject = useCallback((node: any) => {
    return createNodeObject(node);
  }, []);

  useEffect(() => {
    // Only reset camera if nodes actually changed (not just a re-render)
    const prevNodes = prevNodesRef.current;
    const nodesChanged =
      !prevNodes ||
      prevNodes.length !== graph.nodes.length ||
      prevNodes.some((n, i) => n.id !== graph.nodes[i]?.id);
    
    if (nodesChanged && !isCameraPositioning) {
      console.log('[NetworkGraphMobile] graph.nodes changed, resetting camera');
      setIsCameraReady(false);
      prevNodesRef.current = graph.nodes;
    }
  }, [graph.nodes, isCameraPositioning]);

  // Add a timeout to prevent infinite loading with proper cleanup
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (!isCameraReady && !isCameraPositioning) {
      timeoutId = setTimeout(() => {
        console.warn('[NetworkGraphMobile] Camera positioning timeout - forcing ready state');
        setIsCameraReady(true);
        setIsCameraPositioning(false);
      }, 8000); // Increased timeout to 8 seconds
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isCameraReady, isCameraPositioning]);

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      // Clean up any other animations
      const cleanup = () => {
        if (graphRef.current) {
          const scene = graphRef.current.scene();
          if (scene) {
            scene.traverse((object: THREE.Object3D) => {
              if (object instanceof THREE.Mesh) {
                object.geometry.dispose();
                if (Array.isArray(object.material)) {
                  object.material.forEach(material => material.dispose());
                } else {
                  object.material.dispose();
                }
              }
            });
          }
        }
      };
      cleanup();
    };
  }, []);

  // Add debug effects to track state changes
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[NetworkGraphMobile] Loading state changed:', { 
        isCameraReady,
        isCameraPositioning
      });
    }
  }, [isCameraReady, isCameraPositioning]);

  if (loading || !isCameraReady) return (
    <div style={{ 
      width: '100%', 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: '#121212',
      color: '#bb86fc',
      fontSize: '18px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '12px' 
      }}>
        <div className="spinner" style={{ 
          border: '4px solid #23234d', 
          borderTop: '4px solid #bb86fc', 
          borderRadius: '50%', 
          width: 48, 
          height: 48, 
          animation: 'spin 1s linear infinite' 
        }} />
        <div>Loading network...</div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <GraphContainer>
      {graph.nodes.length > 0 && isCameraReady && (
        <ForceGraph3D
          ref={graphRef}
          graphData={graph}
          nodeLabel="name"
          nodeColor={(node: any) => {
            if (node.type === 'user') {
              return node.verificationLevel > 0 ? '#bb86fc' : '#6200ea';
            } else if (node.type === 'hashtag') {
              return '#03dac6';
            }
            return '#cf6679';
          }}
          nodeVal={(node: any) => typeof node.val === 'number' && !isNaN(node.val) ? Math.sqrt(node.val) * 8 : 12}
          linkWidth={(link: any) => (typeof link.strength === 'number' && !isNaN(link.strength) ? link.strength * 4 : 2)}
          linkColor={(link: any) => {
            if (link.type === 'friend') {
              return '#bb86fc';
            } else if (link.type === 'hashtag') {
              return '#03dac6';
            }
            return '#cf6679';
          }}
          backgroundColor="#121212"
          onNodeClick={handleNodeClick}
          onEngineStop={handleEngineStop}
          nodeThreeObject={nodeThreeObject}
          linkThreeObject={(link: any) => {
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
            const material = new THREE.MeshPhongMaterial({
              color: link.type === 'friend' ? '#bb86fc' : '#03dac6',
              transparent: true,
              opacity: typeof link.strength === 'number' && !isNaN(link.strength) ? link.strength * 0.5 : 0.3,
              shininess: 50,
              specular: 0x666666
            });
            return new THREE.Mesh(geometry, material);
          }}
          linkPositionUpdate={(line: any, { start, end }) => {
            const startR = (typeof (start as any).val === 'number' && !isNaN((start as any).val) ? Math.sqrt((start as any).val) * 8 : 12);
            const endR = (typeof (end as any).val === 'number' && !isNaN((end as any).val) ? Math.sqrt((end as any).val) * 8 : 12);
            
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
          enableNodeDrag={false}
          enableNavigationControls={true}
          showNavInfo={true}
          cooldownTicks={100}
          d3AlphaDecay={0.01}
          d3VelocityDecay={0.08}
          warmupTicks={100}
        />
      )}
      {selectedNode && (
        <div style={{
          background: '#181824',
          color: '#fff',
          padding: '24px 16px',
          borderTop: '2px solid #bb86fc',
          marginTop: 'auto',
          width: '100%',
          flexShrink: 0,
          position: 'relative',
          zIndex: 1,
          boxShadow: 'none',
          backdropFilter: 'none',
          transform: 'none',
          transition: 'none'
        }}>
          <MobileTitle>{selectedNode?.name}</MobileTitle>
          <MobileSection>
            <MobileAvatar>
              <img 
                src={selectedNode?.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(selectedNode?.name || '')} 
                alt={selectedNode?.name || ''} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            </MobileAvatar>
            <div style={{ color: '#aaa', fontSize: 12, marginBottom: 6, wordBreak: 'break-all', textAlign: 'center' }}>
              ID: {selectedNode?.id}
            </div>
            <div style={{ color: '#fff', fontWeight: 600, fontSize: 14, marginBottom: 6 }}>
              Verification Level: <span style={{ color: '#bb86fc' }}>{selectedNode?.verificationLevel}</span>
            </div>
          </MobileSection>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginBottom: 18 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              <div style={{ marginBottom: 8, width: '100%' }}>
                <span style={{ color: '#03dac6', fontWeight: 500, fontSize: 15 }}>Hashtags:</span>
                {selectedNode?.hashtags && selectedNode.hashtags.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
                    {selectedNode.hashtags.map((h: string) => (
                      <span key={h} style={{ background: 'linear-gradient(90deg, #bb86fc, #03dac6)', color: '#181824', borderRadius: 12, padding: '4px 12px', fontSize: 14, fontWeight: 600 }}>{`#${h}`}</span>
                    ))}
                  </div>
                ) : (
                  <div style={{ color: '#888', fontSize: 14, marginTop: 6 }}>
                    No interests yet. <span style={{ color: '#bb86fc', cursor: 'pointer', textDecoration: 'underline' }}>Add your first hashtag!</span>
                    <div style={{ color: '#03dac6', fontSize: 13, marginTop: 6, fontStyle: 'italic', lineHeight: 1.5 }}>
                      Hashnect connects you through shared interests—no ads, no algorithmic BS. Hashtags are how you find your people and build real communities here.
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div style={{ width: '100%', margin: '8px 0 0 0', textAlign: 'center' }}>
              <span style={{ color: '#03dac6', fontWeight: 500, fontSize: 15 }}>Bio:</span>
              <div style={{ color: '#fff', fontSize: 15, marginTop: 4, minHeight: 24 }}>
                {selectedNode?.bio && selectedNode.bio.trim() !== '' ? selectedNode.bio : <span style={{ color: '#888', fontStyle: 'italic' }}>No bio yet. <span style={{ color: '#bb86fc', cursor: 'pointer', textDecoration: 'underline' }}>Add something about yourself!</span></span>}
              </div>
            </div>
            {selectedNode?.connectionsCount !== undefined && (
              <div style={{ color: '#fff', fontSize: 14, marginTop: 8 }}>Connections: <span style={{ color: '#bb86fc', fontWeight: 600 }}>{selectedNode.connectionsCount}</span></div>
            )}
            {selectedNode?.subdomains && selectedNode.subdomains.length > 0 && (
              <div style={{ color: '#fff', fontSize: 14, marginTop: 4 }}>Subdomains: <span style={{ color: '#03dac6', fontWeight: 600 }}>{selectedNode.subdomains.join(', ')}</span></div>
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 16 }}>
            <a href="/api/auth/google" title="Connect Google" style={{ background: '#fff', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px #0002' }}><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="Google" style={{ width: 20, height: 20 }} /></a>
            <a href="/api/auth/facebook" title="Connect Facebook" style={{ background: '#1877f3', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px #0002' }}><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg" alt="Facebook" style={{ width: 20, height: 20 }} /></a>
            <a href="/api/auth/instagram" title="Connect Instagram" style={{ background: 'radial-gradient(circle at 30% 110%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fd5949', boxShadow: '0 0 8px 2px #fd5949, 0 2px 8px #0002' }}><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/instagram/instagram-original.svg" alt="Instagram" style={{ width: 20, height: 20, filter: 'drop-shadow(0 0 4px #fd5949)' }} /></a>
            <a href="/api/auth/linkedin" title="Connect LinkedIn" style={{ background: '#0077b5', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px #0002' }}><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg" alt="LinkedIn" style={{ width: 20, height: 20 }} /></a>
          </div>
          <div style={{ color: '#888', fontSize: 13, textAlign: 'center', marginBottom: 12, lineHeight: 1.5 }}>
            Connect your other networks to find lifelong friends and unlock more connections here—Hashnect helps you bring your real social graph to life.
          </div>
          <MobileButton onClick={() => setSelectedNode(null)}>
            Close
          </MobileButton>
        </div>
      )}
    </GraphContainer>
  );
};

export default NetworkGraphMobile; 