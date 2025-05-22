import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';
import { graphService, userService } from '../services/api';
import Modal from 'react-modal';

const GraphContainer = styled.div`
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
`;

const Dialog = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle at 60% 40%, #23234d 0%, #181824 100%);
  color: #fff;
  padding: 48px 32px;
  border-radius: 18px;
  border: 2px solid #bb86fc;
  box-shadow: 0 8px 40px #000a;
  min-width: 320px;
  max-width: 600px;
  z-index: 1000;
`;

const ResponsiveModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 320px;
  max-width: 600px;
  padding: 48px 32px;
  border-radius: 18px;
  background: radial-gradient(circle at 60% 40%, #23234d 0%, #181824 100%);
  color: #fff;
  box-shadow: 0 8px 40px #000a;
  border: 2px solid #bb86fc;
  position: relative;
  overflow: visible;
  @media (max-width: 600px) {
    min-width: unset;
    max-width: 98vw;
    padding: 16px 4px;
    border-radius: 12px;
  }
`;

const ResponsiveAvatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #bb86fc;
  box-shadow: 0 0 24px #222;
  margin-bottom: 12px;
  background: radial-gradient(circle at 60% 40%, #23234d 0%, #181824 100%);
  @media (max-width: 600px) {
    width: 64px;
    height: 64px;
    margin-bottom: 8px;
  }
`;

const ResponsiveTitle = styled.h2`
  margin-top: 0;
  font-size: 28px;
  margin-bottom: 12px;
  text-align: center;
  background: linear-gradient(90deg, #bb86fc, #03dac6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  z-index: 1;
  position: relative;
  @media (max-width: 600px) {
    font-size: 20px;
    margin-bottom: 8px;
  }
`;

const ResponsiveSection = styled.div`
  width: 100%;
  margin-bottom: 24px;
  z-index: 1;
  position: relative;
  @media (max-width: 600px) {
    margin-bottom: 12px;
  }
`;

const ResponsiveButton = styled.button`
  margin-top: 12px;
  padding: 10px 24px;
  border-radius: 8px;
  background: linear-gradient(90deg, #bb86fc, #03dac6);
  color: #fff;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
  letter-spacing: 1px;
  z-index: 1;
  position: relative;
  @media (max-width: 600px) {
    padding: 8px 16px;
    font-size: 14px;
  }
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

// Create a separate component for node rendering
const createNodeObject = (node: Node, isSelected: boolean) => {
  const group = new THREE.Group();
  
  const nodeSize = typeof node.val === 'number' && !isNaN(node.val) ? Math.sqrt(node.val) * 8 : 12;
  
  // Create base sphere
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

const NetworkGraph: React.FC = () => {
  const [graph, setGraph] = useState<GraphData>({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const graphRef = useRef<any>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const prevNodesRef = useRef<Node[] | null>(null);
  const hasAnimatedRef = useRef(false);
  const animationRef = useRef<number | undefined>(undefined);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isCameraPositioning, setIsCameraPositioning] = useState(false);
  const isClickingRef = useRef(false);
  const engineStopTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const clickedNodeRef = useRef<Node | null>(null);
  const [clickedNodeId, setClickedNodeId] = useState<string | null>(null);
  const lastEngineStopRef = useRef<number>(0);
  const engineStopDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const graphInitializedRef = useRef(false);
  const interactionLockRef = useRef(false);
  const pendingClickRef = useRef<Node | null>(null);

  useEffect(() => {
    console.log('[NetworkGraph] Render: loading=', loading, 'isCameraReady=', isCameraReady);
  }, [loading, isCameraReady]);

  useEffect(() => {
    const fetchGraph = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await graphService.getFullGraph();
        // Ensure all nodes have required properties
        const validatedNodes = data.users.map((user: any) => ({
          ...user,
          val: typeof user.val === 'number' && !isNaN(user.val) ? user.val : 15,
          color: user.color || '#6200ea',
          verificationLevel: user.verificationLevel || 0,
          type: user.type || 'user'
        }));

        // Merge friendship and hashtag links with validation
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
        graphInitializedRef.current = true;
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
    if (isClickingRef.current || node.type !== 'user' || isAnimating || interactionLockRef.current) {
      if (node.type === 'user' && !isClickingRef.current && !isAnimating) {
        // Store the click for later if we're locked
        pendingClickRef.current = node;
      }
      return;
    }
    
    // Clear any pending hover timeout
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }

    // Show loading state immediately
    setModalLoading(true);
    setSelectedNode(node);
    
    clickedNodeRef.current = node;
    setClickedNodeId(node.id);
  }, [hoverTimeout, isAnimating]);

  // Handle node clicks in a separate effect
  useEffect(() => {
    const handleNodeClick = async () => {
      if (!clickedNodeRef.current || isClickingRef.current || isAnimating || interactionLockRef.current) {
        if (clickedNodeRef.current && !isClickingRef.current && !isAnimating) {
          // Store the click for later if we're locked
          pendingClickRef.current = clickedNodeRef.current;
        }
        return;
      }
      
      interactionLockRef.current = true;
      isClickingRef.current = true;
      const node = clickedNodeRef.current;

      try {
        const freshProfile = await userService.getProfile(node.id);
        setSelectedNode({ ...node, ...freshProfile });
      } catch (err) {
        console.error('[NetworkGraph] Failed to fetch latest profile:', err);
        setSelectedNode(node);
      } finally {
        setModalLoading(false);
        isClickingRef.current = false;
        clickedNodeRef.current = null;
        setClickedNodeId(null);
        
        // Release the interaction lock after a delay
        setTimeout(() => {
          interactionLockRef.current = false;
          // Process any pending click
          if (pendingClickRef.current) {
            const pendingNode = pendingClickRef.current;
            pendingClickRef.current = null;
            clickedNodeRef.current = pendingNode;
            setClickedNodeId(pendingNode.id);
          }
        }, 300);
      }
    };

    if (clickedNodeId) {
      handleNodeClick();
    }
  }, [clickedNodeId, isAnimating]);

  const handleModalClose = useCallback(() => {
    console.log('[NetworkGraph] handleModalClose called');
    setSelectedNode(null);
  }, []);

  const handleNodeHover = (node: Node | null, prevNode: Node | null) => {
    // Clear any existing timeout
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }

    // Only log hover if we're not processing a click
    if (node) {
      const timeout = setTimeout(() => {
        console.log('[NetworkGraph] Node hover event:', { node, prevNode });
      }, 100); // 100ms delay
      setHoverTimeout(timeout);
    }
  };

  const handleNodeDrag = (node: Node, translate: { x: number; y: number }) => {
    console.log('[NetworkGraph] Node drag event:', { node, translate });
  };

  const handleLinkHover = (link: Link | null, prevLink: Link | null) => {
    console.log('[NetworkGraph] Link hover event:', { link, prevLink });
  };

  // Add camera positioning effect with proper dependencies
  useEffect(() => {
    // Only reset camera if nodes actually changed (not just a re-render)
    const prevNodes = prevNodesRef.current;
    const nodesChanged =
      !prevNodes ||
      prevNodes.length !== graph.nodes.length ||
      prevNodes.some((n, i) => n.id !== graph.nodes[i]?.id);
    if (nodesChanged) {
      console.log('[NetworkGraph] graph.nodes changed, resetting camera (setIsCameraReady(false))');
      setIsCameraReady(false);
      prevNodesRef.current = graph.nodes;
    }
  }, [graph.nodes]);

  // Add a timeout to prevent infinite loading with proper cleanup
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (!isCameraReady) {
      timeoutId = setTimeout(() => {
        console.warn('[NetworkGraph] Camera positioning timeout - forcing ready state');
        setIsCameraReady(true);
      }, 5000); // 5 second timeout
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isCameraReady]);

  // Check for mobile on mount and window resize with proper cleanup
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []); // Empty dependency array since this should only run once on mount

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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  const handleEngineStop = useCallback(() => {
    // Don't handle engine stops while clicking, animating, or locked
    if (isClickingRef.current || isAnimating || !graphInitializedRef.current || interactionLockRef.current) return;

    const now = Date.now();
    if (now - lastEngineStopRef.current < 100) {
      return; // Ignore engine stops that are too close together
    }
    lastEngineStopRef.current = now;

    // Clear any existing debounce
    if (engineStopDebounceRef.current) {
      clearTimeout(engineStopDebounceRef.current);
    }

    // Debounce the engine stop handler
    engineStopDebounceRef.current = setTimeout(() => {
      if (isClickingRef.current || isAnimating || !graphInitializedRef.current || interactionLockRef.current) return;

      console.log('[NetworkGraph] Engine stopped, positioning camera...');
      if (graphRef.current && !isAnimating && !hasAnimatedRef.current && !isCameraPositioning) {
        interactionLockRef.current = true;
        setIsCameraPositioning(true);
        hasAnimatedRef.current = true;
        const scene = graphRef.current.scene();
        if (scene) {
          // Add lights if not already present
          if (!scene.children.some((child: THREE.Object3D) => child instanceof THREE.AmbientLight)) {
            const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
            scene.add(ambientLight);
          }
          if (!scene.children.some((child: THREE.Object3D) => child instanceof THREE.DirectionalLight)) {
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(1, 1, 1);
            scene.add(directionalLight);
          }

          // Get camera
          const camera = graphRef.current.camera();
          if (camera) {
            // Calculate graph bounds
            const nodes = graph.nodes;
            if (nodes.length === 0) {
              console.warn('[NetworkGraph] No nodes to position camera');
              setIsCameraPositioning(false);
              return;
            }

            let minX = Infinity, maxX = -Infinity;
            let minY = Infinity, maxY = -Infinity;
            let minZ = Infinity, maxZ = -Infinity;
            let maxNodeSize = 0;

            nodes.forEach(node => {
              const x = node.x || 0;
              const y = node.y || 0;
              const z = node.z || 0;
              minX = Math.min(minX, x);
              maxX = Math.max(maxX, x);
              minY = Math.min(minY, y);
              maxY = Math.max(maxY, y);
              minZ = Math.min(minZ, z);
              maxZ = Math.max(maxZ, z);
              
              // Calculate node size
              const nodeSize = typeof node.val === 'number' && !isNaN(node.val) ? Math.sqrt(node.val) * 8 : 12;
              maxNodeSize = Math.max(maxNodeSize, nodeSize);
            });

            // Ensure we have valid bounds
            if (minX === Infinity || maxX === -Infinity) {
              console.warn('[NetworkGraph] Invalid graph bounds, using default values');
              minX = -100; maxX = 100;
              minY = -100; maxY = 100;
              minZ = -100; maxZ = 100;
            }

            const centerX = (minX + maxX) / 2;
            const centerY = (minY + maxY) / 2;
            const centerZ = (minZ + maxZ) / 2;
            const sizeX = maxX - minX;
            const sizeY = maxY - minY;
            const sizeZ = maxZ - minZ;
            const maxDimension = Math.max(sizeX, sizeY, sizeZ);

            console.log('[NetworkGraph] Graph bounds:', {
              center: { x: centerX, y: centerY, z: centerZ },
              size: { x: sizeX, y: sizeY, z: sizeZ },
              maxDimension,
              maxNodeSize
            });

            // Calculate target distance with extra padding
            const baseDistance = Math.max(maxDimension, 100); // Ensure minimum distance
            const nodeSizeFactor = Math.max(maxNodeSize, 12) * 2; // Ensure minimum node size
            const targetDistance = (baseDistance + nodeSizeFactor) * 1.5;

            // Set initial camera position
            const angle = Math.PI / 4;
            const initialDistance = Math.max(maxDimension * 0.5, 50); // Ensure minimum initial distance
            camera.position.set(
              centerX + initialDistance * Math.cos(angle),
              centerY + initialDistance * Math.sin(angle),
              centerZ + initialDistance * Math.sin(angle)
            );
            camera.lookAt(centerX, centerY, centerZ);
            camera.fov = 45;
            camera.updateProjectionMatrix();

            // Start smooth animation to target distance
            setIsAnimating(true);
            animateCamera(camera, targetDistance, new THREE.Vector3(centerX, centerY, centerZ));

            // Mark as ready
            setIsCameraReady(true);
            console.log('[NetworkGraph] setIsCameraReady(true) called');
          }
        }
        setIsCameraPositioning(false);
        
        // Release the interaction lock after a delay
        setTimeout(() => {
          interactionLockRef.current = false;
          // Process any pending click
          if (pendingClickRef.current) {
            const pendingNode = pendingClickRef.current;
            pendingClickRef.current = null;
            clickedNodeRef.current = pendingNode;
            setClickedNodeId(pendingNode.id);
          }
        }, 300);
      }
      engineStopDebounceRef.current = null;
    }, 100);
  }, [isAnimating, isCameraPositioning, graph.nodes]);

  const animateCamera = (camera: THREE.PerspectiveCamera, targetDistance: number, center: THREE.Vector3) => {
    const startDistance = camera.position.distanceTo(center);
    const startTime = performance.now();
    const duration = 2000; // 2 seconds animation

    // Adjust target distance for mobile
    const mobileFactor = isMobile ? 1.3 : 1; // 30% more zoom out on mobile
    const adjustedTargetDistance = targetDistance * mobileFactor;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic function for smooth deceleration
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      
      const currentDistance = startDistance + (adjustedTargetDistance - startDistance) * easedProgress;
      
      // Keep the same angle but adjust distance
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
    return createNodeObject(node, node.id === selectedNode?.id);
  }, [selectedNode?.id]);

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
    <GraphContainer className="graph-container">
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
          onNodeDrag={handleNodeDrag}
          onNodeHover={handleNodeHover}
          onLinkHover={handleLinkHover}
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
        <ResponsiveModalContent style={{ 
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000
        }}>
          {modalLoading ? (
            <div style={{ 
              minHeight: 120, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              width: '100%'
            }}>
              <div style={{ fontSize: 18, color: '#bb86fc', marginBottom: 12 }}>Loading profile...</div>
              <div className="spinner" style={{ 
                border: '4px solid #23234d', 
                borderTop: '4px solid #bb86fc', 
                borderRadius: '50%', 
                width: 36, 
                height: 36, 
                animation: 'spin 1s linear infinite',
                boxShadow: '0 0 24px #bb86fc88'
              }} />
              <style>{`
                @keyframes spin { 
                  0% { transform: rotate(0deg); } 
                  100% { transform: rotate(360deg); } 
                }
              `}</style>
            </div>
          ) : (
            <>
              <ResponsiveTitle>{selectedNode?.name}</ResponsiveTitle>
              <ResponsiveSection>
                <ResponsiveAvatar style={{
                  boxShadow: selectedNode?.verificationLevel > 0 ? `0 0 ${selectedNode.verificationLevel * 16}px 6px #bb86fc88, 0 0 32px #03dac6aa` : '0 0 24px #222',
                  animation: selectedNode?.verificationLevel > 0 ? 'glowPulse 2s infinite alternate' : 'none',
                }}>
                  <img src={selectedNode?.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(selectedNode?.name || '')} alt={selectedNode?.name || ''} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: selectedNode?.verificationLevel > 0 ? 'drop-shadow(0 0 8px #bb86fc)' : 'none' }} />
                </ResponsiveAvatar>
                <div style={{ color: '#aaa', fontSize: 12, marginBottom: 6, wordBreak: 'break-all', textAlign: 'center' }}>ID: {selectedNode?.id}</div>
                <div style={{ color: '#fff', fontWeight: 600, fontSize: 14, marginBottom: 6 }}>Verification Level: <span style={{ color: '#bb86fc' }}>{selectedNode?.verificationLevel}</span></div>
              </ResponsiveSection>
              {/* Hashtags, Connections, Subdomains */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginBottom: 18, zIndex: 1, position: 'relative' }}>
                {/* Hashtags as chips or prompt */}
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
              <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 16, zIndex: 1, position: 'relative' }}>
                <a href="/api/auth/google" title="Connect Google" style={{ background: '#fff', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px #0002' }}><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="Google" style={{ width: 20, height: 20 }} /></a>
                <a href="/api/auth/facebook" title="Connect Facebook" style={{ background: '#1877f3', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px #0002' }}><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg" alt="Facebook" style={{ width: 20, height: 20 }} /></a>
                <a href="/api/auth/instagram" title="Connect Instagram" style={{ background: 'radial-gradient(circle at 30% 110%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fd5949', boxShadow: '0 0 8px 2px #fd5949, 0 2px 8px #0002' }}><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/instagram/instagram-original.svg" alt="Instagram" style={{ width: 20, height: 20, filter: 'drop-shadow(0 0 4px #fd5949)' }} /></a>
                <a href="/api/auth/linkedin" title="Connect LinkedIn" style={{ background: '#0077b5', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px #0002' }}><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg" alt="LinkedIn" style={{ width: 20, height: 20 }} /></a>
              </div>
              <div style={{ color: '#888', fontSize: 13, textAlign: 'center', marginBottom: 12, maxWidth: 480, margin: '0 auto 18px auto', lineHeight: 1.5 }}>
                Connect your other networks to find lifelong friends and unlock more connections here—Hashnect helps you bring your real social graph to life.
              </div>
              <ResponsiveButton 
                onClick={handleModalClose}
              >
                Close
              </ResponsiveButton>
              <style>{`
                @keyframes glowPulse {
                  0% { box-shadow: 0 0 24px #bb86fc, 0 0 32px #03dac6aa; }
                  100% { box-shadow: 0 0 48px #bb86fc, 0 0 64px #03dac6aa; }
                }
              `}</style>
            </>
          )}
        </ResponsiveModalContent>
      )}
    </GraphContainer>
  );
};

export default NetworkGraph;
