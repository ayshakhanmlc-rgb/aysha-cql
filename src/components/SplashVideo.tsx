import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import splashVideo from '@/assets/hero-video_2.mp4';

interface Props {
  onComplete: () => void;
}

const SplashVideo = ({ onComplete }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
      <video
        ref={videoRef}
        src={splashVideo}
        autoPlay
        playsInline
        muted
        onEnded={onComplete}
        className="absolute inset-0 w-full h-full object-cover"
      />

      <motion.div
        className="absolute bottom-16 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <button
          onClick={onComplete}
          className="btn-premium px-8 py-3.5 font-bold text-sm flex items-center gap-2"
        >
          Start Your Journey
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
};

export default SplashVideo;
