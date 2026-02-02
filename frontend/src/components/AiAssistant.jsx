import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Loader2, ImagePlus, Mic, Square, Volume2, VolumeX } from 'lucide-react';
import { API_URL } from '../config';

const AiAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
  const initialMessages = [
    {
      role: 'assistant',
      content:
        "Hey there! I'm your stylish AI shopping bestie. I speak English, I’m a little bit funny, and I’m here to help you find outfits, answer questions, and make your shopping feel easy and fun. What are you in the mood for today?"
    }
  ];
    const [messages, setMessages] = useState([
    ...initialMessages
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // File
  const [selectedImagePreview, setSelectedImagePreview] = useState(null); // object URL
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceNoteBlob, setVoiceNoteBlob] = useState(null); // Blob
  const [voiceNoteUrl, setVoiceNoteUrl] = useState(null); // object URL
  const [recordingSeconds, setRecordingSeconds] = useState(0);
    const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const lastSpokenIdxRef = useRef(0);
  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const recordTimerRef = useRef(null);
  const ownedAudioUrlsRef = useRef([]);
  const ttsAudioRef = useRef(null);
  const ttsAudioUrlRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

  useEffect(() => {
    return () => {
      try { if (recordTimerRef.current) clearInterval(recordTimerRef.current); } catch { /* ignore */ }
      try { mediaRecorderRef.current?.stop?.(); } catch { /* ignore */ }
      try { mediaStreamRef.current?.getTracks?.().forEach((t) => t.stop()); } catch { /* ignore */ }
      try { if (voiceNoteUrl) URL.revokeObjectURL(voiceNoteUrl); } catch { /* ignore */ }
      try { ownedAudioUrlsRef.current.forEach((u) => URL.revokeObjectURL(u)); } catch { /* ignore */ }
      try { ttsAudioRef.current?.pause?.(); } catch { /* ignore */ }
      try { if (ttsAudioUrlRef.current) URL.revokeObjectURL(ttsAudioUrlRef.current); } catch { /* ignore */ }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedImage) {
      if (selectedImagePreview) URL.revokeObjectURL(selectedImagePreview);
      setSelectedImagePreview(null);
      return;
    }
    const url = URL.createObjectURL(selectedImage);
    setSelectedImagePreview(url);
    return () => URL.revokeObjectURL(url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedImage]);

  useEffect(() => {
    if (!voiceNoteBlob) {
      if (voiceNoteUrl) URL.revokeObjectURL(voiceNoteUrl);
      setVoiceNoteUrl(null);
      return;
    }
    const url = URL.createObjectURL(voiceNoteBlob);
    setVoiceNoteUrl(url);
    return () => URL.revokeObjectURL(url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voiceNoteBlob]);

  const appendAssistantMessage = (content, products) => {
    setMessages(prev => [...prev, { role: 'assistant', content, ...(products ? { products } : {}) }]);
  };

  const pickGoodGirlVoice = (targetLang) => {
    try {
      if (!('speechSynthesis' in window)) return null;
      const voices = window.speechSynthesis.getVoices?.() || [];
      if (!voices.length) return null;

      const lang = String(targetLang || navigator.language || 'en-US').toLowerCase();
      const byLang = voices.filter(v => (v.lang || '').toLowerCase().startsWith(lang.split('-')[0]));
      const pool = byLang.length ? byLang : voices;

      const preferredNames = [
        'Google UK English Female',
        'Google US English',
        'Microsoft Zira',
        'Zira',
        'Samantha',
        'Victoria',
        'Karen',
      ];

      const byPreferredName = pool.find(v => preferredNames.some(n => (v.name || '').toLowerCase().includes(n.toLowerCase())));
      if (byPreferredName) return byPreferredName;

      const likelyFemale = pool.find(v => /(female|zira|samantha|victoria|karen)/i.test(v.name || ''));
      return likelyFemale || pool[0] || null;
    } catch {
      return null;
    }
  };

  const stopSpeaking = () => {
    try {
      try { window.speechSynthesis?.cancel?.(); } catch { /* ignore */ }
      try { ttsAudioRef.current?.pause?.(); } catch { /* ignore */ }
      try {
        if (ttsAudioRef.current) ttsAudioRef.current.currentTime = 0;
      } catch { /* ignore */ }
      try {
        if (ttsAudioUrlRef.current) {
          URL.revokeObjectURL(ttsAudioUrlRef.current);
          ttsAudioUrlRef.current = null;
        }
      } catch { /* ignore */ }
      setIsSpeaking(false);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    // If user closes the assistant while it's speaking, stop immediately
    if (!isOpen) {
      stopSpeaking();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const speak = (text) => {
    try {
      const content = String(text || '').trim();
      if (!content) return;
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(content);
      // Force English voice for a consistent, friendly "beauty girl" tone
      const ttsLang = 'en-US';
      utter.lang = ttsLang;
      utter.rate = 1.0;
      utter.pitch = 1.15; // slightly brighter "girl" tone
      const v = pickGoodGirlVoice(ttsLang);
      if (v) utter.voice = v;
      utter.onstart = () => setIsSpeaking(true);
      utter.onend = () => setIsSpeaking(false);
      utter.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utter);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (!voiceEnabled) return;
    // Speak only new assistant messages
    if (messages.length <= lastSpokenIdxRef.current) return;
    const lastMsg = messages[messages.length - 1];
    lastSpokenIdxRef.current = messages.length;
    if (lastMsg?.role === 'assistant' && lastMsg?.content) {
      speak(lastMsg.content);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, voiceEnabled]);

  const sendMessage = async ({ text, imageFile, imagePreview, voiceBlob } = {}) => {
    const userMessage = (text ?? input).trim();
    const img = imageFile ?? selectedImage;
    const imgPreview = imagePreview ?? selectedImagePreview;
    const vBlob = voiceBlob ?? voiceNoteBlob;
    const messageAudioUrl = vBlob ? URL.createObjectURL(vBlob) : null;
    if (messageAudioUrl) ownedAudioUrlsRef.current.push(messageAudioUrl);

    if (!userMessage && !img && !vBlob) return;

    setMessages(prev => [
      ...prev,
      {
        role: 'user',
        content: userMessage || (img ? 'Find similar products to this image.' : (vBlob ? 'Voice note' : '')),
        ...(imgPreview ? { imagePreview: imgPreview } : {}),
        ...(messageAudioUrl ? { audioUrl: messageAudioUrl } : {})
      }
    ]);

    // Clear current input/image so the UI feels responsive
    setInput('');
    setSelectedImage(null);
    setVoiceNoteBlob(null);
    setIsLoading(true);

    try {
      // If an image is present, run visual search first
      if (img) {
        const fd = new FormData();
        fd.append('image', img);

        const resp = await fetch(`${API_URL}/api/products/visual-search`, {
          method: 'POST',
          body: fd
        });

        const data = await resp.json();
        if (!resp.ok) {
          throw new Error(data?.message || data?.error || 'Visual search failed');
        }

        const results = data?.results || [];
        if (results.length > 0) {
          appendAssistantMessage('Here are the most similar products I found:', results);
        } else {
          appendAssistantMessage("I couldn't find any visually similar products yet. Please try a different image, or ask an admin to reindex image hashes.");
        }
        return;
      }

      // If a voice note is present, send to backend transcription + reply
      if (vBlob) {
        const fd = new FormData();
        fd.append('audio', new File([vBlob], 'voice.webm', { type: vBlob.type || 'audio/webm' }));
        fd.append('language', 'en');

        const resp = await fetch(`${API_URL}/api/ai/voice`, {
          method: 'POST',
          body: fd
        });

        const data = await resp.json();
        if (!resp.ok) {
          throw new Error(data?.message || data?.error || 'Voice message failed');
        }

        appendAssistantMessage(data.response, data.products);
        return;
      }

      // Text chat
      const response = await fetch(`${API_URL}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, language: 'en' })
      });

      const data = await response.json();

      if (response.ok) {
        appendAssistantMessage(data.response, data.products);
      } else {
        throw new Error(data.message || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error:', error);
      appendAssistantMessage("I apologize, but I'm having trouble right now. Please try again in a moment.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendMessage();
  };

  const startVoiceNote = async () => {
    if (isRecording || isLoading) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const chunks = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (ev) => {
        if (ev.data && ev.data.size > 0) chunks.push(ev.data);
      };

      recorder.onstop = () => {
        try {
          stream.getTracks().forEach((t) => t.stop());
        } catch { /* ignore */ }
        mediaStreamRef.current = null;

        const blob = new Blob(chunks, { type: chunks[0]?.type || 'audio/webm' });
        setVoiceNoteBlob(blob);
      };

      setVoiceNoteBlob(null);
      setRecordingSeconds(0);
      recordTimerRef.current = setInterval(() => setRecordingSeconds((s) => s + 1), 1000);
      setIsRecording(true);
      recorder.start();
    } catch (err) {
      console.error(err);
      appendAssistantMessage("I couldn't access your microphone. Please allow mic permission and try again.");
      setIsRecording(false);
    }
  };

  const stopVoiceNote = async () => {
    if (!isRecording) return;
    try { if (recordTimerRef.current) clearInterval(recordTimerRef.current); } catch { /* ignore */ }
    recordTimerRef.current = null;
    setIsRecording(false);
    try {
      mediaRecorderRef.current?.stop?.();
    } catch {
      // ignore
    }
  };

    return (
        <>
            {/* Floating Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-8 right-8 z-50 p-4 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 hover:scale-105 group border border-gray-100 ${isOpen ? 'bg-white text-gray-800 rotate-90' : 'bg-black text-white'
                    }`}
            >
                {isOpen ? (
                    <X className="w-6 h-6" />
                ) : (
                    <div className="relative">
                        <MessageCircle className="w-6 h-6" />
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                    </div>
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-28 right-8 w-[400px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-10rem)] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-200 border border-gray-100 font-sans">

                    {/* Header */}
                    <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 text-lg leading-tight">Assistant</h3>
                                <p className="text-xs text-gray-500 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                    Online
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setVoiceEnabled((v) => {
                                        const next = !v;
                                        try { window.speechSynthesis?.cancel(); } catch { /* ignore */ }
                                        setIsSpeaking(false);

                                        // When turning voice ON, immediately speak the latest assistant message (if any)
                                        if (next) {
                                            const lastAssistant = [...messages].reverse().find(
                                                (m) => m.role === 'assistant' && m.content
                                            );
                                            if (lastAssistant) {
                                                speak(lastAssistant.content);
                                                lastSpokenIdxRef.current = messages.length;
                                            } else {
                                                lastSpokenIdxRef.current = messages.length;
                                            }
                                        }

                                        return next;
                                    });
                                }}
                                className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-700"
                                title={voiceEnabled ? 'Turn off voice responses' : 'Turn on voice responses'}
                            >
                                {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                            </button>
                            {voiceEnabled && isSpeaking && (
                                <button
                                    type="button"
                                    onClick={stopSpeaking}
                                    className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-700"
                                    title="Stop speaking"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                            <button onClick={() => setMessages([...initialMessages])} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                                Clear
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-gray-50/50 scrollbar-thin scrollbar-thumb-gray-200">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    {msg.imagePreview && (
                                        <div className="mb-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                                            <img src={msg.imagePreview} alt="Uploaded" className="w-40 h-40 object-cover" />
                                        </div>
                                    )}
                                    {msg.audioUrl && (
                                        <div className="mb-2 w-64 max-w-full rounded-xl border border-gray-200 bg-white shadow-sm p-2">
                                            <audio controls src={msg.audioUrl} className="w-full" />
                                        </div>
                                    )}
                                    <div
                                        className={`p-3.5 rounded-2xl text-[15px] leading-relaxed shadow-sm whitespace-pre-line ${
                                            msg.role === 'user'
                                                ? 'bg-black text-white rounded-br-none'
                                                : 'bg-gradient-to-br from-pink-50 via-white to-rose-50 text-gray-800 border border-rose-100 rounded-bl-none'
                                        }`}
                                    >
                                        {msg.role === 'assistant' && (
                                            <p className="text-[11px] uppercase tracking-[0.18em] text-rose-400 font-semibold mb-1">
                                                Your AI stylist
                                            </p>
                                        )}
                                        <p className="text-[14px] leading-relaxed">
                                            {msg.content}
                                        </p>
                                    </div>
                                    {Array.isArray(msg.products) && msg.products.length > 0 && (
                                        <div className="mt-3 grid grid-cols-2 gap-3 w-full">
                                            {msg.products.slice(0, 6).map((p) => (
                                                <a
                                                    key={p.id}
                                                    href={`/product/${p.id}`}
                                                    className="group rounded-xl overflow-hidden border border-gray-100 bg-white shadow-sm hover:shadow-md transition"
                                                >
                                                    <div className="w-full aspect-square bg-gray-50 overflow-hidden">
                                                        <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform" />
                                                    </div>
                                                    <div className="p-2">
                                                        <p className="text-xs font-semibold text-gray-800 line-clamp-2">{p.title}</p>
                                                        <p className="text-[11px] text-gray-500 mt-0.5">
                                                            {Number(p.price).toLocaleString()} RWF
                                                        </p>
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                    <span className="text-[10px] text-gray-400 mt-1 px-1">
                                        {msg.role === 'user' ? 'You' : 'AI Assistant'}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white p-4 rounded-2xl rounded-bl-none shadow-sm border border-gray-100 flex items-center gap-3">
                                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                                    <span className="text-xs text-gray-500">Thinking...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-gray-100">
                        <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) setSelectedImage(file);
                                    e.target.value = '';
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-100 transition-all active:scale-95"
                                title="Upload image to find similar products"
                            >
                                <ImagePlus className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => (isRecording ? stopVoiceNote() : startVoiceNote())}
                                className={`p-3 border rounded-xl transition-all active:scale-95 ${isRecording ? 'bg-black text-white border-black' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'}`}
                                title={isRecording ? 'Stop recording' : 'Record a voice note'}
                                disabled={isLoading}
                            >
                                {isRecording ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                            </button>
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask about products, style..."
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-4 pr-10 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <Sparkles className="w-4 h-4 text-gray-400" />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading || (!input.trim() && !selectedImage && !voiceNoteBlob)}
                                className="p-3 bg-black rounded-xl text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                        {isRecording && (
                            <div className="mt-3 flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
                                <p className="text-[11px] text-gray-700">
                                    Recording… <span className="font-semibold">{recordingSeconds}s</span>
                                </p>
                                <button
                                    type="button"
                                    onClick={stopVoiceNote}
                                    className="text-[11px] font-semibold text-gray-700 hover:text-black"
                                >
                                    Stop
                                </button>
                            </div>
                        )}
                        {voiceNoteUrl && !isRecording && (
                            <div className="mt-3 flex items-center gap-3">
                                <div className="flex-1 rounded-xl border border-gray-200 bg-white p-2">
                                    <audio controls src={voiceNoteUrl} className="w-full" />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setVoiceNoteBlob(null)}
                                    className="text-[11px] text-gray-500 hover:text-gray-800"
                                >
                                    Remove
                                </button>
                            </div>
                        )}
                        {selectedImagePreview && (
                            <div className="mt-3 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                                    <img src={selectedImagePreview} alt="Selected" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[11px] text-gray-600">Image ready. Press send to find similar products.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSelectedImage(null)}
                                    className="text-[11px] text-gray-500 hover:text-gray-800"
                                >
                                    Remove
                                </button>
                            </div>
                        )}
                        <div className="text-center mt-2">
                            <p className="text-[10px] text-gray-300">Powered by AI</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AiAssistant;
