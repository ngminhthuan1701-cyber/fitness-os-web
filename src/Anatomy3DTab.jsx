import React, { useState, useMemo } from 'react';
import * as I from 'lucide-react';
import { muscleGroupsData } from './anatomyData.js';

export default function Anatomy3DTab({ onAddExerciseToToday, colorTheme, dark }) {
  const [selectedMuscleId, setSelectedMuscleId] = useState('chest');
  const [activeView, setActiveView] = useState('front'); // 'front' | 'back'
  const [hoveredMuscleId, setHoveredMuscleId] = useState(null);
  const [activeVideoModal, setActiveVideoModal] = useState(null);
  const [filterQuery, setFilterQuery] = useState('');

  // Lấy nhóm cơ hiện tại
  const currentMuscle = useMemo(() => {
    return muscleGroupsData.find(m => m.id === selectedMuscleId) || muscleGroupsData[0];
  }, [selectedMuscleId]);

  // Lọc bài tập
  const filteredExercises = useMemo(() => {
    if (!currentMuscle) return [];
    if (!filterQuery.trim()) return currentMuscle.exercises;
    const q = filterQuery.toLowerCase();
    return currentMuscle.exercises.filter(
      ex =>
        ex.name.toLowerCase().includes(q) ||
        ex.vietnameseName.toLowerCase().includes(q) ||
        ex.equipment.toLowerCase().includes(q)
    );
  }, [currentMuscle, filterQuery]);

  const handleSelectMuscle = (id, targetView) => {
    setSelectedMuscleId(id);
    if (targetView && targetView !== activeView && targetView !== 'both') {
      setActiveView(targetView);
    }
  };

  const isHighlighted = (id) => selectedMuscleId === id;
  const isHovered = (id) => hoveredMuscleId === id;

  // Lấy màu sắc highlight dựa theo theme hoặc mặc định
  const getHighlightColor = (id) => {
    if (isHighlighted(id)) {
      return 'var(--primary)';
    }
    if (isHovered(id)) {
      return 'var(--primary-hover, #38bdf8)';
    }
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
            Mô hình trực quan kích thước lớn. Nhấp trực tiếp vào từng vùng cơ trên cơ thể để khám phá cấu trúc giải phẫu, video chuyển động và kỹ thuật tập luyện chuẩn y khoa.
          </p>
        </div>

        {/* BỘ CHUYỂN GÓC NHÌN MẶT TRƯỚC / MẶT SAU */}
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

      {/* THANH CHIP CHỌN NHANH NHÓM CƠ */}
      <div className="anatomy-muscle-chips">
        {muscleGroupsData.map((m) => {
          const isSel = m.id === selectedMuscleId;
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
              <span className="chip-count">{m.exercises.length}</span>
            </button>
          );
        })}
      </div>

      {/* KHÔNG GIAN CHÍNH: 2 CỘT (MÔ HÌNH 3D BỰ BÊN TRÁI & BẢI TẬP BÊN PHẢI) */}
      <div className="anatomy-main-layout">
        {/* CỘT 1: KHUNG MÔ HÌNH 3D KÍCH THƯỚC LỚN */}
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

          {/* SÂN KHẤU 3D INTERACTIVE */}
          <div className="anatomy-stage">
            {/* Lưới tọa độ không gian 3D nền */}
            <div className="stage-grid-overlay" />

            {/* Vòng quét Hologram */}
            <div className="scanner-ring" />

            {/* SVG MÔ HÌNH CƠ THỂ NGƯỜI TO LỚN */}
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

              {/* KHUNG CƠ THỂ CHUNG (ĐẦU, CỔ) */}
              <g className="body-silhouette">
                {/* Đầu */}
                <ellipse cx="230" cy="55" rx="32" ry="40" fill="url(#bodyBaseGrad)" stroke={dark ? '#334155' : '#94a3b8'} strokeWidth="2" />
                {/* Cổ */}
                <path d="M216,92 L244,92 L248,118 L212,118 Z" fill="url(#bodyBaseGrad)" />
              </g>

              {/* ======================= MẶT TRƯỚC (FRONT VIEW) ======================= */}
              {activeView === 'front' && (
                <g className="front-muscles">
                  {/* CƠ VAI TRƯỚC VÀ GIỮA (DELTOIDS) */}
                  <g
                    className={`muscle-clickable ${isHighlighted('shoulders') ? 'selected' : ''}`}
                    onClick={() => handleSelectMuscle('shoulders', 'front')}
                    onMouseEnter={() => setHoveredMuscleId('shoulders')}
                    onMouseLeave={() => setHoveredMuscleId(null)}
                    title="Cơ Vai (Deltoids)"
                  >
                    {/* Vai trái */}
                    <path
                      d="M168,124 C150,132 135,152 132,176 C130,192 140,202 152,198 C160,182 168,162 174,142 Z"
                      fill={getHighlightColor('shoulders')}
                      stroke={getStrokeColor('shoulders')}
                      strokeWidth={isHighlighted('shoulders') ? 3 : 1.5}
                      filter={isHighlighted('shoulders') ? 'url(#glowEffect)' : 'none'}
                    />
                    {/* Vai phải */}
                    <path
                      d="M292,124 C310,132 325,152 328,176 C330,192 320,202 308,198 C300,182 292,162 286,142 Z"
                      fill={getHighlightColor('shoulders')}
                      stroke={getStrokeColor('shoulders')}
                      strokeWidth={isHighlighted('shoulders') ? 3 : 1.5}
                      filter={isHighlighted('shoulders') ? 'url(#glowEffect)' : 'none'}
                    />
                  </g>

                  {/* CƠ NGỰC (CHEST / PECTORALS) */}
                  <g
                    className={`muscle-clickable ${isHighlighted('chest') ? 'selected' : ''}`}
                    onClick={() => handleSelectMuscle('chest', 'front')}
                    onMouseEnter={() => setHoveredMuscleId('chest')}
                    onMouseLeave={() => setHoveredMuscleId(null)}
                    title="Cơ Ngực (Pectoralis)"
                  >
                    {/* Ngực trái */}
                    <path
                      d="M178,138 C198,134 222,138 226,144 C228,172 225,200 220,206 C195,212 170,198 162,182 C164,160 170,146 178,138 Z"
                      fill={getHighlightColor('chest')}
                      stroke={getStrokeColor('chest')}
                      strokeWidth={isHighlighted('chest') ? 3 : 1.5}
                      filter={isHighlighted('chest') ? 'url(#glowEffect)' : 'none'}
                    />
                    {/* Ngực phải */}
                    <path
                      d="M282,138 C262,134 238,138 234,144 C232,172 235,200 240,206 C265,212 290,198 298,182 C296,160 290,146 282,138 Z"
                      fill={getHighlightColor('chest')}
                      stroke={getStrokeColor('chest')}
                      strokeWidth={isHighlighted('chest') ? 3 : 1.5}
                      filter={isHighlighted('chest') ? 'url(#glowEffect)' : 'none'}
                    />
                  </g>

                  {/* CƠ TAY TRƯỚC (BICEPS) & CẲNG TAY */}
                  <g
                    className={`muscle-clickable ${isHighlighted('arms') ? 'selected' : ''}`}
                    onClick={() => handleSelectMuscle('arms', 'both')}
                    onMouseEnter={() => setHoveredMuscleId('arms')}
                    onMouseLeave={() => setHoveredMuscleId(null)}
                    title="Cơ Tay (Biceps & Forearms)"
                  >
                    {/* Bắp tay trước trái */}
                    <path
                      d="M148,198 C140,212 136,236 138,256 C144,260 156,254 162,238 C166,220 164,204 156,196 Z"
                      fill={getHighlightColor('arms')}
                      stroke={getStrokeColor('arms')}
                      strokeWidth={isHighlighted('arms') ? 3 : 1.5}
                      filter={isHighlighted('arms') ? 'url(#glowEffect)' : 'none'}
                    />
                    {/* Cẳng tay trái */}
                    <path
                      d="M136,262 C126,280 118,310 112,338 C120,344 132,336 142,306 C148,286 146,270 142,260 Z"
                      fill={getHighlightColor('arms')}
                      stroke={getStrokeColor('arms')}
                      strokeWidth={isHighlighted('arms') ? 3 : 1.5}
                      filter={isHighlighted('arms') ? 'url(#glowEffect)' : 'none'}
                    />
                    {/* Bắp tay trước phải */}
                    <path
                      d="M312,198 C320,212 324,236 322,256 C316,260 304,254 298,238 C294,220 296,204 304,196 Z"
                      fill={getHighlightColor('arms')}
                      stroke={getStrokeColor('arms')}
                      strokeWidth={isHighlighted('arms') ? 3 : 1.5}
                      filter={isHighlighted('arms') ? 'url(#glowEffect)' : 'none'}
                    />
                    {/* Cẳng tay phải */}
                    <path
                      d="M324,262 C334,280 342,310 348,338 C340,344 328,336 318,306 C312,286 314,270 318,260 Z"
                      fill={getHighlightColor('arms')}
                      stroke={getStrokeColor('arms')}
                      strokeWidth={isHighlighted('arms') ? 3 : 1.5}
                      filter={isHighlighted('arms') ? 'url(#glowEffect)' : 'none'}
                    />
                  </g>

                  {/* CƠ BỤNG VÀ LIÊN SƯỜN (ABS & CORE) */}
                  <g
                    className={`muscle-clickable ${isHighlighted('core') ? 'selected' : ''}`}
                    onClick={() => handleSelectMuscle('core', 'front')}
                    onMouseEnter={() => setHoveredMuscleId('core')}
                    onMouseLeave={() => setHoveredMuscleId(null)}
                    title="Cơ Bụng (Abs & Core)"
                  >
                    {/* 6 múi bụng trung tâm */}
                    <rect x="206" y="214" width="22" height="24" rx="4" fill={getHighlightColor('core')} stroke={getStrokeColor('core')} strokeWidth={isHighlighted('core') ? 2.5 : 1.5} />
                    <rect x="232" y="214" width="22" height="24" rx="4" fill={getHighlightColor('core')} stroke={getStrokeColor('core')} strokeWidth={isHighlighted('core') ? 2.5 : 1.5} />
                    <rect x="206" y="242" width="22" height="24" rx="4" fill={getHighlightColor('core')} stroke={getStrokeColor('core')} strokeWidth={isHighlighted('core') ? 2.5 : 1.5} />
                    <rect x="232" y="242" width="22" height="24" rx="4" fill={getHighlightColor('core')} stroke={getStrokeColor('core')} strokeWidth={isHighlighted('core') ? 2.5 : 1.5} />
                    <rect x="206" y="270" width="22" height="26" rx="4" fill={getHighlightColor('core')} stroke={getStrokeColor('core')} strokeWidth={isHighlighted('core') ? 2.5 : 1.5} />
                    <rect x="232" y="270" width="22" height="26" rx="4" fill={getHighlightColor('core')} stroke={getStrokeColor('core')} strokeWidth={isHighlighted('core') ? 2.5 : 1.5} />
                    {/* Cơ liên sườn trái & phải */}
                    <path d="M178,216 C190,224 196,248 194,276 C184,272 178,252 174,232 Z" fill={getHighlightColor('core')} stroke={getStrokeColor('core')} strokeWidth="1.5" />
                    <path d="M282,216 C270,224 264,248 266,276 C276,272 282,252 286,232 Z" fill={getHighlightColor('core')} stroke={getStrokeColor('core')} strokeWidth="1.5" />
                  </g>

                  {/* CƠ ĐÙI TRƯỚC (QUADRICEPS) & CHÂN */}
                  <g
                    className={`muscle-clickable ${isHighlighted('legs') ? 'selected' : ''}`}
                    onClick={() => handleSelectMuscle('legs', 'both')}
                    onMouseEnter={() => setHoveredMuscleId('legs')}
                    onMouseLeave={() => setHoveredMuscleId(null)}
                    title="Cơ Đùi Trước (Quadriceps)"
                  >
                    {/* Đùi trước trái */}
                    <path
                      d="M188,330 C172,350 162,390 164,440 C172,475 186,490 200,494 C216,488 222,460 220,410 C218,365 210,336 188,330 Z"
                      fill={getHighlightColor('legs')}
                      stroke={getStrokeColor('legs')}
                      strokeWidth={isHighlighted('legs') ? 3 : 1.5}
                      filter={isHighlighted('legs') ? 'url(#glowEffect)' : 'none'}
                    />
                    {/* Đùi trước phải */}
                    <path
                      d="M272,330 C288,350 298,390 296,440 C288,475 274,490 260,494 C244,488 238,460 240,410 C242,365 250,336 272,330 Z"
                      fill={getHighlightColor('legs')}
                      stroke={getStrokeColor('legs')}
                      strokeWidth={isHighlighted('legs') ? 3 : 1.5}
                      filter={isHighlighted('legs') ? 'url(#glowEffect)' : 'none'}
                    />
                    {/* Bắp chuối trước trái */}
                    <path
                      d="M182,518 C176,540 172,570 178,610 C186,630 196,628 200,600 C204,570 206,536 198,518 Z"
                      fill={getHighlightColor('legs')}
                      stroke={getStrokeColor('legs')}
                      strokeWidth={isHighlighted('legs') ? 2.5 : 1.5}
                    />
                    {/* Bắp chuối trước phải */}
                    <path
                      d="M278,518 C284,540 288,570 282,610 C274,630 264,628 260,600 C256,570 254,536 262,518 Z"
                      fill={getHighlightColor('legs')}
                      stroke={getStrokeColor('legs')}
                      strokeWidth={isHighlighted('legs') ? 2.5 : 1.5}
                    />
                  </g>
                </g>
              )}

              {/* ======================= MẶT SAU (BACK VIEW) ======================= */}
              {activeView === 'back' && (
                <g className="back-muscles">
                  {/* CƠ CẦU VAI & LƯNG XÔ (BACK & LATS) */}
                  <g
                    className={`muscle-clickable ${isHighlighted('back') ? 'selected' : ''}`}
                    onClick={() => handleSelectMuscle('back', 'back')}
                    onMouseEnter={() => setHoveredMuscleId('back')}
                    onMouseLeave={() => setHoveredMuscleId(null)}
                    title="Cơ Lưng & Xô (Lats & Traps)"
                  >
                    {/* Cơ cầu vai (Trapezius hình thoi) */}
                    <path
                      d="M230,118 L272,136 L254,204 L230,224 L206,204 L188,136 Z"
                      fill={getHighlightColor('back')}
                      stroke={getStrokeColor('back')}
                      strokeWidth={isHighlighted('back') ? 3 : 1.5}
                      filter={isHighlighted('back') ? 'url(#glowEffect)' : 'none'}
                    />
                    {/* Cơ xô trái (Lats trái hình chữ V) */}
                    <path
                      d="M188,160 C170,188 166,236 172,282 C184,286 206,274 212,250 C216,216 210,180 188,160 Z"
                      fill={getHighlightColor('back')}
                      stroke={getStrokeColor('back')}
                      strokeWidth={isHighlighted('back') ? 3 : 1.5}
                      filter={isHighlighted('back') ? 'url(#glowEffect)' : 'none'}
                    />
                    {/* Cơ xô phải (Lats phải hình chữ V) */}
                    <path
                      d="M272,160 C290,188 294,236 288,282 C276,286 254,274 248,250 C244,216 250,180 272,160 Z"
                      fill={getHighlightColor('back')}
                      stroke={getStrokeColor('back')}
                      strokeWidth={isHighlighted('back') ? 3 : 1.5}
                      filter={isHighlighted('back') ? 'url(#glowEffect)' : 'none'}
                    />
                    {/* Lưng dưới (Lower back) */}
                    <path
                      d="M212,260 L248,260 L246,310 L214,310 Z"
                      fill={getHighlightColor('back')}
                      stroke={getStrokeColor('back')}
                      strokeWidth={isHighlighted('back') ? 2.5 : 1.5}
                    />
                  </g>

                  {/* CƠ VAI SAU (REAR DELTOIDS) */}
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

                  {/* CƠ TAY SAU (TRICEPS) */}
                  <g
                    className={`muscle-clickable ${isHighlighted('arms') ? 'selected' : ''}`}
                    onClick={() => handleSelectMuscle('arms', 'both')}
                    onMouseEnter={() => setHoveredMuscleId('arms')}
                    onMouseLeave={() => setHoveredMuscleId(null)}
                    title="Cơ Tay Sau (Triceps)"
                  >
                    {/* Tay sau trái */}
                    <path
                      d="M142,190 C136,212 134,238 138,258 C148,260 156,246 158,226 C160,206 154,194 142,190 Z"
                      fill={getHighlightColor('arms')}
                      stroke={getStrokeColor('arms')}
                      strokeWidth={isHighlighted('arms') ? 3 : 1.5}
                    />
                    {/* Tay sau phải */}
                    <path
                      d="M318,190 C324,212 326,238 322,258 C312,260 304,246 302,226 C300,206 306,194 318,190 Z"
                      fill={getHighlightColor('arms')}
                      stroke={getStrokeColor('arms')}
                      strokeWidth={isHighlighted('arms') ? 3 : 1.5}
                    />
                  </g>

                  {/* CƠ MÔNG (GLUTES) & ĐÙI SAU (HAMSTRINGS) & BẮP CHÂN */}
                  <g
                    className={`muscle-clickable ${isHighlighted('legs') ? 'selected' : ''}`}
                    onClick={() => handleSelectMuscle('legs', 'back')}
                    onMouseEnter={() => setHoveredMuscleId('legs')}
                    onMouseLeave={() => setHoveredMuscleId(null)}
                    title="Cơ Mông & Đùi Sau (Glutes & Hamstrings)"
                  >
                    {/* Mông trái */}
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
                    {/* Mông phải */}
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
                    {/* Đùi sau trái */}
                    <path
                      d="M182,388 C174,420 172,460 178,490 C192,494 208,488 214,460 C218,426 216,392 208,384 Z"
                      fill={getHighlightColor('legs')}
                      stroke={getStrokeColor('legs')}
                      strokeWidth={isHighlighted('legs') ? 3 : 1.5}
                    />
                    {/* Đùi sau phải */}
                    <path
                      d="M278,388 C286,420 288,460 282,490 C268,494 252,488 246,460 C242,426 244,392 252,384 Z"
                      fill={getHighlightColor('legs')}
                      stroke={getStrokeColor('legs')}
                      strokeWidth={isHighlighted('legs') ? 3 : 1.5}
                    />
                    {/* Bắp chân trái (Calves đôi) */}
                    <path
                      d="M174,518 C166,540 168,574 176,610 C186,626 198,620 202,596 C206,566 204,534 196,518 Z"
                      fill={getHighlightColor('legs')}
                      stroke={getStrokeColor('legs')}
                      strokeWidth={isHighlighted('legs') ? 3 : 1.5}
                    />
                    {/* Bắp chân phải (Calves đôi) */}
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

            {/* BẢNG CHÚ THÍCH NHANH TRỰC QUAN GÓC DƯỚI */}
            <div className="stage-hud-info">
              <span className="hud-target-label">ĐANG CHỌN:</span>
              <strong className="hud-target-name">{currentMuscle.name}</strong>
              <span className="hud-target-latin">({currentMuscle.latinName})</span>
            </div>
          </div>
        </div>

        {/* CỘT 2: THÔNG TIN CHI TIẾT & BÀI TẬP CỦA NHÓM CƠ */}
        <div className="anatomy-details-card">
          {/* CARD TỔNG QUAN VỀ NHÓM CƠ */}
          <div className="muscle-overview-banner">
            <div className="muscle-banner-head">
              <div>
                <div className="muscle-latin-badge">{currentMuscle.latinName}</div>
                <h2>Cơ {currentMuscle.name}</h2>
              </div>
              <div className="muscle-exercise-counter">
                <b>{currentMuscle.exercises.length}</b>
                <span>bài tập tối ưu</span>
              </div>
            </div>

            <p className="muscle-description">{currentMuscle.summary}</p>

            <div className="sub-muscles-tags">
              <span className="sub-tag-label">Vùng cơ cấu thành:</span>
              {currentMuscle.subMuscles.map((sub, idx) => (
                <span key={idx} className="sub-muscle-pill">
                  {sub}
                </span>
              ))}
            </div>
          </div>

          {/* THANH TÌM KIẾM BÀI TẬP */}
          <div className="exercise-filter-box">
            <I.Search size={17} className="search-icon" />
            <input
              type="text"
              placeholder={`Tìm kiếm bài tập cơ ${currentMuscle.name} (ví dụ: Bench Press, Tạ đơn, Cáp...)`}
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
            />
            {filterQuery && (
              <button className="clear-btn" onClick={() => setFilterQuery('')}>
                <I.X size={15} />
              </button>
            )}
          </div>

          {/* DANH SÁCH BÀI TẬP CHO NHÓM CƠ */}
          <div className="exercises-catalog">
            {filteredExercises.map((ex) => (
              <div key={ex.id} className="exercise-card-3d">
                {/* ẢNH MINH HỌA VÀ BADGE */}
                <div className="exercise-media-header">
                  <img src={ex.image} alt={ex.name} className="exercise-thumb" loading="lazy" />
                  <div className="exercise-media-overlay">
                    <span className="badge-equipment">{ex.equipment}</span>
                    <span className="badge-level">{ex.level}</span>
                  </div>
                  {/* Nút xem Video nổi bật trên ảnh */}
                  <button
                    className="quick-video-play-btn"
                    onClick={() => setActiveVideoModal(ex)}
                    title="Xem Video Hướng Dẫn Kỹ Thuật"
                  >
                    <I.Play size={22} fill="#ffffff" />
                  </button>
                </div>

                {/* THÔNG TIN BÀI TẬP */}
                <div className="exercise-body">
                  <div className="exercise-title-row">
                    <div>
                      <h3>{ex.name}</h3>
                      <div className="exercise-vn-name">{ex.vietnameseName}</div>
                    </div>
                    <div className="exercise-stats-box">
                      <b>{ex.suggestedSets}</b>
                      <span>{ex.suggestedReps}</span>
                    </div>
                  </div>

                  {/* Mục tiêu cơ bắp */}
                  <div className="exercise-target-line">
                    <I.Target size={15} color="var(--primary)" />
                    <span>
                      Tác động chính: <b>{ex.targetMuscle}</b>
                    </span>
                  </div>

                  {/* CÁC BƯỚC HƯỚNG DẪN CHI TIẾT */}
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

                  {/* Form Tips & Lỗi sai */}
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

                  {/* NÚT HÀNH ĐỘNG */}
                  <div className="exercise-action-buttons">
                    <button
                      className="btn-watch-video"
                      onClick={() => setActiveVideoModal(ex)}
                    >
                      <I.Film size={16} />
                      <span>Xem Video HD Kỹ Thuật</span>
                    </button>

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
                <button className="primary" onClick={() => setFilterQuery('')}>
                  Xóa bộ lọc tìm kiếm
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= MODAL XEM VIDEO HƯỚNG DẪN KỸ THUẬT TO RÕ NÉT ================= */}
      {activeVideoModal && (
        <div className="modal-backdrop" onClick={() => setActiveVideoModal(null)}>
          <div className="modal modal-video-hd" onClick={(e) => e.stopPropagation()}>
            <div className="modal-video-head">
              <div className="video-head-titles">
                <span className="video-badge">VIDEO HƯỚNG DẪN CHUẨN FORM</span>
                <h2>{activeVideoModal.name}</h2>
                <span className="video-vn-sub">({activeVideoModal.vietnameseName})</span>
              </div>
              <button
                className="close-video-modal"
                onClick={() => setActiveVideoModal(null)}
                title="Đóng video"
              >
                <I.X size={22} />
              </button>
            </div>

            {/* KHUNG PHÁT VIDEO CHUẨN */}
            <div className="video-player-container">
              <iframe
                src={`${activeVideoModal.videoUrl}?autoplay=1&rel=0`}
                title={activeVideoModal.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="exercise-video-iframe"
              />
            </div>

            {/* TÓM TẮT KỸ THUẬT DƯỚI VIDEO */}
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
              <div className="summary-item">
                <I.CheckCircle2 size={16} color="var(--primary)" />
                <span>{activeVideoModal.formTips}</span>
              </div>
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
