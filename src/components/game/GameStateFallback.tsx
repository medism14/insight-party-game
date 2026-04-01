import { motion } from 'framer-motion';
import { Screen } from '../layout/Screen';
import { Button } from '../common/Button';
import { Card } from '../common/Card';

interface GameStateFallbackProps {
  title: string;
  description: string;
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  color?: string;
}

export function GameStateFallback({
  title,
  description,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
  color,
}: GameStateFallbackProps) {
  return (
    <Screen>
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card className="p-6 text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-white mb-3">{title}</h2>
            <p className="text-white/60 leading-relaxed mb-6">{description}</p>
            <div className="space-y-3">
              <Button
                onClick={onPrimary}
                fullWidth
                size="lg"
                color={color}
              >
                {primaryLabel}
              </Button>
              {secondaryLabel && onSecondary && (
                <Button
                  onClick={onSecondary}
                  fullWidth
                  size="lg"
                  variant="secondary"
                >
                  {secondaryLabel}
                </Button>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </Screen>
  );
}
