import { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, Button } from '@/components/ui';
import { content, t } from '@/data/content';
import { useTTS } from '@/hooks/useTTS';
import {
  PersonStanding, Play, Pause, ChevronLeft, ChevronRight,
  RotateCcw, Volume2, Camera, CameraOff, Lock, AlertTriangle,
  CheckCircle, Star, Info, Hand, Home, X,
} from 'lucide-react';

export function DancePage() {
  const { language, learningStyle, isCreator, canUseCamera, ageGroup, mode, addPoints, addBadge, incrementImpact, accessibility } = useApp();
  const { speak, stop, speaking } = useTTS();
  const [selectedDance, setSelectedDance] = useState<typeof content.dances[0] | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<'slow' | 'normal'>('normal');

  // Move Mode state
  const [moveMode, setMoveMode] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const [showGrownupCheck, setShowGrownupCheck] = useState(false);
  const [grownupProgress, setGrownupProgress] = useState(0);
  const [consentAgreed, setConsentAgreed] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [showMirror, setShowMirror] = useState(false);
  const [moveScore, setMoveScore] = useState<{ stars: number; feedback: string } | null>(null);
  const [practiceMode, setPracticeMode] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const grownupTimerRef = useRef<number | null>(null);
  const inactivityTimerRef = useRef<number | null>(null);
  const breakTimerRef = useRef<number | null>(null);

  // Auto-advance steps when playing
  useEffect(() => {
    if (!playing || !selectedDance) return;
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        const maxStep = isCreator ? selectedDance.steps.length : Math.min(4, selectedDance.steps.length);
        if (prev + 1 >= maxStep) {
          setPlaying(false);
          incrementImpact('danceStepsPracticed', maxStep);
          addPoints(15);
          addBadge('first-dance');
          return prev;
        }
        return prev + 1;
      });
    }, speed === 'slow' ? 4000 : 2500);
    return () => clearInterval(interval);
  }, [playing, selectedDance, speed, isCreator, incrementImpact, addPoints, addBadge]);

  // Cleanup camera on unmount
  useEffect(() => {
    return () => stopCamera();
  }, []);

  // Camera auto-shutdown on tab switch
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && cameraActive) {
        stopCamera();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [cameraActive]);

  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
      setPracticeMode(false);

      // Inactivity timer (5 minutes)
      inactivityTimerRef.current = window.setTimeout(() => {
        stopCamera();
        setCameraError(language === 'EN' ? 'Camera turned off after 5 minutes of inactivity.' : 'Kamera dimatikan setelah 5 menit tidak aktif.');
      }, 5 * 60 * 1000);

      // Break reminder (3 minutes)
      breakTimerRef.current = window.setTimeout(() => {
        setCameraError(language === 'EN' ? 'Drink some water and rest!' : 'Minum air dan istirahat!');
      }, 3 * 60 * 1000);

      // Start pose detection loop (mock — see comments below)
      startPoseDetection();
    } catch (err) {
      // Camera blocked, missing, or too dark — fall back to Practice Mode
      setCameraError(language === 'EN'
        ? 'Camera not available. Falling back to Practice Mode — you can still learn the dance!'
        : 'Kamera tidak tersedia. Beralih ke Mode Latihan — kamu tetap bisa belajar tari!');
      setPracticeMode(true);
    }
  }, [language]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
    if (breakTimerRef.current) {
      clearTimeout(breakTimerRef.current);
      breakTimerRef.current = null;
    }
  }, []);

  // Mock pose detection — in a real implementation, this would use MediaPipe Pose or TensorFlow.js MoveNet
  // ALL processing happens on-device. No frames, images, or pose data are ever sent to a server.
  const startPoseDetection = useCallback(() => {
    // REAL IMPLEMENTATION NOTE:
    // This would load MediaPipe Pose from CDN and run inference on each video frame.
    // The model detects body joints (shoulders, elbows, wrists, hips, knees, ankles).
    // NO face recognition, NO emotion detection, NO age/gender estimation.
    // Camera frames are processed in memory only and immediately discarded.
    // NEVER record, save, screenshot, or store video or images.
    // Only the final star score is saved on the device.

    // For this prototype, we simulate detection with a timer
    // that gives encouraging feedback after a few seconds
    setTimeout(() => {
      if (!cameraActive) return;
      const stars = Math.floor(Math.random() * 3) + 1; // 1-3 stars
      const feedbacks = language === 'EN'
        ? ['Nice! Raise your left arm a little higher', 'Great form! Keep going', 'Almost there! Try again', 'Perfect! Next step']
        : ['Bagus! Angkat lengan kiri sedikit lebih tinggi', 'Forma hebat! Lanjutkan', 'Hampir! Coba lagi', 'Sempurna! Langkah berikutnya'];
      setMoveScore({ stars, feedback: feedbacks[Math.floor(Math.random() * feedbacks.length)] });
    }, 3000);
  }, [cameraActive, language]);

  const handleMoveModeToggle = () => {
    if (moveMode) {
      // Turn off
      stopCamera();
      setMoveMode(false);
      setMoveScore(null);
    } else {
      // Check eligibility
      if (mode === 'ViewOnly' || mode === 'Guest' || ageGroup === 'under7') {
        setCameraError(language === 'EN' ? 'Move Mode is not available for your account type.' : 'Mode Gerak tidak tersedia untuk tipe akun kamu.');
        return;
      }
      setShowConsent(true);
    }
  };

  const handleConsent = () => {
    if (ageGroup === 'kid') {
      // Explorer under 13 needs grown-up check
      setShowConsent(false);
      setShowGrownupCheck(true);
    } else {
      // Creator: tick consent box
      setConsentAgreed(true);
      setShowConsent(false);
      setMoveMode(true);
      startCamera();
    }
  };

  const startGrownupHold = () => {
    if (grownupTimerRef.current) return;
    setGrownupProgress(0);
    const startTime = Date.now();
    grownupTimerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, (elapsed / 3000) * 100);
      setGrownupProgress(progress);
      if (progress >= 100) {
        if (grownupTimerRef.current) clearInterval(grownupTimerRef.current);
        grownupTimerRef.current = null;
        setShowGrownupCheck(false);
        setMoveMode(true);
        startCamera();
      }
    }, 50);
  };

  const stopGrownupHold = () => {
    if (grownupTimerRef.current) {
      clearInterval(grownupTimerRef.current);
      grownupTimerRef.current = null;
    }
    setGrownupProgress(0);
  };

  const handleListen = (text: string) => {
    if (speaking) {
      stop();
    } else {
      speak(text, language === 'EN' ? 'en-US' : 'id-ID');
    }
  };

  // Dance detail view
  if (selectedDance) {
    const dance = selectedDance;
    const maxSteps = isCreator ? dance.steps.length : Math.min(4, dance.steps.length);
    const step = dance.steps[currentStep];

    return (
      <div className="py-8 px-4 max-w-4xl mx-auto">
        <button
          onClick={() => { setSelectedDance(null); stopCamera(); setMoveMode(false); }}
          className="flex items-center gap-2 text-ink-400 hover:text-white mb-6"
        >
          <ChevronLeft size={20} /> {language === 'EN' ? 'Back to dances' : 'Kembali ke tari'}
        </button>

        <div className="text-center mb-8">
          <div className="text-7xl mb-4 animate-float">💃</div>
          <h1 className="text-4xl font-display font-black text-white mb-2">{t(dance.name, language)}</h1>
          <div className="flex items-center justify-center gap-4 text-ink-400">
            <span>{t(dance.region, language)}</span>
            <span>·</span>
            <span className="px-2 py-0.5 rounded-full bg-batik-400/20 text-batik-300 text-xs">
              {t(dance.difficulty, language)}
            </span>
          </div>
        </div>

        {/* Safe space check (Move Mode) */}
        {moveMode && cameraActive && (
          <Card className="mb-4 border-l-4 border-l-neon-yellow">
            <h3 className="font-bold text-neon-yellow mb-2 flex items-center gap-2">
              <AlertTriangle size={18} />
              {language === 'EN' ? 'Safe Space Check' : 'Pemeriksaan Ruang Aman'}
            </h3>
            <ul className="text-sm text-ink-300 space-y-1">
              <li>✓ {language === 'EN' ? 'Clear the area around you' : 'Bersihkan area di sekitar kamu'}</li>
              <li>✓ {language === 'EN' ? 'Stay away from furniture' : 'Menjauhlah dari perabotan'}</li>
              {ageGroup === 'kid' && (
                <li>✓ {language === 'EN' ? 'Keep a grown-up nearby' : 'Pastikan orang dewasa di dekat kamu'}</li>
              )}
            </ul>
          </Card>
        )}

        {/* Camera indicator + stop button */}
        {cameraActive && (
          <div className="mb-4 flex items-center justify-between p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
            <div className="flex items-center gap-2 text-red-400">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              {language === 'EN' ? 'Camera is on' : 'Kamera aktif'}
            </div>
            <Button size="sm" variant="danger" onClick={() => { stopCamera(); setMoveMode(false); }}>
              <CameraOff size={16} /> {language === 'EN' ? 'Stop Camera' : 'Hentikan Kamera'}
            </Button>
          </div>
        )}

        {/* Camera/pose view */}
        {moveMode && (
          <Card className="mb-6">
            <div className="relative aspect-video bg-ink-800 rounded-xl overflow-hidden">
              {/* Hidden video element — raw camera image hidden by default */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${showMirror ? '' : 'hidden'}`}
              />
              {/* Canvas for skeleton/avatar overlay */}
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
              />

              {/* Stylized avatar overlay (default — no raw camera shown) */}
              {!showMirror && cameraActive && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-8xl animate-pulse">💃</div>
                  <div className="absolute bottom-4 left-4 right-4 text-center">
                    <p className="text-xs text-ink-400">
                      {language === 'EN' ? 'Illustrated avatar mirrors your movement' : 'Avatar ilustrasi mengikuti gerakanmu'}
                    </p>
                  </div>
                </div>
              )}

              {/* Practice mode fallback */}
              {practiceMode && !cameraActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-6xl mb-3">💃</div>
                  <p className="text-ink-400 text-sm text-center px-4">
                    {cameraError || (language === 'EN' ? 'Practice Mode — follow the illustrated guide!' : 'Mode Latihan — ikuti panduan ilustrasi!')}
                  </p>
                </div>
              )}

              {/* Live feedback */}
              {moveScore && cameraActive && (
                <div className="absolute top-4 left-4 right-4 p-3 bg-black/70 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm">{moveScore.feedback}</p>
                      <div className="flex gap-1 mt-1">
                        {[1, 2, 3].map((s) => (
                          <Star
                            key={s}
                            size={16}
                            className={s <= moveScore.stars ? 'text-neon-yellow fill-current' : 'text-ink-600'}
                          />
                        ))}
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                      moveScore.stars === 3 ? 'bg-neon-green/20 text-neon-green' :
                      moveScore.stars === 2 ? 'bg-neon-yellow/20 text-neon-yellow' :
                      'bg-ink-700 text-ink-400'
                    }`}>
                      {moveScore.stars === 3 ? '★★★' : moveScore.stars === 2 ? '★★' : '★'}
                    </div>
                  </div>
                </div>
              )}

              {/* Not started yet */}
              {!cameraActive && !practiceMode && !cameraError && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-ink-400 text-sm">{language === 'EN' ? 'Starting camera...' : 'Memulai kamera...'}</p>
                </div>
              )}
              {cameraError && !cameraActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  <AlertTriangle className="text-neon-yellow mb-2" size={32} />
                  <p className="text-ink-300 text-sm text-center">{cameraError}</p>
                  <Button size="sm" variant="ghost" className="mt-3" onClick={() => setCameraError(null)}>
                    {language === 'EN' ? 'Continue in Practice Mode' : 'Lanjut di Mode Latihan'}
                  </Button>
                </div>
              )}
            </div>

            {/* Mirror toggle */}
            <div className="flex items-center justify-between mt-3">
              <label className="flex items-center gap-2 text-sm text-ink-400">
                <input
                  type="checkbox"
                  checked={showMirror}
                  onChange={(e) => setShowMirror(e.target.checked)}
                  className="rounded"
                />
                {language === 'EN' ? 'Show mirror (camera image)' : 'Tampilkan cermin (gambar kamera)'}
              </label>
              <p className="text-xs text-ink-500">
                {language === 'EN' ? 'Off by default — your image stays private' : 'Mati secara default — gambarmu tetap pribadi'}
              </p>
            </div>
          </Card>
        )}

        {/* Step viewer */}
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-display font-bold text-white">
              {language === 'EN' ? 'Step' : 'Langkah'} {currentStep + 1} / {maxSteps}
            </h3>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={speed === 'slow' ? 'neon-blue' : 'ghost'}
                onClick={() => setSpeed('slow')}
              >
                {language === 'EN' ? 'Slow' : 'Lambat'}
              </Button>
              <Button
                size="sm"
                variant={speed === 'normal' ? 'neon-blue' : 'ghost'}
                onClick={() => setSpeed('normal')}
              >
                {language === 'EN' ? 'Normal' : 'Normal'}
              </Button>
            </div>
          </div>

          {/* Illustrated step figure */}
          <div className="aspect-video bg-gradient-to-br from-batik-600/20 via-ink-800 to-neon-pink/10 rounded-xl flex items-center justify-center relative overflow-hidden mb-4">
            <div className="absolute inset-0 batik-bg opacity-20" />
            <div className="text-8xl animate-float relative z-10">💃</div>
            <div className="absolute bottom-4 left-4 text-4xl font-display font-black text-white/20">
              {currentStep + 1}
            </div>
          </div>

          {/* Step text */}
          <p className="text-lg text-white text-center mb-4">
            {language === 'EN' ? step.en : step.id}
          </p>

          {/* Audio (Auditory mode) */}
          {learningStyle === 'Auditory' && (
            <div className="flex items-center justify-center gap-2 mb-4">
              <Button
                size="sm"
                variant="neon-green"
                onClick={() => handleListen(language === 'EN' ? step.en : step.id)}
              >
                <Volume2 size={16} /> {speaking ? 'Stop' : language === 'EN' ? 'Listen' : 'Dengar'}
              </Button>
              <span className="text-xs text-ink-500">
                {language === 'EN' ? 'Spoken with count: 1, 2, 3, 4' : 'Diucapkan dengan hitungan: 1, 2, 3, 4'}
              </span>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              <ChevronLeft size={16} /> {language === 'EN' ? 'Back' : 'Kembali'}
            </Button>
            <Button
              size="sm"
              variant={playing ? 'neon-pink' : 'secondary'}
              onClick={() => setPlaying(!playing)}
            >
              {playing ? <Pause size={16} /> : <Play size={16} />}
              {playing ? (language === 'EN' ? 'Pause' : 'Jeda') : (language === 'EN' ? 'Play' : 'Putar')}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setCurrentStep(currentStep)}
            >
              <RotateCcw size={16} /> {language === 'EN' ? 'Replay' : 'Ulang'}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setCurrentStep(Math.min(maxSteps - 1, currentStep + 1))}
              disabled={currentStep === maxSteps - 1}
            >
              {language === 'EN' ? 'Next' : 'Berikutnya'} <ChevronRight size={16} />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => { setCurrentStep(0); setPlaying(false); }}
            >
              <RotateCcw size={14} /> {language === 'EN' ? 'Restart' : 'Mulai Ulang'}
            </Button>
          </div>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-1.5 mt-4">
            {Array.from({ length: maxSteps }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentStep(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === currentStep ? 'bg-neon-pink w-6' : i < currentStep ? 'bg-neon-green' : 'bg-ink-600'
                }`}
                aria-label={`Step ${i + 1}`}
              />
            ))}
          </div>
        </Card>

        {/* Move Mode toggle (Kinesthetic only) */}
        {learningStyle === 'Kinesthetic' && (
          <Card className="mb-6 border-l-4 border-l-neon-pink">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                  <Camera size={18} className="text-neon-pink" />
                  {language === 'EN' ? 'Move Mode' : 'Mode Gerak'}
                </h3>
                <p className="text-sm text-ink-400 mt-1">
                  {language === 'EN'
                    ? 'Camera checks your moves in real time. Nothing is recorded or saved.'
                    : 'Kamera memeriksa gerakanmu secara real-time. Tidak ada yang direkam atau disimpan.'}
                </p>
              </div>
              <Button
                size="sm"
                variant={moveMode ? 'danger' : 'neon-pink'}
                onClick={handleMoveModeToggle}
              >
                {moveMode
                  ? <><CameraOff size={16} /> {language === 'EN' ? 'Turn Off' : 'Matikan'}</>
                  : <><Camera size={16} /> {language === 'EN' ? 'Turn On' : 'Nyalakan'}</>}
              </Button>
            </div>
          </Card>
        )}

        {/* Story behind the dance */}
        <Card className="mb-6 border-l-4 border-l-batik-400">
          <h3 className="text-lg font-display font-bold text-white mb-2 flex items-center gap-2">
            <Info size={18} className="text-batik-400" />
            {language === 'EN' ? 'Story Behind the Dance' : 'Kisah Di Balik Tari'}
          </h3>
          <p className="text-ink-200 leading-relaxed text-sm">{t(dance.story, language)}</p>
        </Card>

        {/* Take It IRL prompt */}
        <Card className="border-l-4 border-l-neon-green">
          <div className="flex items-center gap-3">
            <Home className="text-neon-green" size={24} />
            <p className="text-ink-200">
              {language === 'EN'
                ? 'Teach this move to a family member!'
                : 'Ajarkan gerakan ini ke anggota keluarga!'}
            </p>
          </div>
        </Card>

        {/* Pre-permission consent screen */}
        {showConsent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">
            <Card className="max-w-md p-6">
              <h3 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-2">
                <Camera className="text-neon-pink" /> {language === 'EN' ? 'Before we turn on the camera' : 'Sebelum kami menyalakan kamera'}
              </h3>
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-neon-green flex-shrink-0 mt-0.5" size={20} />
                  <p className="text-sm text-ink-200">{language === 'EN' ? 'The camera checks your moves.' : 'Kamera memeriksa gerakanmu.'}</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-neon-green flex-shrink-0 mt-0.5" size={20} />
                  <p className="text-sm text-ink-200">{language === 'EN' ? 'Nothing is recorded or saved.' : 'Tidak ada yang direkam atau disimpan.'}</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-neon-green flex-shrink-0 mt-0.5" size={20} />
                  <p className="text-sm text-ink-200">{language === 'EN' ? 'Nothing leaves your device.' : 'Tidak ada yang meninggalkan perangkatmu.'}</p>
                </div>
              </div>
              {ageGroup !== 'kid' && (
                <label className="flex items-center gap-2 mb-4 text-sm text-ink-300">
                  <input type="checkbox" checked={consentAgreed} onChange={(e) => setConsentAgreed(e.target.checked)} />
                  {language === 'EN' ? 'I understand and agree to use Move Mode.' : 'Saya mengerti dan setuju menggunakan Mode Gerak.'}
                </label>
              )}
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => setShowConsent(false)}>
                  {language === 'EN' ? 'Cancel' : 'Batal'}
                </Button>
                <Button
                  size="sm"
                  variant="neon-pink"
                  onClick={handleConsent}
                  disabled={ageGroup !== 'kid' && !consentAgreed}
                >
                  {language === 'EN' ? 'Continue' : 'Lanjutkan'}
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Grown-up check (Explorer under 13) */}
        {showGrownupCheck && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">
            <Card className="max-w-md p-6">
              <h3 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-2">
                <Hand className="text-neon-yellow" /> {language === 'EN' ? 'Grown-up Check' : 'Pemeriksaan Orang Dewasa'}
              </h3>
              <p className="text-sm text-ink-300 mb-4">
                {language === 'EN'
                  ? 'A grown-up needs to hold this button for 3 seconds to turn on the camera.'
                  : 'Orang dewasa harus menahan tombol ini selama 3 detik untuk menyalakan kamera.'}
              </p>
              <button
                onMouseDown={startGrownupHold}
                onMouseUp={stopGrownupHold}
                onMouseLeave={stopGrownupHold}
                onTouchStart={startGrownupHold}
                onTouchEnd={stopGrownupHold}
                className="w-full py-6 rounded-xl bg-neon-yellow/20 border-2 border-neon-yellow text-neon-yellow font-bold relative overflow-hidden"
              >
                <div
                  className="absolute inset-0 bg-neon-yellow/20 transition-all"
                  style={{ width: `${grownupProgress}%` }}
                />
                <span className="relative z-10">
                  {language === 'EN' ? 'Hold to confirm grown-up' : 'Tahan untuk konfirmasi orang dewasa'}
                </span>
              </button>
              <Button size="sm" variant="ghost" className="w-full mt-3" onClick={() => { setShowGrownupCheck(false); stopGrownupHold(); }}>
                {language === 'EN' ? 'Cancel' : 'Batal'}
              </Button>
            </Card>
          </div>
        )}
      </div>
    );
  }

  // Dance list
  return (
    <div className="py-8 px-4 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold text-white flex items-center gap-2">
          <PersonStanding className="text-neon-pink" /> {language === 'EN' ? 'Dance Studio' : 'Studio Tari'}
        </h1>
        <p className="text-ink-400 mt-1">
          {language === 'EN'
            ? 'Learn traditional Indonesian dances step by step, at your own pace.'
            : 'Pelajari tarian tradisional Indonesia langkah demi langkah, dengan kecepatanmu sendiri.'}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {content.dances.map((dance) => (
          <Card key={dance.id} onClick={() => { setSelectedDance(dance); setCurrentStep(0); setPlaying(false); }} className="group">
            <div className="flex items-start gap-4">
              <div className="text-5xl group-hover:scale-110 transition-transform">💃</div>
              <div className="flex-1">
                <h3 className="text-lg font-display font-bold text-white">{t(dance.name, language)}</h3>
                <div className="flex items-center gap-2 text-xs text-ink-500 mb-2">
                  <span>{t(dance.region, language)}</span>
                  <span>·</span>
                  <span className="px-2 py-0.5 rounded-full bg-batik-400/20 text-batik-300">
                    {t(dance.difficulty, language)}
                  </span>
                </div>
                <p className="text-sm text-ink-300 line-clamp-2">{t(dance.story, language)}</p>
                <div className="mt-2 text-xs text-ink-500">
                  {dance.steps.length} {language === 'EN' ? 'steps' : 'langkah'}
                  {isCreator && ` · ${language === 'EN' ? 'full choreography' : 'koreografi penuh'}`}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Kinesthetic mode hint */}
      {learningStyle === 'Kinesthetic' && (
        <Card className="mt-6 border-l-4 border-l-neon-pink">
          <h3 className="font-bold text-neon-pink mb-2 flex items-center gap-2">
            <Camera size={18} /> {language === 'EN' ? 'Move Mode Available!' : 'Mode Gerak Tersedia!'}
          </h3>
          <p className="text-sm text-ink-300">
            {language === 'EN'
              ? 'Pick a dance, then turn on Move Mode. The camera checks your moves in real time — like a dance coach! Nothing is ever recorded or saved.'
              : 'Pilih tari, lalu nyalakan Mode Gerak. Kamera memeriksa gerakanmu secara real-time — seperti pelatih tari! Tidak ada yang pernah direkam atau disimpan.'}
          </p>
        </Card>
      )}

      {/* Non-kinesthetic hint */}
      {learningStyle !== 'Kinesthetic' && (
        <Card className="mt-6">
          <p className="text-sm text-ink-400">
            {language === 'EN'
              ? '💡 Switch to Kinesthetic learning style (in the header) to unlock Move Mode with camera movement recognition!'
              : '💡 Beralih ke gaya belajar Kinestetik (di header) untuk membuka Mode Gerak dengan pengenalan gerakan kamera!'}
          </p>
        </Card>
      )}

      {/* Safety note */}
      <Card className="mt-4">
        <p className="text-xs text-ink-500">
          {language === 'EN'
            ? '🔒 Camera is only used in Move Mode (Kinesthetic). It\'s always opt-in, off by default, and never records or uploads anything. All processing happens on your device.'
            : '🔒 Kamera hanya digunakan di Mode Gerak (Kinestetik). Selalu opt-in, mati secara default, dan tidak pernah merekam atau mengunggah apa pun. Semua pemrosesan terjadi di perangkatmu.'}
        </p>
      </Card>
    </div>
  );
}
