import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Screen } from '../layout/Screen';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { useGame } from '../../hooks/useGame';
import * as storage from '../../services/partyStorage';
import type { Party } from '../../types/party';

export function PartySelect() {
  const { setPhase, setParty, loadPartyPlayers } = useGame();
  const [parties, setParties] = useState<Party[]>(() => storage.getParties());
  const [showCreate, setShowCreate] = useState(false);
  const [newPartyName, setNewPartyName] = useState('');

  const handleCreateParty = () => {
    if (!newPartyName.trim()) return;

    const party = storage.createParty(newPartyName.trim());
    storage.setCurrentPartyId(party.id);
    setParty(party.id, party.name);
    setPhase('party-lobby');
  };

  const handleSelectParty = (party: Party) => {
    storage.setCurrentPartyId(party.id);
    setParty(party.id, party.name);

    // Load players with scores
    const players = party.players.map(p => ({
      id: p.id,
      name: p.name,
      color: p.color,
      score: 0,
    }));
    loadPartyPlayers(players);

    setPhase('party-lobby');
  };

  const handleDeleteParty = (e: React.MouseEvent, partyId: string) => {
    e.stopPropagation();
    storage.deleteParty(partyId);
    setParties(storage.getParties());
  };

  return (
    <Screen>
      <div className="flex-1 flex flex-col p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.h1
            className="text-5xl font-extrabold gradient-text mb-2"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Insight
          </motion.h1>
          <p className="text-white/60">Choisis ou cree un groupe</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {showCreate ? (
            <motion.div
              key="create"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col"
            >
              <Card className="p-6 mb-4">
                <h2 className="text-lg font-bold text-white mb-4">
                  Nouveau groupe
                </h2>
                <input
                  type="text"
                  value={newPartyName}
                  onChange={e => setNewPartyName(e.target.value)}
                  placeholder="Nom du groupe..."
                  maxLength={30}
                  className="w-full px-4 py-3 text-lg mb-4"
                  autoFocus
                />
                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowCreate(false)}
                    variant="secondary"
                    fullWidth
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleCreateParty}
                    disabled={!newPartyName.trim()}
                    fullWidth
                  >
                    Creer
                  </Button>
                </div>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col"
            >
              <Button
                onClick={() => setShowCreate(true)}
                fullWidth
                size="lg"
                className="mb-6 glow-purple"
              >
                + Creer un groupe
              </Button>

              {parties.length > 0 && (
                <>
                  <p className="text-white/40 text-sm mb-3">
                    Groupes existants
                  </p>
                  <div className="flex-1 overflow-y-auto space-y-3">
                    {parties.map((party, index) => (
                      <motion.div
                        key={party.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card
                          onClick={() => handleSelectParty(party)}
                          className="p-4 flex items-center justify-between"
                        >
                          <div>
                            <h3 className="text-white font-bold text-lg">
                              {party.name}
                            </h3>
                            <p className="text-white/40 text-sm">
                              {party.players.length} joueur{party.players.length > 1 ? 's' : ''}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">👥</span>
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => handleDeleteParty(e, party.id)}
                              className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400"
                            >
                              ×
                            </motion.button>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}

              {parties.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <span className="text-6xl mb-4">🎉</span>
                  <p className="text-white/60">
                    Aucun groupe pour le moment.
                    <br />
                    Cree ton premier groupe !
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Screen>
  );
}
