import { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { AnimatePresence } from 'framer-motion';
import {
  organizations,
  maya,
  jordan,
  aisha,
  vibeColors,
  otherPlayers,
  npcCharacters,
  extraPlayers,
  type Organization,
  type Vibe,
} from '@/data/mockData';
import { fetchWalkingRoute, type RouteResult } from '@/lib/routing';
import { useParty } from '@/contexts/PartyContext';
import TopBar from './TopBar';
import FilterBar from './FilterBar';
import NearbyToasts from './NearbyToasts';
import OrgPreviewCard from './OrgPreviewCard';
import OrgDetailSheet from './OrgDetailSheet';
import OrgListView from './OrgListView';
import FindPartyOverlay from './FindPartyOverlay';
import NpcChatOverlay from './NpcChatOverlay';
import PartyChat from './PartyChat';
import BulletinBoardOverlay from '@/components/bulletin/BulletinBoardOverlay';
import { useTourState } from '@/components/tour/useTourState';

const NYC_CENTER: [number, number] = [40.7128, -74.006];

const GameMap = () => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.MarkerClusterGroup | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const playerLayerRef = useRef<L.LayerGroup | null>(null);
  const npcLayerRef = useRef<L.LayerGroup | null>(null);

  const { isPartyFormed, formParty } = useParty();
  const [showListView, setShowListView] = useState(false);

  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [detailOrg, setDetailOrg] = useState<Organization | null>(null);
  const [listSearch, setListSearch] = useState('');
  const [showFindParty, setShowFindParty] = useState(false);
  const [showNpc, setShowNpc] = useState<string | null>(null);
  const [questAccepted, setQuestAccepted] = useState<Record<string, boolean>>({});
  const [showBulletin, setShowBulletin] = useState(false);
  const [routeInfo, setRouteInfo] = useState<RouteResult | null>(null);

  // Init map
  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;

    const map = L.map(containerRef.current, {
      center: NYC_CENTER,
      zoom: 13,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(map);

    // Player layer group
    const playerLayer = L.layerGroup();

    // Player marker (You)
    const playerIcon = L.divIcon({
      className: 'player-marker',
      html: `<div style="display:flex;flex-direction:column;align-items:center">
        <div style="width:52px;height:52px;border-radius:50%;border:3px solid ${vibeColors[maya.vibe]};overflow:hidden;box-shadow:0 4px 14px ${vibeColors[maya.vibe]}40;background:white"><img src="${maya.photo}" style="width:100%;height:100%;object-fit:cover"/></div>
        <span style="margin-top:4px;font-size:11px;font-weight:700;color:#1e293b;background:white;padding:1px 8px;border-radius:10px;box-shadow:0 2px 6px rgba(0,0,0,0.1)">You</span>
      </div>`,
      iconSize: [52, 70],
      iconAnchor: [26, 35],
    });
    L.marker(maya.location, { icon: playerIcon, zIndexOffset: 1000 }).addTo(playerLayer);

    // Other player avatars
    const allPlayers = [...otherPlayers, ...extraPlayers];
    allPlayers.forEach(player => {
      const color = vibeColors[player.vibe];
      const icon = L.divIcon({
        className: 'player-marker',
        html: `<div style="display:flex;flex-direction:column;align-items:center">
          <div style="width:44px;height:44px;border-radius:50%;border:3px solid ${color};overflow:hidden;box-shadow:0 3px 10px ${color}30;background:white"><img src="${player.photo}" style="width:100%;height:100%;object-fit:cover"/></div>
          <span style="margin-top:3px;font-size:10px;font-weight:600;color:#334155;background:white;padding:1px 6px;border-radius:8px;box-shadow:0 1px 4px rgba(0,0,0,0.08)">${player.name.split(' ')[0]}</span>
        </div>`,
        iconSize: [44, 62],
        iconAnchor: [22, 31],
      });
      L.marker(player.location, { icon }).addTo(playerLayer);
    });

    playerLayer.addTo(map);
    playerLayerRef.current = playerLayer;

    // NPC layer group
    const npcLayer = L.layerGroup();

    npcCharacters.forEach(npc => {
      const color = vibeColors[npc.vibe];
      const icon = L.divIcon({
        className: 'player-marker',
        html: `<div style="display:flex;flex-direction:column;align-items:center;cursor:pointer">
          <div style="width:44px;height:44px;border-radius:50%;border:3px solid ${color};overflow:hidden;box-shadow:0 3px 10px ${color}30;background:white"><img src="${npc.photo}" style="width:100%;height:100%;object-fit:cover"/></div>
          <span style="margin-top:3px;font-size:9px;font-weight:700;color:white;background:${color};padding:1px 6px;border-radius:8px">${npc.npcRole || npc.name.split(' ')[0]}</span>
        </div>`,
        iconSize: [44, 62],
        iconAnchor: [22, 31],
      });
      const marker = L.marker(npc.location, { icon });
      marker.on('click', () => {
        setShowNpc(npc.id);
      });
      marker.addTo(npcLayer);
    });

    npcLayer.addTo(map);
    npcLayerRef.current = npcLayer;

    // Cluster group
    const cluster = L.markerClusterGroup({
      maxClusterRadius: 40,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      iconCreateFunction: (c) => {
        const count = c.getChildCount();
        return L.divIcon({
          html: `<div style="width:32px;height:32px;border-radius:50%;background:hsl(var(--primary));display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:12px;box-shadow:0 2px 8px rgba(0,0,0,0.3)">${count}</div>`,
          className: '',
          iconSize: [32, 32],
        });
      },
    });

    map.addLayer(cluster);
    markersRef.current = cluster;
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers
  useEffect(() => {
    const cluster = markersRef.current;
    if (!cluster) return;
    cluster.clearLayers();

    const filtered = activeFilter === 'All' ? organizations : organizations.filter(o => {
      if (activeFilter === 'Quests') return o.type === 'quest';
      if (activeFilter === 'Partners') return o.type === 'partner';
      if (activeFilter === 'Hangouts') return o.type === 'hangout';
      if (activeFilter === 'Mentors') return o.type === 'mentorship';
      if (activeFilter === 'People') return false; // People filter shows only players
      return true;
    });

    filtered.forEach(org => {
      const color = vibeColors[org.vibe];
      const hasThumbnail = org.thumbnail && !org.thumbnail.startsWith('/partners/');
      const isLocked = org.locked;
      const lockBadge = isLocked
        ? `<div style="position:absolute;top:-6px;right:-6px;background:#6366f1;color:white;font-size:8px;font-weight:800;padding:2px 5px;border-radius:6px;box-shadow:0 1px 4px rgba(0,0,0,0.2);white-space:nowrap">LVL ${org.levelRequired || '?'}</div>`
        : '';
      const lockedOverlay = isLocked
        ? `<div style="position:absolute;inset:0;background:rgba(255,255,255,0.5);border-radius:12px;display:flex;align-items:center;justify-content:center"></div>`
        : '';
      const icon = L.divIcon({
        className: 'quest-marker',
        html: hasThumbnail
          ? `<div style="display:flex;flex-direction:column;align-items:center;position:relative">
              <div style="position:relative;width:56px;height:56px;border-radius:12px;border:3px solid ${isLocked ? '#94a3b8' : color};overflow:hidden;box-shadow:0 3px 10px rgba(0,0,0,0.15);background:white;${isLocked ? 'filter:grayscale(0.5);opacity:0.8' : ''}">
                <img src="${org.thumbnail}" style="width:100%;height:100%;object-fit:cover"/>
                ${lockedOverlay}
              </div>
              ${lockBadge}
              <span style="margin-top:3px;font-size:9px;font-weight:700;color:#334155;background:white;padding:1px 6px;border-radius:8px;box-shadow:0 1px 4px rgba(0,0,0,0.08);max-width:72px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${org.name}</span>
            </div>`
          : `<div style="display:flex;flex-direction:column;align-items:center;position:relative">
              <div style="position:relative;width:48px;height:48px;border-radius:12px;border:3px solid ${isLocked ? '#94a3b8' : color};display:flex;align-items:center;justify-content:center;background:white;box-shadow:0 3px 10px rgba(0,0,0,0.15);${isLocked ? 'opacity:0.7' : ''}"><span style="font-size:20px">${isLocked ? '🔒' : (org.icon || '📍')}</span></div>
              ${lockBadge}
              <span style="margin-top:3px;font-size:9px;font-weight:700;color:#334155;background:white;padding:1px 6px;border-radius:8px;box-shadow:0 1px 4px rgba(0,0,0,0.08);max-width:72px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${org.name}</span>
            </div>`,
        iconSize: [56, 76],
        iconAnchor: [28, 38],
      });

      const marker = L.marker(org.location, { icon });
      marker.on('click', () => {
        setSelectedOrg(org);
        mapRef.current?.flyTo(org.location, 15, { duration: 0.5 });
      });
      cluster.addLayer(marker);
    });
  }, [activeFilter]);

  // Show/hide player and NPC layers based on filter
  useEffect(() => {
    const map = mapRef.current;
    const playerLayer = playerLayerRef.current;
    const npcLayer = npcLayerRef.current;
    if (!map || !playerLayer || !npcLayer) return;

    const showPlayers = activeFilter === 'All' || activeFilter === 'People';
    const showNpcs = activeFilter === 'All' || activeFilter === 'Mentors';

    if (showPlayers && !map.hasLayer(playerLayer)) map.addLayer(playerLayer);
    if (!showPlayers && map.hasLayer(playerLayer)) map.removeLayer(playerLayer);
    if (showNpcs && !map.hasLayer(npcLayer)) map.addLayer(npcLayer);
    if (!showNpcs && map.hasLayer(npcLayer)) map.removeLayer(npcLayer);
  }, [activeFilter]);

  // Route drawing
  const drawRoute = useCallback(async (org: Organization) => {
    if (routeLayerRef.current && mapRef.current) {
      mapRef.current.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }
    const result = await fetchWalkingRoute(maya.location, org.location);
    if (result && mapRef.current) {
      const color = vibeColors[org.vibe];
      const polyline = L.polyline(result.coordinates, {
        color,
        weight: 4,
        opacity: 0.8,
        dashArray: '8 12',
      }).addTo(mapRef.current);
      routeLayerRef.current = polyline;
      setRouteInfo(result);
    }
  }, []);

  const handleAcceptQuest = (org: Organization) => {
    setQuestAccepted(prev => ({ ...prev, [org.id]: true }));
    drawRoute(org);
    setDetailOrg(null);
    setSelectedOrg(null);

    if (!isPartyFormed) {
      setTimeout(() => setShowFindParty(true), 600);
    }
  };

  const handleFormParty = () => {
    formParty([jordan, aisha]);
    setShowFindParty(false);
    setTimeout(() => setShowNpc('marcus'), 400);
  };

  const handleNpcDone = () => {
    setShowNpc(null);
  };

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="absolute inset-0" />

      <TopBar onAvatarClick={() => {}} />
      <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} showListView={showListView} onToggleListView={() => setShowListView(!showListView)} />
      <NearbyToasts />

      <AnimatePresence>
        {selectedOrg && !detailOrg && (
          <OrgPreviewCard
            org={selectedOrg}
            onClose={() => { setSelectedOrg(null); setRouteInfo(null); }}
            onExpand={() => setDetailOrg(selectedOrg)}
            onOpenBoard={() => setShowBulletin(true)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {detailOrg && (
          <OrgDetailSheet
            org={detailOrg}
            onClose={() => setDetailOrg(null)}
            onAccept={() => handleAcceptQuest(detailOrg)}
            partyFormed={isPartyFormed}
            onOpenBoard={() => setShowBulletin(true)}
            questAccepted={questAccepted[detailOrg.id]}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showListView && (
          <OrgListView
            organizations={organizations}
            searchQuery={listSearch}
            onSearchChange={setListSearch}
            onClose={() => setShowListView(false)}
            onSelectOrg={(org) => { setShowListView(false); setSelectedOrg(org); setDetailOrg(org); }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFindParty && <FindPartyOverlay onPartyFormed={handleFormParty} onClose={() => setShowFindParty(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showNpc && <NpcChatOverlay npcId={showNpc} onClose={handleNpcDone} />}
      </AnimatePresence>

      {showBulletin && detailOrg && <BulletinBoardOverlay org={detailOrg} onClose={() => setShowBulletin(false)} />}

      {isPartyFormed && <PartyChat />}
    </div>
  );
};

export default GameMap;
