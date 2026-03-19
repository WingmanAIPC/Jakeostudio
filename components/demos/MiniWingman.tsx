import React, { useState, useRef, useEffect, useCallback } from "react";

interface LikertQuestion {
  id: string;
  text: string;
  dimension: string;
}

const QUESTIONS: LikertQuestion[] = [
  { id: "sa", text: "I can easily identify what I'm feeling in any given moment.", dimension: "Self-Awareness" },
  { id: "em", text: "I naturally pick up on how others are feeling, even when they don't say it.", dimension: "Empathy" },
  { id: "mo", text: "I stay motivated to pursue my goals, even when things get difficult.", dimension: "Motivation" },
  { id: "ss", text: "I find it easy to navigate social situations and build connections.", dimension: "Social Skills" },
  { id: "sr", text: "When I feel a strong emotion, I can pause before reacting.", dimension: "Self-Regulation" },
];

const SCALE_LABELS = ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"];
const SCALE_COLORS = ["#ef4444", "#f59e0b", "#a1a1aa", "#6ee7b7", "#10b981"];

interface Message {
  role: "assistant" | "user";
  content: string;
}

interface EQProfile {
  [key: string]: number;
}

const WingmanLogo: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="32" fill="#14532d" />
    <g transform="translate(10, 12)">
      <path
        d="M18 0C12 0 7 4 5 9C3 14 3 20 5 25C7 30 10 34 14 37C16 38.5 18 39.5 20 40C20 40 20 38 19 35C17 30 15 25 15 20C15 15 16 11 18 8C20 5 23 3 26 3C23 1 20 0 18 0Z"
        fill="#1a1a1a"
      />
      <path
        d="M26 3C20 3 16 8 15 14C14 20 15 26 18 31C20 35 23 38 26 40C28 38 30 35 31 32C33 27 34 22 33 17C32 12 30 8 27 5C26.5 4.3 26 3.6 26 3Z"
        fill="white"
      />
      <circle cx="23" cy="18" r="2" fill="#1a1a1a" />
    </g>
  </svg>
);

const MiniWingman: React.FC = () => {
  const [phase, setPhase] = useState<"likert" | "profile" | "chat">("likert");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [eqProfile, setEqProfile] = useState<EQProfile>({});
  const [fadeClass, setFadeClass] = useState("opacity-100");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleAnswer = (value: number) => {
    const q = QUESTIONS[currentQ];
    const newAnswers = { ...answers, [q.id]: value };
    setAnswers(newAnswers);

    if (currentQ < QUESTIONS.length - 1) {
      setFadeClass("opacity-0 -translate-y-2");
      setTimeout(() => {
        setCurrentQ((prev) => prev + 1);
        setFadeClass("opacity-0 translate-y-2");
        requestAnimationFrame(() => {
          setFadeClass("opacity-100 translate-y-0");
        });
      }, 200);
    } else {
      const profile: EQProfile = {};
      QUESTIONS.forEach((q) => {
        profile[q.dimension] = newAnswers[q.id] ?? 3;
      });
      setEqProfile(profile);
      setPhase("profile");

      setTimeout(() => {
        setPhase("chat");
        sendInitialMessage(profile);
      }, 2500);
    }
  };

  const sendInitialMessage = async (profile: EQProfile) => {
    setIsStreaming(true);
    try {
      const controller = new AbortController();
      abortRef.current = controller;

      const res = await fetch("/api/wingman", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [], eqProfile: profile, isInitial: true }),
        signal: controller.signal,
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No stream");

      const decoder = new TextDecoder();
      let fullText = "";

      setMessages([{ role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        setMessages([{ role: "assistant", content: fullText }]);
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setMessages([{ role: "assistant", content: "Hey there! I'm Wingman. I had trouble connecting, but I'm still here to chat. What's on your mind?" }]);
    } finally {
      setIsStreaming(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isStreaming) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsStreaming(true);

    try {
      const controller = new AbortController();
      abortRef.current = controller;

      const res = await fetch("/api/wingman", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
          eqProfile,
          isInitial: false,
        }),
        signal: controller.signal,
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No stream");

      const decoder = new TextDecoder();
      let fullText = "";

      setMessages([...updatedMessages, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        setMessages([...updatedMessages, { role: "assistant", content: fullText }]);
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setMessages([...updatedMessages, { role: "assistant", content: "Sorry, I couldn't process that. Try again?" }]);
    } finally {
      setIsStreaming(false);
    }
  };

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  if (phase === "likert") {
    const q = QUESTIONS[currentQ];
    const progress = ((currentQ) / QUESTIONS.length) * 100;

    return (
      <div className="flex flex-col items-center justify-center min-h-[360px] px-4">
        <div className="flex items-center gap-2 mb-6">
          <WingmanLogo size={32} />
          <span className="text-sm font-medium text-zinc-300">Wingman EQ Assessment</span>
        </div>

        <div className="w-full max-w-md h-1.5 bg-zinc-800 rounded-full mb-8 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: "linear-gradient(90deg, #166534, #22c55e)" }}
          />
        </div>

        <div className={`text-center max-w-md transition-all duration-200 ${fadeClass}`}>
          <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2">
            {q.dimension}
          </p>
          <p className="text-lg font-medium text-white mb-8 leading-relaxed">
            {q.text}
          </p>

          <div className="flex justify-center gap-3">
            {SCALE_LABELS.map((label, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(i + 1)}
                className="group flex flex-col items-center gap-2"
              >
                <div
                  className={`w-10 h-10 rounded-full transition-all duration-200 flex items-center justify-center text-sm font-medium ${
                    answers[q.id] === i + 1
                      ? "scale-110 ring-2 ring-white/40 ring-offset-2 ring-offset-black"
                      : "hover:scale-110 group-hover:ring-1 group-hover:ring-white/20"
                  }`}
                  style={{
                    backgroundColor: SCALE_COLORS[i],
                    color: i === 2 ? "#27272a" : "white",
                  }}
                >
                  {i + 1}
                </div>
                <span className="text-[9px] text-zinc-600 max-w-[60px] text-center leading-tight hidden md:block">
                  {label}
                </span>
              </button>
            ))}
          </div>

          <p className="text-[10px] text-zinc-600 mt-4">
            Question {currentQ + 1} of {QUESTIONS.length}
          </p>
        </div>
      </div>
    );
  }

  if (phase === "profile") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[360px] px-4">
        <WingmanLogo size={40} />
        <p className="text-sm text-zinc-400 mb-6 mt-4">Analyzing your profile...</p>

        <div className="w-full max-w-sm space-y-3">
          {Object.entries(eqProfile).map(([dim, score]) => (
            <div key={dim}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-400">{dim}</span>
                <span className="text-zinc-300">{score}/5</span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${(score / 5) * 100}%`, background: "linear-gradient(90deg, #166534, #22c55e)" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[400px]">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
        <WingmanLogo size={28} />
        <span className="text-sm font-medium text-zinc-300">Wingman</span>
        {isStreaming && (
          <span className="text-[10px] text-emerald-400 ml-auto">typing...</span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "text-white rounded-br-md"
                  : "bg-zinc-800 text-zinc-200 rounded-bl-md"
              }`}
              style={msg.role === "user" ? { backgroundColor: "#166534" } : undefined}
            >
              {msg.content || (
                <span className="inline-flex gap-1">
                  <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-pulse" />
                  <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-pulse [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-pulse [animation-delay:0.4s]" />
                </span>
              )}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="px-4 py-3 border-t border-white/10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Jake, EQ, or anything..."
            disabled={isStreaming}
            className="flex-1 bg-zinc-900 border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/30 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isStreaming || !input.trim()}
            className="px-4 py-2 rounded-full text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110"
            style={{ backgroundColor: "#166534" }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default MiniWingman;
