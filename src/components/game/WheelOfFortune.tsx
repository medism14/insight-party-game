import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface WheelOfFortuneProps {
  items: string[];
  onResult: (result: string) => void;
  colors?: string[];
}

const DEFAULT_COLORS = [
  '#8B5CF6',
  '#EC4899',
  '#3B82F6',
  '#10B981',
  '#F97316',
  '#EF4444',
  '#84CC16',
  '#06B6D4',
];

export function WheelOfFortune({
  items,
  onResult,
  colors = DEFAULT_COLORS,
}: WheelOfFortuneProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const segmentAngle = 360 / items.length;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;
    const radius = center - 10;

    ctx.clearRect(0, 0, size, size);

    items.forEach((item, index) => {
      const startAngle = (index * segmentAngle - 90) * (Math.PI / 180);
      const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180);

      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = colors[index % colors.length];
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(startAngle + (segmentAngle / 2) * (Math.PI / 180));
      ctx.textAlign = 'right';
      ctx.fillStyle = 'white';
      ctx.font = 'bold 11px Inter, sans-serif';

      const text = item.length > 20 ? item.substring(0, 18) + '...' : item;
      ctx.fillText(text, radius - 15, 4);
      ctx.restore();
    });

    ctx.beginPath();
    ctx.arc(center, center, 25, 0, Math.PI * 2);
    ctx.fillStyle = '#0a0a0f';
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
    ctx.stroke();
  }, [items, colors, segmentAngle]);

  const spin = () => {
    if (isSpinning) return;

    setIsSpinning(true);

    const randomIndex = Math.floor(Math.random() * items.length);
    const targetAngle = 360 - (randomIndex * segmentAngle + segmentAngle / 2);
    const spins = 3 + Math.floor(Math.random() * 2);
    const finalRotation = rotation + spins * 360 + targetAngle;

    setRotation(finalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      onResult(items[randomIndex]);
    }, 2500);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10"
          style={{
            width: 0,
            height: 0,
            borderLeft: '15px solid transparent',
            borderRight: '15px solid transparent',
            borderTop: '30px solid white',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
          }}
        />

        <motion.div
          animate={{ rotate: rotation }}
          transition={{
            duration: 2.5,
            ease: [0.17, 0.67, 0.12, 0.99],
          }}
          style={{
            transformOrigin: 'center center',
            willChange: 'transform',
          }}
        >
          <canvas
            ref={canvasRef}
            width={280}
            height={280}
            className="rounded-full"
          />
        </motion.div>
      </div>

      {!isSpinning && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileTap={{ scale: 0.95 }}
          onClick={spin}
          className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-2xl shadow-lg"
        >
          Tourner la roue !
        </motion.button>
      )}

      {isSpinning && (
        <p className="text-white/60 text-lg animate-pulse">
          La roue tourne...
        </p>
      )}
    </div>
  );
}
