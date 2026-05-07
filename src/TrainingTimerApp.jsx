import React, { useEffect, useState } from "react";
import { Play, Pause, RotateCcw, SkipForward, Dumbbell, Timer, Flame, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const saitamaWorkout = [
  { name: "Flexiones", reps: "100 reps" },
  { name: "Abdominales", reps: "100 reps" },
  { name: "Sentadillas", reps: "100 reps" },
  { name: "Correr", reps: "10 km" },
];

const superSerieWorkout = [
  { name: "Flexiones", reps: "10 reps" },
  { name: "Sentadillas", reps: "10 reps" },
  { name: "Fondos en paralela", reps: "10 reps" },
  { name: "Peso muerto", reps: "10 reps" },
  { name: "Russian twist", reps: "10 por lado" },
  { name: "Vuelos laterales", reps: "10 reps" },
  { name: "Estocadas", reps: "10 por pierna" },
  { name: "Dominadas", reps: "10 reps" },
  { name: "Pistol squat", reps: "10 por pierna" },
  { name: "Pike push-up", reps: "10 reps" },
];

export default function TrainingTimerApp() {
  const [mode, setMode] = useState("superserie");
  const [currentExercise, setCurrentExercise] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [rounds, setRounds] = useState(3);
  const [workSeconds, setWorkSeconds] = useState(45);
  const [shortRest, setShortRest] = useState(10);
  const [longRest, setLongRest] = useState(300);
  const [phase, setPhase] = useState("work");
  const [secondsLeft, setSecondsLeft] = useState(workSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [completed, setCompleted] = useState(false);

  const workout = mode === "saitama" ? saitamaWorkout : superSerieWorkout;
  const totalExercises = workout.length;
  const progress = completed
    ? 100
    : (((currentRound - 1) * totalExercises + currentExercise) /
        (rounds * totalExercises)) *
      100;

  const current = workout[currentExercise];

  useEffect(() => {
    setCurrentExercise(0);
    setCurrentRound(1);
    setPhase("work");
    setSecondsLeft(workSeconds);
    setIsRunning(false);
    setCompleted(false);
  }, [mode]);

  useEffect(() => {
    if (!isRunning || completed) return undefined;
    if (secondsLeft <= 0) {
      nextStep();
      return undefined;
    }

    const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [isRunning, secondsLeft, completed]);

  useEffect(() => {
    if (phase === "work") setSecondsLeft(workSeconds);
  }, [workSeconds]);

  function formatTime(total) {
    const min = Math.floor(total / 60);
    const sec = total % 60;
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }

  function nextStep() {
    if (completed) return;

    if (phase === "work") {
      const isLastExercise = currentExercise === totalExercises - 1;
      const isLastRound = currentRound === rounds;

      if (isLastExercise && isLastRound) {
        setCompleted(true);
        setIsRunning(false);
        return;
      }

      setPhase("rest");
      setSecondsLeft(isLastExercise ? longRest : shortRest);
      return;
    }

    const isLastExercise = currentExercise === totalExercises - 1;
    if (isLastExercise) {
      setCurrentExercise(0);
      setCurrentRound((r) => r + 1);
    } else {
      setCurrentExercise((i) => i + 1);
    }
    setPhase("work");
    setSecondsLeft(workSeconds);
  }

  function resetWorkout() {
    setCurrentExercise(0);
    setCurrentRound(1);
    setPhase("work");
    setSecondsLeft(workSeconds);
    setIsRunning(false);
    setCompleted(false);
  }

  const phaseLabel = completed ? "Entrenamiento completo" : phase === "work" ? "Ejercicio" : "Descanso";

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-slate-200">
            <Flame className="w-4 h-4" /> Training Timer App
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight">
            Entrená como una bestia, <span className="text-cyan-300">pero con orden</span>
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-base md:text-lg">
            Temporizador para rutina Saitama y superserie de 10 ejercicios. Controlá series, descansos y progreso sin perderte en el entrenamiento.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="bg-white/10 border border-white/10 rounded-2xl shadow-xl lg:col-span-2 p-6 md:p-8 space-y-8">
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                type="button"
                onClick={() => setMode("superserie")}
                className={`rounded-2xl px-5 py-3 font-semibold transition-colors ${mode === "superserie" ? "bg-cyan-500 hover:bg-cyan-600" : "bg-white/10 hover:bg-white/20"}`}
              >
                Superserie 10 ejercicios
              </button>
              <button
                type="button"
                onClick={() => setMode("saitama")}
                className={`rounded-2xl px-5 py-3 font-semibold transition-colors ${mode === "saitama" ? "bg-cyan-500 hover:bg-cyan-600" : "bg-white/10 hover:bg-white/20"}`}
              >
                Saitama
              </button>
            </div>

            <div className="text-center space-y-4">
              <div className="text-sm uppercase tracking-[0.3em] text-cyan-300">{phaseLabel}</div>

              {completed ? (
                <div className="space-y-4">
                  <CheckCircle2 className="w-24 h-24 mx-auto text-cyan-300" />
                  <h2 className="text-4xl md:text-5xl font-black">Rutina terminada</h2>
                  <p className="text-slate-300">Listo, animal. Hoy sumaste disciplina real.</p>
                </div>
              ) : (
                <>
                  <h2 className="text-4xl md:text-6xl font-black">{phase === "work" ? current.name : "Respirá y preparate"}</h2>
                  <p className="text-xl text-slate-300">{phase === "work" ? current.reps : "El próximo ejercicio viene picante"}</p>
                  <div className="text-7xl md:text-8xl font-black tabular-nums">{formatTime(secondsLeft)}</div>
                  <div className="text-slate-300">
                    Serie {currentRound} de {rounds} · Ejercicio {currentExercise + 1} de {totalExercises}
                  </div>
                </>
              )}
            </div>

            <div className="space-y-3">
              <div className="h-4 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-cyan-400 transition-all" style={{ width: `${progress}%` }} />
              </div>
              <div className="text-center text-sm text-slate-400">Progreso total: {Math.round(progress)}%</div>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsRunning((v) => !v)}
                className="rounded-2xl px-8 py-4 bg-cyan-500 hover:bg-cyan-600 text-lg font-semibold inline-flex items-center"
              >
                {isRunning ? <Pause className="mr-2" /> : <Play className="mr-2" />}
                {isRunning ? "Pausar" : "Empezar"}
              </button>
              <button type="button" onClick={nextStep} className="rounded-2xl px-6 py-4 bg-white/10 hover:bg-white/20 inline-flex items-center">
                <SkipForward className="mr-2" /> Saltar
              </button>
              <button type="button" onClick={resetWorkout} className="rounded-2xl px-6 py-4 bg-white/10 hover:bg-white/20 inline-flex items-center">
                <RotateCcw className="mr-2" /> Reiniciar
              </button>
            </div>
          </div>

          <div className="space-y-5">
            <div className="bg-white/10 border border-white/10 rounded-2xl shadow-xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-cyan-300 font-bold">
                <Timer className="w-5 h-5" /> Configuración
              </div>

              <label className="block space-y-2">
                <span className="text-sm text-slate-300">Series</span>
                <input type="number" min="1" max="10" value={rounds} onChange={(e) => setRounds(Number(e.target.value))} className="w-full rounded-xl bg-slate-900 border border-white/10 p-3" />
              </label>

              <label className="block space-y-2">
                <span className="text-sm text-slate-300">Tiempo por ejercicio</span>
                <input type="number" min="5" value={workSeconds} onChange={(e) => setWorkSeconds(Number(e.target.value))} className="w-full rounded-xl bg-slate-900 border border-white/10 p-3" />
              </label>

              <label className="block space-y-2">
                <span className="text-sm text-slate-300">Descanso corto</span>
                <input type="number" min="0" value={shortRest} onChange={(e) => setShortRest(Number(e.target.value))} className="w-full rounded-xl bg-slate-900 border border-white/10 p-3" />
              </label>

              <label className="block space-y-2">
                <span className="text-sm text-slate-300">Descanso entre series</span>
                <input type="number" min="0" value={longRest} onChange={(e) => setLongRest(Number(e.target.value))} className="w-full rounded-xl bg-slate-900 border border-white/10 p-3" />
              </label>
            </div>

            <div className="bg-white/10 border border-white/10 rounded-2xl shadow-xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-cyan-300 font-bold">
                <Dumbbell className="w-5 h-5" /> Rutina actual
              </div>
              <div className="space-y-2 max-h-[360px] overflow-auto pr-1">
                {workout.map((exercise, index) => (
                  <div key={exercise.name} className={`rounded-xl p-3 border ${index === currentExercise && !completed ? "bg-cyan-500/20 border-cyan-300" : "bg-slate-900/70 border-white/10"}`}>
                    <div className="font-bold">{index + 1}. {exercise.name}</div>
                    <div className="text-sm text-slate-300">{exercise.reps}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
