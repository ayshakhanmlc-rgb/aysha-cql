import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { useParty } from '@/contexts/PartyContext';
import { vibeColors } from '@/data/mockData';

const MainNavBar = () => {
  const navigate = useNavigate();
  const { partyMembers, isPartyFormed } = useParty();

  return (
    <div className="absolute bottom-0 left-0 right-0 z-[900] px-2 pt-3 bg-background/92 backdrop-blur-sm border-t border-border" style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}>
      <div className="flex items-center justify-around">
        <button
          className="flex flex-col items-center gap-1 px-4 py-1 active:scale-90 transition-transform"
        >
          <Icon
            icon="solar:map-point-bold-duotone"
            width={26}
            className="text-primary"
          />
          <span className="text-[10px] font-medium text-primary">
            Map
          </span>
        </button>

        <button
          onClick={() => navigate('/passport')}
          className="flex flex-col items-center gap-1 px-4 py-1 active:scale-90 transition-transform"
        >
          <Icon
            icon="solar:diploma-bold-duotone"
            width={26}
            className="text-muted-foreground"
          />
          <span className="text-[10px] font-medium text-muted-foreground">
            Passport
          </span>
        </button>

        {isPartyFormed && (
          <div className="flex flex-col items-center gap-1 px-3 py-1">
            <div className="flex -space-x-1.5">
              {partyMembers.slice(0, 3).map(p => (
                <div
                  key={p.id}
                  className="w-6 h-6 rounded-full overflow-hidden border-2 border-background"
                  style={{ outline: `1.5px solid ${vibeColors[p.vibe]}` }}
                >
                  <img src={p.photo} alt={p.name} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <span className="text-[9px] text-accent font-medium">Party</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainNavBar;
