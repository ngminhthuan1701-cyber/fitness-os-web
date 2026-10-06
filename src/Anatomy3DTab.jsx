import React, { useState, useMemo } from 'react';
import * as I from 'lucide-react';
import { muscleGroupsData } from './anatomyData.js';

// Danh sách ảnh mẫu Gym HD để người dùng chọn nhanh nếu không có link ảnh
const PRESET_EXERCISE_IMAGES = [
  { label: 'Tạ đòn Barbell', url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80' },
  { label: 'Tạ đơn Dumbbell', url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=80' },
  { label: 'Kéo Cáp Cable', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80' },
  { label: 'Gánh Squat Khung', url: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80' },
  { label: 'Xà đơn Bodyweight', url: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800&auto=format&fit=crop&q=80' },
  { label: 'Thảm & Bụng Core', url: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=800&auto=format&fit=crop&q=80' }
];

// Hàm chuyển đổi mọi định dạng link YouTube (watch, shorts, youtu.be, embed) sang embed URL
export function formatVideoUrl(url) {
  if (!url) return '';
  url = url.trim();
  if (url.includes('youtube.com/embed/')) return url;
  
  // youtu.be/ID
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  
  // youtube.com/watch?v=ID
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  
  // youtube.com/shorts/ID
  const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortsMatch) return `https://www.youtube.com/embed/${shortsMatch[1]}`;
  
  return url;
}

export default function Anatomy3DTab({
  customExercises = [],
  onCreateExercise,
  onDeleteExercise,
  onAddExerciseToToday,
  colorTheme,
  dark
}) {
  const [selectedMuscleId, setSelectedMuscleId] = useState('chest');
  const [activeView, setActiveView] = useState('front'); // 'front' | 'back'
  const [hoveredMuscleId, setHoveredMuscleId] = useState(null);
  const [activeVideoModal, setActiveVideoModal] = useState(null);
  const [filterQuery, setFilterQuery] = useState('');
  
  // Trạng thái modal tạo bài tập & thêm video mới
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newExForm, setNewExForm] = useState({
    name: '',
    vietnameseName: '',
    muscleGroup: 'chest',
    targetMuscle: '',
    secondaryMuscles: '',
    equipment: 'Tạ đôi Dumbbell',
    level: 'Cơ bản',
    image: PRESET_EXERCISE_IMAGES[0].url,
    videoUrl: '',
    suggestedSets: '3 - 4 sets',
    suggestedReps: '10 - 12 reps',
    instructionsText: '1. Chuẩn bị tư thế vững chắc, giữ cột sống trung tính.\n2. Thực hiện động tác có kiểm soát trong 2-3 giây.\n3. Thở ra khi dùng lực, hít sâu khi hạ tạ.',
    formTips: 'Gồng chắc cơ core và kiểm soát tốc độ hạ tạ.',
    commonMistakes: 'Đung đưa thân người lấy đà hoặc khóa cứng khớp ở đỉnh.'
  });

  // Lấy nhóm cơ hiện tại
  const currentMuscle = useMemo(() => {
    return muscleGroupsData.find(m => m.id === selectedMuscleId) || muscleGroupsData[0];
  }, [selectedMuscleId]);

  // Gộp bài tập mặc định và bài tập tự tạo thuộc nhóm cơ đang chọn
  const allCurrentExercises = useMemo(() => {
    const defaultList = currentMuscle ? currentMuscle.exercises : [];
    const customList = (customExercises || []).filter(ex => ex.muscleGroup === selectedMuscleId);
    return [...customList, ...defaultList];
  }, [currentMuscle, customExercises, selectedMuscleId]);

  // Lọc bài tập theo từ khóa
  const filteredExercises = useMemo(() => {
    if (!filterQuery.trim()) return allCurrentExercises;
    const q = filterQuery.toLowerCase();
    return allCurrentExercises.filter(
      ex =>
        ex.name.toLowerCase().includes(q) ||
        (ex.vietnameseName && ex.vietnameseName.toLowerCase().includes(q)) ||
        (ex.equipment && ex.equipment.toLowerCase().includes(q)) ||
        (ex.targetMuscle && ex.targetMuscle.toLowerCase().includes(q))
    );
  }, [allCurrentExercises, filterQuery]);

  const handleSelectMuscle = (id, targetView) => {
    setSelectedMuscleId(id);
    if (targetView && targetView !== activeView && targetView !== 'both') {
      setActiveView(targetView);
    }
  };

  const handleOpenCreateModal = (presetMuscleId) => {
    setNewExForm(prev => ({
      ...prev,
      muscleGroup: presetMuscleId || selectedMuscleId,
      targetMuscle: currentMuscle ? `Cơ ${currentMuscle.name}` : ''
    }));
    setShowCreateModal(true);
  };

  const handleSaveNewExercise = (e) => {
    e.preventDefault();
    if (!newExForm.name.trim()) {
      alert('Vui lòng nhập tên bài tập!');
      return;
    }

    const formattedVideo = formatVideoUrl(newExForm.videoUrl);

    // Chuyển chuỗi hướng dẫn thành mảng các bước
    const instructions = newExForm.instructionsText
      .split('\n')
      .map(line => line.trim())
      .filter(line => Boolean(line));

    const newExercise = {
      id: 'custom-ex-' + Date.now(),
      name: newExForm.name.trim(),
      vietnameseName: newExForm.vietnameseName.trim() || newExForm.name.trim(),
      muscleGroup: newExForm.muscleGroup,
      targetMuscle: newExForm.targetMuscle.trim() || `Cơ ${muscleGroupsData.find(m => m.id === newExForm.muscleGroup)?.name || 'chính'}`,
      secondaryMuscles: newExForm.secondaryMuscles.split(',').map(s => s.trim()).filter(Boolean),
      equipment: newExForm.equipment,
      level: newExForm.level,
      image: newExForm.image || PRESET_EXERCISE_IMAGES[0].url,
      videoUrl: formattedVideo,
      suggestedSets: newExForm.suggestedSets || '3 - 4 sets',
      suggestedReps: newExForm.suggestedReps || '10 - 12 reps',
      instructions: instructions.length ? instructions : ['Thực hiện động tác đúng kỹ thuật và kiểm soát nhịp thở.'],
      formTips: newExForm.formTips || 'Luôn gồng core và kiểm soát tạ.',
      commonMistakes: newExForm.commonMistakes || 'Dùng quán tính đung đưa người.',
      isCustom: true
    };

    if (onCreateExercise) {
      onCreateExercise(newExercise);
    }

    // Tự động chuyển đến nhóm cơ của bài tập vừa tạo
    setSelectedMuscleId(newExForm.muscleGroup);
    setShowCreateModal(false);

    // Reset form
    setNewExForm({
      name: '',
      vietnameseName: '',
      muscleGroup: selectedMuscleId,
      targetMuscle: '',
      secondaryMuscles: '',
      equipment: 'Tạ đôi Dumbbell',
      level: 'Cơ bản',
      image: PRESET_EXERCISE_IMAGES[0].url,
      videoUrl: '',
      suggestedSets: '3 - 4 sets',
      suggestedReps: '10 - 12 reps',
      instructionsText: '1. Chuẩn bị tư thế vững chắc.\n2. Thực hiện động tác có kiểm soát.\n3. Thở ra khi nâng, hít vào khi hạ.',
      formTips: 'Gồng chắc cơ core và kiểm soát tốc độ.',
      commonMistakes: 'Đung đưa thân người lấy đà.'
    });
  };

  const isHighlighted = (id) => selectedMuscleId === id;
  const isHovered = (id) => hoveredMuscleId === id;

  const getHighlightColor = (id) => {
    if (isHighlighted(id)) return 'var(--primary)';
    if (isHovered(id)) return 'var(--primary-hover, #38bdf8)';
    return dark ? '#1e293b' : '#cbd5e1';
  };

  const getStrokeColor = (id) => {
    if (isHighlighted(id)) return '#ffffff';
    if (isHovered(id)) return '#ffffff';
    return dark ? '#334155' : '#94a3b8';
  };

  return (
    <div className="anatomy-container">
      {/* HEADER TAB */}
      <div className="anatomy-header">
        <div className="anatomy-header-text">
          <div className="anatomy-eyebrow">
            <I.Activity size={18} />
            <span>3D INTERACTIVE MUSCLE ANATOMY</span>
          </div>
          <h1>Mô Hình Giải Phẫu Cơ Bắp 3D & Bài Tập Chuẩn</h1>
          <p>
            Khám phá chi tiết giải phẫu cơ thể người. Nhấp trực tiếp vào từng múi cơ hoặc thêm video bài tập của riêng bạn vào hệ thống.
          </p>
        </div>

        {/* NÚT TẠO BÀI TẬP & NÚT ĐỔI MẶT TRƯỚC / SAU */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            className="primary"
            onClick={() => handleOpenCreateModal(selectedMuscleId)}
            style={{
              padding: '10px 18px',
              borderRadius: 14,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13.5,
              fontWeight: 800,
              boxShadow: '0 4px 14px var(--primary-glow)'
            }}
          >
            <I.PlusCircle size={18} />
            <span>+ Tạo Bài Tập & Thêm Video</span>
          </button>

          <div className="anatomy-view-toggles">
            <button
              className={`view-btn ${activeView === 'front' ? 'active' : ''}`}
              onClick={() => setActiveView('front')}
            >
              <I.Eye size={18} />
              <span>Mặt Trước (Front)</span>
            </button>
            <button
              className={`view-btn ${activeView === 'back' ? 'active' : ''}`}
              onClick={() => setActiveView('back')}
            >
              <I.RotateCw size={18} />
              <span>Mặt Sau (Back)</span>
            </button>
          </div>
        </div>
      </div>

      {/* THANH CHIP CHỌN NHANH NHÓM CƠ */}
      <div className="anatomy-muscle-chips">
        {muscleGroupsData.map((m) => {
          const isSel = m.id === selectedMuscleId;
          const count = m.exercises.length + (customExercises || []).filter(c => c.muscleGroup === m.id).length;
          return (
            <button
              key={m.id}
              className={`muscle-chip ${isSel ? 'active' : ''}`}
              onClick={() => handleSelectMuscle(m.id, m.view)}
              onMouseEnter={() => setHoveredMuscleId(m.id)}
              onMouseLeave={() => setHoveredMuscleId(null)}
            >
              <span className="chip-dot" />
              <span>{m.name}</span>
              <span className="chip-count">{count}</span>
            </button>
          );
        })}
      </div>

      {/* KHÔNG GIAN BỐ CỤC CHÍNH */}
      <div className="anatomy-main-layout">
        {/* CỘT 1: KHUNG MÔ HÌNH 3D BỰ */}
        <div className="anatomy-model-card">
          <div className="model-card-head">
            <div className="model-badge">
              <span className="scanner-indicator" />
              <span>
                GÓC NHÌN: <b>{activeView === 'front' ? 'MẶT TRƯỚC' : 'MẶT SAU'}</b>
              </span>
            </div>
            <span className="model-hint">
              <I.MousePointerClick size={15} /> Nhấp vào múi cơ để xem bài tập
            </span>
          </div>

          <div className="anatomy-stage">
            <div className="stage-grid-overlay" />
            <div className="scanner-ring" />

            <svg
              className="human-body-svg"
              viewBox="0 0 460 720"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <linearGradient id="bodyBaseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={dark ? '#1a2234' : '#e2e8f0'} />
                  <stop offset="100%" stopColor={dark ? '#0f172a' : '#cbd5e1'} />
                </linearGradient>
              </defs>

              <g className="body-silhouette">
                <ellipse cx="230" cy="55" rx="32" ry="40" fill="url(#bodyBaseGrad)" stroke={dark ? '#334155' : '#94a3b8'} strokeWidth="2" />
                <path d="M216,92 L244,92 L248,118 L212,118 Z" fill="url(#bodyBaseGrad)" />
              </g>

              {/* MẶT TRƯỚC (FRONT VIEW) */}
              {activeView === 'front' && (
                <g className="front-muscles">
                  {/* CƠ VAI */}
                  <g
                    className={`muscle-clickable ${isHighlighted('shoulders') ? 'selected' : ''}`}
                    onClick={() => handleSelectMuscle('shoulders', 'front')}
                    onMouseEnter={() => setHoveredMuscleId('shoulders')}
                    onMouseLeave={() => setHoveredMuscleId(null)}
                    title="Cơ Vai (Deltoids)"
                  >
                    <path
                      d="M168,124 C150,132 135,152 132,176 C130,192 140,202 152,198 C160,182 168,162 174,142 Z"
                      fill={getHighlightColor('shoulders')}
                      stroke={getStrokeColor('shoulders')}
                      strokeWidth={isHighlighted('shoulders') ? 3 : 1.5}
                      filter={isHighlighted('shoulders') ? 'url(#glowEffect)' : 'none'}
                    />
                    <path
                      d="M292,124 C310,132 325,152 328,176 C330,192 320,202 308,198 C300,182 292,162 286,142 Z"
                      fill={getHighlightColor('shoulders')}
                      stroke={getStrokeColor('shoulders')}
                      strokeWidth={isHighlighted('shoulders') ? 3 : 1.5}
                      filter={isHighlighted('shoulders') ? 'url(#glowEffect)' : 'none'}
                    />
                  </g>

                  {/* CƠ NGỰC */}
                  <g
                    className={`muscle-clickable ${isHighlighted('chest') ? 'selected' : ''}`}
                    onClick={() => handleSelectMuscle('chest', 'front')}
                    onMouseEnter={() => setHoveredMuscleId('chest')}
                    onMouseLeave={() => setHoveredMuscleId(null)}
                    title="Cơ Ngực (Pectoralis)"
                  >
                    <path
                      d="M178,138 C198,134 222,138 226,144 C228,172 225,200 220,206 C195,212 170,198 162,182 C164,160 170,146 178,138 Z"
                      fill={getHighlightColor('chest')}
                      stroke={getStrokeColor('chest')}
                      strokeWidth={isHighlighted('chest') ? 3 : 1.5}
                      filter={isHighlighted('chest') ? 'url(#glowEffect)' : 'none'}
                    />
                    <path
                      d="M282,138 C262,134 238,138 234,144 C232,172 235,200 240,206 C265,212 290,198 298,182 C296,160 290,146 282,138 Z"
                      fill={getHighlightColor('chest')}
                      stroke={getStrokeColor('chest')}
                      strokeWidth={isHighlighted('chest') ? 3 : 1.5}
                      filter={isHighlighted('chest') ? 'url(#glowEffect)' : 'none'}
                    />
                  </g>

                  {/* CƠ TAY */}
                  <g
                    className={`muscle-clickable ${isHighlighted('arms') ? 'selected' : ''}`}
                    onClick={() => handleSelectMuscle('arms', 'both')}
                    onMouseEnter={() => setHoveredMuscleId('arms')}
                    onMouseLeave={() => setHoveredMuscleId(null)}
                    title="Cơ Tay (Biceps & Forearms)"
                  >
                    <path
                      d="M148,198 C140,212 136,236 138,256 C144,260 156,254 162,238 C166,220 164,204 156,196 Z"
                      fill={getHighlightColor('arms')}
                      stroke={getStrokeColor('arms')}
                      strokeWidth={isHighlighted('arms') ? 3 : 1.5}
                      filter={isHighlighted('arms') ? 'url(#glowEffect)' : 'none'}
                    />
                    <path
                      d="M136,262 C126,280 118,310 112,338 C120,344 132,336 142,306 C148,286 146,270 142,260 Z"
                      fill={getHighlightColor('arms')}
                      stroke={getStrokeColor('arms')}
                      strokeWidth={isHighlighted('arms') ? 3 : 1.5}
                      filter={isHighlighted('arms') ? 'url(#glowEffect)' : 'none'}
                    />
                    <path
                      d="M312,198 C320,212 324,236 322,256 C316,260 304,254 298,238 C294,220 296,204 304,196 Z"
                      fill={getHighlightColor('arms')}
                      stroke={getStrokeColor('arms')}
                      strokeWidth={isHighlighted('arms') ? 3 : 1.5}
                      filter={isHighlighted('arms') ? 'url(#glowEffect)' : 'none'}
                    />
                    <path
                      d="M324,262 C334,280 342,310 348,338 C340,344 328,336 318,306 C312,286 314,270 318,260 Z"
                      fill={getHighlightColor('arms')}
                      stroke={getStrokeColor('arms')}
                      strokeWidth={isHighlighted('arms') ? 3 : 1.5}
                      filter={isHighlighted('arms') ? 'url(#glowEffect)' : 'none'}
                    />
                  </g>

                  {/* CƠ BỤNG */}
                  <g
                    className={`muscle-clickable ${isHighlighted('core') ? 'selected' : ''}`}
                    onClick={() => handleSelectMuscle('core', 'front')}
                    onMouseEnter={() => setHoveredMuscleId('core')}
                    onMouseLeave={() => setHoveredMuscleId(null)}
                    title="Cơ Bụng (Abs & Core)"
                  >
                    <rect x="206" y="214" width="22" height="24" rx="4" fill={getHighlightColor('core')} stroke={getStrokeColor('core')} strokeWidth={isHighlighted('core') ? 2.5 : 1.5} />
                    <rect x="232" y="214" width="22" height="24" rx="4" fill={getHighlightColor('core')} stroke={getStrokeColor('core')} strokeWidth={isHighlighted('core') ? 2.5 : 1.5} />
                    <rect x="206" y="242" width="22" height="24" rx="4" fill={getHighlightColor('core')} stroke={getStrokeColor('core')} strokeWidth={isHighlighted('core') ? 2.5 : 1.5} />
                    <rect x="232" y="242" width="22" height="24" rx="4" fill={getHighlightColor('core')} stroke={getStrokeColor('core')} strokeWidth={isHighlighted('core') ? 2.5 : 1.5} />
                    <rect x="206" y="270" width="22" height="26" rx="4" fill={getHighlightColor('core')} stroke={getStrokeColor('core')} strokeWidth={isHighlighted('core') ? 2.5 : 1.5} />
                    <rect x="232" y="270" width="22" height="26" rx="4" fill={getHighlightColor('core')} stroke={getStrokeColor('core')} strokeWidth={isHighlighted('core') ? 2.5 : 1.5} />
                    <path d="M178,216 C190,224 196,248 194,276 C184,272 178,252 174,232 Z" fill={getHighlightColor('core')} stroke={getStrokeColor('core')} strokeWidth="1.5" />
                    <path d="M282,216 C270,224 264,248 266,276 C276,272 282,252 286,232 Z" fill={getHighlightColor('core')} stroke={getStrokeColor('core')} strokeWidth="1.5" />
                  </g>

                  {/* CƠ ĐÙI TRƯỚC */}
                  <g
                    className={`muscle-clickable ${isHighlighted('legs') ? 'selected' : ''}`}
                    onClick={() => handleSelectMuscle('legs', 'both')}
                    onMouseEnter={() => setHoveredMuscleId('legs')}
                    onMouseLeave={() => setHoveredMuscleId(null)}
                    title="Cơ Đùi Trước (Quadriceps)"
                  >
                    <path
                      d="M188,330 C172,350 162,390 164,440 C172,475 186,490 200,494 C216,488 222,460 220,410 C218,365 210,336 188,330 Z"
                      fill={getHighlightColor('legs')}
                      stroke={getStrokeColor('legs')}
                      strokeWidth={isHighlighted('legs') ? 3 : 1.5}
                      filter={isHighlighted('legs') ? 'url(#glowEffect)' : 'none'}
                    />
                    <path
                      d="M272,330 C288,350 298,390 296,440 C288,475 274,490 260,494 C244,488 238,460 240,410 C242,365 250,336 272,330 Z"
                      fill={getHighlightColor('legs')}
                      stroke={getStrokeColor('legs')}
                      strokeWidth={isHighlighted('legs') ? 3 : 1.5}
                      filter={isHighlighted('legs') ? 'url(#glowEffect)' : 'none'}
                    />
                    <path
                      d="M182,518 C176,540 172,570 178,610 C186,630 196,628 200,600 C204,570 206,536 198,518 Z"
                      fill={getHighlightColor('legs')}
                      stroke={getStrokeColor('legs')}
                      strokeWidth={isHighlighted('legs') ? 2.5 : 1.5}
                    />
                    <path
                      d="M278,518 C284,540 288,570 282,610 C274,630 264,628 260,600 C256,570 254,536 262,518 Z"
                      fill={getHighlightColor('legs')}
                      stroke={getStrokeColor('legs')}
                      strokeWidth={isHighlighted('legs') ? 2.5 : 1.5}
                    />
                  </g>
                </g>
              )}

              {/* MẶT SAU (BACK VIEW) */}
              {activeView === 'back' && (
                <g className="back-muscles">
                  {/* CƠ LƯNG & XÔ */}
                  <g
                    className={`muscle-clickable ${isHighlighted('back') ? 'selected' : ''}`}
                    onClick={() => handleSelectMuscle('back', 'back')}
                    onMouseEnter={() => setHoveredMuscleId('back')}
                    onMouseLeave={() => setHoveredMuscleId(null)}
                    title="Cơ Lưng & Xô (Lats & Traps)"
                  >
                    <path
                      d="M230,118 L272,136 L254,204 L230,224 L206,204 L188,136 Z"
                      fill={getHighlightColor('back')}
                      stroke={getStrokeColor('back')}
                      strokeWidth={isHighlighted('back') ? 3 : 1.5}
                      filter={isHighlighted('back') ? 'url(#glowEffect)' : 'none'}
                    />
                    <path
                      d="M188,160 C170,188 166,236 172,282 C184,286 206,274 212,250 C216,216 210,180 188,160 Z"
                      fill={getHighlightColor('back')}
                      stroke={getStrokeColor('back')}
                      strokeWidth={isHighlighted('back') ? 3 : 1.5}
                      filter={isHighlighted('back') ? 'url(#glowEffect)' : 'none'}
                    />
                    <path
                      d="M272,160 C290,188 294,236 288,282 C276,286 254,274 248,250 C244,216 250,180 272,160 Z"
                      fill={getHighlightColor('back')}
                      stroke={getStrokeColor('back')}
                      strokeWidth={isHighlighted('back') ? 3 : 1.5}
                      filter={isHighlighted('back') ? 'url(#glowEffect)' : 'none'}
                    />
                    <path
                      d="M212,260 L248,260 L246,310 L214,310 Z"
                      fill={getHighlightColor('back')}
                      stroke={getStrokeColor('back')}
                      strokeWidth={isHighlighted('back') ? 2.5 : 1.5}
                    />
                  </g>

                  {/* CƠ VAI SAU */}
                  <g
                    className={`muscle-clickable ${isHighlighted('shoulders') ? 'selected' : ''}`}
                    onClick={() => handleSelectMuscle('shoulders', 'back')}
                    onMouseEnter={() => setHoveredMuscleId('shoulders')}
                    onMouseLeave={() => setHoveredMuscleId(null)}
                    title="Cơ Vai Sau (Rear Delts)"
                  >
                    <path
                      d="M168,130 C154,142 142,164 140,186 C152,192 162,176 172,154 Z"
                      fill={getHighlightColor('shoulders')}
                      stroke={getStrokeColor('shoulders')}
                      strokeWidth={isHighlighted('shoulders') ? 3 : 1.5}
                    />
                    <path
                      d="M292,130 C306,142 318,164 320,186 C308,192 298,176 288,154 Z"
                      fill={getHighlightColor('shoulders')}
                      stroke={getStrokeColor('shoulders')}
                      strokeWidth={isHighlighted('shoulders') ? 3 : 1.5}
                    />
                  </g>

                  {/* CƠ TAY SAU */}
                  <g
                    className={`muscle-clickable ${isHighlighted('arms') ? 'selected' : ''}`}
                    onClick={() => handleSelectMuscle('arms', 'both')}
                    onMouseEnter={() => setHoveredMuscleId('arms')}
                    onMouseLeave={() => setHoveredMuscleId(null)}
                    title="Cơ Tay Sau (Triceps)"
                  >
                    <path
                      d="M142,190 C136,212 134,238 138,258 C148,260 156,246 158,226 C160,206 154,194 142,190 Z"
                      fill={getHighlightColor('arms')}
                      stroke={getStrokeColor('arms')}
                      strokeWidth={isHighlighted('arms') ? 3 : 1.5}
                    />
                    <path
                      d="M318,190 C324,212 326,238 322,258 C312,260 304,246 302,226 C300,206 306,194 318,190 Z"
                      fill={getHighlightColor('arms')}
                      stroke={getStrokeColor('arms')}
                      strokeWidth={isHighlighted('arms') ? 3 : 1.5}
                    />
                  </g>

                  {/* CƠ MÔNG & ĐÙI SAU */}
                  <g
                    className={`muscle-clickable ${isHighlighted('legs') ? 'selected' : ''}`}
                    onClick={() => handleSelectMuscle('legs', 'back')}
                    onMouseEnter={() => setHoveredMuscleId('legs')}
                    onMouseLeave={() => setHoveredMuscleId(null)}
                    title="Cơ Mông & Đùi Sau (Glutes & Hamstrings)"
                  >
                    <ellipse
                      cx="206"
                      cy="348"
                      rx="32"
                      ry="34"
                      fill={getHighlightColor('legs')}
                      stroke={getStrokeColor('legs')}
                      strokeWidth={isHighlighted('legs') ? 3 : 1.5}
                      filter={isHighlighted('legs') ? 'url(#glowEffect)' : 'none'}
                    />
                    <ellipse
                      cx="254"
                      cy="348"
                      rx="32"
                      ry="34"
                      fill={getHighlightColor('legs')}
                      stroke={getStrokeColor('legs')}
                      strokeWidth={isHighlighted('legs') ? 3 : 1.5}
                      filter={isHighlighted('legs') ? 'url(#glowEffect)' : 'none'}
                    />
                    <path
                      d="M182,388 C174,420 172,460 178,490 C192,494 208,488 214,460 C218,426 216,392 208,384 Z"
                      fill={getHighlightColor('legs')}
                      stroke={getStrokeColor('legs')}
                      strokeWidth={isHighlighted('legs') ? 3 : 1.5}
                    />
                    <path
                      d="M278,388 C286,420 288,460 282,490 C268,494 252,488 246,460 C242,426 244,392 252,384 Z"
                      fill={getHighlightColor('legs')}
                      stroke={getStrokeColor('legs')}
                      strokeWidth={isHighlighted('legs') ? 3 : 1.5}
                    />
                    <path
                      d="M174,518 C166,540 168,574 176,610 C186,626 198,620 202,596 C206,566 204,534 196,518 Z"
                      fill={getHighlightColor('legs')}
                      stroke={getStrokeColor('legs')}
                      strokeWidth={isHighlighted('legs') ? 3 : 1.5}
                    />
                    <path
                      d="M286,518 C294,540 292,574 284,610 C274,626 262,620 258,596 C254,566 256,534 264,518 Z"
                      fill={getHighlightColor('legs')}
                      stroke={getStrokeColor('legs')}
                      strokeWidth={isHighlighted('legs') ? 3 : 1.5}
                    />
                  </g>
                </g>
              )}
            </svg>

            <div className="stage-hud-info">
              <span className="hud-target-label">ĐANG CHỌN:</span>
              <strong className="hud-target-name">{currentMuscle.name}</strong>
              <span className="hud-target-latin">({currentMuscle.latinName})</span>
            </div>
          </div>
        </div>

        {/* CỘT 2: CHI TIẾT NHÓM CƠ & BÀI TẬP */}
        <div className="anatomy-details-card">
          {/* BANNER TỔNG QUAN */}
          <div className="muscle-overview-banner">
            <div className="muscle-banner-head">
              <div>
                <div className="muscle-latin-badge">{currentMuscle.latinName}</div>
                <h2>Cơ {currentMuscle.name}</h2>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div className="muscle-exercise-counter">
                  <b>{allCurrentExercises.length}</b>
                  <span>bài tập</span>
                </div>
                <button
                  className="btn-secondary"
                  onClick={() => handleOpenCreateModal(selectedMuscleId)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 12,
                    fontSize: 12.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontWeight: 800
                  }}
                  title="Thêm bài tập mới cho nhóm cơ này"
                >
                  <I.Plus size={15} /> Thêm bài
                </button>
              </div>
            </div>

            <p className="muscle-description">{currentMuscle.summary}</p>

            <div className="sub-muscles-tags">
              <span className="sub-tag-label">Cấu thành:</span>
              {currentMuscle.subMuscles.map((sub, idx) => (
                <span key={idx} className="sub-muscle-pill">
                  {sub}
                </span>
              ))}
            </div>
          </div>

          {/* THANH TÌM KIẾM */}
          <div className="exercise-filter-box">
            <I.Search size={17} className="search-icon" />
            <input
              type="text"
              placeholder={`Tìm bài tập cơ ${currentMuscle.name} (Bench Press, Squat, Tạ đơn, Video...)`}
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
            />
            {filterQuery && (
              <button className="clear-btn" onClick={() => setFilterQuery('')}>
                <I.X size={15} />
              </button>
            )}
          </div>

          {/* DANH SÁCH BÀI TẬP */}
          <div className="exercises-catalog">
            {filteredExercises.map((ex) => (
              <div key={ex.id} className="exercise-card-3d">
                <div className="exercise-media-header">
                  <img src={ex.image} alt={ex.name} className="exercise-thumb" loading="lazy" />
                  <div className="exercise-media-overlay">
                    <span className="badge-equipment">{ex.equipment}</span>
                    <span className="badge-level">{ex.level}</span>
                    {ex.isCustom && (
                      <span
                        style={{
                          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                          color: '#fff',
                          fontSize: 11,
                          fontWeight: 900,
                          padding: '3px 9px',
                          borderRadius: 8,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4
                        }}
                      >
                        ⭐ BÀI TẬP CỦA BẠN
                      </span>
                    )}
                  </div>

                  {ex.videoUrl && (
                    <button
                      className="quick-video-play-btn"
                      onClick={() => setActiveVideoModal(ex)}
                      title="Xem Video Hướng Dẫn Kỹ Thuật"
                    >
                      <I.Play size={22} fill="#ffffff" />
                    </button>
                  )}
                </div>

                <div className="exercise-body">
                  <div className="exercise-title-row">
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <h3>{ex.name}</h3>
                        {ex.isCustom && onDeleteExercise && (
                          <button
                            onClick={() => {
                              if (confirm(`Bạn có chắc muốn xóa bài tập "${ex.name}"?`)) {
                                onDeleteExercise(ex.id);
                              }
                            }}
                            title="Xóa bài tập tự tạo này"
                            style={{
                              background: 'transparent',
                              border: 0,
                              color: '#ef4444',
                              cursor: 'pointer',
                              padding: 4
                            }}
                          >
                            <I.Trash2 size={16} />
                          </button>
                        )}
                      </div>
                      <div className="exercise-vn-name">{ex.vietnameseName}</div>
                    </div>
                    <div className="exercise-stats-box">
                      <b>{ex.suggestedSets}</b>
                      <span>{ex.suggestedReps}</span>
                    </div>
                  </div>

                  <div className="exercise-target-line">
                    <I.Target size={15} color="var(--primary)" />
                    <span>
                      Tác động chính: <b>{ex.targetMuscle}</b>
                    </span>
                  </div>

                  <div className="exercise-steps-accordion">
                    <div className="steps-title">
                      <I.ListOrdered size={15} /> Các bước thực hiện chuẩn:
                    </div>
                    <ol className="steps-list">
                      {ex.instructions.map((step, sIdx) => (
                        <li key={sIdx}>{step}</li>
                      ))}
                    </ol>
                  </div>

                  <div className="exercise-cues-grid">
                    <div className="cue-box tip">
                      <I.CheckCircle2 size={15} />
                      <div>
                        <b>Mẹo giữ form:</b> {ex.formTips}
                      </div>
                    </div>
                    {ex.commonMistakes && (
                      <div className="cue-box warning">
                        <I.AlertTriangle size={15} />
                        <div>
                          <b>Lỗi sai cần tránh:</b> {ex.commonMistakes}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="exercise-action-buttons">
                    {ex.videoUrl ? (
                      <button
                        className="btn-watch-video"
                        onClick={() => setActiveVideoModal(ex)}
                      >
                        <I.Film size={16} />
                        <span>Xem Video HD Kỹ Thuật</span>
                      </button>
                    ) : (
                      <button
                        className="btn-watch-video"
                        style={{ opacity: 0.6, cursor: 'default' }}
                        title="Bài tập chưa có link video"
                      >
                        <I.VideoOff size={16} />
                        <span>Chưa có video</span>
                      </button>
                    )}

                    <button
                      className="btn-add-workout"
                      onClick={() => onAddExerciseToToday && onAddExerciseToToday(ex)}
                    >
                      <I.PlusCircle size={16} />
                      <span>Thêm vào lịch tập hôm nay</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredExercises.length === 0 && (
              <div className="empty-exercise-box">
                <I.Dumbbell size={38} />
                <p>Không tìm thấy bài tập nào khớp với từ khóa "{filterQuery}".</p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn-secondary" onClick={() => setFilterQuery('')}>
                    Xóa bộ lọc
                  </button>
                  <button className="primary" onClick={() => handleOpenCreateModal(selectedMuscleId)}>
                    <I.Plus size={16} /> Tạo bài tập mới ngay
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= MODAL TẠO BÀI TẬP & THÊM VIDEO MỚI ================= */}
      {showCreateModal && (
        <div className="modal-backdrop" onClick={() => setShowCreateModal(false)}>
          <div
            className="modal modal-lg"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 760, width: '95vw', maxHeight: '90vh', overflowY: 'auto' }}
          >
            <div className="modal-head">
              <div>
                <span className="badge-level" style={{ fontSize: 11, marginBottom: 4, display: 'inline-block' }}>
                  TỰ TẠO BÀI TẬP CỦA BẠN
                </span>
                <h2 style={{ margin: 0 }}>Thêm Bài Tập & Video Hướng Dẫn</h2>
              </div>
              <button className="icon-btn" onClick={() => setShowCreateModal(false)}>
                <I.X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveNewExercise} style={{ display: 'grid', gap: 16, marginTop: 14 }}>
              {/* Tên bài tập */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
                <div className="input-row">
                  <label>Tên bài tập (Tiếng Anh hoặc tên gốc) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Incline Dumbbell Fly"
                    value={newExForm.name}
                    onChange={(e) => setNewExForm({ ...newExForm, name: e.target.value })}
                  />
                </div>
                <div className="input-row">
                  <label>Tên tiếng Việt</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Ép ngực dốc tạ đơn"
                    value={newExForm.vietnameseName}
                    onChange={(e) => setNewExForm({ ...newExForm, vietnameseName: e.target.value })}
                  />
                </div>
              </div>

              {/* Chọn Nhóm cơ & Cơ chi tiết */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
                <div className="input-row">
                  <label>Nhóm cơ chính trên mô hình 3D *</label>
                  <select
                    value={newExForm.muscleGroup}
                    onChange={(e) => setNewExForm({ ...newExForm, muscleGroup: e.target.value })}
                    style={{
                      padding: 12,
                      borderRadius: 12,
                      border: '1px solid var(--border-card)',
                      background: 'var(--bg-subtle)',
                      color: 'var(--text-main)',
                      fontWeight: 700
                    }}
                  >
                    {muscleGroupsData.map(m => (
                      <option key={m.id} value={m.id}>
                        Cơ {m.name} ({m.latinName})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-row">
                  <label>Vùng cơ tác động chi tiết</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Ngực trên, rãnh ngực trong"
                    value={newExForm.targetMuscle}
                    onChange={(e) => setNewExForm({ ...newExForm, targetMuscle: e.target.value })}
                  />
                </div>

                <div className="input-row">
                  <label>Thiết bị tập</label>
                  <select
                    value={newExForm.equipment}
                    onChange={(e) => setNewExForm({ ...newExForm, equipment: e.target.value })}
                    style={{
                      padding: 12,
                      borderRadius: 12,
                      border: '1px solid var(--border-card)',
                      background: 'var(--bg-subtle)',
                      color: 'var(--text-main)',
                      fontWeight: 700
                    }}
                  >
                    <option value="Đòn tạ Barbell">Đòn tạ Barbell</option>
                    <option value="Tạ đôi Dumbbell">Tạ đôi Dumbbell</option>
                    <option value="Máy kéo cáp Cable">Máy kéo cáp Cable</option>
                    <option value="Máy tập Machine">Máy tập Machine</option>
                    <option value="Thân người Bodyweight">Thân người Bodyweight</option>
                    <option value="Tạ ấm Kettlebell">Tạ ấm Kettlebell</option>
                    <option value="Khác">Thiết bị khác</option>
                  </select>
                </div>
              </div>

              {/* ĐƯỜNG LINK VIDEO YOUTUBE */}
              <div className="input-row" style={{ background: 'var(--bg-subtle)', padding: 16, borderRadius: 16, border: '1px solid var(--border-subtle)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <I.Film size={16} color="var(--primary)" />
                  <b>Đường link Video Hướng Dẫn (YouTube watch / shorts / embed)</b>
                </label>
                <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                  <input
                    type="url"
                    placeholder="Dán link YouTube (ví dụ: https://www.youtube.com/watch?v=... hoặc https://youtu.be/...)"
                    value={newExForm.videoUrl}
                    onChange={(e) => setNewExForm({ ...newExForm, videoUrl: e.target.value })}
                    style={{ flex: 1 }}
                  />
                  {newExForm.videoUrl && (
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => {
                        const embed = formatVideoUrl(newExForm.videoUrl);
                        if (embed) {
                          setActiveVideoModal({
                            name: newExForm.name || 'Xem thử video',
                            vietnameseName: newExForm.vietnameseName || '',
                            videoUrl: embed,
                            equipment: newExForm.equipment,
                            suggestedSets: newExForm.suggestedSets,
                            suggestedReps: newExForm.suggestedReps,
                            formTips: newExForm.formTips
                          });
                        }
                      }}
                      style={{ padding: '0 16px', fontSize: 13, whiteSpace: 'nowrap' }}
                    >
                      <I.Play size={15} /> Xem thử
                    </button>
                  )}
                </div>
                <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: 4 }}>
                  💡 Hệ thống tự động chuyển đổi link YouTube thông thường thành video xem trực tiếp chuẩn HD.
                </small>
              </div>

              {/* HÌNH ẢNH MINH HỌA & PRESETS */}
              <div className="input-row">
                <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <I.Image size={16} /> Link hình ảnh minh họa (hoặc chọn ảnh mẫu bên dưới)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newExForm.image}
                  onChange={(e) => setNewExForm({ ...newExForm, image: e.target.value })}
                />
                
                {/* Chọn nhanh ảnh mẫu */}
                <div style={{ display: 'flex', gap: 8, marginTop: 8, overflowX: 'auto', paddingBottom: 6 }}>
                  {PRESET_EXERCISE_IMAGES.map((preset, pIdx) => (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={() => setNewExForm({ ...newExForm, image: preset.url })}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '4px 10px',
                        borderRadius: 10,
                        fontSize: 11.5,
                        background: newExForm.image === preset.url ? 'var(--primary-light)' : 'var(--bg-subtle)',
                        border: `1px solid ${newExForm.image === preset.url ? 'var(--primary)' : 'var(--border-card)'}`,
                        color: newExForm.image === preset.url ? 'var(--primary)' : 'var(--text-main)',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <img src={preset.url} alt="" style={{ width: 16, height: 16, borderRadius: 4, objectFit: 'cover' }} />
                      <span>{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* THÔNG SỐ SETS & REPS */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
                <div className="input-row">
                  <label>Số hiệp (Sets) đề xuất</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: 3 - 4 sets"
                    value={newExForm.suggestedSets}
                    onChange={(e) => setNewExForm({ ...newExForm, suggestedSets: e.target.value })}
                  />
                </div>
                <div className="input-row">
                  <label>Số lần (Reps) đề xuất</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: 8 - 12 reps"
                    value={newExForm.suggestedReps}
                    onChange={(e) => setNewExForm({ ...newExForm, suggestedReps: e.target.value })}
                  />
                </div>
                <div className="input-row">
                  <label>Độ khó</label>
                  <select
                    value={newExForm.level}
                    onChange={(e) => setNewExForm({ ...newExForm, level: e.target.value })}
                    style={{
                      padding: 12,
                      borderRadius: 12,
                      border: '1px solid var(--border-card)',
                      background: 'var(--bg-subtle)',
                      color: 'var(--text-main)',
                      fontWeight: 700
                    }}
                  >
                    <option value="Cơ bản">Cơ bản</option>
                    <option value="Trung bình">Trung bình</option>
                    <option value="Nâng cao">Nâng cao</option>
                  </select>
                </div>
              </div>

              {/* HƯỚNG DẪN CÁC BƯỚC */}
              <div className="input-row">
                <label>Các bước thực hiện chuẩn (mỗi bước 1 dòng)</label>
                <textarea
                  rows={3}
                  value={newExForm.instructionsText}
                  onChange={(e) => setNewExForm({ ...newExForm, instructionsText: e.target.value })}
                  placeholder="1. Bước chuẩn bị...&#10;2. Thực hiện nâng tạ...&#10;3. Hạ tạ có kiểm soát..."
                />
              </div>

              {/* MẸO GIỮ FORM & LỖI SAI */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
                <div className="input-row">
                  <label>Mẹo giữ form chuẩn (Form Tip)</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Ghì chặt bả vai, cùi chỏ hướng vào trong 45 độ"
                    value={newExForm.formTips}
                    onChange={(e) => setNewExForm({ ...newExForm, formTips: e.target.value })}
                  />
                </div>
                <div className="input-row">
                  <label>Lỗi sai cần tránh</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Đung đưa lưng, nhấc gót chân"
                    value={newExForm.commonMistakes}
                    onChange={(e) => setNewExForm({ ...newExForm, commonMistakes: e.target.value })}
                  />
                </div>
              </div>

              {/* NÚT LƯU & HỦY */}
              <div className="modal-foot" style={{ marginTop: 10 }}>
                <button type="button" className="secondary" onClick={() => setShowCreateModal(false)}>
                  Hủy
                </button>
                <button type="submit" className="primary" style={{ padding: '12px 24px', fontSize: 14, fontWeight: 800 }}>
                  <I.Save size={16} /> Lưu Bài Tập & Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL XEM VIDEO KỸ THUẬT HD ================= */}
      {activeVideoModal && (
        <div className="modal-backdrop" onClick={() => setActiveVideoModal(null)}>
          <div className="modal modal-video-hd" onClick={(e) => e.stopPropagation()}>
            <div className="modal-video-head">
              <div className="video-head-titles">
                <span className="video-badge">VIDEO HƯỚNG DẪN KỸ THUẬT</span>
                <h2>{activeVideoModal.name}</h2>
                {activeVideoModal.vietnameseName && (
                  <span className="video-vn-sub">({activeVideoModal.vietnameseName})</span>
                )}
              </div>
              <button
                className="close-video-modal"
                onClick={() => setActiveVideoModal(null)}
                title="Đóng video"
              >
                <I.X size={22} />
              </button>
            </div>

            <div className="video-player-container">
              <iframe
                src={`${activeVideoModal.videoUrl}?autoplay=1&rel=0`}
                title={activeVideoModal.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="exercise-video-iframe"
              />
            </div>

            <div className="video-quick-summary">
              <div className="summary-item">
                <I.Dumbbell size={16} color="var(--primary)" />
                <span>
                  Thiết bị: <b>{activeVideoModal.equipment}</b>
                </span>
              </div>
              <div className="summary-item">
                <I.Repeat size={16} color="var(--primary)" />
                <span>
                  Đề xuất: <b>{activeVideoModal.suggestedSets} x {activeVideoModal.suggestedReps}</b>
                </span>
              </div>
              {activeVideoModal.formTips && (
                <div className="summary-item">
                  <I.CheckCircle2 size={16} color="var(--primary)" />
                  <span>{activeVideoModal.formTips}</span>
                </div>
              )}
            </div>

            <div className="modal-video-footer">
              <button
                className="primary"
                onClick={() => {
                  if (onAddExerciseToToday) onAddExerciseToToday(activeVideoModal);
                  setActiveVideoModal(null);
                }}
              >
                <I.Plus size={16} /> Thêm bài này vào Lịch tập hôm nay
              </button>
              <button className="secondary" onClick={() => setActiveVideoModal(null)}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
