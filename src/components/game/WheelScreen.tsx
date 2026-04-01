import { motion } from 'framer-motion';
import { Screen } from '../layout/Screen';
import { PlayerAvatar } from '../common/PlayerAvatar';
import { WheelOfFortune } from './WheelOfFortune';
import { useGame } from '../../hooks/useGame';
import { getDares } from '../../data';

export function WheelScreen() {
  const { state, setPhase, spinWheel } = useGame();

  const loser = state.players.find(
    p => p.id === state.selectedWorstAnswerId
  );

  const dares = getDares();
  const dareTexts = dares.map(d => d.text);

  const handleResult = (result: string) => {
    spinWheel(result);
    setTimeout(() => {
      setPhase('dare');
    }, 1500);
  };

  return (
    <Screen>
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h2 className="text-2xl font-bold text-white mb-2">
            Roue de la Fortune !
          </h2>
          {loser && (
            <div className="flex items-center justify-center gap-2 text-white/60">
              <span>Gage pour</span>
              <PlayerAvatar
                name={loser.name}
                color={loser.color}
                size="sm"
              />
              <span className="font-medium text-white">{loser.name}</span>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <WheelOfFortune
            items={dareTexts.slice(0, 10)}
            onResult={handleResult}
          />
        </motion.div>
      </div>
    </Screen>
  );
}
