import React, { useEffect, useRef, useState, useCallback } from 'react';
import styled from 'styled-components';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';
import { graphService, userService, authService } from '../services/api';

const GraphContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #121212;
`;

const InfoPanel = styled.div`
  background: #181824;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  padding: 16px;
  /* No position, no z-index, no shadow */
`;

const BottomSheet = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #181824;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  transform: translateY(${props => props.$isOpen ? '0' : '100%'});
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  max-height: 80vh;
  z-index: 1000;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
`;

const Handle = styled.div`
  width: 40px;
  height: 4px;
  background: #bb86fc;
  border-radius: 2px;
  margin: 12px auto;
  opacity: 0.5;
`;

const SheetContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 16px 16px;
  -webkit-overflow-scrolling: touch;
`;

const SheetHeader = styled.div`
  padding: 0 16px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid rgba(187, 134, 252, 0.2);
`;

const MobileAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #bb86fc;
  flex-shrink: 0;
`;

const MobileTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  color: #fff;
`;

const Section = styled.div`
  margin: 16px 0;
`;

const SectionTitle = styled.div`
  color: #03dac6;
  font-size: 14px;
  margin-bottom: 8px;
  font-weight: 500;
`;

const Hashtag = styled.span`
  background: linear-gradient(90deg, #bb86fc, #03dac6);
  color: #181824;
  border-radius: 12px;
  padding: 4px 12px;
  font-size: 14px;
  font-weight: 600;
  display: inline-block;
  margin: 4px;
`;

const CloseButton = styled.button`
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

const BottomBar = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #181824;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  box-shadow: 0 -2px 12px rgba(0,0,0,0.2);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  z-index: 2000;
  cursor: pointer;
`;

const FoldPanel = styled.div<{ $open: boolean }>`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #181824;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  box-shadow: 0 -2px 12px rgba(0,0,0,0.2);
  padding: 24px 16px 32px 16px;
  max-height: 60vh;
  transform: translateY(${props => props.$open ? '0' : '100%'});
  transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
  z-index: 2001;
  display: flex;
  flex-direction: column;
  pointer-events: ${props => props.$open ? 'auto' : 'none'};
`;

const BarAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #bb86fc;
  margin-right: 12px;
  flex-shrink: 0;
`;

const BarName = styled.div`
  color: #fff;
  font-size: 16px;
  font-weight: 600;
`;

const BarChevron = styled.div<{ $open: boolean }>`
  margin-left: auto;
  color: #bb86fc;
  font-size: 22px;
  transform: rotate(${props => props.$open ? '180deg' : '0'});
  transition: transform 0.2s;
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
  const [isAnimating, setIsAnimating] = useState(false);
  const prevNodesRef = useRef<Node[] | null>(null);
  const hasAnimatedRef = useRef(false);
  const animationRef = useRef<number | undefined>(undefined);
  const [isCameraPositioning, setIsCameraPositioning] = useState(false);
  const [barOpen, setBarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

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

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  // Fetch full profile when bar is opened
  useEffect(() => {
    const fetchProfile = async () => {
      if (barOpen && user && user.id) {
        try {
          setProfileLoading(true);
          setProfileError(null);
          const data = await userService.getProfile(user.id);
          setProfile(data);
        } catch (e) {
          setProfile(null);
          setProfileError('Failed to load profile. Please try again.');
        } finally {
          setProfileLoading(false);
        }
      }
    };
    fetchProfile();
  }, [barOpen, user]);

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
      <div style={{ flex: 1, width: '100%', height: '100%' }}>
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
      </div>
      {user && !barOpen && (
        <BottomBar onClick={() => setBarOpen(true)}>
          <BarAvatar>
            <img src={user.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.fullName || user.name)} alt={user.fullName || user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </BarAvatar>
          <BarName>{user.fullName || user.name}</BarName>
          <BarChevron $open={barOpen}>{barOpen ? '▲' : '▼'}</BarChevron>
        </BottomBar>
      )}
      {user && barOpen && (
        <FoldPanel $open={barOpen}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
            <button
              style={{ background: 'none', border: 'none', color: '#bb86fc', fontSize: 24, cursor: 'pointer' }}
              onClick={() => !profileLoading && setBarOpen(false)}
              aria-label="Close"
              disabled={profileLoading}
            >
              ×
            </button>
          </div>
          {profileLoading && (
            <div style={{ color: '#bb86fc', textAlign: 'center', padding: 24 }}>
              <div className="spinner" style={{
                border: '4px solid #23234d',
                borderTop: '4px solid #bb86fc',
                borderRadius: '50%',
                width: 32,
                height: 32,
                margin: '0 auto 12px',
                animation: 'spin 1s linear infinite'
              }} />
              Loading profile...
              <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
          )}
          {profileError && (
            <div style={{ color: 'red', textAlign: 'center', padding: 24 }}>{profileError}</div>
          )}
          {profile && !profileLoading && !profileError && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                <BarAvatar>
                  <img src={profile.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(profile.fullName || profile.name)} alt={profile.fullName || profile.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </BarAvatar>
                <div>
                  <BarName>{profile.fullName || profile.name}</BarName>
                  <div style={{ color: '#aaa', fontSize: 12 }}>Level {profile.verificationLevel || 0}</div>
                </div>
              </div>
              {profile.bio && profile.bio.trim() && (
                <>
                  <div style={{ color: '#03dac6', fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Bio</div>
                  <div style={{ color: '#fff', fontSize: 14, marginBottom: 16 }}>{profile.bio}</div>
                </>
              )}
              <div style={{ marginBottom: 8 }}>
                <div style={{ color: '#03dac6', fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Tags</div>
                {profile.hashtags && profile.hashtags.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {profile.hashtags.map((h: any) => (
                      <Hashtag key={typeof h === 'string' ? h : h.name}>#{typeof h === 'string' ? h : h.name}</Hashtag>
                    ))}
                  </div>
                ) : (
                  <div style={{ color: '#aaa', fontSize: 13 }}>No tags</div>
                )}
              </div>
            </>
          )}
        </FoldPanel>
      )}
    </GraphContainer>
  );
};

export default NetworkGraphMobile; 