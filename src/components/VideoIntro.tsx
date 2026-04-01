import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowRight } from 'lucide-react';
import introVideo from '@/assets/intro-video.mp4';
import avatarNova from '@/assets/avatar-nova.png';

interface Props {
  onComplete: () => void;
}

const VideoIntro = ({ onComplete }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setPlaying(true);
    }
  };

  return (
    <div className="fixed inset-0 mesh-bg flex flex-col items-center justify-center z-50">
      {/* progress bar decoration */}
      <div className="absolute top-0 left-0 right-0 h-1 flex gap-1">
        <div className="flex-1 bg-primary rounded-full" />
        <div className="flex-1 bg-primary/40 rounded-full" />
        <div className="flex-1 bg-primary/15 rounded-full" />
      </div>

      <div className="flex-1" />

      {/* video circle */}
      <motion.div
        className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden shadow-2xl border-4 border-white/60"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {!playing && (
          <img
            src={avatarNova}
            alt="Nova"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        <video
          ref={videoRef}
          src={introVideo}
          playsInline
          onEnded={onComplete}
          className={`absolute inset-0 w-full h-full object-cover ${playing ? '' : 'opacity-0'}`}
        />

        {!playing && (
          <button
            onClick={handlePlay}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm"
          >
            <Play className="w-12 h-12 text-white fill-white/80 mb-2" />
            <span className="text-white font-semibold text-sm">Tap to play</span>
          </button>
        )}
      </motion.div>

      {/* Speech bubble */}
      <motion.div
        className="mt-6 bg-card/80 backdrop-blur-sm rounded-2xl px-6 py-4 max-w-xs text-center border border-border shadow-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-sm font-semibold text-foreground">
          Hi, I'm Nova — your AI career assistant.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Listen to the intro, then let's explore your passions.
        </p>
      </motion.div>

      <div className="flex-1" />

      {/* skip button */}
      <motion.div
        className="mb-16"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <button
          onClick={onComplete}
          className="btn-premium px-8 py-3.5 font-bold text-sm flex items-center gap-2"
        >
          Skip Intro
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
};

export default VideoIntro;
