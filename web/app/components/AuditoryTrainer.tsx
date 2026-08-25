"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ALL_MISSIONS, RESEARCH_LINKS, TRAINING_WEEKS, type DialogueLine, type Mission } from "../data/proCourse";

type Tab = "train" | "route" | "progress" | "method";
type SupportMode = "guided" | "standard" | "challenge";

type SavedProgress = {
  completed: number[];
  attempts: Record<number, number>;
  bestScores: Record<number, number>;
  confidence: Record<number, number>;
  activeId: number;
  reviewDue: number[];
  baselineCompleted: boolean;
  baselineScore: number;
  supportMode: SupportMode;
};

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const EMPTY_PROGRESS: SavedProgress = {
  completed: [], attempts: {}, bestScores: {}, confidence: {}, activeId: 1,
  reviewDue: [], baselineCompleted: false, baselineScore: 0, supportMode: "guided",
};

const DIAGNOSTIC_IDS = [1, 8, 43];
const unique = (values: number[]) => Array.from(new Set(values));

function levelLabel(mode: SupportMode) {
  if (mode === "guided") return "Base guiada";
  if (mode === "standard") return "Ritmo funcional";
  return "Reto natural";
}

function trainingRate(mode: SupportMode) {
  if (mode === "guided") return 0.86;
  if (mode === "challenge") return 1.02;
  return 0.94;
}

function pickVoices() {
  if (!("speechSynthesis" in window)) return [];
  const english = window.speechSynthesis.getVoices().filter((voice) => voice.lang.toLowerCase().startsWith("en"));
  const american = english.filter((voice) => voice.lang.toLowerCase().startsWith("en-us"));
  return american.length >= 2 ? american : english;
}

export default function AuditoryTrainer() {
  const [tab, setTab] = useState<Tab>("train");
  const [progress, setProgress] = useState<SavedProgress>(EMPTY_PROGRESS);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [loaded, setLoaded] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const [audioStatus, setAudioStatus] = useState("Listo para el primer pase");
  const [playing, setPlaying] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [diagnosticIndex, setDiagnosticIndex] = useState(0);
  const [diagnosticAnswers, setDiagnosticAnswers] = useState<number[]>([]);
  const [diagnosticSelection, setDiagnosticSelection] = useState<number | null>(null);
  const [diagnosticChecked, setDiagnosticChecked] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const cancelledSpeech = useRef(false);

  const mission = useMemo(() => ALL_MISSIONS.find((item) => item.id === progress.activeId) ?? ALL_MISSIONS[0], [progress.activeId]);
  const week = TRAINING_WEEKS[selectedWeek - 1] ?? TRAINING_WEEKS[0];
  const diagnosticMission = ALL_MISSIONS.find((item) => item.id === DIAGNOSTIC_IDS[diagnosticIndex]) ?? ALL_MISSIONS[0];

  useEffect(() => {
    try {
      const current = window.localStorage.getItem("cancha48-progress-v2");
      if (current) setProgress({ ...EMPTY_PROGRESS, ...JSON.parse(current) });
      else {
        const legacy = window.localStorage.getItem("cancha48-progress-v1");
        if (legacy) {
          const previous = JSON.parse(legacy) as Partial<SavedProgress>;
          setProgress({ ...EMPTY_PROGRESS, completed: previous.completed ?? [], bestScores: previous.bestScores ?? {}, attempts: previous.attempts ?? {} });
        }
      }
    } catch { setProgress(EMPTY_PROGRESS); }
    setLoaded(true);
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    setInstalled(window.matchMedia("(display-mode: standalone)").matches);
    const capturePrompt = (event: Event) => { event.preventDefault(); setInstallPrompt(event as InstallPromptEvent); };
    const markInstalled = () => { setInstalled(true); setInstallPrompt(null); };
    window.addEventListener("beforeinstallprompt", capturePrompt);
    window.addEventListener("appinstalled", markInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", capturePrompt);
      window.removeEventListener("appinstalled", markInstalled);
      window.speechSynthesis?.cancel();
    };
  }, []);

  useEffect(() => { if (loaded) window.localStorage.setItem("cancha48-progress-v2", JSON.stringify(progress)); }, [progress, loaded]);

  useEffect(() => {
    cancelledSpeech.current = true;
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    setSelectedAnswer(null); setChecked(false); setShowTranscript(false); setShowModel(false);
    if (recordingUrl) URL.revokeObjectURL(recordingUrl);
    setRecordingUrl(null); setAudioStatus("Listo para el primer pase"); setPlaying(false);
  }, [mission.id]);

  useEffect(() => () => { streamRef.current?.getTracks().forEach((track) => track.stop()); }, []);

  function speakLine(item: DialogueLine | { speaker: "B"; en: string }, rate = 0.92) {
    if (!("speechSynthesis" in window)) { setAudioStatus("La voz no está disponible. Usa Chrome o Edge."); return; }
    cancelledSpeech.current = true; window.speechSynthesis.cancel(); cancelledSpeech.current = false;
    const utterance = new SpeechSynthesisUtterance(item.en);
    const voices = pickVoices();
    utterance.lang = "en-US"; utterance.rate = rate; utterance.pitch = item.speaker === "A" ? 1.02 : 0.96;
    utterance.voice = voices[item.speaker === "A" ? 0 : Math.min(1, voices.length - 1)] ?? null;
    utterance.onstart = () => setAudioStatus("Reproduciendo una intervención");
    utterance.onend = () => setAudioStatus("Ahora imítala sin mirar");
    window.speechSynthesis.speak(utterance);
  }

  function playDialogue(item: Mission, rate: number, countAttempt = true) {
    if (!("speechSynthesis" in window)) { setAudioStatus("La voz no está disponible. Usa Chrome o Edge."); return; }
    cancelledSpeech.current = true; window.speechSynthesis.cancel(); cancelledSpeech.current = false;
    setPlaying(true); setAudioStatus(rate < 0.85 ? "Pase de rescate: escucha los bloques" : "Conversación en curso: no leas");
    const voices = pickVoices();
    const playAt = (index: number) => {
      if (cancelledSpeech.current || index >= item.dialogue.length) {
        setPlaying(false); if (!cancelledSpeech.current) setAudioStatus("Pase terminado. Responde por significado."); return;
      }
      const current = item.dialogue[index];
      const utterance = new SpeechSynthesisUtterance(current.en);
      utterance.lang = "en-US"; utterance.rate = rate; utterance.pitch = current.speaker === "A" ? 1.03 : 0.96;
      utterance.voice = voices[current.speaker === "A" ? 0 : Math.min(1, voices.length - 1)] ?? null;
      utterance.onend = () => window.setTimeout(() => playAt(index + 1), 260);
      utterance.onerror = () => { setPlaying(false); setAudioStatus("No se pudo completar el audio. Intenta de nuevo."); };
      window.speechSynthesis.speak(utterance);
    };
    playAt(0);
    if (countAttempt) setProgress((current) => ({ ...current, attempts: { ...current.attempts, [item.id]: (current.attempts[item.id] ?? 0) + 1 } }));
  }

  function checkAnswer() {
    if (selectedAnswer === null) return;
    setChecked(true);
    const correct = selectedAnswer === mission.answer;
    setProgress((current) => ({
      ...current,
      bestScores: { ...current.bestScores, [mission.id]: Math.max(current.bestScores[mission.id] ?? 0, correct ? 100 : 0) },
      reviewDue: correct ? current.reviewDue.filter((id) => id !== mission.id) : unique([...current.reviewDue, mission.id]),
    }));
  }

  function chooseMission(item: Mission) {
    setProgress((current) => ({ ...current, activeId: item.id })); setSelectedWeek(item.week); setTab("train");
  }

  function finishMission(confidence: number) {
    setProgress((current) => {
      const completed = unique([...current.completed, mission.id]);
      const reviewDue = confidence < 3 ? unique([...current.reviewDue, mission.id]) : current.reviewDue.filter((id) => id !== mission.id);
      const review = reviewDue.find((id) => id !== mission.id && completed.includes(id));
      const nextNew = ALL_MISSIONS.find((item) => !completed.includes(item.id));
      const nextId = completed.length % 4 === 0 && review ? review : nextNew?.id ?? review ?? mission.id;
      const nextMission = ALL_MISSIONS.find((item) => item.id === nextId);
      if (nextMission) setSelectedWeek(nextMission.week);
      return { ...current, completed, reviewDue, confidence: { ...current.confidence, [mission.id]: confidence }, activeId: nextId };
    });
    setTab("route");
  }

  function completeDiagnostic() {
    if (diagnosticSelection === null) return;
    const correct = diagnosticSelection === diagnosticMission.answer ? 1 : 0;
    const answers = [...diagnosticAnswers, correct];
    setDiagnosticAnswers(answers); setDiagnosticChecked(true);
    if (diagnosticIndex < DIAGNOSTIC_IDS.length - 1) {
      window.setTimeout(() => { setDiagnosticIndex((value) => value + 1); setDiagnosticSelection(null); setDiagnosticChecked(false); }, 850);
      return;
    }
    const score = answers.reduce((sum, value) => sum + value, 0);
    const mode: SupportMode = score <= 1 ? "guided" : score === 2 ? "standard" : "challenge";
    window.setTimeout(() => {
      setProgress((current) => ({ ...current, baselineCompleted: true, baselineScore: score, supportMode: mode, activeId: 1 }));
      setDiagnosticSelection(null); setDiagnosticChecked(false); setAudioStatus("Diagnóstico terminado. Tu ruta está lista.");
    }, 850);
  }

  async function startRecording() {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") { setAudioStatus("La grabación no está disponible en este navegador."); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream; chunksRef.current = [];
      const recorder = new MediaRecorder(stream); recorderRef.current = recorder;
      recorder.ondataavailable = (event) => { if (event.data.size > 0) chunksRef.current.push(event.data); };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        if (recordingUrl) URL.revokeObjectURL(recordingUrl);
        setRecordingUrl(URL.createObjectURL(blob)); stream.getTracks().forEach((track) => track.stop()); streamRef.current = null;
      };
      recorder.start(); setRecording(true); setAudioStatus("Grabando: responde como si fuera una llamada real");
    } catch { setAudioStatus("Permite el micrófono para grabar tu respuesta."); }
  }

  function stopRecording() {
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
    setRecording(false); setAudioStatus("Escúchate una vez y evalúa si tu mensaje fue claro.");
  }

  async function installApp() {
    if (!installPrompt) return;
    await installPrompt.prompt(); const choice = await installPrompt.userChoice;
    if (choice.outcome === "accepted") setInstalled(true); setInstallPrompt(null);
  }

  function exportProgress() {
    const backup = { course: "CANCHA-48-PRO", exportedAt: new Date().toISOString(), progress };
    const url = URL.createObjectURL(new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" }));
    const link = document.createElement("a"); link.href = url; link.download = `cancha48-progreso-${new Date().toISOString().slice(0, 10)}.json`; link.click(); URL.revokeObjectURL(url);
  }

  const completedScores = progress.completed.map((id) => progress.bestScores[id] ?? 0);
  const average = completedScores.length ? Math.round(completedScores.reduce((sum, value) => sum + value, 0) / completedScores.length) : 0;

  if (!loaded) return <main className="app-shell"><div className="loading-card">Preparando tu entrenamiento…</div></main>;

  if (!progress.baselineCompleted) {
    return (
      <main className="app-shell diagnostic-shell">
        <header className="topbar"><div><p className="eyebrow">Evaluación de entrada</p><h1>CANCHA‑48 PRO</h1></div><div className="week-progress"><strong>{diagnosticIndex + 1}/3</strong><span>muestras</span></div></header>
        <section className="diagnostic-card">
          <div className="lesson-heading"><span>No estudies antes · sólo escucha</span><h2>Calibración auditiva</h2><p>Esto no mide gramática. Determina cuánto apoyo y qué velocidad necesita tu oído al comenzar.</p></div>
          <div className="audio-stage diagnostic-audio"><p className="step-label">Muestra {diagnosticIndex + 1}</p><button className="primary-action" onClick={() => playDialogue(diagnosticMission, 0.96, false)} disabled={playing}><span className="play-mark">▶</span>{playing ? "Escuchando…" : "Escuchar conversación"}</button><p className="audio-status" aria-live="polite">{audioStatus}</p></div>
          <div className="meaning-check"><p className="step-label">Elige por significado</p><h3>{diagnosticMission.question}</h3><div className="option-grid">{diagnosticMission.options.map((option, index) => <button key={option} className={diagnosticSelection === index ? "answer-option selected" : "answer-option"} onClick={() => !diagnosticChecked && setDiagnosticSelection(index)}>{option}</button>)}</div><button className="check-action" disabled={diagnosticSelection === null || diagnosticChecked} onClick={completeDiagnostic}>{diagnosticChecked ? "Registrado" : "Confirmar respuesta"}</button></div>
        </section>
        <p className="privacy-note">Tu evaluación y avance se guardan únicamente en este dispositivo.</p>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <header className="topbar"><div><p className="eyebrow">Entrenamiento auditivo por misiones</p><h1>CANCHA‑48 PRO</h1></div><div className="week-progress" aria-label={`${progress.completed.length} de ${ALL_MISSIONS.length} misiones`}><strong>{progress.completed.length}/{ALL_MISSIONS.length}</strong><span>{levelLabel(progress.supportMode)}</span></div></header>
      <div className="install-row">{installPrompt && !installed ? <button className="install-action" onClick={installApp}>Instalar</button> : <span>{installed ? "Aplicación instalada" : "Disponible desde el navegador"}</span>}<span>Curso autónomo · avance local</span></div>
      <nav className="tabs" aria-label="Secciones"><button className={tab === "train" ? "active" : ""} onClick={() => setTab("train")}>Entrenar</button><button className={tab === "route" ? "active" : ""} onClick={() => setTab("route")}>Ruta</button><button className={tab === "progress" ? "active" : ""} onClick={() => setTab("progress")}>Avance</button><button className={tab === "method" ? "active" : ""} onClick={() => setTab("method")}>Método</button></nav>

      {tab === "train" && (
        <section className="workspace" aria-labelledby="mission-title">
          <div className="lesson-heading"><div className="mission-meta"><span>Semana {mission.week} · Misión {mission.day}</span><span>18–25 min</span></div><h2 id="mission-title">{mission.title}</h2><p>{mission.context}</p><div className="mission-objective"><strong>Objetivo operativo</strong><span>{mission.objective}</span></div></div>
          <div className="audio-stage"><p className="step-label">1 · Lectura del juego</p><p className="stage-instruction">Escucha la conversación completa sin leer. Busca quién, qué cambió y qué debe ocurrir.</p><div className="audio-actions"><button className="primary-action" onClick={() => playDialogue(mission, trainingRate(progress.supportMode))} disabled={playing}><span className="play-mark">▶</span>{playing ? "Conversación en curso" : "Pase natural"}</button>{checked && selectedAnswer !== mission.answer && <button className="secondary-action" onClick={() => playDialogue(mission, 0.78)}>Pase de rescate</button>}</div><p className="audio-status" aria-live="polite">{audioStatus}</p></div>
          <div className="meaning-check"><p className="step-label">2 · Decisión por significado</p><h3>{mission.question}</h3><div className="option-grid">{mission.options.map((option, index) => { const state = checked ? index === mission.answer ? " correct" : index === selectedAnswer ? " wrong" : "" : selectedAnswer === index ? " selected" : ""; return <button key={option} className={`answer-option${state}`} onClick={() => !checked && setSelectedAnswer(index)}>{option}</button>; })}</div>{!checked ? <button className="check-action" disabled={selectedAnswer === null} onClick={checkAnswer}>Comprobar comprensión</button> : <div className={selectedAnswer === mission.answer ? "feedback success" : "feedback repair"}><strong>{selectedAnswer === mission.answer ? "Comprensión correcta" : "Necesita reparación"}</strong><span>{selectedAnswer === mission.answer ? "Captaste el dato esencial. Ahora comprueba cómo sonó." : "No memorices la respuesta. Usa el pase de rescate y escucha los bloques con fuerza."}</span></div>}</div>
          {checked && <div className="study-panel"><div className="study-toolbar"><div><p className="step-label">3 · Video mental y forma sonora</p><h3>Reconstruye la escena</h3></div><button className="transcript-toggle" onClick={() => setShowTranscript((value) => !value)}>{showTranscript ? "Ocultar diálogo" : "Mostrar diálogo"}</button></div>{showTranscript && <div className="dialogue-transcript">{mission.dialogue.map((item, index) => <article key={`${item.speaker}-${index}`} className={`dialogue-line speaker-${item.speaker.toLowerCase()}`}><div className="speaker-badge">{item.name}</div><div><p>{item.en}</p><span>{item.es}</span></div><button aria-label={`Escuchar intervención de ${item.name}`} onClick={() => speakLine(item, 0.9)}>▶</button></article>)}<button className="inline-play replay-full" onClick={() => playDialogue(mission, 0.92)}>Escuchar otra vez con el texto</button></div>}<div className="chunk-grid">{mission.chunks.map((item) => <article key={item.written}><strong>{item.written}</strong><b>{item.heard}</b><span>{item.meaning}</span></article>)}</div></div>}
          {checked && <div className="speaking-block pro-speaking"><p className="step-label">4 · Tu turno</p><h3>{mission.responsePrompt}</h3><p>Responde primero sin mirar. Después compara tu mensaje con el modelo; no necesitas imitar el acento.</p><div className="response-actions"><button className={recording ? "recording-action" : "record-action"} onClick={recording ? stopRecording : startRecording}>{recording ? "Detener grabación" : "Grabar mi respuesta"}</button><button className="secondary-action" onClick={() => setShowModel((value) => !value)}>{showModel ? "Ocultar modelo" : "Comparar con modelo"}</button></div>{recordingUrl && <audio controls src={recordingUrl} aria-label="Tu respuesta grabada" />}{showModel && <div className="model-card"><div><strong>{mission.modelResponse}</strong><span>{mission.modelResponseEs}</span></div><button onClick={() => speakLine({ speaker: "B", en: mission.modelResponse }, 0.9)}>▶</button></div>}<div className="confidence-check"><p>Termina calificando tu capacidad real, no tu acento:</p><div><button onClick={() => finishMission(1)}>Necesité leer</button><button onClick={() => finishMission(2)}>Respondí con esfuerzo</button><button onClick={() => finishMission(3)}>Respondí sin apoyo</button></div></div></div>}
        </section>
      )}

      {tab === "route" && <section className="lesson-list" aria-labelledby="route-title"><div className="section-heading"><p className="eyebrow">Ruta funcional · 8 semanas</p><h2 id="route-title">{week.title}</h2><p>{week.objective}</p></div><div className="route-summary"><span>48 misiones conversacionales</span><span>5 días de avance + 1 de repaso</span><span>18–25 min por sesión</span></div><div className="week-picker" aria-label="Elegir semana">{TRAINING_WEEKS.map((item) => { const done = item.missions.filter((entry) => progress.completed.includes(entry.id)).length; return <button key={item.number} className={selectedWeek === item.number ? "active" : ""} onClick={() => setSelectedWeek(item.number)}><strong>{item.number}</strong><span>{done}/6</span></button>; })}</div><div className="lesson-grid">{week.missions.map((item) => { const done = progress.completed.includes(item.id); const review = progress.reviewDue.includes(item.id); return <button key={item.id} className="lesson-card" onClick={() => chooseMission(item)}><span className={done ? "day done" : "day"}>{done ? "✓" : item.day}</span><span><strong>{item.title}</strong><small>{item.context}</small>{review && <em>Repaso recomendado</em>}</span><span className="arrow">→</span></button>; })}</div></section>}

      {tab === "progress" && <section className="progress-view" aria-labelledby="progress-title"><div className="section-heading"><p className="eyebrow">Medición funcional</p><h2 id="progress-title">Tu avance auditivo</h2><p>Se mide comprensión de significado, recuperación de errores y capacidad para responder. No se premia memorizar transcripciones.</p></div><div className="metric-grid pro-metrics"><article><span>Misiones entrenadas</span><strong>{progress.completed.length}/48</strong></article><article><span>Comprensión acumulada</span><strong>{average}%</strong></article><article><span>Repasos pendientes</span><strong>{progress.reviewDue.length}</strong></article><article><span>Reproducciones</span><strong>{Object.values(progress.attempts).reduce((sum, value) => sum + value, 0)}</strong></article></div><div className="baseline-card"><div><span>Nivel de entrada</span><strong>{progress.baselineScore}/3 · {levelLabel(progress.supportMode)}</strong></div><p>La velocidad inicial se adapta a este resultado. Los errores pasan automáticamente a la cola de repaso.</p></div><div className="progress-table">{TRAINING_WEEKS.map((item) => { const completed = item.missions.filter((entry) => progress.completed.includes(entry.id)).length; return <button key={item.number} onClick={() => { setSelectedWeek(item.number); setTab("route"); }}><span>Semana {item.number} · {item.title}</span><strong>{completed}/6</strong></button>; })}</div><div className="data-actions"><button className="backup-action" onClick={exportProgress}>Descargar respaldo</button><button className="reset-action" onClick={() => { if (window.confirm("¿Deseas borrar la evaluación y todo el progreso de este dispositivo?")) { window.localStorage.removeItem("cancha48-progress-v2"); setProgress(EMPTY_PROGRESS); setTab("train"); } }}>Reiniciar desde diagnóstico</button></div></section>}

      {tab === "method" && <section className="method-view" aria-labelledby="method-title"><div className="section-heading"><p className="eyebrow">Fundamento, no promesa rápida</p><h2 id="method-title">Por qué funciona este entrenamiento</h2><p>Los deportistas no reciben un método secreto. Progresan porque practican lenguaje limitado y urgente dentro del mismo contexto, reciben corrección inmediata y lo usan todos los días. CANCHA‑48 convierte esas condiciones en una rutina personal.</p></div><div className="principle-grid"><article><span>01</span><div><strong>Misión real</strong><p>Cada sesión termina en una decisión o respuesta, como una indicación de juego.</p></div></article><article><span>02</span><div><strong>Input comprensible</strong><p>Primero escuchas natural; el rescate lento aparece sólo cuando lo necesitas.</p></div></article><article><span>03</span><div><strong>Variabilidad</strong><p>Personas, números y contextos cambian para evitar que memorices una sola voz.</p></div></article><article><span>04</span><div><strong>Recuperación activa</strong><p>Debes elegir significado y responder antes de ver el modelo.</p></div></article><article><span>05</span><div><strong>Repaso adaptativo</strong><p>Los errores y respuestas con apoyo vuelven a aparecer; los aciertos sólidos avanzan.</p></div></article></div><div className="method-warning"><strong>Meta honesta</strong><p>Este ciclo no promete “hablar inglés en semanas”. Entrena comprensión y respuesta funcional en 48 situaciones de alta utilidad. La velocidad depende de práctica frecuente, exposición y uso real.</p></div><div className="research-list"><h3>Evidencia utilizada</h3>{RESEARCH_LINKS.map((source) => <a key={source.href} href={source.href} target="_blank" rel="noreferrer"><strong>{source.title}</strong><span>{source.note}</span><b>↗</b></a>)}</div></section>}

      <footer><span>CANCHA‑48 PRO · ciclo funcional</span><span>Escucha · decide · responde · repite</span></footer>
    </main>
  );
}
