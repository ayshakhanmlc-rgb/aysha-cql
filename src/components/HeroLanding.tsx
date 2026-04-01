import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import avatarNova from '@/assets/avatar-nova.png';

interface Props {
  onStart: () => void;
}

const HeroLanding = ({ onStart }: Props) => {
  return (
    <div className="fixed inset-0 mesh-bg flex flex-col items-center justify-center overflow-hidden">
      {/* progress bar decoration */}
      <div className="absolute top-0 left-0 right-0 h-1 flex gap-1">
        <div className="flex-1 bg-primary rounded-full" />
        <div className="flex-1 bg-primary/40 rounded-full" />
        <div className="flex-1 bg-primary/15 rounded-full" />
      </div>

      <div className="flex-1" />

      {/* Nova avatar */}
      <motion.div
        className="w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden shadow-2xl border-4 border-white/60"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <img
          src={avatarNova}
          alt="Nova, your AI guide"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Title */}
      <motion.div
        className="mt-8 text-center px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Welcome to FutureQuest.
        </h1>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">
          This isn't a quiz. It's your edge in NYC.
        </p>
      </motion.div>

      <div className="flex-1" />

      {/* Continue button */}
      <motion.div
        className="mb-16"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <button
          onClick={onStart}
          className="btn-premium px-10 py-4 font-bold text-sm flex items-center gap-2"
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
};

export default HeroLanding;
