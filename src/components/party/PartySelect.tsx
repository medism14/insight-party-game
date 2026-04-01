import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Screen } from '../layout/Screen';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { useGame } from '../../hooks/useGame';
import * as storage from '../../services/partyStorage';
import type { Party } from '../../types/party';

export function PartySelect() {
  const { setPhase, setParty, clearParty, loadPartyPlayers } = useGame();
  const [currentParty, setCurrentParty] = useState<Party | null>(() => {
    const savedPartyId = storage.getCurrentPartyId();
    if (!savedPartyId) return null;

    const savedParty = storage.getParty(savedPartyId);
    if (!savedParty) {
      storage.setCurrentPartyId(null);
      return null;
    }

    return savedParty;
  });
  const [showCreate, setShowCreate] = useState(false);
  const [newPartyName, setNewPartyName] = useState('');

  const handleCreateParty = () => {
    if (!newPartyName.trim()) return;

    const party = storage.createParty(newPartyName.trim());
    storage.setCurrentPartyId(party.id);
    setCurrentParty(party);
    setParty(party.id, party.name);
    setPhase('party-lobby');
  };

  const handleCreatePartyKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;

    e.preventDefault();
    handleCreateParty();
  };

  const handleSelectParty = (party: Party) => {
    storage.setCurrentPartyId(party.id);
    setCurrentParty(party);
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

  const handleDeleteParty = (partyId: string) => {
    storage.deleteParty(partyId);
    if (storage.getCurrentPartyId() === partyId) {
      storage.setCurrentPartyId(null);
    }
    clearParty();
    setCurrentParty(null);
    setShowCreate(false);
    setNewPartyName('');
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
          <p className="text-white/60">
            {currentParty ? 'Seul ton groupe actif est visible sur cet appareil' : 'Cree ton groupe'}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {showCreate || !currentParty ? (
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
                  onKeyDown={handleCreatePartyKeyDown}
                  placeholder="Nom du groupe..."
                  maxLength={30}
                  className="w-full px-4 py-3 text-lg mb-4"
                  autoFocus
                />
                <div className="flex gap-3">
                  {currentParty && (
                    <Button
                      onClick={() => setShowCreate(false)}
                      variant="secondary"
                      fullWidth
                    >
                      Annuler
                    </Button>
                  )}
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
              <p className="text-white/40 text-sm mb-3">
                Groupe actif
              </p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card
                  onClick={() => handleSelectParty(currentParty)}
                  className="p-4 flex items-center justify-between mb-4"
                >
                  <div>
                    <h3 className="text-white font-bold text-lg">
                      {currentParty.name}
                    </h3>
                    <p className="text-white/40 text-sm">
                      {currentParty.players.length} joueur{currentParty.players.length > 1 ? 's' : ''}
                    </p>
                  </div>
                  <span className="text-2xl">👥</span>
                </Card>
              </motion.div>

              <p className="text-white/50 text-sm mb-6">
                Les autres groupes enregistres localement ne sont pas affiches ici.
              </p>

              <div className="space-y-3">
                <Button
                  onClick={() => handleSelectParty(currentParty)}
                  fullWidth
                  size="lg"
                  className="glow-purple"
                >
                  Continuer avec ce groupe
                </Button>

                <Button
                  onClick={() => setShowCreate(true)}
                  variant="secondary"
                  fullWidth
                >
                  Creer un autre groupe
                </Button>

                <Button
                  onClick={() => handleDeleteParty(currentParty.id)}
                  variant="secondary"
                  fullWidth
                  className="border border-red-500/30 text-red-300"
                >
                  Supprimer ce groupe
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Screen>
  );
}
