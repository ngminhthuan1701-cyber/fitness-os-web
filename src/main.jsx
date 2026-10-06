import React, { useEffect, useMemo, useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import * as I from 'lucide-react';
import './styles.css';
import { askGeminiCoach } from './gemini.js';
import { defaultRecipes, defaultCombos, standardIngredients } from './recipesData.js';
import { workoutPrograms, muscleGroups } from './workoutData.js';
import { SUPABASE_URL, DEFAULT_SUPABASE_KEY, saveToSupabase, loadFromSupabase, testConnection } from './supabase.js';

// Dữ liệu mẫu lịch sử các ngày trong tháng 10/2026
const initialHistory = {
  '2026-10-01': {
    status: 'workout',
    program: 'Push Day',
    exercises: [
      { name: 'Barbell Bench Press', muscle: 'Ngực', sets: 4, reps: '8–10', weight: 52.5, note: '' },
      { name: 'Incline Dumbbell Press', muscle: 'Ngực trên', sets: 3, reps: '10–12', weight: 20, note: '' },
      { name: 'Lateral Raise', muscle: 'Vai', sets: 4, reps: '12–15', weight: 8, note: '' }
    ],
    meals: [
      { name: 'Sáng', food: 'Khoai lang + 3 trứng luộc', cal: 480, protein: 26, cost: 22000 },
      { name: 'Trưa', food: 'Cơm + 200g bò xào súp lơ', cal: 680, protein: 55, cost: 60000 },
      { name: 'Tối', food: 'Cơm + 150g ức gà + rau luộc', cal: 620, protein: 46, cost: 35000 }
    ],
    cal: 2280,
    protein: 148,
    cost: 117000
  },
  '2026-10-02': {
    status: 'workout',
    program: 'Pull Day',
    exercises: [
      { name: 'Barbell Deadlift', muscle: 'Lưng', sets: 3, reps: '6–8', weight: 85, note: '' },
      { name: 'Lat Pulldown', muscle: 'Lưng xô', sets: 4, reps: '10–12', weight: 45, note: '' },
      { name: 'Bicep Barbell Curl', muscle: 'Tay trước', sets: 3, reps: '10–12', weight: 20, note: '' }
    ],
    meals: [
      { name: 'Sáng', food: 'Bánh mì + 3 trứng ốp la + sữa', cal: 530, protein: 28, cost: 25000 },
      { name: 'Trưa', food: 'Cơm + 200g ức gà áp chảo sốt tiêu đen', cal: 710, protein: 60, cost: 42000 },
      { name: 'Tối', food: 'Cơm + cá basa sốt chanh bơ', cal: 650, protein: 44, cost: 38000 }
    ],
    cal: 2310,
    protein: 152,
    cost: 105000
  },
  '2026-10-03': {
    status: 'rest',
    program: 'Nghỉ ngơi',
    exercises: [],
    meals: [
      { name: 'Sáng', food: 'Phở bò tái nạm', cal: 550, protein: 32, cost: 45000 },
      { name: 'Trưa', food: 'Cơm + sườn ram + canh rau', cal: 680, protein: 38, cost: 40000 },
      { name: 'Tối', food: 'Đậu hũ sốt cà chua nhồi thịt', cal: 590, protein: 42, cost: 35000 }
    ],
    cal: 2150,
    protein: 138,
    cost: 120000
  },
  '2026-10-04': {
    status: 'workout',
    program: 'Legs & Abs',
    exercises: [
      { name: 'Barbell Squat', muscle: 'Đùi trước', sets: 4, reps: '8–10', weight: 65, note: '' },
      { name: 'Romanian Deadlift', muscle: 'Đùi sau', sets: 3, reps: '10–12', weight: 60, note: '' },
      { name: 'Hanging Leg Raise', muscle: 'Bụng', sets: 3, reps: '15', weight: 0, note: '' }
    ],
    meals: [
      { name: 'Sáng', food: 'Yến mạch + sữa tươi + chuối', cal: 490, protein: 22, cost: 26000 },
      { name: 'Trưa', food: 'Cơm + 200g thịt nạc heo + rau', cal: 700, protein: 50, cost: 45000 },
      { name: 'Tối', food: 'Cơm + 200g cá basa + rau luộc', cal: 640, protein: 45, cost: 35000 }
    ],
    cal: 2350,
    protein: 147,
    cost: 106000
  },
  '2026-10-05': {
    status: 'workout',
    program: 'Upper Body',
    exercises: [
      { name: 'Barbell Bench Press', muscle: 'Ngực', sets: 4, reps: '8–10', weight: 55, note: '' },
      { name: 'Lat Pulldown', muscle: 'Lưng', sets: 4, reps: '8–12', weight: 45, note: '' },
      { name: 'Dumbbell Shoulder Press', muscle: 'Vai', sets: 3, reps: '10–12', weight: 16, note: '' }
    ],
    meals: [
      { name: 'Sáng', food: 'Khoai lang + trứng luộc + chuối', cal: 510, protein: 27, cost: 24000 },
      { name: 'Trưa', food: 'Cơm + 200g ức gà + rau', cal: 690, protein: 58, cost: 42000 },
      { name: 'Tối', food: 'Cơm + 150g thịt bò xào súp lơ', cal: 670, protein: 48, cost: 55000 }
    ],
    cal: 2300,
    protein: 153,
    cost: 121000
  }
};

const seed = {
  profile: {
    name: 'Minh',
    age: 23,
    height: 165,
    weight: 52,
    goal: 'Tăng cơ / Tăng cân',
    days: 4,
    minutes: 60,
    calories: 2300,
    protein: 150,
    carbs: 280,
    fat: 70,
    budget: 150000
  },
  todayStatus: 'workout',
  selectedProgram: 'Upper Body',
  completedWorkouts: ['Mon'],
  completedTodayExercises: [0],
  exercises: [
    { name: 'Barbell Bench Press', muscle: 'Ngực', sets: 4, reps: '8–10', weight: 55, note: 'Tập trung hạ tạ có kiểm soát' },
    { name: 'Lat Pulldown', muscle: 'Lưng xô', sets: 4, reps: '8–12', weight: 45, note: 'Kéo sâu chạm ngực trên' },
    { name: 'Dumbbell Shoulder Press', muscle: 'Vai', sets: 3, reps: '10–12', weight: 16, note: 'Gồng chắc cơ bụng' },
    { name: 'Barbell Bicep Curl', muscle: 'Tay trước', sets: 3, reps: '10–12', weight: 20, note: 'Cố định cùi chỏ' }
  ],
  meals: [
    { name: 'Sáng', food: 'Khoai lang + 3 trứng luộc + chuối + sữa', cal: 520, protein: 29, cost: 27000 },
    { name: 'Trưa', food: 'Cơm trắng + 200g ức gà áp chảo + rau luộc', cal: 690, protein: 58, cost: 42000 },
    { name: 'Snack', food: 'Sữa chua + chuối + đậu phộng rang', cal: 360, protein: 16, cost: 22000 }
  ],
  recipes: defaultRecipes,
  myRecipes: [
    {
      id: 'my-1',
      name: 'Ức gà luộc xé phay muối tiêu chanh',
      category: 'High Protein',
      mealType: 'Trưa / Tối',
      time: '12 phút',
      cal: 330,
      protein: 50,
      carbs: 2,
      fat: 5,
      cost: 25000,
      emoji: '🍗',
      image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80',
      summary: 'Món tủ của tôi: luộc nhanh, xé phay chấm muối tiêu chanh thơm lừng.',
      beginnerTip: 'Mẹo cho người mới: Luộc với nhánh gừng nhỏ và chút muối. Khi nước sôi 8 phút thì tắt bếp, ngâm thêm 5 phút là gà chín mềm mọng!',
      videoUrl: '',
      ingredients: ['200g ức gà tươi', '1 nhánh gừng', 'Muối, tiêu, chanh tươi'],
      steps: [
        'Đun sôi nồi nước với vài lát gừng và 1 thìa muối.',
        'Cho ức gà vào luộc 8 phút ở lửa vừa.',
        'Tắt bếp, đậy vung ngâm 5 phút rồi vớt ra ngâm nước lạnh.',
        'Xé phay miếng vừa ăn và chấm muối tiêu chanh.'
      ]
    }
  ],
  combos: defaultCombos,
  history: initialHistory,
  expenses: [
    { item: 'Ức gà tươi (500g)', amount: 45000, cat: 'Thịt' },
    { item: 'Trứng gà (10 quả)', amount: 32000, cat: 'Trứng' },
    { item: 'Sữa tươi tiệt trùng', amount: 34000, cat: 'Sữa' },
    { item: 'Chuối già Nam Mỹ (1kg)', amount: 20000, cat: 'Hoa quả' }
  ]
};

const money = n => new Intl.NumberFormat('vi-VN').format(n) + '₫';

// Trích xuất link nhúng Youtube từ URL
function getYoutubeEmbedUrl(url) {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

// Phát âm thanh beep khi hết giờ nghỉ
function playBeep() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  } catch (err) {
    console.warn('Audio play error:', err);
  }
}

function App() {
  const [data, setData] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('fitness-os'));
      if (!saved) return seed;
      
      // Tự động bổ sung ảnh thật, mẹo nấu ăn và link video từ defaultRecipes nếu dữ liệu cũ trong localStorage bị thiếu
      const rawRecipes = (saved.recipes && saved.recipes.length) ? saved.recipes : defaultRecipes;
      const recipes = rawRecipes.map(r => {
        const def = defaultRecipes.find(d => d.id === r.id || d.name === r.name);
        if (def) {
          return {
            ...def,
            ...r,
            image: r.image || def.image,
            beginnerTip: r.beginnerTip || def.beginnerTip,
            videoUrl: r.videoUrl || def.videoUrl
          };
        }
        return r;
      });

      return {
        ...seed,
        ...saved,
        recipes,
        combos: (saved.combos && saved.combos.length) ? saved.combos : defaultCombos,
        myRecipes: saved.myRecipes || seed.myRecipes,
        exercises: saved.exercises && saved.exercises.length ? saved.exercises : seed.exercises,
        history: saved.history || initialHistory,
        todayStatus: saved.todayStatus || 'workout',
        selectedProgram: saved.selectedProgram || 'Upper Body',
        completedWorkouts: saved.completedWorkouts || ['Mon']
      };
    } catch {
      return seed;
    }
  });

  const [page, setPage] = useState('Dashboard');
  const [dark, setDark] = useState(() => {
    try {
      const saved = localStorage.getItem('fitness-theme');
      return saved ? saved === 'dark' : false;
    } catch {
      return false;
    }
  });

  // 4 Theme màu sắc: 'green' (Xanh lá), 'pink' (Hoa anh đào), 'autumn' (Mùa thu), 'blue' (Xanh biển)
  const themesList = [
    { key: 'green', name: 'Xanh lá mát mẻ', icon: '🌿', subtitle: 'EMERALD MINT SYSTEM' },
    { key: 'pink', name: 'Hoa anh đào Pastel', icon: '🌸', subtitle: 'SAKURA PINK SYSTEM' },
    { key: 'autumn', name: 'Mùa thu ấm áp', icon: '🍂', subtitle: 'AUTUMN AMBER SYSTEM' },
    { key: 'blue', name: 'Xanh biển Pastel', icon: '🌊', subtitle: 'PASTEL BLUE SYSTEM' }
  ];

  const [colorTheme, setColorTheme] = useState(() => {
    try {
      return localStorage.getItem('fitness-color-theme') || 'green'; // Mặc định xanh lá mát mẻ
    } catch {
      return 'green';
    }
  });

  // Trạng thái thu gọn / mở rộng menu để xem Full Màn Hình
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem('fitness-sidebar-collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const [toast, setToast] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('fitness-os', JSON.stringify(data));
  }, [data]);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem('fitness-theme', next ? 'dark' : 'light');
  };

  const toggleSidebar = () => {
    const next = !sidebarCollapsed;
    setSidebarCollapsed(next);
    localStorage.setItem('fitness-sidebar-collapsed', String(next));
  };

  const handleSelectColorTheme = (themeKey) => {
    setColorTheme(themeKey);
    localStorage.setItem('fitness-color-theme', themeKey);
    const th = themesList.find(t => t.key === themeKey);
    notify(`Đã chuyển theme: ${th ? th.icon + ' ' + th.name : themeKey}`);
  };

  const currentTheme = themesList.find(t => t.key === colorTheme) || themesList[0];

  const consumed = useMemo(() => data.meals.reduce((s, m) => s + (Number(m.cal) || 0), 0), [data.meals]);
  const protein = useMemo(() => data.meals.reduce((s, m) => s + (Number(m.protein) || 0), 0), [data.meals]);
  const spent = useMemo(() => data.expenses.reduce((s, e) => s + (Number(e.amount) || 0), 0), [data.expenses]);

  const notify = msg => {
    setToast(msg);
    setTimeout(() => setToast(''), 2800);
  };

  // ---------------- TÍNH NĂNG SAO LƯU & KHÔI PHỤC JSON ----------------
  const handleExportData = () => {
    try {
      const dateStr = new Date().toISOString().slice(0, 10);
      const dataStr = JSON.stringify(data, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Fitness_OS_Backup_${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      notify('📥 Đã tải file sao lưu (.json) về máy thành công!');
    } catch (err) {
      notify('Lỗi sao lưu: ' + err.message);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        if (!json || typeof json !== 'object' || !json.profile) {
          throw new Error('File không đúng cấu trúc của Fitness OS');
        }
        setData({
          ...seed,
          ...json,
          recipes: json.recipes && json.recipes.length ? json.recipes : defaultRecipes,
          exercises: json.exercises && json.exercises.length ? json.exercises : seed.exercises,
          history: json.history || initialHistory
        });
        notify('📤 Đã khôi phục toàn bộ dữ liệu từ file thành công 100%!');
      } catch (err) {
        alert('Lỗi khôi phục: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetData = () => {
    if (window.confirm('Bạn có chắc chắn muốn đặt lại toàn bộ dữ liệu về mặc định ban đầu không?')) {
      setData({ ...seed, recipes: defaultRecipes, history: initialHistory });
      localStorage.removeItem('fitness-os');
      notify('🔄 Đã đặt lại toàn bộ dữ liệu về mặc định ban đầu!');
    }
  };

  // Đồng bộ lưu vào Database Server (localhost:3001)
  const handleSyncToDb = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Mã lỗi server: ' + res.status);
      notify('💾 Đã lưu dữ liệu vào Database trên máy thành công!');
    } catch (err) {
      alert('Không kết nối được tới Database Server cục bộ.\n\n👉 Để bật Database, bạn mở terminal chạy lệnh:\nnpm run server');
    }
  };

  // Đồng bộ lưu lên Supabase Cloud
  const handleCloudSync = async () => {
    try {
      const time = await saveToSupabase(data);
      notify(`☁️ Đã đồng bộ lên Supabase Cloud thành công lúc ${new Date(time).toLocaleTimeString()}!`);
    } catch (err) {
      alert('Lỗi đồng bộ Supabase Cloud: ' + err.message);
    }
  };

  // Nạp dữ liệu từ Database Server (localhost:3001)
  const handleLoadFromDb = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/data');
      if (!res.ok) throw new Error('Mã lỗi server: ' + res.status);
      const json = await res.json();
      if (!json || !json.profile) {
        throw new Error('Database server chưa có dữ liệu');
      }
      setData({
        ...seed,
        ...json,
        recipes: json.recipes && json.recipes.length ? json.recipes : defaultRecipes,
        exercises: json.exercises && json.exercises.length ? json.exercises : seed.exercises,
        history: json.history || initialHistory
      });
      notify('📥 Đã nạp dữ liệu từ Database Server thành công!');
    } catch (err) {
      alert('Lỗi nạp từ Database: ' + err.message + '\n\n👉 Đảm bảo bạn đã chạy lệnh: npm run server');
    }
  };

  // Thêm bữa ăn vào nhật ký
  const handleAddMeal = (newMeal) => {
    setData(d => ({
      ...d,
      meals: [...d.meals, newMeal],
      expenses: newMeal.cost > 0
        ? [...d.expenses, { item: newMeal.food, amount: Number(newMeal.cost), cat: 'Thực phẩm' }]
        : d.expenses
    }));
    notify(`Đã nạp "${newMeal.food}" vào bữa ${newMeal.name}`);
  };

  const handleDeleteMeal = (index) => {
    setData(d => ({
      ...d,
      meals: d.meals.filter((_, i) => i !== index)
    }));
    notify('Đã xóa bữa ăn');
  };

  const handleAddRecipe = (recipe) => {
    setData(d => ({
      ...d,
      recipes: [recipe, ...d.recipes]
    }));
    notify(`Đã thêm công thức "${recipe.name}"`);
  };

  const handleSaveToMyRecipes = (recipe) => {
    const newMyRecipe = {
      ...recipe,
      id: 'my-' + Date.now(),
      savedFromSuggested: true
    };
    setData(d => ({
      ...d,
      myRecipes: [newMyRecipe, ...(d.myRecipes || [])]
    }));
    notify(`⭐ Đã lưu "${recipe.name}" vào Thực đơn của tôi!`);
  };

  const handleCreateMyRecipe = (recipe) => {
    setData(d => ({
      ...d,
      myRecipes: [recipe, ...(d.myRecipes || [])]
    }));
    notify(`✅ Đã thêm "${recipe.name}" vào Thực đơn của tôi!`);
  };

  const handleDeleteMyRecipe = (recipeId) => {
    setData(d => ({
      ...d,
      myRecipes: (d.myRecipes || []).filter(r => r.id !== recipeId)
    }));
    notify('Đã xóa món khỏi Thực đơn của tôi');
  };

  const handleEatCombo = (combo, mealType = 'Trưa') => {
    const mealName = mealType || 'Trưa';
    const itemsText = Array.isArray(combo.items) ? combo.items.join(' + ') : (combo.items || combo.name);
    const newMeal = {
      name: mealName,
      food: `[Combo] ${combo.name}: ${itemsText}`,
      cal: Number(combo.cal),
      protein: Number(combo.protein),
      cost: Number(combo.cost || 0)
    };
    setData(d => ({
      ...d,
      meals: [...d.meals, newMeal],
      expenses: combo.cost > 0
        ? [...d.expenses, { item: `Combo: ${combo.name}`, amount: Number(combo.cost), cat: 'Thực phẩm' }]
        : d.expenses
    }));
    notify(`⚡ Đã nạp "${combo.name}" (${combo.cal} kcal, ${combo.protein}g đạm) vào bữa ${mealName}!`);
  };

  const handleCreateCombo = (combo) => {
    setData(d => ({
      ...d,
      combos: [combo, ...(d.combos || [])]
    }));
    notify(`🍱 Đã lưu Combo "${combo.name}" thành công!`);
  };

  const handleDeleteCombo = (comboId) => {
    setData(d => ({
      ...d,
      combos: (d.combos || []).filter(c => c.id !== comboId)
    }));
    notify('Đã xóa Combo');
  };

  const handleAddExpense = (expense) => {
    setData(d => ({
      ...d,
      expenses: [...d.expenses, expense]
    }));
    notify(`Đã ghi nhận chi tiêu: ${expense.item}`);
  };

  const handleDeleteExpense = (index) => {
    setData(d => ({
      ...d,
      expenses: d.expenses.filter((_, i) => i !== index)
    }));
    notify('Đã xóa khoản chi tiêu');
  };

  // Cập nhật dữ liệu của 1 ngày trong Lịch sử tháng
  const handleUpdateDayHistory = (dateKey, dayData) => {
    setData(d => ({
      ...d,
      history: {
        ...d.history,
        [dateKey]: dayData
      }
    }));
    notify(`Đã cập nhật dữ liệu cho ngày ${dateKey}!`);
  };

  const navItems = [
    ['Dashboard', I.LayoutDashboard, 'Tổng quan'],
    ['Calendar', I.Calendar, 'Lịch tháng'],
    ['Workout', I.Dumbbell, 'Lịch tập'],
    ['Recipes', I.ChefHat, 'Món ăn'],
    ['Nutrition', I.Utensils, 'Dinh dưỡng'],
    ['Recovery', I.BatteryMedium, 'Hồi phục'],
    ['Progress', I.TrendingUp, 'Tiến độ'],
    ['Money', I.Wallet, 'Chi tiêu'],
    ['AI Coach', I.Sparkles, 'AI Coach'],
    ['Profile', I.Settings, 'Cài đặt']
  ];

  return (
    <div className={`app ${colorTheme === 'green' ? 'theme-green' : colorTheme === 'pink' ? 'theme-pink' : colorTheme === 'autumn' ? 'theme-autumn' : ''} ${dark ? 'dark' : ''} ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`.trim()}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        style={{ display: 'none' }}
      />

      <aside className="sidebar">
        <div className="brand">
          <div className="logo">⚡</div>
          <div>
            <b>FITNESS OS</b>
            <span>{currentTheme.subtitle}</span>
          </div>
          <button
            className="sidebar-toggle-btn"
            onClick={toggleSidebar}
            title="Thu gọn menu để xem Full màn hình"
          >
            <I.PanelLeftClose size={17} />
          </button>
        </div>

        <nav>
          {navItems.map(([key, Icon, label]) => (
            <button
              className={page === key ? 'active' : ''}
              onClick={() => setPage(key)}
              key={key}
            >
              <Icon size={18} />
              {label || key}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          {/* Bộ chọn 4 Theme trong Sidebar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 4 }}>
            {themesList.map(th => (
              <button
                key={th.key}
                onClick={() => handleSelectColorTheme(th.key)}
                title={th.name}
                style={{
                  padding: '9px 0',
                  borderRadius: 10,
                  background: colorTheme === th.key ? 'rgba(255, 255, 255, 0.22)' : 'rgba(255, 255, 255, 0.06)',
                  border: colorTheme === th.key ? '1px solid rgba(255, 255, 255, 0.45)' : '1px solid transparent',
                  fontSize: 17,
                  textAlign: 'center',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                {th.icon}
              </button>
            ))}
          </div>
          <button onClick={toggleTheme}>
            <I.SunMoon size={18} />
            {dark ? 'Giao diện Sáng' : 'Giao diện Tối'}
          </button>
          <button onClick={() => setPage('Profile')}>
            <I.Settings size={18} />
            Cài đặt & Database
          </button>
        </div>
      </aside>

      <main className="main">
        <header>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button
              className="icon-btn"
              onClick={toggleSidebar}
              title={sidebarCollapsed ? "Mở menu điều hướng (Phím tắt)" : "Thu gọn menu để xem Full màn hình"}
              style={sidebarCollapsed ? { background: 'var(--primary)', color: '#fff', borderColor: 'var(--primary)' } : {}}
            >
              {sidebarCollapsed ? <I.Menu size={20} /> : <I.PanelLeftClose size={18} />}
            </button>
            <div>
              <div className="eyebrow">HÔM NAY · 06 THÁNG 10, 2026</div>
              <h1>
                {page === 'Dashboard' && `Chào ngày mới, ${data.profile.name} 👋`}
                {page === 'Calendar' && 'Lịch tháng & Thống kê Chuyên cần 📅'}
                {page === 'Workout' && 'Lịch tập & Nhật ký buổi tập 🏋️'}
                {page === 'Recipes' && 'Khám phá Món ăn & Video nấu ăn 🍳'}
                {page === 'Nutrition' && 'Nhật ký Dinh dưỡng & Bữa ăn 🥗'}
                {page === 'Recovery' && 'Điểm phục hồi & Sẵn sàng tập luyện 🟢'}
                {page === 'Progress' && 'Tiến độ Cân nặng & Sức mạnh 📈'}
                {page === 'Money' && 'Quản lý Ngân sách & Chi tiêu 💰'}
                {page === 'AI Coach' && 'AI Fitness Coach Thông Minh 🤖'}
                {page === 'Profile' && 'Cài đặt Hồ sơ, Sao lưu & Database ⚙️'}
              </h1>
            </div>
          </div>
          <div className="header-actions">
            {/* Bộ chọn 4 Theme trực tiếp: Xanh lá, Hoa anh đào, Mùa thu, Xanh biển */}
            <div style={{
              display: 'flex',
              gap: 4,
              background: 'var(--bg-card)',
              padding: '3px 6px',
              borderRadius: 14,
              border: '1px solid var(--border-card)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              {themesList.map(th => (
                <button
                  key={th.key}
                  onClick={() => handleSelectColorTheme(th.key)}
                  title={`Đổi sang: ${th.name}`}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    border: colorTheme === th.key ? '2px solid var(--primary)' : '1px solid transparent',
                    background: colorTheme === th.key ? 'var(--primary-light)' : 'transparent',
                    fontSize: 16,
                    display: 'grid',
                    placeItems: 'center',
                    cursor: 'pointer',
                    transform: colorTheme === th.key ? 'scale(1.06)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {th.icon}
                </button>
              ))}
            </div>
            <button className="icon-btn" onClick={handleCloudSync} title="Lưu nhanh lên Supabase Cloud (Đám mây)">
              <I.CloudUpload size={18} />
            </button>
            <button className="icon-btn" onClick={handleSyncToDb} title="Lưu nhanh vào Database ổ cứng (Server port 3001)">
              <I.Database size={18} />
            </button>
            <button className="icon-btn" onClick={handleExportData} title="Sao lưu dữ liệu ra file JSON">
              <I.Download size={18} />
            </button>
            <button className="icon-btn" onClick={handleImportClick} title="Khôi phục dữ liệu từ file JSON">
              <I.Upload size={18} />
            </button>
            <button className="icon-btn" onClick={toggleTheme} title={dark ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}>
              <I.SunMoon size={18} />
            </button>
            <div className="avatar" title={data.profile.name}>
              {data.profile.name ? data.profile.name[0].toUpperCase() : 'M'}
            </div>
          </div>
        </header>

        {page === 'Dashboard' && (
          <Dashboard
            data={data}
            setData={setData}
            consumed={consumed}
            protein={protein}
            spent={spent}
            notify={notify}
            onAddMeal={handleAddMeal}
            onDeleteMeal={handleDeleteMeal}
            onOpenWorkout={() => setPage('Workout')}
            onOpenRecipes={() => setPage('Recipes')}
            onOpenNutrition={() => setPage('Nutrition')}
          />
        )}

        {page === 'Calendar' && (
          <CalendarPage
            history={data.history}
            todayData={{
              status: data.todayStatus,
              program: data.selectedProgram,
              exercises: data.exercises,
              meals: data.meals,
              cal: consumed,
              protein: protein,
              cost: spent
            }}
            onUpdateDay={handleUpdateDayHistory}
            notify={notify}
          />
        )}

        {page === 'Workout' && (
          <Workout
            data={data}
            setData={setData}
            notify={notify}
          />
        )}

        {page === 'Recipes' && (
          <RecipesPage
            recipes={data.recipes}
            myRecipes={data.myRecipes || []}
            combos={data.combos || []}
            ingredients={standardIngredients}
            onAddMeal={handleAddMeal}
            onAddRecipe={handleAddRecipe}
            onSaveToMyRecipes={handleSaveToMyRecipes}
            onCreateMyRecipe={handleCreateMyRecipe}
            onDeleteMyRecipe={handleDeleteMyRecipe}
            onEatCombo={handleEatCombo}
            onCreateCombo={handleCreateCombo}
            onDeleteCombo={handleDeleteCombo}
            notify={notify}
          />
        )}

        {page === 'Nutrition' && (
          <Nutrition
            data={data}
            consumed={consumed}
            protein={protein}
            combos={data.combos || []}
            onAddMeal={handleAddMeal}
            onDeleteMeal={handleDeleteMeal}
            onEatCombo={handleEatCombo}
            onOpenRecipes={() => setPage('Recipes')}
          />
        )}

        {page === 'Recovery' && <Recovery />}

        {page === 'Progress' && <Progress data={data} />}

        {page === 'Money' && (
          <Money
            data={data}
            spent={spent}
            onAddExpense={handleAddExpense}
            onDeleteExpense={handleDeleteExpense}
          />
        )}

        {page === 'AI Coach' && (
          <Coach
            data={data}
            consumed={consumed}
            protein={protein}
            spent={spent}
          />
        )}

        {page === 'Profile' && (
          <Profile
            data={data}
            setData={setData}
            notify={notify}
            onExport={handleExportData}
            onImport={handleImportClick}
            onReset={handleResetData}
            onSyncDb={handleSyncToDb}
            onLoadDb={handleLoadFromDb}
          />
        )}
      </main>

      {toast && (
        <div className="toast">
          <I.CheckCircle2 size={16} /> {toast}
        </div>
      )}
    </div>
  );
}

function Card({ children, className = '', style }) {
  return <section className={'card ' + className} style={style}>{children}</section>;
}

function Metric({ icon: Icon, label, value, sub, good }) {
  return (
    <Card>
      <div className="metric-top">
        <span>{label}</span>
        <Icon size={18} />
      </div>
      <strong className="metric-value">{value}</strong>
      <div className={good ? 'positive' : 'muted'}>{sub}</div>
    </Card>
  );
}

// ---------------- DASHBOARD ----------------
function Dashboard({
  data,
  setData,
  consumed,
  protein,
  spent,
  notify,
  onAddMeal,
  onDeleteMeal,
  onOpenWorkout,
  onOpenRecipes,
  onOpenNutrition
}) {
  const remain = data.profile.calories - consumed;
  const isRest = data.todayStatus === 'rest';

  // State cho Modal thêm bài tập nhanh trên Dashboard
  const [showAddExModal, setShowAddExModal] = useState(false);
  const [newExForm, setNewExForm] = useState({
    name: '',
    muscle: 'Ngực',
    sets: 3,
    reps: '8–10',
    weight: 40,
    note: ''
  });

  // State cho Modal thêm bữa ăn nhanh trên Dashboard
  const [showAddMealModal, setShowAddMealModal] = useState(false);
  const [newMealForm, setNewMealForm] = useState({
    name: 'Trưa',
    food: '',
    cal: 500,
    protein: 40,
    cost: 35000
  });

  const completedTodayExercises = data.completedTodayExercises || [];
  const completedCount = completedTodayExercises.length;
  const totalExercises = (data.exercises || []).length;
  const workoutPercent = totalExercises > 0 ? Math.min(100, Math.round((completedCount / totalExercises) * 100)) : 0;

  const calPercent = Math.min(100, Math.round((consumed / data.profile.calories) * 100));
  const protPercent = Math.min(100, Math.round((protein / data.profile.protein) * 100));

  // Toggle hoàn thành bài tập
  const handleToggleExercise = (idx) => {
    const isDone = completedTodayExercises.includes(idx);
    const updated = isDone
      ? completedTodayExercises.filter(i => i !== idx)
      : [...completedTodayExercises, idx];
    setData(d => ({ ...d, completedTodayExercises: updated }));
    notify(isDone ? 'Đã bỏ đánh dấu hoàn thành bài tập' : 'Đã hoàn thành bài tập! Quá đỉnh 🔥');
  };

  // Xóa bài tập
  const handleDeleteExercise = (idx) => {
    setData(d => ({
      ...d,
      exercises: d.exercises.filter((_, i) => i !== idx),
      completedTodayExercises: (d.completedTodayExercises || [])
        .filter(i => i !== idx)
        .map(i => (i > idx ? i - 1 : i))
    }));
    notify('Đã xóa bài tập');
  };

  // Thêm bài tập
  const handleCreateExerciseSubmit = (e) => {
    e.preventDefault();
    if (!newExForm.name.trim()) return;
    setData(d => ({
      ...d,
      todayStatus: 'workout',
      exercises: [
        ...d.exercises,
        {
          name: newExForm.name.trim(),
          muscle: newExForm.muscle,
          sets: Number(newExForm.sets),
          reps: newExForm.reps.trim(),
          weight: Number(newExForm.weight),
          note: newExForm.note.trim()
        }
      ]
    }));
    notify(`Đã thêm bài tập mới: ${newExForm.name}`);
    setShowAddExModal(false);
    setNewExForm({ name: '', muscle: 'Ngực', sets: 3, reps: '8–10', weight: 40, note: '' });
  };

  // Thêm món ăn
  const handleCreateMealSubmit = (e) => {
    e.preventDefault();
    if (!newMealForm.food.trim()) return;
    onAddMeal({
      name: newMealForm.name,
      food: newMealForm.food.trim(),
      cal: Number(newMealForm.cal),
      protein: Number(newMealForm.protein),
      cost: Number(newMealForm.cost)
    });
    setShowAddMealModal(false);
    setNewMealForm({ name: 'Trưa', food: '', cal: 500, protein: 40, cost: 35000 });
  };

  // Chuyển nhanh trạng thái buổi tập
  const handleToggleStatus = (status) => {
    setData(d => ({ ...d, todayStatus: status }));
    notify(status === 'workout' ? 'Đã bật chế độ: Hôm nay đi tập 🏋️' : 'Đã bật chế độ: Hôm nay nghỉ ngơi 🛌');
  };

  // Đổi giáo trình tập nhanh
  const handleSwitchProgram = (prog) => {
    const progExs = workoutPrograms[prog] || [];
    setData(d => ({
      ...d,
      selectedProgram: prog,
      todayStatus: 'workout',
      exercises: progExs.length ? progExs : d.exercises,
      completedTodayExercises: []
    }));
    notify(`Đã đổi giáo trình sang: ${prog}`);
  };

  return (
    <>
      {/* AI Coach Banner */}
      <div className="insight">
        <div className="ai-icon">
          <I.Sparkles size={22} />
        </div>
        <div>
          <b>Gợi ý hôm nay từ AI Coach</b>
          <p>
            {isRest
              ? `Hôm nay là Ngày nghỉ (Rest Day). Hãy ưu tiên nạp đủ ${data.profile.protein}g protein để phục hồi sợi cơ và giữ ngân sách dưới ${money(data.profile.budget)}.`
              : `Hôm nay bạn có lịch tập ${data.selectedProgram}. Cơ bắp hồi phục tốt (82/100). Hãy nạp thêm ${Math.max(0, data.profile.protein - protein)}g protein để tối ưu phát triển cơ!`}
          </p>
        </div>
        <button onClick={onOpenWorkout}>
          {isRest ? 'Xem lịch tập' : 'Vào buổi tập'} <I.ArrowRight size={16} />
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid metrics">
        <Metric
          icon={I.Scale}
          label="CÂN NẶNG"
          value={data.profile.weight + ' kg'}
          sub="+0.4 kg / 4 tuần"
          good
        />
        <Metric
          icon={I.Flame}
          label="CALORIES"
          value={consumed + ' / ' + data.profile.calories}
          sub={remain >= 0 ? `${remain} kcal còn lại` : `Vượt ${-remain} kcal`}
          good={remain >= 0}
        />
        <Metric
          icon={I.Dumbbell}
          label="BUỔI TẬP"
          value={isRest ? 'Nghỉ ngơi' : data.selectedProgram}
          sub={isRest ? 'Phục hồi cơ bắp' : `${(data.exercises || []).length} bài tập · Sẵn sàng`}
          good
        />
        <Metric
          icon={I.BatteryMedium}
          label="HỒI PHỤC"
          value="82 / 100"
          sub="Sẵn sàng tập nặng"
          good
        />
        <Metric
          icon={I.Wallet}
          label="NGÂN SÁCH"
          value={money(spent)}
          sub={`Còn ${money(Math.max(0, data.profile.budget - spent))}`}
          good={spent <= data.profile.budget}
        />
      </div>

      {/* ---------------- 2 KHỐI CHÍNH: HÔM NAY TÔI ĐÃ TẬP GÌ & HÔM NAY TÔI ĐÃ ĂN GÌ ---------------- */}
      <div className="today-grid">
        {/* CARD 1: HÔM NAY TÔI ĐÃ TẬP GÌ */}
        <section className="today-card">
          <div className="today-card-head">
            <div>
              <div className="today-card-title">
                <span style={{ fontSize: 28 }}>🏋️</span>
                <div>
                  <h2>Hôm nay tôi đã tập gì?</h2>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    Thứ Ba, 06/10/2026 · {isRest ? 'Hôm nay nghỉ ngơi' : `Giáo trình: ${data.selectedProgram}`}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div className="toggle-switch">
                <button
                  className={!isRest ? 'active' : ''}
                  onClick={() => handleToggleStatus('workout')}
                  style={{ fontSize: 12.5, padding: '7px 12px' }}
                >
                  🏋️ Đi tập
                </button>
                <button
                  className={isRest ? 'active' : ''}
                  onClick={() => handleToggleStatus('rest')}
                  style={{ fontSize: 12.5, padding: '7px 12px' }}
                >
                  🛌 Nghỉ
                </button>
              </div>
            </div>
          </div>

          {isRest ? (
            <div style={{ background: 'var(--bg-subtle)', padding: '24px 20px', borderRadius: 18, border: '1px solid var(--border-subtle)', textAlign: 'center', margin: 'auto 0' }}>
              <span style={{ fontSize: 44, display: 'block', marginBottom: 10 }}>🛌</span>
              <b style={{ fontSize: 16.5, display: 'block', color: 'var(--text-main)', marginBottom: 6 }}>
                Hôm nay bạn đang chọn Ngày nghỉ (Rest Day)
              </b>
              <p style={{ fontSize: 13.5, color: 'var(--text-muted)', maxWidth: 440, margin: '0 auto 16px', lineHeight: 1.6 }}>
                Các sợi cơ đang trong quá trình hồi phục và phát triển. Hãy uống đủ nước, ngủ ít nhất 7-8 tiếng và nạp đủ {data.profile.protein}g protein!
              </p>
              <button
                className="btn-secondary"
                onClick={() => handleToggleStatus('workout')}
                style={{ fontSize: 13, padding: '9px 18px', borderRadius: 10 }}
              >
                <I.Dumbbell size={16} /> Chuyển sang có đi tập hôm nay
              </button>
            </div>
          ) : (
            <>
              {/* Progress bar */}
              <div className="today-progress-bar">
                <div className="today-progress-header">
                  <span>Tiến độ buổi tập hôm nay ({completedCount}/{totalExercises} bài hoàn thành)</span>
                  <b style={{ color: '#0284c7' }}>{workoutPercent}%</b>
                </div>
                <div className="bar">
                  <i style={{ width: `${workoutPercent}%`, background: 'linear-gradient(90deg, #0284c7, #38bdf8)' }} />
                </div>
              </div>

              {/* Danh sách bài tập hôm nay */}
              <div className="today-list">
                {(!data.exercises || data.exercises.length === 0) ? (
                  <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '36px 0', fontSize: 14 }}>
                    Chưa có bài tập nào hôm nay. Bấm "+ Thêm bài tập" để tạo bài tập mới!
                  </p>
                ) : (
                  data.exercises.map((ex, idx) => {
                    const isDone = completedTodayExercises.includes(idx);
                    return (
                      <div className={'today-item ' + (isDone ? 'is-done' : '')} key={idx}>
                        <div className="today-item-left">
                          <span className="today-item-idx">0{idx + 1}</span>
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <span className="today-item-name">{ex.name}</span>
                            <div className="today-item-sub">
                              <span className="badge-muscle">{ex.muscle}</span>
                              <span>{ex.sets} hiệp × {ex.reps}</span>
                              <span>·</span>
                              <strong style={{ color: '#0284c7' }}>{ex.weight} kg</strong>
                              {ex.note && <span style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>({ex.note})</span>}
                            </div>
                          </div>
                        </div>

                        <div className="today-item-right">
                          <button
                            className={'check-circle-btn ' + (isDone ? 'checked' : '')}
                            onClick={() => handleToggleExercise(idx)}
                            title={isDone ? 'Bỏ đánh dấu hoàn thành' : 'Đánh dấu đã tập xong'}
                          >
                            {isDone ? <I.Check size={18} strokeWidth={3} /> : <I.Circle size={18} />}
                          </button>
                          <button
                            className="action-icon-btn"
                            onClick={() => handleDeleteExercise(idx)}
                            title="Xóa bài tập này"
                          >
                            <I.Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Chân thẻ: Thao tác nhanh */}
              <div className="today-card-foot">
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <button
                    className="primary"
                    onClick={() => setShowAddExModal(true)}
                    style={{ fontSize: 13, padding: '9px 14px' }}
                  >
                    <I.Plus size={16} /> Thêm bài tập
                  </button>

                  <select
                    value={data.selectedProgram}
                    onChange={e => handleSwitchProgram(e.target.value)}
                    style={{ padding: '8px 12px', borderRadius: 10, fontSize: 12.5, fontWeight: 700, background: 'var(--bg-subtle)', color: 'var(--text-main)', border: '1px solid var(--border-card)' }}
                    title="Đổi giáo trình tập luyện"
                  >
                    {Object.keys(workoutPrograms).map(p => (
                      <option key={p} value={p}>Đổi giáo trình: {p}</option>
                    ))}
                  </select>
                </div>

                <button
                  className="text-btn"
                  onClick={onOpenWorkout}
                  style={{ fontSize: 13, fontWeight: 700, color: '#0284c7' }}
                >
                  Vào phòng tập (Bấm giờ nghỉ) <I.ArrowRight size={14} />
                </button>
              </div>
            </>
          )}
        </section>

        {/* CARD 2: HÔM NAY TÔI ĐÃ ĂN GÌ */}
        <section className="today-card">
          <div className="today-card-head">
            <div>
              <div className="today-card-title">
                <span style={{ fontSize: 28 }}>🥗</span>
                <div>
                  <h2>Hôm nay tôi đã ăn gì?</h2>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    Nhật ký các bữa ăn & Dinh dưỡng nạp trong ngày
                  </span>
                </div>
              </div>
            </div>

            <span className="today-card-badge">
              {data.meals.length} bữa · {consumed} kcal
            </span>
          </div>

          {/* Macro Progress */}
          <div className="today-progress-bar">
            <div className="today-progress-header">
              <span>Tiến độ calo trong ngày ({consumed} / {data.profile.calories} kcal)</span>
              <b>{calPercent}%</b>
            </div>
            <div className="bar" style={{ marginBottom: 12 }}>
              <i style={{ width: `${Math.min(100, Math.max(0, calPercent))}%`, background: 'linear-gradient(90deg, #f59e0b, #ef4444)' }} />
            </div>

            <div className="today-progress-header">
              <span>Tiến độ protein ({protein} / {data.profile.protein}g)</span>
              <b style={{ color: 'var(--primary)' }}>{protPercent}%</b>
            </div>
            <div className="bar">
              <i style={{ width: `${Math.min(100, Math.max(0, protPercent))}%`, background: 'linear-gradient(90deg, var(--primary), #38bdf8)' }} />
            </div>
          </div>

          {/* Danh sách bữa ăn hôm nay */}
          <div className="today-list">
            {(!data.meals || data.meals.length === 0) ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '36px 0', fontSize: 14 }}>
                Chưa ghi nhận món ăn nào hôm nay. Bấm "+ Thêm bữa ăn" để ghi lại!
              </p>
            ) : (
              data.meals.map((m, idx) => (
                <div className="today-item" key={idx}>
                  <div className="today-item-left">
                    <span className="badge-meal">
                      {m.name === 'Sáng' ? '🌅 Sáng' : m.name === 'Trưa' ? '🍗 Trưa' : m.name === 'Tối' ? '🥩 Tối' : '🥛 Snack'}
                    </span>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <span className="today-item-name">{m.food}</span>
                      <div className="today-item-sub">
                        <span>🔥 {m.cal} kcal</span>
                        <span>·</span>
                        <strong style={{ color: '#0284c7' }}>🥩 {m.protein}g Protein</strong>
                        <span>·</span>
                        <span>💰 {money(m.cost)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="today-item-right">
                    <button
                      className="action-icon-btn"
                      onClick={() => onDeleteMeal(idx)}
                      title="Xóa món ăn này"
                    >
                      <I.Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Chân thẻ: Thao tác nhanh */}
          <div className="today-card-foot">
            <button
              className="primary"
              onClick={() => setShowAddMealModal(true)}
              style={{ fontSize: 13, padding: '9px 14px' }}
            >
              <I.Plus size={16} /> + Thêm bữa ăn
            </button>

            <button
              className="text-btn"
              onClick={onOpenRecipes}
              style={{ fontSize: 13, fontWeight: 700, color: '#0284c7' }}
            >
              Khám phá món & Video nấu ăn <I.ArrowRight size={14} />
            </button>
          </div>
        </section>
      </div>

      {/* 2 CỘT DƯỚI: TIẾN ĐỘ TUẦN & ĐIỂM CHÚ Ý TỪ COACH */}
      <div className="two-col">
        <Card>
          <div className="section-head">
            <div>
              <span className="eyebrow">TIẾN ĐỘ TUẦN</span>
              <h2>Lịch tập luyện tuần này</h2>
            </div>
            <span className="pill">Mục tiêu: {data.profile.days} buổi/tuần</span>
          </div>
          <div className="week">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
              const isDone = (data.completedWorkouts || []).includes(day);
              const isToday = day === 'Tue';
              return (
                <div key={day} style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: 12, marginBottom: 6, display: 'block', fontWeight: 600 }}>{day}</span>
                  <span className={isDone ? 'done' : isToday ? 'today' : ''}>
                    {isDone ? '✓' : isToday ? '●' : '○'}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <div className="section-head">
            <div>
              <span className="eyebrow">TỔNG QUAN</span>
              <h2>Điểm chú ý hôm nay</h2>
            </div>
          </div>
          <ul className="insights">
            <li>🔥 Bench Press ghi nhận mức tạ mới: <b>57.5 kg</b> (+12% tháng này).</li>
            <li>
              🥩 Protein hiện tại: <b>{protein}g</b> (cần thêm <b>{Math.max(0, data.profile.protein - protein)}g</b>).
            </li>
            <li>💰 Đã chi tiêu: <b>{money(spent)}</b> / ngân sách ngày <b>{money(data.profile.budget)}</b>.</li>
            <li>🛌 Giấc ngủ đêm qua đạt <b>7h 30m</b>, chỉ số hồi phục 82/100 rất tốt.</li>
          </ul>
        </Card>
      </div>

      {/* MODAL THÊM BÀI TẬP NHANH TRÊN DASHBOARD */}
      {showAddExModal && (
        <div className="modal-backdrop" onClick={() => setShowAddExModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Thêm bài tập mới vào hôm nay</h3>
              <button className="modal-close" onClick={() => setShowAddExModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateExerciseSubmit}>
              <div className="modal-body">
                <div className="input-row">
                  <label>Tên bài tập</label>
                  <input
                    required
                    placeholder="Ví dụ: Incline Dumbbell Press, Squat, Lat Pulldown..."
                    value={newExForm.name}
                    onChange={e => setNewExForm({ ...newExForm, name: e.target.value })}
                  />
                </div>
                <div className="input-row">
                  <label>Nhóm cơ chính</label>
                  <select
                    value={newExForm.muscle}
                    onChange={e => setNewExForm({ ...newExForm, muscle: e.target.value })}
                  >
                    {muscleGroups.filter(g => g !== 'Tất cả').map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  <div className="input-row">
                    <label>Số Sets</label>
                    <input
                      type="number"
                      min="1"
                      value={newExForm.sets}
                      onChange={e => setNewExForm({ ...newExForm, sets: e.target.value })}
                    />
                  </div>
                  <div className="input-row">
                    <label>Số Reps</label>
                    <input
                      placeholder="8–10"
                      value={newExForm.reps}
                      onChange={e => setNewExForm({ ...newExForm, reps: e.target.value })}
                    />
                  </div>
                  <div className="input-row">
                    <label>Mức tạ (kg)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={newExForm.weight}
                      onChange={e => setNewExForm({ ...newExForm, weight: e.target.value })}
                    />
                  </div>
                </div>
                <div className="input-row">
                  <label>Ghi chú kỹ thuật (tùy chọn)</label>
                  <input
                    placeholder="Ví dụ: Gồng chặt cơ bụng, hạ tạ kiểm soát..."
                    value={newExForm.note}
                    onChange={e => setNewExForm({ ...newExForm, note: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-foot">
                <button type="button" className="btn-secondary" onClick={() => setShowAddExModal(false)}>
                  Hủy
                </button>
                <button type="submit" className="primary">
                  Lưu bài tập
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL THÊM BỮA ĂN NHANH TRÊN DASHBOARD */}
      {showAddMealModal && (
        <div className="modal-backdrop" onClick={() => setShowAddMealModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Ghi nhận bữa ăn mới hôm nay</h3>
              <button className="modal-close" onClick={() => setShowAddMealModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateMealSubmit}>
              <div className="modal-body">
                <div className="input-row">
                  <label>Bữa ăn</label>
                  <select
                    value={newMealForm.name}
                    onChange={e => setNewMealForm({ ...newMealForm, name: e.target.value })}
                  >
                    <option value="Sáng">Bữa Sáng 🌅</option>
                    <option value="Trưa">Bữa Trưa 🍗</option>
                    <option value="Tối">Bữa Tối 🥩</option>
                    <option value="Snack">Bữa Phụ / Snack 🥛</option>
                  </select>
                </div>
                <div className="input-row">
                  <label>Tên món ăn & Thực phẩm</label>
                  <input
                    required
                    placeholder="Ví dụ: Cơm + 200g ức gà + rau luộc..."
                    value={newMealForm.food}
                    onChange={e => setNewMealForm({ ...newMealForm, food: e.target.value })}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  <div className="input-row">
                    <label>Calo (kcal)</label>
                    <input
                      type="number"
                      required
                      value={newMealForm.cal}
                      onChange={e => setNewMealForm({ ...newMealForm, cal: e.target.value })}
                    />
                  </div>
                  <div className="input-row">
                    <label>Protein (g)</label>
                    <input
                      type="number"
                      required
                      value={newMealForm.protein}
                      onChange={e => setNewMealForm({ ...newMealForm, protein: e.target.value })}
                    />
                  </div>
                  <div className="input-row">
                    <label>Chi phí (₫)</label>
                    <input
                      type="number"
                      value={newMealForm.cost}
                      onChange={e => setNewMealForm({ ...newMealForm, cost: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-foot">
                <button type="button" className="btn-secondary" onClick={() => setShowAddMealModal(false)}>
                  Hủy
                </button>
                <button type="submit" className="primary">
                  Lưu bữa ăn
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

// ---------------- CALENDAR & MONTHLY STATS COMPONENT ----------------
function CalendarPage({ history, todayData, onUpdateDay, notify }) {
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(9); // 0-indexed: 9 = October
  const [selectedDateKey, setSelectedDateKey] = useState('2026-10-06');
  const [showEditModal, setShowEditModal] = useState(false);

  // Gộp dữ liệu hôm nay vào fullHistory
  const fullHistory = useMemo(() => {
    return {
      ...history,
      '2026-10-06': {
        status: todayData.status,
        program: todayData.program,
        exercises: todayData.exercises,
        meals: todayData.meals,
        cal: todayData.cal,
        protein: todayData.protein,
        cost: todayData.cost
      }
    };
  }, [history, todayData]);

  // Thống kê tháng hiện tại
  const monthStats = useMemo(() => {
    let workoutDays = 0;
    let restDays = 0;
    let totalCal = 0;
    let totalProtein = 0;
    let totalCost = 0;
    let daysRecorded = 0;

    const prefix = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
    Object.keys(fullHistory).forEach(key => {
      if (key.startsWith(prefix)) {
        const item = fullHistory[key];
        if (item.status === 'workout') workoutDays++;
        if (item.status === 'rest') restDays++;
        if (item.cal > 0) {
          totalCal += item.cal;
          totalProtein += item.protein;
          totalCost += (item.cost || 0);
          daysRecorded++;
        }
      }
    });

    return {
      workoutDays,
      restDays,
      avgCal: daysRecorded ? Math.round(totalCal / daysRecorded) : 0,
      avgProtein: daysRecorded ? Math.round(totalProtein / daysRecorded) : 0,
      totalCost
    };
  }, [fullHistory, currentYear, currentMonth]);

  // Ngày được chọn xem chi tiết
  const selectedDayInfo = fullHistory[selectedDateKey] || {
    status: 'off',
    program: 'Chưa có lịch',
    exercises: [],
    meals: [],
    cal: 0,
    protein: 0,
    cost: 0
  };

  // State chỉnh sửa ngày trong modal
  const [editingDay, setEditingDay] = useState(selectedDayInfo);
  const [newExForm, setNewExForm] = useState({ name: '', sets: 3, reps: '8-10', weight: 40 });
  const [newMealForm, setNewMealForm] = useState({ name: 'Trưa', food: '', cal: 500, protein: 40, cost: 35000 });

  const handleOpenEdit = (dateStr) => {
    setSelectedDateKey(dateStr);
    const dayData = fullHistory[dateStr] || {
      status: 'off',
      program: '',
      exercises: [],
      meals: [],
      cal: 0,
      protein: 0,
      cost: 0
    };
    setEditingDay(dayData);
    setShowEditModal(true);
  };

  const handleSaveDayEdit = () => {
    // Tính lại calo, protein, cost từ danh sách món ăn
    const cal = editingDay.meals.reduce((s, m) => s + (Number(m.cal) || 0), 0);
    const protein = editingDay.meals.reduce((s, m) => s + (Number(m.protein) || 0), 0);
    const cost = editingDay.meals.reduce((s, m) => s + (Number(m.cost) || 0), 0);

    const updated = {
      ...editingDay,
      cal,
      protein,
      cost
    };

    onUpdateDay(selectedDateKey, updated);
    setShowEditModal(false);
  };

  // Helper tính toán các ngày trong tháng
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7; // Thứ 2 = 0

  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  return (
    <>
      {/* Monthly Statistics Summary */}
      <div className="grid metrics">
        <Metric
          icon={I.Dumbbell}
          label="BUỔI TẬP THÁNG"
          value={`${monthStats.workoutDays} buổi`}
          sub="Đã hoàn thành xuất sắc"
          good
        />
        <Metric
          icon={I.BatteryMedium}
          label="NGÀY NGHỈ PHỤC HỒI"
          value={`${monthStats.restDays} ngày`}
          sub="Phục hồi cơ bắp đúng chuẩn"
          good
        />
        <Metric
          icon={I.Flame}
          label="TRUNG BÌNH CALO"
          value={`${monthStats.avgCal} kcal`}
          sub="Trung bình mỗi ngày"
        />
        <Metric
          icon={I.Beef}
          label="TRUNG BÌNH PROTEIN"
          value={`${monthStats.avgProtein} g`}
          sub="Đạt mục tiêu phát triển cơ"
          good
        />
        <Metric
          icon={I.Wallet}
          label="TIỀN ĂN TRONG THÁNG"
          value={money(monthStats.totalCost)}
          sub="Tổng chi tiêu ăn uống"
          good
        />
      </div>

      {/* Calendar Card */}
      <div className="calendar-card">
        <div className="calendar-nav-bar">
          <div className="cal-month-title">
            <I.Calendar size={22} color="#0284c7" />
            <span>{monthNames[currentMonth]} · {currentYear}</span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="cal-nav-btn" onClick={prevMonth}>
              <I.ChevronLeft size={16} /> Tháng trước
            </button>
            <button className="cal-nav-btn" onClick={() => { setCurrentMonth(9); setCurrentYear(2026); }}>
              Hiện tại
            </button>
            <button className="cal-nav-btn" onClick={nextMonth}>
              Tháng sau <I.ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="calendar-grid" style={{ marginBottom: 8 }}>
          {['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'].map(d => (
            <div className="cal-day-header" key={d}>{d}</div>
          ))}
        </div>

        {/* Calendar Days Grid */}
        <div className="calendar-grid">
          {/* Empty cells before 1st day */}
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div className="cal-day-cell other-month" key={'prev-' + i} />
          ))}

          {/* Days of month */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const item = fullHistory[dateStr];
            const isToday = dateStr === '2026-10-06';
            const isSelected = dateStr === selectedDateKey;

            return (
              <div
                className={`cal-day-cell ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                key={dateStr}
                onClick={() => handleOpenEdit(dateStr)}
              >
                <div className="cal-day-top">
                  <span className="cal-day-num">{dayNum}</span>
                  {item?.status === 'workout' && (
                    <span className="cal-status-badge badge-workout">🏋️ Tập</span>
                  )}
                  {item?.status === 'rest' && (
                    <span className="cal-status-badge badge-rest">🛌 Nghỉ</span>
                  )}
                  {!item || item.status === 'off' ? (
                    <span className="cal-status-badge badge-off">⚪ Trống</span>
                  ) : null}
                </div>

                {item?.status === 'workout' && item?.program && (
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#0284c7', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.program}
                  </div>
                )}

                {item?.cal > 0 && (
                  <div className="cal-macro-sub">
                    {item.cal} kcal · {item.protein}g P
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal View & Edit Day Details - FULLSCREEN TO RÕ RÀNG */}
      {showEditModal && (
        <div className="modal-backdrop" onClick={() => setShowEditModal(false)}>
          <div className="modal modal-fullscreen" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <span className="eyebrow">CHỈNH SỬA & XEM CHI TIẾT THEO NGÀY</span>
                <h3 style={{ margin: '4px 0 0', fontSize: 24 }}>📅 Ngày {selectedDateKey}</h3>
              </div>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>✕</button>
            </div>

            <div className="modal-body">
              {/* Day Status Toggle */}
              <div style={{ background: 'var(--bg-subtle)', padding: '18px 22px', borderRadius: 18, border: '1px solid var(--border-card)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <b style={{ fontSize: 15, display: 'block', color: 'var(--text-main)' }}>
                    Trạng thái ngày {selectedDateKey}:
                  </b>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    Chọn trạng thái để hệ thống tự động ghi nhận vào biểu đồ chuyên cần
                  </span>
                </div>
                <div className="toggle-switch">
                  <button
                    className={editingDay.status === 'workout' ? 'active' : ''}
                    onClick={() => setEditingDay({ ...editingDay, status: 'workout', program: editingDay.program || 'Upper Body' })}
                  >
                    🏋️ Có đi tập
                  </button>
                  <button
                    className={editingDay.status === 'rest' ? 'active' : ''}
                    onClick={() => setEditingDay({ ...editingDay, status: 'rest', program: 'Nghỉ ngơi' })}
                  >
                    🛌 Nghỉ ngơi (Rest)
                  </button>
                  <button
                    className={editingDay.status === 'off' ? 'active' : ''}
                    onClick={() => setEditingDay({ ...editingDay, status: 'off', program: '' })}
                  >
                    ⚪ Chưa ghi nhận
                  </button>
                </div>
              </div>

              <div className="modal-two-col">
                {/* Left Col: Exercises of the Day */}
                <div style={{ background: 'var(--bg-subtle)', padding: 22, borderRadius: 20, border: '1px solid var(--border-card)', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div>
                      <b style={{ fontSize: 16, display: 'block' }}>🏋️ Buổi tập hôm đó</b>
                      <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                        Giáo trình tập: <strong style={{ color: '#0284c7' }}>{editingDay.program || 'Chưa chọn'}</strong>
                      </span>
                    </div>
                    {editingDay.status === 'workout' && (
                      <select
                        value={editingDay.program}
                        onChange={e => setEditingDay({ ...editingDay, program: e.target.value })}
                        style={{ padding: '8px 14px', borderRadius: 10, fontSize: 13, fontWeight: 700, background: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border-card)' }}
                      >
                        {Object.keys(workoutPrograms).map(p => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    )}
                  </div>

                  {editingDay.status === 'workout' ? (
                    <>
                      {/* Exercise list */}
                      <div style={{ minHeight: 180, maxHeight: 260, overflowY: 'auto', display: 'grid', gap: 10, marginBottom: 16, paddingRight: 4 }}>
                        {(!editingDay.exercises || editingDay.exercises.length === 0) ? (
                          <p style={{ color: 'var(--text-muted)', fontSize: 13.5, textAlign: 'center', padding: '36px 0' }}>Chưa có bài tập nào được ghi nhận cho ngày này.</p>
                        ) : (
                          editingDay.exercises.map((ex, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-card)', padding: '12px 16px', borderRadius: 14, border: '1px solid var(--border-subtle)', fontSize: 14 }}>
                              <div>
                                <b style={{ fontSize: 15 }}>{ex.name}</b>
                                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 12.5, marginTop: 3 }}>
                                  {ex.sets} sets × {ex.reps} · <strong style={{ color: '#0284c7' }}>{ex.weight} kg</strong>
                                </span>
                              </div>
                              <button
                                className="action-icon-btn"
                                onClick={() => setEditingDay({ ...editingDay, exercises: editingDay.exercises.filter((_, i) => i !== idx) })}
                                title="Xóa bài tập"
                              >
                                <I.Trash2 size={16} />
                              </button>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Add Exercise form - 2 HÀNG RỘNG RÃI */}
                      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 14, marginTop: 'auto' }}>
                        <span style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--primary)', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                          + Thêm bài tập vào ngày này:
                        </span>
                        <div style={{ display: 'grid', gap: 8 }}>
                          <input
                            placeholder="Nhập tên bài tập (vd: Incline Dumbbell Press, Squat, Bench Press)..."
                            value={newExForm.name}
                            onChange={e => setNewExForm({ ...newExForm, name: e.target.value })}
                            style={{ padding: '10px 14px', borderRadius: 10, fontSize: 13.5 }}
                          />
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 8 }}>
                            <input
                              placeholder="Sets (hiệp)"
                              type="number"
                              value={newExForm.sets}
                              onChange={e => setNewExForm({ ...newExForm, sets: e.target.value })}
                              style={{ padding: '10px 12px', borderRadius: 10, fontSize: 13 }}
                            />
                            <input
                              placeholder="Reps (lần)"
                              value={newExForm.reps}
                              onChange={e => setNewExForm({ ...newExForm, reps: e.target.value })}
                              style={{ padding: '10px 12px', borderRadius: 10, fontSize: 13 }}
                            />
                            <input
                              placeholder="Tạ (kg)"
                              type="number"
                              value={newExForm.weight}
                              onChange={e => setNewExForm({ ...newExForm, weight: e.target.value })}
                              style={{ padding: '10px 12px', borderRadius: 10, fontSize: 13 }}
                            />
                            <button
                              className="primary"
                              style={{ padding: '10px 18px', fontSize: 13.5, whiteSpace: 'nowrap' }}
                              onClick={() => {
                                if (!newExForm.name.trim()) return;
                                setEditingDay({
                                  ...editingDay,
                                  exercises: [...(editingDay.exercises || []), { ...newExForm, sets: Number(newExForm.sets), weight: Number(newExForm.weight) }]
                                });
                                setNewExForm({ name: '', sets: 3, reps: '8-10', weight: 40 });
                              }}
                            >
                              <I.Plus size={16} /> Thêm bài
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '48px 16px', color: 'var(--text-muted)' }}>
                      <div style={{ fontSize: 44, marginBottom: 10 }}>🛌</div>
                      <p style={{ fontSize: 14.5, margin: 0 }}>
                        {editingDay.status === 'rest' ? 'Hôm nay là Ngày nghỉ phục hồi cơ bắp (Rest Day)' : 'Chưa có lịch tập cho ngày này. Bấm "Có đi tập" để thêm buổi tập.'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Right Col: Meals of the Day */}
                <div style={{ background: 'var(--bg-subtle)', padding: 22, borderRadius: 20, border: '1px solid var(--border-card)', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div>
                      <b style={{ fontSize: 16, display: 'block' }}>🥗 Các món đã ăn hôm đó</b>
                      <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                        Tổng cộng: <strong style={{ color: '#0284c7' }}>{editingDay.meals?.reduce((s, m) => s + (Number(m.cal) || 0), 0) || 0} kcal</strong> · <strong style={{ color: '#0284c7' }}>{editingDay.meals?.reduce((s, m) => s + (Number(m.protein) || 0), 0) || 0}g Protein</strong>
                      </span>
                    </div>
                  </div>

                  <div style={{ minHeight: 180, maxHeight: 260, overflowY: 'auto', display: 'grid', gap: 10, marginBottom: 16, paddingRight: 4 }}>
                    {(!editingDay.meals || editingDay.meals.length === 0) ? (
                      <p style={{ color: 'var(--text-muted)', fontSize: 13.5, textAlign: 'center', padding: '36px 0' }}>Chưa có món ăn nào được ghi nhận cho ngày này.</p>
                    ) : (
                      editingDay.meals.map((m, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-card)', padding: '12px 16px', borderRadius: 14, border: '1px solid var(--border-subtle)', fontSize: 14 }}>
                          <div>
                            <b style={{ fontSize: 15 }}>{m.name}: {m.food}</b>
                            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: 12.5, marginTop: 3 }}>
                              {m.cal} kcal · <strong style={{ color: '#0284c7' }}>{m.protein}g Protein</strong> · {money(m.cost || 0)}
                            </span>
                          </div>
                          <button
                            className="action-icon-btn"
                            onClick={() => setEditingDay({ ...editingDay, meals: editingDay.meals.filter((_, i) => i !== idx) })}
                            title="Xóa món ăn"
                          >
                            <I.Trash2 size={16} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Meal form - 2 HÀNG RỘNG RÃI */}
                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 14, marginTop: 'auto' }}>
                    <span style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--primary)', display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                      + Thêm món ăn vào ngày này:
                    </span>
                    <div style={{ display: 'grid', gap: 8 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 8 }}>
                        <select
                          value={newMealForm.name}
                          onChange={e => setNewMealForm({ ...newMealForm, name: e.target.value })}
                          style={{ padding: '10px 12px', borderRadius: 10, fontSize: 13, background: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border-card)', fontWeight: 700 }}
                        >
                          <option value="Sáng">Bữa Sáng</option>
                          <option value="Trưa">Bữa Trưa</option>
                          <option value="Tối">Bữa Tối</option>
                          <option value="Snack">Bữa Phụ</option>
                        </select>
                        <input
                          placeholder="Tên món ăn (vd: Cơm + 200g ức gà + rau)..."
                          value={newMealForm.food}
                          onChange={e => setNewMealForm({ ...newMealForm, food: e.target.value })}
                          style={{ padding: '10px 14px', borderRadius: 10, fontSize: 13.5 }}
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 8 }}>
                        <input
                          placeholder="Calo (kcal)"
                          type="number"
                          value={newMealForm.cal}
                          onChange={e => setNewMealForm({ ...newMealForm, cal: e.target.value })}
                          style={{ padding: '10px 12px', borderRadius: 10, fontSize: 13 }}
                        />
                        <input
                          placeholder="Protein (g)"
                          type="number"
                          value={newMealForm.protein}
                          onChange={e => setNewMealForm({ ...newMealForm, protein: e.target.value })}
                          style={{ padding: '10px 12px', borderRadius: 10, fontSize: 13 }}
                        />
                        <input
                          placeholder="Chi phí (₫)"
                          type="number"
                          value={newMealForm.cost}
                          onChange={e => setNewMealForm({ ...newMealForm, cost: e.target.value })}
                          style={{ padding: '10px 12px', borderRadius: 10, fontSize: 13 }}
                        />
                        <button
                          className="primary"
                          style={{ padding: '10px 18px', fontSize: 13.5, whiteSpace: 'nowrap' }}
                          onClick={() => {
                            if (!newMealForm.food.trim()) return;
                            setEditingDay({
                              ...editingDay,
                              meals: [...(editingDay.meals || []), { ...newMealForm, cal: Number(newMealForm.cal), protein: Number(newMealForm.protein), cost: Number(newMealForm.cost) }]
                            });
                            setNewMealForm({ name: 'Trưa', food: '', cal: 500, protein: 40, cost: 35000 });
                          }}
                        >
                          <I.Plus size={16} /> Thêm món
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-foot">
              <button type="button" className="btn-secondary" onClick={() => setShowEditModal(false)}>
                Hủy bỏ
              </button>
              <button type="button" className="primary" onClick={handleSaveDayEdit}>
                <I.Save size={16} /> Lưu thay đổi ngày {selectedDateKey}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ---------------- WORKOUT COMPONENT ----------------
function Workout({ data, setData, notify }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90);
  const [timerRunning, setTimerRunning] = useState(false);

  const completedTodayExercises = data.completedTodayExercises || [];

  const [newEx, setNewEx] = useState({
    name: '',
    muscle: 'Ngực',
    sets: 3,
    reps: '8–10',
    weight: 40,
    note: ''
  });

  useEffect(() => {
    let interval = null;
    if (timerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timerRunning && timeLeft === 0) {
      setTimerRunning(false);
      playBeep();
      notify('⏰ Hết giờ nghỉ! Vào hiệp tiếp theo thôi 💪');
    }
    return () => clearInterval(interval);
  }, [timerRunning, timeLeft]);

  const toggleCheck = (idx) => {
    const isDone = completedTodayExercises.includes(idx);
    const updated = isDone
      ? completedTodayExercises.filter(i => i !== idx)
      : [...completedTodayExercises, idx];
    setData(d => ({ ...d, completedTodayExercises: updated }));
    notify(isDone ? 'Đã bỏ đánh dấu hoàn thành' : 'Đã hoàn thành bài tập! Rất tốt 🔥');
  };

  const handleSelectProgram = (programKey) => {
    const programExercises = workoutPrograms[programKey] || [];
    setData(d => ({
      ...d,
      selectedProgram: programKey,
      exercises: programExercises.length ? programExercises : d.exercises,
      completedTodayExercises: []
    }));
    notify(`Đã đổi sang giáo trình: ${programKey}`);
  };

  const handleToggleDayStatus = (status) => {
    setData(d => ({ ...d, todayStatus: status }));
    notify(status === 'workout' ? 'Đã bật chế độ: Hôm nay đi tập 🏋️' : 'Đã bật chế độ: Hôm nay nghỉ ngơi 🛌');
  };

  const handleDeleteExercise = (idx) => {
    setData(d => ({
      ...d,
      exercises: d.exercises.filter((_, i) => i !== idx)
    }));
    notify('Đã xóa bài tập');
  };

  const handleCreateExercise = (e) => {
    e.preventDefault();
    if (!newEx.name.trim()) return;
    setData(d => ({
      ...d,
      exercises: [...d.exercises, { ...newEx, sets: Number(newEx.sets), weight: Number(newEx.weight) }]
    }));
    setShowAddModal(false);
    setNewEx({ name: '', muscle: 'Ngực', sets: 3, reps: '8–10', weight: 40, note: '' });
    notify(`Đã thêm bài tập: ${newEx.name}`);
  };

  const handleFinishWorkout = () => {
    setData(d => ({
      ...d,
      completedWorkouts: Array.from(new Set([...(d.completedWorkouts || []), 'Tue'])),
      completedTodayExercises: (d.exercises || []).map((_, i) => i)
    }));
    notify('🎉 Chúc mừng bạn đã hoàn thành buổi tập hôm nay! Đã cập nhật vào tiến độ tuần.');
  };

  const completedCount = (data.completedTodayExercises || []).length;
  const progressPercent = (data.exercises || []).length > 0
    ? Math.round((completedCount / data.exercises.length) * 100)
    : 0;

  const isRest = data.todayStatus === 'rest';

  return (
    <>
      <div className="check-in-banner">
        <div>
          <span className="eyebrow">ĐIỂM DANH HÔM NAY</span>
          <b style={{ display: 'block', fontSize: 17, marginTop: 4 }}>
            {isRest ? 'Hôm nay: Nghỉ ngơi phục hồi (Rest Day) 🛌' : `Hôm nay: Có đi tập (${data.selectedProgram}) 🏋️`}
          </b>
        </div>
        <div className="toggle-switch">
          <button
            className={!isRest ? 'active' : ''}
            onClick={() => handleToggleDayStatus('workout')}
          >
            Đi tập hôm nay
          </button>
          <button
            className={isRest ? 'active' : ''}
            onClick={() => handleToggleDayStatus('rest')}
          >
            Hôm nay nghỉ
          </button>
        </div>
      </div>

      {isRest ? (
        <Card style={{ padding: 40, textAlign: 'center' }}>
          <div style={{ fontSize: 54, marginBottom: 16 }}>🛌</div>
          <h2>Hôm nay là Ngày Nghỉ Ngơi (Rest Day)</h2>
          <p style={{ maxWidth: 540, margin: '10px auto 24px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Cơ bắp chỉ phát triển khi bạn nghỉ ngơi và nạp đủ dinh dưỡng. Hãy tập trung ăn đủ {data.profile.protein}g protein, uống đủ 2.5L nước và ngủ sớm tối nay.
          </p>
          <div style={{ display: 'inline-flex', gap: 12 }}>
            <button className="primary" onClick={() => handleToggleDayStatus('workout')}>
              Đổi ý: Hôm nay tôi muốn đi tập!
            </button>
          </div>
        </Card>
      ) : (
        <>
          <div className="workout-hero">
            <div>
              <span className="eyebrow">GIÁO TRÌNH HIỆN TẠI</span>
              <h2>{data.selectedProgram} · Hypertrophy</h2>
              <p>Thời lượng: ~{data.profile.minutes} phút · Tiến độ: {completedCount}/{data.exercises.length} bài ({progressPercent}%)</p>
              <div className="progress-bar-wrap" style={{ maxWidth: 380 }}>
                <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button className="primary" onClick={handleFinishWorkout}>
                <I.CheckCircle2 size={16} /> Hoàn thành buổi tập
              </button>
            </div>
          </div>

          <div className="program-select">
            {Object.keys(workoutPrograms).map(prog => (
              <button
                key={prog}
                className={'program-btn ' + (data.selectedProgram === prog ? 'active' : '')}
                onClick={() => handleSelectProgram(prog)}
              >
                {prog}
              </button>
            ))}
          </div>

          <div className="two-col">
            <Card>
              <div className="section-head">
                <div>
                  <h2>Danh sách bài tập hôm nay</h2>
                  <span className="pill">{data.exercises.length} bài tập</span>
                </div>
                <button className="primary" onClick={() => setShowAddModal(true)} style={{ fontSize: 13, padding: '9px 14px' }}>
                  <I.Plus size={16} /> Thêm bài tập
                </button>
              </div>

              {data.exercises.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '28px 0' }}>
                  Chưa có bài tập nào. Bấm "+ Thêm bài tập" để tạo bài tập mới!
                </p>
              ) : (
                data.exercises.map((e, i) => {
                  const isDone = completedTodayExercises.includes(i);
                  return (
                    <div className={'exercise ' + (isDone ? 'completed' : '')} key={i}>
                      <div className="exercise-num">0{i + 1}</div>
                      <div className="exercise-main">
                        <b>{e.name}</b>
                        <span>{e.muscle} · {e.sets} sets · {e.reps} {e.note ? `· ${e.note}` : ''}</span>
                      </div>
                      <div className="weight">{e.weight} kg</div>
                      <button
                        className="check"
                        onClick={() => toggleCheck(i)}
                        title={isDone ? 'Bỏ đánh dấu' : 'Đánh dấu hoàn thành'}
                      >
                        {isDone ? <I.Check size={20} color="#0284c7" /> : <I.Circle size={20} />}
                      </button>
                      <button
                        className="action-icon-btn"
                        onClick={() => handleDeleteExercise(i)}
                        title="Xóa bài tập"
                      >
                        <I.Trash2 size={16} />
                      </button>
                    </div>
                  );
                })
              )}
            </Card>

            <div>
              <Card style={{ marginBottom: 18 }}>
                <span className="eyebrow">ĐỒNG HỒ NGHỈ (REST TIMER)</span>
                <h2>Thời gian nghỉ giữa các hiệp</h2>

                <div className="timer-box">
                  <div className="timer-display">
                    {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}
                  </div>
                  <div className="timer-actions">
                    <button
                      className="timer-btn"
                      onClick={() => setTimerRunning(!timerRunning)}
                    >
                      {timerRunning ? <><I.Pause size={14} /> Tạm dừng</> : <><I.Play size={14} /> Bắt đầu</>}
                    </button>
                    <button
                      className="timer-btn"
                      onClick={() => { setTimeLeft(90); setTimerRunning(false); }}
                      title="Đặt lại 90s"
                    >
                      <I.RotateCcw size={14} />
                    </button>
                    <button
                      className="timer-btn"
                      onClick={() => setTimeLeft(t => t + 30)}
                    >
                      +30s
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  {[60, 90, 120, 180].map(s => (
                    <button
                      key={s}
                      className="filter-btn"
                      onClick={() => { setTimeLeft(s); setTimerRunning(true); }}
                      style={{ flex: 1, textAlign: 'center' }}
                    >
                      {s >= 60 ? `${s / 60}p` : `${s}s`}
                    </button>
                  ))}
                </div>
              </Card>

              <Card>
                <span className="eyebrow">TĂNG TẢI TIỆM TIẾN (PROGRESSIVE OVERLOAD)</span>
                <h2>Mục tiêu nâng tạ hôm nay</h2>
                <div className="target">
                  <b>Barbell Bench Press</b>
                  <strong>57.5 kg × 8–10 reps</strong>
                  <span>Kỷ lục lần trước: 55 kg × 10 reps (hoàn thành xuất sắc)</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                  💡 <b>Mẹo từ Coach:</b> Nếu hiệp 1 đẩy được 10 reps thoải mái, hãy giữ mức 57.5 kg cho hiệp 2 và 3. Luôn có người đỡ tạ (spotter) hoặc dùng chốt an toàn.
                </p>
              </Card>
            </div>
          </div>
        </>
      )}

      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Thêm bài tập mới vào buổi tập hôm nay</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateExercise}>
              <div className="modal-body">
                <div className="input-row">
                  <label>Tên bài tập</label>
                  <input
                    required
                    placeholder="Ví dụ: Incline Dumbbell Press, Pull-up, Squat..."
                    value={newEx.name}
                    onChange={e => setNewEx({ ...newEx, name: e.target.value })}
                  />
                </div>
                <div className="input-row">
                  <label>Nhóm cơ chính</label>
                  <select
                    value={newEx.muscle}
                    onChange={e => setNewEx({ ...newEx, muscle: e.target.value })}
                  >
                    {muscleGroups.filter(g => g !== 'Tất cả').map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  <div className="input-row">
                    <label>Số Sets (Hiệp)</label>
                    <input
                      type="number"
                      min="1"
                      value={newEx.sets}
                      onChange={e => setNewEx({ ...newEx, sets: e.target.value })}
                    />
                  </div>
                  <div className="input-row">
                    <label>Số Reps</label>
                    <input
                      placeholder="8–10"
                      value={newEx.reps}
                      onChange={e => setNewEx({ ...newEx, reps: e.target.value })}
                    />
                  </div>
                  <div className="input-row">
                    <label>Mức tạ (kg)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={newEx.weight}
                      onChange={e => setNewEx({ ...newEx, weight: e.target.value })}
                    />
                  </div>
                </div>
                <div className="input-row">
                  <label>Ghi chú kỹ thuật / Cảm nhận</label>
                  <input
                    placeholder="Ví dụ: Nghỉ 90s, hạ tạ chậm 2 giây..."
                    value={newEx.note}
                    onChange={e => setNewEx({ ...newEx, note: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-foot">
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>
                  Hủy
                </button>
                <button type="submit" className="primary">
                  Thêm bài tập
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

// ---------------- RECIPES & COOKING & COMBO COMPONENT ----------------
function RecipesPage({
  recipes,
  myRecipes = [],
  combos = [],
  ingredients = standardIngredients,
  onAddMeal,
  onAddRecipe,
  onSaveToMyRecipes,
  onCreateMyRecipe,
  onDeleteMyRecipe,
  onEatCombo,
  onCreateCombo,
  onDeleteCombo,
  notify
}) {
  const [tab, setTab] = useState('suggested'); // 'suggested' | 'my_recipes' | 'combos'
  const [filter, setFilter] = useState('Tất cả');
  const [search, setSearch] = useState('');
  const [activeRecipe, setActiveRecipe] = useState(null);
  const [selectedMealType, setSelectedMealType] = useState('Trưa');

  // Modal tạo món của tôi
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRecipe, setNewRecipe] = useState({
    name: '',
    category: 'High Protein',
    mealType: 'Trưa / Tối',
    time: '20 phút',
    cal: 400,
    protein: 40,
    carbs: 20,
    fat: 10,
    cost: 35000,
    emoji: '🍲',
    image: '',
    summary: '',
    beginnerTip: '',
    videoUrl: '',
    ingredientsText: '',
    stepsText: ''
  });

  // State chọn nguyên liệu để máy tự tính trong Modal Tạo Món
  const [selectedIngredientsInRecipe, setSelectedIngredientsInRecipe] = useState([]);

  // State Trình tạo Combo Mới
  const [showComboCreator, setShowComboCreator] = useState(false);
  const [newCombo, setNewCombo] = useState({
    name: '',
    icon: '🍱',
    goal: 'Tăng cơ nạc (Lean Bulk)',
    bestTime: 'Trưa',
    summary: ''
  });
  const [comboSelectedIngredients, setComboSelectedIngredients] = useState([
    { id: 'uc-ga', qty: 2 }, // 200g ức gà
    { id: 'com-trang', qty: 1 }, // 1 bát cơm
    { id: 'sup-lo', qty: 1 } // 100g súp lơ
  ]);
  const [comboMealType, setComboMealType] = useState('Trưa');

  const categories = ['Tất cả', 'High Protein', 'Budget Friendly', 'Mass Gainer'];

  // Lọc món gợi ý
  const filteredSuggested = recipes.filter(r => {
    const matchCategory = filter === 'Tất cả' || r.category === filter;
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
      (r.ingredients && r.ingredients.some(ing => ing.toLowerCase().includes(search.toLowerCase())));
    return matchCategory && matchSearch;
  });

  // Lọc món của tôi
  const filteredMyRecipes = myRecipes.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
      (r.ingredients && r.ingredients.some(ing => ing.toLowerCase().includes(search.toLowerCase())));
    return matchSearch;
  });

  // Nạp món vào nhật ký hôm nay
  const handleLogMeal = (recipe, mealName = selectedMealType) => {
    onAddMeal({
      name: mealName,
      food: recipe.name,
      cal: Number(recipe.cal),
      protein: Number(recipe.protein),
      cost: Number(recipe.cost || 0)
    });
    setActiveRecipe(null);
  };

  // Tính toán dinh dưỡng tự động cho Trình Tạo Combo
  const comboTotals = useMemo(() => {
    let cal = 0;
    let protein = 0;
    let carbs = 0;
    let fat = 0;
    let cost = 0;
    const itemsList = [];

    comboSelectedIngredients.forEach(sel => {
      const ing = ingredients.find(i => i.id === sel.id);
      if (ing && sel.qty > 0) {
        cal += Math.round(ing.cal * sel.qty);
        protein += Math.round(ing.protein * sel.qty);
        carbs += Math.round(ing.carbs * sel.qty);
        fat += Math.round(ing.fat * sel.qty);
        cost += Math.round(ing.cost * sel.qty);
        itemsList.push(`${ing.name} (x${sel.qty} ${ing.unit})`);
      }
    });

    return { cal, protein, carbs, fat, cost, itemsList };
  }, [comboSelectedIngredients, ingredients]);

  // Cập nhật số lượng nguyên liệu trong combo
  const handleUpdateComboIngQty = (id, delta) => {
    setComboSelectedIngredients(prev => {
      const existing = prev.find(p => p.id === id);
      if (!existing && delta > 0) {
        return [...prev, { id, qty: delta }];
      }
      return prev
        .map(p => (p.id === id ? { ...p, qty: Math.max(0, p.qty + delta) } : p))
        .filter(p => p.qty > 0);
    });
  };

  // Tính toán tự động cho Modal Tạo món ăn
  const handleApplyIngredientsToNewRecipe = () => {
    let cal = 0;
    let protein = 0;
    let carbs = 0;
    let fat = 0;
    let cost = 0;
    const ingTexts = [];

    selectedIngredientsInRecipe.forEach(sel => {
      const ing = ingredients.find(i => i.id === sel.id);
      if (ing && sel.qty > 0) {
        cal += Math.round(ing.cal * sel.qty);
        protein += Math.round(ing.protein * sel.qty);
        carbs += Math.round(ing.carbs * sel.qty);
        fat += Math.round(ing.fat * sel.qty);
        cost += Math.round(ing.cost * sel.qty);
        ingTexts.push(`${ing.name}: ${sel.qty} x ${ing.unit}`);
      }
    });

    setNewRecipe(prev => ({
      ...prev,
      cal: cal || prev.cal,
      protein: protein || prev.protein,
      carbs: carbs || prev.carbs,
      fat: fat || prev.fat,
      cost: cost || prev.cost,
      ingredientsText: ingTexts.length > 0 ? ingTexts.join('\n') : prev.ingredientsText
    }));
  };

  // Submit Lưu món vào Thực đơn của tôi
  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newRecipe.name.trim()) return;

    const recipeToAdd = {
      id: 'my-' + Date.now(),
      name: newRecipe.name.trim(),
      category: newRecipe.category,
      mealType: newRecipe.mealType,
      time: newRecipe.time,
      cal: Number(newRecipe.cal),
      protein: Number(newRecipe.protein),
      carbs: Number(newRecipe.carbs),
      fat: Number(newRecipe.fat),
      cost: Number(newRecipe.cost),
      emoji: newRecipe.emoji || '🍽️',
      image: newRecipe.image.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      summary: newRecipe.summary || 'Món ăn do bạn tự chuẩn bị và chế biến.',
      beginnerTip: newRecipe.beginnerTip || 'Mẹo của bạn: Nêm nếm vừa phải, theo dõi thời gian nấu để thức ăn giữ được trọn vẹn chất đạm.',
      videoUrl: newRecipe.videoUrl.trim(),
      ingredients: newRecipe.ingredientsText.split('\n').filter(s => s.trim()),
      steps: newRecipe.stepsText.split('\n').filter(s => s.trim())
    };

    onCreateMyRecipe(recipeToAdd);
    setShowCreateModal(false);
    setSelectedIngredientsInRecipe([]);
    setNewRecipe({
      name: '',
      category: 'High Protein',
      mealType: 'Trưa / Tối',
      time: '20 phút',
      cal: 400,
      protein: 40,
      carbs: 20,
      fat: 10,
      cost: 35000,
      emoji: '🍲',
      image: '',
      summary: '',
      beginnerTip: '',
      videoUrl: '',
      ingredientsText: '',
      stepsText: ''
    });
  };

  // Submit Lưu Combo mới
  const handleSaveCustomCombo = () => {
    if (!newCombo.name.trim()) {
      notify('Vui lòng nhập tên Combo!');
      return;
    }
    if (comboTotals.itemsList.length === 0) {
      notify('Vui lòng chọn ít nhất 1 nguyên liệu cho combo!');
      return;
    }

    const created = {
      id: 'combo-' + Date.now(),
      name: newCombo.name.trim(),
      target: newCombo.goal,
      mealType: newCombo.bestTime,
      image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80',
      items: comboTotals.itemsList,
      cal: comboTotals.cal,
      protein: comboTotals.protein,
      carbs: comboTotals.carbs,
      fat: comboTotals.fat,
      cost: comboTotals.cost,
      summary: newCombo.summary || `Combo tự phối: ${comboTotals.cal} kcal, ${comboTotals.protein}g Protein chuẩn dinh dưỡng.`
    };

    onCreateCombo(created);
    setShowComboCreator(false);
    setNewCombo({
      name: '',
      icon: '🍱',
      goal: 'Tăng cơ nạc (Lean Bulk)',
      bestTime: 'Trưa',
      summary: ''
    });
  };

  const youtubeEmbed = activeRecipe ? getYoutubeEmbedUrl(activeRecipe.videoUrl) : null;

  return (
    <>
      {/* 3 SUB-NAVIGATION TABS */}
      <div className="sub-nav-tabs">
        <button
          className={'sub-nav-tab ' + (tab === 'suggested' ? 'active' : '')}
          onClick={() => setTab('suggested')}
        >
          <I.Sparkles size={17} /> ✨ Thực đơn gợi ý (Ảnh thật & Cách nấu)
        </button>
        <button
          className={'sub-nav-tab ' + (tab === 'my_recipes' ? 'active' : '')}
          onClick={() => setTab('my_recipes')}
        >
          <I.BookOpen size={17} /> 📋 Thực đơn của tôi ({myRecipes.length})
        </button>
        <button
          className={'sub-nav-tab ' + (tab === 'combos' ? 'active' : '')}
          onClick={() => setTab('combos')}
        >
          <I.ChefHat size={17} /> 🍱 Combo Bữa Ăn & Tính Calo ({combos.length})
        </button>
      </div>

      {/* ================= TAB 1: THỰC ĐƠN GỢI Ý ================= */}
      {tab === 'suggested' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 14 }}>
            <div className="recipe-filter-bar" style={{ margin: 0 }}>
              {categories.map(c => (
                <button
                  key={c}
                  className={'filter-btn ' + (filter === c ? 'active' : '')}
                  onClick={() => setFilter(c)}
                >
                  {c === 'High Protein' ? '🥩 Giàu Protein' : c === 'Budget Friendly' ? '💰 Tiết kiệm' : c === 'Mass Gainer' ? '⚡ Tăng cân calo cao' : c}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flex: 1, maxWidth: 360, minWidth: 240 }}>
              <input
                style={{
                  width: '100%',
                  padding: '11px 18px',
                  borderRadius: 20,
                  border: '1px solid var(--border-card)',
                  background: 'var(--bg-card)',
                  color: 'var(--text-main)',
                  fontSize: 13.5,
                  outline: 'none'
                }}
                placeholder="🔍 Tìm món, ức gà, bò, cá..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="recipe-grid">
            {filteredSuggested.map(recipe => (
              <div className="recipe-card" key={recipe.id || recipe.name}>
                {/* Ảnh món ăn thật sắc nét */}
                {recipe.image ? (
                  <div className="recipe-img-box">
                    <img src={recipe.image} alt={recipe.name} loading="lazy" />
                    <span className="recipe-img-tag">
                      {recipe.category === 'High Protein' ? '🥩 Giàu Protein' : recipe.category === 'Budget Friendly' ? '💰 Tiết kiệm' : '⚡ Tăng Calo'}
                    </span>
                  </div>
                ) : (
                  <div className="recipe-img-placeholder">
                    <span>{recipe.emoji || '🍲'}</span>
                  </div>
                )}

                <div className="recipe-header" style={{ marginTop: 4 }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 16.5, fontWeight: 800, marginBottom: 4 }}>{recipe.name}</h3>
                    <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
                      ⏱ {recipe.time} · {recipe.mealType} · <b style={{ color: '#0284c7' }}>{money(recipe.cost)}</b>
                    </span>
                  </div>
                </div>

                {/* Mẹo dành cho người mới tập nấu */}
                {recipe.beginnerTip && (
                  <div className="beginner-tip-box">
                    <span style={{ fontSize: 16 }}>💡</span>
                    <span>{recipe.beginnerTip}</span>
                  </div>
                )}

                <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0, lineHeight: 1.5, flex: 1 }}>
                  {recipe.summary}
                </p>

                {/* Macro Chips */}
                <div className="recipe-macros">
                  <div className="recipe-macros-item">
                    <span>Calo</span>
                    <b>{recipe.cal} kcal</b>
                  </div>
                  <div className="recipe-macros-item">
                    <span>Protein</span>
                    <b style={{ color: '#0284c7' }}>{recipe.protein}g</b>
                  </div>
                  <div className="recipe-macros-item">
                    <span>Carbs</span>
                    <b>{recipe.carbs || 0}g</b>
                  </div>
                  <div className="recipe-macros-item">
                    <span>Chất béo</span>
                    <b>{recipe.fat || 0}g</b>
                  </div>
                </div>

                {/* Các nút hành động */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
                  <button
                    className="btn-secondary"
                    onClick={() => setActiveRecipe(recipe)}
                    style={{ padding: '10px 8px', fontSize: 12.5, borderRadius: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6 }}
                  >
                    <I.BookOpen size={14} /> Cách nấu {recipe.videoUrl ? '🎬' : ''}
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={() => onSaveToMyRecipes(recipe)}
                    style={{ padding: '10px 8px', fontSize: 12.5, borderRadius: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, borderColor: '#0284c7', color: '#0284c7' }}
                    title="Lưu món này vào danh sách Thực đơn của tôi"
                  >
                    <I.Bookmark size={14} /> Lưu vào Của tôi
                  </button>
                </div>

                <button
                  className="primary"
                  onClick={() => handleLogMeal(recipe, 'Trưa')}
                  style={{ width: '100%', marginTop: 6, padding: '10px 0', fontSize: 13, justifyContent: 'center' }}
                >
                  <I.Plus size={15} /> Ăn món này (Nạp bữa Trưa)
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ================= TAB 2: THỰC ĐƠN CỦA TÔI ================= */}
      {tab === 'my_recipes' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 14 }}>
            <div>
              <h2 style={{ margin: '0 0 4px', fontSize: 20 }}>Món ăn do bạn thực hiện & lưu lại</h2>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                Tự tạo món mới có bảng tính Calo tự động từ nguyên liệu hoặc lưu từ thực đơn gợi ý.
              </span>
            </div>

            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <input
                style={{
                  padding: '10px 16px',
                  borderRadius: 20,
                  border: '1px solid var(--border-card)',
                  background: 'var(--bg-card)',
                  color: 'var(--text-main)',
                  fontSize: 13,
                  outline: 'none',
                  minWidth: 200
                }}
                placeholder="🔍 Tìm món của bạn..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button className="primary" onClick={() => setShowCreateModal(true)} style={{ fontSize: 13 }}>
                <I.Plus size={16} /> Tạo món mới (Tự tính Calo)
              </button>
            </div>
          </div>

          {filteredMyRecipes.length === 0 ? (
            <div style={{
              background: 'var(--bg-card)',
              border: '1px dashed var(--border-card)',
              borderRadius: 20,
              padding: '48px 24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 14
            }}>
              <span style={{ fontSize: 44 }}>👨‍🍳</span>
              <b style={{ fontSize: 17 }}>Bạn chưa lưu món ăn nào trong thực đơn cá nhân!</b>
              <p style={{ maxWidth: 480, fontSize: 13.5, color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
                Bạn có thể qua tab <b>"✨ Thực đơn gợi ý"</b> bấm nút <b>"Lưu vào Của tôi"</b> ở bất kỳ món nào bạn thích, hoặc bấm nút dưới đây để tạo món với bảng tính Calo tự động.
              </p>
              <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
                <button className="btn-secondary" onClick={() => setTab('suggested')}>
                  Xem Thực đơn gợi ý
                </button>
                <button className="primary" onClick={() => setShowCreateModal(true)}>
                  <I.Plus size={16} /> Tạo món ăn mới ngay
                </button>
              </div>
            </div>
          ) : (
            <div className="recipe-grid">
              {filteredMyRecipes.map(recipe => (
                <div className="recipe-card" key={recipe.id || recipe.name}>
                  {recipe.image ? (
                    <div className="recipe-img-box">
                      <img src={recipe.image} alt={recipe.name} loading="lazy" />
                      <span className="recipe-img-tag" style={{ background: '#0284c7' }}>
                        ⭐ Món của tôi
                      </span>
                    </div>
                  ) : (
                    <div className="recipe-img-placeholder">
                      <span>{recipe.emoji || '🍽️'}</span>
                    </div>
                  )}

                  <div className="recipe-header" style={{ marginTop: 4 }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: 16.5, fontWeight: 800, marginBottom: 4 }}>{recipe.name}</h3>
                      <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
                        ⏱ {recipe.time} · {recipe.mealType} · <b style={{ color: '#0284c7' }}>{money(recipe.cost)}</b>
                      </span>
                    </div>
                  </div>

                  {recipe.beginnerTip && (
                    <div className="beginner-tip-box">
                      <span style={{ fontSize: 16 }}>💡</span>
                      <span>{recipe.beginnerTip}</span>
                    </div>
                  )}

                  <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0, lineHeight: 1.5, flex: 1 }}>
                    {recipe.summary}
                  </p>

                  <div className="recipe-macros">
                    <div className="recipe-macros-item">
                      <span>Calo</span>
                      <b>{recipe.cal} kcal</b>
                    </div>
                    <div className="recipe-macros-item">
                      <span>Protein</span>
                      <b style={{ color: '#0284c7' }}>{recipe.protein}g</b>
                    </div>
                    <div className="recipe-macros-item">
                      <span>Carbs</span>
                      <b>{recipe.carbs || 0}g</b>
                    </div>
                    <div className="recipe-macros-item">
                      <span>Chất béo</span>
                      <b>{recipe.fat || 0}g</b>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, marginTop: 8 }}>
                    <button
                      className="btn-secondary"
                      onClick={() => setActiveRecipe(recipe)}
                      style={{ padding: '10px 8px', fontSize: 12.5, borderRadius: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6 }}
                    >
                      <I.BookOpen size={14} /> Xem cách làm
                    </button>
                    <button
                      className="action-icon-btn"
                      onClick={() => onDeleteMyRecipe(recipe.id)}
                      title="Xóa món khỏi thực đơn của tôi"
                      style={{ border: '1px solid var(--border-card)', borderRadius: 10, width: 40, height: 40 }}
                    >
                      <I.Trash2 size={16} />
                    </button>
                  </div>

                  <button
                    className="primary"
                    onClick={() => handleLogMeal(recipe, 'Trưa')}
                    style={{ width: '100%', marginTop: 6, padding: '10px 0', fontSize: 13, justifyContent: 'center' }}
                  >
                    <I.Plus size={15} /> Ăn món này hôm nay
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ================= TAB 3: COMBO BỮA ĂN & TÍNH CALO ================= */}
      {tab === 'combos' && (
        <>
          {/* Header & Toggle Trình tạo Combo */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 14 }}>
            <div>
              <h2 style={{ margin: '0 0 4px', fontSize: 20 }}>Combo Bữa Ăn Chuẩn Khoa Học</h2>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                Nạp trọn gói 1 chạm hoặc tự phối hợp nguyên liệu để máy tự động tính toàn bộ Calo, Protein & Giá tiền.
              </span>
            </div>

            <button
              className={showComboCreator ? 'btn-secondary' : 'primary'}
              onClick={() => setShowComboCreator(!showComboCreator)}
              style={{ fontSize: 13.5, gap: 8 }}
            >
              <I.Calculator size={17} />
              {showComboCreator ? 'Đóng Trình tạo Combo' : '🧮 Mở Trình Tạo Combo Mới (Tự Tính Calo)'}
            </button>
          </div>

          {/* DYNAMIC CALCULATOR & COMBO CREATOR PANEL */}
          {showComboCreator && (
            <div className="calculator-panel">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 12 }}>
                <div>
                  <h3 style={{ margin: '0 0 4px', fontSize: 18, color: '#0284c7' }}>
                    🧮 Trình Tạo Combo Bữa Ăn - Tự Động Tính Calo & Macro
                  </h3>
                  <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
                    Bấm chọn nguyên liệu và số lượng, hệ thống sẽ tự động cộng dồn dinh dưỡng theo thời gian thực!
                  </span>
                </div>
                <button className="modal-close" onClick={() => setShowComboCreator(false)}>✕</button>
              </div>

              {/* Thông tin Combo */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 18 }}>
                <div className="input-row">
                  <label>Tên Combo bữa ăn</label>
                  <input
                    placeholder="Ví dụ: Combo Trưa Tăng Cơ 60g Protein..."
                    value={newCombo.name}
                    onChange={e => setNewCombo({ ...newCombo, name: e.target.value })}
                  />
                </div>
                <div className="input-row">
                  <label>Mục tiêu dinh dưỡng</label>
                  <select
                    value={newCombo.goal}
                    onChange={e => setNewCombo({ ...newCombo, goal: e.target.value })}
                  >
                    <option value="Tăng cơ nạc (Lean Bulk)">Tăng cơ nạc (Lean Bulk)</option>
                    <option value="Giảm mỡ giữ cơ (Cutting)">Giảm mỡ giữ cơ (Cutting)</option>
                    <option value="Tiết kiệm học sinh sinh viên">Tiết kiệm học sinh sinh viên</option>
                    <option value="Nhanh gọn dưới 10 phút">Nhanh gọn dưới 10 phút</option>
                  </select>
                </div>
                <div className="input-row">
                  <label>Gợi ý thời điểm ăn</label>
                  <select
                    value={newCombo.bestTime}
                    onChange={e => setNewCombo({ ...newCombo, bestTime: e.target.value })}
                  >
                    <option value="Sáng">Bữa Sáng</option>
                    <option value="Trưa">Bữa Trưa</option>
                    <option value="Tối">Bữa Tối</option>
                    <option value="Snack">Bữa Phụ (Snack)</option>
                  </select>
                </div>
              </div>

              {/* Bộ chọn nguyên liệu chuẩn gym */}
              <div style={{ marginBottom: 20 }}>
                <b style={{ display: 'block', fontSize: 13.5, marginBottom: 10 }}>
                  🛒 Bấm chọn nguyên liệu đưa vào combo (Đã có định lượng & calo chuẩn):
                </b>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: 10,
                  maxHeight: 220,
                  overflowY: 'auto',
                  padding: 8,
                  background: 'var(--bg-subtle)',
                  borderRadius: 14,
                  border: '1px solid var(--border-subtle)'
                }}>
                  {ingredients.map(ing => {
                    const selected = comboSelectedIngredients.find(s => s.id === ing.id);
                    const qty = selected ? selected.qty : 0;
                    return (
                      <div
                        key={ing.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          background: qty > 0 ? 'var(--primary-light)' : 'var(--bg-card)',
                          border: `1px solid ${qty > 0 ? 'var(--primary-border)' : 'var(--border-card)'}`,
                          borderRadius: 10,
                          fontSize: 13
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 0, paddingRight: 8 }}>
                          <b style={{ display: 'block', fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {ing.name}
                          </b>
                          <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                            {ing.unit} · {ing.cal} kcal · {ing.protein}g đạm · {money(ing.cost)}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <button
                            type="button"
                            onClick={() => handleUpdateComboIngQty(ing.id, -1)}
                            disabled={qty === 0}
                            style={{ width: 26, height: 26, borderRadius: 6, border: '1px solid var(--border-card)', background: 'var(--bg-card)', cursor: qty === 0 ? 'not-allowed' : 'pointer', fontWeight: 900 }}
                          >
                            -
                          </button>
                          <span style={{ minWidth: 20, textAlign: 'center', fontWeight: 800, color: qty > 0 ? '#0284c7' : 'inherit' }}>
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateComboIngQty(ing.id, 1)}
                            style={{ width: 26, height: 26, borderRadius: 6, border: '1px solid var(--border-card)', background: 'var(--bg-card)', cursor: 'pointer', fontWeight: 900 }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* BẢNG KẾT QUẢ TÍNH TOÁN CALO & MACRO TỰ ĐỘNG THEO THỜI GIAN THỰC */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.08), rgba(56, 189, 248, 0.08))',
                border: '1px solid var(--primary-border)',
                borderRadius: 16,
                padding: '16px 20px',
                marginBottom: 20
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 10 }}>
                  <b style={{ fontSize: 14, color: '#0284c7' }}>
                    ⚡ KẾT QUẢ TÍNH TOÁN DINH DƯỠNG TỰ ĐỘNG ({comboTotals.itemsList.length} thành phần):
                  </b>
                  <span style={{ fontSize: 13, fontWeight: 800 }}>
                    Ước tính chi phí: <b style={{ color: '#0284c7' }}>{money(comboTotals.cost)}</b>
                  </span>
                </div>

                <div className="macro-chips-row" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                  <div className="macro-chip">
                    <span className="macro-lbl">TỔNG CALORIES</span>
                    <span className="macro-val">{comboTotals.cal} kcal</span>
                  </div>
                  <div className="macro-chip">
                    <span className="macro-lbl">PROTEIN (ĐẠM)</span>
                    <span className="macro-val" style={{ color: '#0284c7' }}>{comboTotals.protein}g</span>
                  </div>
                  <div className="macro-chip">
                    <span className="macro-lbl">CARBS (TINH BỘT)</span>
                    <span className="macro-val">{comboTotals.carbs}g</span>
                  </div>
                  <div className="macro-chip">
                    <span className="macro-lbl">CHẤT BÉO (FAT)</span>
                    <span className="macro-val">{comboTotals.fat}g</span>
                  </div>
                </div>

                {/* Danh sách thành phần đã chọn */}
                <div style={{ marginTop: 12, fontSize: 12.5, color: 'var(--text-muted)' }}>
                  <b>Thành phần chi tiết: </b>
                  {comboTotals.itemsList.length > 0 ? comboTotals.itemsList.join(', ') : 'Chưa chọn nguyên liệu nào.'}
                </div>
              </div>

              {/* Nút hành động */}
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowComboCreator(false)}
                >
                  Đóng
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    if (comboTotals.itemsList.length === 0) return notify('Chưa có nguyên liệu trong combo!');
                    onEatCombo({
                      name: newCombo.name || 'Combo Tự Phối',
                      items: comboTotals.itemsList,
                      cal: comboTotals.cal,
                      protein: comboTotals.protein,
                      cost: comboTotals.cost
                    }, comboMealType);
                  }}
                  style={{ borderColor: '#0284c7', color: '#0284c7' }}
                >
                  ⚡ Ăn ngay hôm nay (Nạp vào {comboMealType})
                </button>
                <button
                  type="button"
                  className="primary"
                  onClick={handleSaveCustomCombo}
                >
                  <I.Check size={16} /> Lưu vào danh mục Combo của tôi
                </button>
              </div>
            </div>
          )}

          {/* DANH SÁCH CÁC COMBO HIỆN CÓ */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
            {combos.map((combo, idx) => {
              const itemsArray = Array.isArray(combo.items)
                ? combo.items.map(it => (typeof it === 'string' ? it : it.name))
                : [combo.items];

              return (
                <div className="combo-card" key={combo.id || idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                    <div>
                      <span style={{ fontSize: 11.5, fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        🎯 {combo.target || 'Bữa ăn chuẩn Gym'}
                      </span>
                      <h3 style={{ margin: '4px 0 2px', fontSize: 17, fontWeight: 800 }}>
                        {combo.name}
                      </h3>
                      <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
                        Bữa thích hợp: {combo.mealType || 'Trưa / Tối'} · Chi phí: <b style={{ color: '#0284c7' }}>{money(combo.cost || 0)}</b>
                      </span>
                    </div>
                    {combo.id && combo.id.startsWith('combo-') && (
                      <button
                        className="action-icon-btn"
                        onClick={() => onDeleteCombo(combo.id)}
                        title="Xóa combo này"
                        style={{ border: '1px solid var(--border-card)', borderRadius: 8 }}
                      >
                        <I.Trash2 size={15} />
                      </button>
                    )}
                  </div>

                  {combo.summary && (
                    <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                      {combo.summary}
                    </p>
                  )}

                  {/* Danh sách thành phần cụ thể */}
                  <div className="combo-items-list">
                    <b style={{ fontSize: 12.5, color: 'var(--text-muted)', marginBottom: 2 }}>
                      🍱 Thành phần món trong Combo:
                    </b>
                    {itemsArray.map((it, i) => (
                      <div className="combo-item-row" key={i}>
                        <span>✓ {it}</span>
                      </div>
                    ))}
                  </div>

                  {/* Dinh dưỡng Combo to rõ */}
                  <div className="recipe-macros">
                    <div className="recipe-macros-item">
                      <span>Calo</span>
                      <b>{combo.cal} kcal</b>
                    </div>
                    <div className="recipe-macros-item">
                      <span>Protein</span>
                      <b style={{ color: '#0284c7' }}>{combo.protein}g</b>
                    </div>
                    <div className="recipe-macros-item">
                      <span>Carbs</span>
                      <b>{combo.carbs || 0}g</b>
                    </div>
                    <div className="recipe-macros-item">
                      <span>Chất béo</span>
                      <b>{combo.fat || 0}g</b>
                    </div>
                  </div>

                  {/* Nạp 1 chạm vào bữa hôm nay */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    background: 'var(--bg-subtle)',
                    padding: '8px 12px',
                    borderRadius: 12,
                    marginTop: 'auto'
                  }}>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      Nạp bữa:
                    </span>
                    <select
                      defaultValue={combo.mealType === 'Sáng' ? 'Sáng' : 'Trưa'}
                      id={`combo-sel-${combo.id || idx}`}
                      style={{
                        padding: '6px 10px',
                        borderRadius: 8,
                        background: 'var(--bg-card)',
                        color: 'var(--text-main)',
                        border: '1px solid var(--border-card)',
                        fontSize: 12.5
                      }}
                    >
                      <option value="Sáng">Sáng</option>
                      <option value="Trưa">Trưa</option>
                      <option value="Tối">Tối</option>
                      <option value="Snack">Snack</option>
                    </select>

                    <button
                      className="primary"
                      onClick={() => {
                        const selEl = document.getElementById(`combo-sel-${combo.id || idx}`);
                        const chosenMeal = selEl ? selEl.value : 'Trưa';
                        onEatCombo(combo, chosenMeal);
                      }}
                      style={{ flex: 1, padding: '8px 12px', fontSize: 12.5, justifyContent: 'center' }}
                    >
                      ⚡ Nạp Combo vào hôm nay
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ================= MODAL XEM CÁCH NẤU CHI TIẾT & VIDEO YOUTUBE ================= */}
      {activeRecipe && (
        <div className="modal-backdrop" onClick={() => setActiveRecipe(null)}>
          <div className="modal modal-xl" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ fontSize: 36 }}>{activeRecipe.emoji || '🍲'}</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: 22 }}>{activeRecipe.name}</h3>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    ⏱ Thời gian nấu: {activeRecipe.time} · Chi phí: {money(activeRecipe.cost)} · Phân loại: {activeRecipe.category}
                  </span>
                </div>
              </div>
              <button className="modal-close" onClick={() => setActiveRecipe(null)}>✕</button>
            </div>

            <div className="modal-body">
              {/* Ảnh món ăn thật lớn & sắc nét */}
              {activeRecipe.image && (
                <div style={{ width: '100%', height: 260, borderRadius: 18, overflow: 'hidden', marginBottom: 20 }}>
                  <img src={activeRecipe.image} alt={activeRecipe.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}

              {/* Mẹo chi tiết cho người mới học nấu ăn */}
              {activeRecipe.beginnerTip && (
                <div className="beginner-tip-box" style={{ marginBottom: 20, padding: 16 }}>
                  <span style={{ fontSize: 22 }}>💡</span>
                  <div>
                    <b style={{ display: 'block', fontSize: 14, marginBottom: 4 }}>Bí quyết cho người mới học nấu ăn:</b>
                    <span style={{ fontSize: 13.5 }}>{activeRecipe.beginnerTip}</span>
                  </div>
                </div>
              )}

              <div className="modal-two-col">
                {/* Cột 1: Dinh dưỡng & Nguyên liệu */}
                <div>
                  <div className="macro-chips-row">
                    <div className="macro-chip">
                      <span className="macro-lbl">CALORIES</span>
                      <span className="macro-val">{activeRecipe.cal} kcal</span>
                    </div>
                    <div className="macro-chip">
                      <span className="macro-lbl">PROTEIN</span>
                      <span className="macro-val" style={{ color: '#0284c7' }}>{activeRecipe.protein}g</span>
                    </div>
                    <div className="macro-chip">
                      <span className="macro-lbl">CARBS</span>
                      <span className="macro-val">{activeRecipe.carbs || 0}g</span>
                    </div>
                    <div className="macro-chip">
                      <span className="macro-lbl">CHẤT BÉO</span>
                      <span className="macro-val">{activeRecipe.fat || 0}g</span>
                    </div>
                  </div>

                  <p style={{ fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.6, margin: '14px 0 16px' }}>
                    {activeRecipe.summary}
                  </p>

                  <div style={{ marginBottom: 16 }}>
                    <b style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>🛒 Nguyên liệu cần chuẩn bị:</b>
                    <div className="ingredient-tags">
                      {activeRecipe.ingredients && activeRecipe.ingredients.map((ing, i) => (
                        <span className="ing-tag" key={i}>✓ {ing}</span>
                      ))}
                    </div>
                  </div>

                  {/* Nạp vào bữa hôm nay */}
                  <div style={{ background: 'var(--primary-light)', padding: 18, borderRadius: 16, border: '1px solid var(--primary-border)' }}>
                    <b style={{ display: 'block', marginBottom: 10, fontSize: 13.5, color: '#0284c7' }}>
                      ➕ Nạp món này vào Nhật ký hôm nay:
                    </b>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <span style={{ fontSize: 13, color: 'var(--text-main)', fontWeight: 600 }}>Chọn bữa:</span>
                      <select
                        value={selectedMealType}
                        onChange={e => setSelectedMealType(e.target.value)}
                        style={{ padding: '8px 12px', borderRadius: 8, background: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border-card)' }}
                      >
                        <option value="Sáng">Bữa Sáng</option>
                        <option value="Trưa">Bữa Trưa</option>
                        <option value="Tối">Bữa Tối</option>
                        <option value="Snack">Bữa Phụ (Snack)</option>
                      </select>
                      <button className="primary" onClick={() => handleLogMeal(activeRecipe, selectedMealType)} style={{ marginLeft: 'auto', fontSize: 13 }}>
                        Nạp vào nhật ký
                      </button>
                    </div>
                  </div>
                </div>

                {/* Cột 2: Video Youtube & Từng bước nấu */}
                <div>
                  {youtubeEmbed ? (
                    <div>
                      <b style={{ display: 'block', fontSize: 14, marginBottom: 8 }}>🎬 Video hướng dẫn xem trực tiếp:</b>
                      <div className="video-frame-wrap" style={{ marginBottom: 18 }}>
                        <iframe
                          src={youtubeEmbed}
                          title={activeRecipe.name}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  ) : activeRecipe.videoUrl ? (
                    <div className="video-link-banner" style={{ marginBottom: 18 }}>
                      <div>
                        <b>🎬 Video / Clip hướng dẫn:</b>
                        <span style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)' }}>Mở liên kết trên web</span>
                      </div>
                      <a href={activeRecipe.videoUrl} target="_blank" rel="noopener noreferrer">
                        Mở video <I.ExternalLink size={14} />
                      </a>
                    </div>
                  ) : null}

                  <div>
                    <b style={{ display: 'block', marginBottom: 10, fontSize: 14 }}>👨‍🍳 Các bước thực hiện chi tiết:</b>
                    <ol className="recipe-steps">
                      {activeRecipe.steps && activeRecipe.steps.map((st, i) => (
                        <li key={i}>{st}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-foot">
              <button className="btn-secondary" onClick={() => setActiveRecipe(null)}>
                Đóng
              </button>
              {tab === 'suggested' && (
                <button
                  className="btn-secondary"
                  onClick={() => {
                    onSaveToMyRecipes(activeRecipe);
                    setActiveRecipe(null);
                  }}
                  style={{ borderColor: '#0284c7', color: '#0284c7' }}
                >
                  <I.Bookmark size={15} /> Lưu vào Thực đơn của tôi
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL TẠO MÓN ĂN CỦA TÔI (CÓ BẢNG TÍNH CALO TỰ ĐỘNG) ================= */}
      {showCreateModal && (
        <div className="modal-backdrop" onClick={() => setShowCreateModal(false)}>
          <div className="modal modal-xl" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <h3 style={{ margin: 0, fontSize: 20 }}>Tạo món ăn mới của bạn</h3>
                <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
                  Bạn có thể chọn nguyên liệu bên dưới để máy tự tính toán Calo & Dinh dưỡng hoặc tự nhập.
                </span>
              </div>
              <button className="modal-close" onClick={() => setShowCreateModal(false)}>✕</button>
            </div>

            <form onSubmit={handleCreateSubmit}>
              <div className="modal-body">
                {/* Bộ chọn nguyên liệu để máy tự tính */}
                <div style={{
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 20
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <b style={{ fontSize: 13.5, color: '#0284c7' }}>
                      🧮 Chọn nhanh nguyên liệu chuẩn (Máy sẽ tự động tính Calo, Protein & Giá):
                    </b>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={handleApplyIngredientsToNewRecipe}
                      style={{ fontSize: 12, padding: '4px 10px' }}
                    >
                      Áp dụng vào món ăn ⬇
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', maxHeight: 130, overflowY: 'auto', padding: 4 }}>
                    {ingredients.map(ing => {
                      const sel = selectedIngredientsInRecipe.find(s => s.id === ing.id);
                      const qty = sel ? sel.qty : 0;
                      return (
                        <button
                          key={ing.id}
                          type="button"
                          onClick={() => {
                            setSelectedIngredientsInRecipe(prev => {
                              const exists = prev.find(p => p.id === ing.id);
                              if (exists) {
                                return prev.map(p => p.id === ing.id ? { ...p, qty: p.qty + 1 } : p);
                              }
                              return [...prev, { id: ing.id, qty: 1 }];
                            });
                          }}
                          style={{
                            padding: '6px 12px',
                            borderRadius: 12,
                            fontSize: 12,
                            border: `1px solid ${qty > 0 ? '#0284c7' : 'var(--border-card)'}`,
                            background: qty > 0 ? 'var(--primary-light)' : 'var(--bg-card)',
                            color: qty > 0 ? '#0284c7' : 'var(--text-main)',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6
                          }}
                        >
                          <span>{ing.name} ({ing.unit})</span>
                          {qty > 0 && <b style={{ background: '#0284c7', color: '#fff', borderRadius: 10, padding: '1px 6px', fontSize: 11 }}>x{qty}</b>}
                        </button>
                      );
                    })}
                  </div>
                  {selectedIngredientsInRecipe.length > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                      <button
                        type="button"
                        onClick={() => setSelectedIngredientsInRecipe([])}
                        style={{ fontSize: 12, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        Xóa chọn nguyên liệu
                      </button>
                    </div>
                  )}
                </div>

                {/* Form điền thông tin */}
                <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: 14 }}>
                  <div className="input-row">
                    <label>Icon</label>
                    <input
                      value={newRecipe.emoji}
                      onChange={e => setNewRecipe({ ...newRecipe, emoji: e.target.value })}
                      style={{ textAlign: 'center', fontSize: 24 }}
                    />
                  </div>
                  <div className="input-row">
                    <label>Tên món ăn</label>
                    <input
                      required
                      placeholder="Ví dụ: Bò xào súp lơ, Ức gà nướng bơ tỏi..."
                      value={newRecipe.name}
                      onChange={e => setNewRecipe({ ...newRecipe, name: e.target.value })}
                    />
                  </div>
                  <div className="input-row">
                    <label>Phân loại mục tiêu</label>
                    <select
                      value={newRecipe.category}
                      onChange={e => setNewRecipe({ ...newRecipe, category: e.target.value })}
                    >
                      <option value="High Protein">Giàu Protein (High Protein)</option>
                      <option value="Budget Friendly">Tiết kiệm (Budget Friendly)</option>
                      <option value="Mass Gainer">Tăng cân calo cao (Mass Gainer)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
                  <div className="input-row">
                    <label>Calo (kcal)</label>
                    <input
                      type="number"
                      required
                      value={newRecipe.cal}
                      onChange={e => setNewRecipe({ ...newRecipe, cal: e.target.value })}
                    />
                  </div>
                  <div className="input-row">
                    <label>Protein (g)</label>
                    <input
                      type="number"
                      required
                      value={newRecipe.protein}
                      onChange={e => setNewRecipe({ ...newRecipe, protein: e.target.value })}
                    />
                  </div>
                  <div className="input-row">
                    <label>Carbs (g)</label>
                    <input
                      type="number"
                      value={newRecipe.carbs}
                      onChange={e => setNewRecipe({ ...newRecipe, carbs: e.target.value })}
                    />
                  </div>
                  <div className="input-row">
                    <label>Chất béo (g)</label>
                    <input
                      type="number"
                      value={newRecipe.fat}
                      onChange={e => setNewRecipe({ ...newRecipe, fat: e.target.value })}
                    />
                  </div>
                  <div className="input-row">
                    <label>Chi phí (₫)</label>
                    <input
                      type="number"
                      value={newRecipe.cost}
                      onChange={e => setNewRecipe({ ...newRecipe, cost: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div className="input-row">
                    <label>Ảnh món ăn (URL ảnh thật trên mạng)</label>
                    <input
                      placeholder="https://images.unsplash.com/... hoặc dán link ảnh món của bạn"
                      value={newRecipe.image}
                      onChange={e => setNewRecipe({ ...newRecipe, image: e.target.value })}
                    />
                  </div>
                  <div className="input-row">
                    <label>🎬 Link Video / Youtube hướng dẫn</label>
                    <input
                      placeholder="Dán link Youtube https://www.youtube.com/watch?v=..."
                      value={newRecipe.videoUrl}
                      onChange={e => setNewRecipe({ ...newRecipe, videoUrl: e.target.value })}
                    />
                  </div>
                </div>

                <div className="input-row">
                  <label>💡 Mẹo nấu cho người mới (Thời gian lửa, độ chín, cách ướp...)</label>
                  <input
                    placeholder="Ví dụ: Đậy vung chảo 2 phút cho thịt mềm mọng không bị khô..."
                    value={newRecipe.beginnerTip}
                    onChange={e => setNewRecipe({ ...newRecipe, beginnerTip: e.target.value })}
                  />
                </div>

                <div className="modal-two-col">
                  <div className="input-row">
                    <label>🛒 Nguyên liệu (mỗi dòng 1 nguyên liệu)</label>
                    <textarea
                      rows="4"
                      placeholder="200g ức gà tươi&#10;1 nhánh gừng nhỏ&#10;1 quả chanh, muối tiêu..."
                      value={newRecipe.ingredientsText}
                      onChange={e => setNewRecipe({ ...newRecipe, ingredientsText: e.target.value })}
                    />
                  </div>
                  <div className="input-row">
                    <label>👨‍🍳 Cách làm từng bước (mỗi dòng 1 bước)</label>
                    <textarea
                      rows="4"
                      placeholder="Bước 1: Rửa sạch và thấm khô...&#10;Bước 2: Ướp tiêu và chút hạt nêm...&#10;Bước 3: Áp chảo mỗi mặt 4 phút..."
                      value={newRecipe.stepsText}
                      onChange={e => setNewRecipe({ ...newRecipe, stepsText: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-foot">
                <button type="button" className="btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Hủy
                </button>
                <button type="submit" className="primary">
                  Lưu vào Thực đơn của tôi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

// ---------------- NUTRITION LOG COMPONENT ----------------
function Nutrition({ data, consumed, protein, combos = [], onAddMeal, onDeleteMeal, onEatCombo, onOpenRecipes }) {
  const [showAddMealModal, setShowAddMealModal] = useState(false);
  const [mealInput, setMealInput] = useState({
    name: 'Trưa',
    food: '',
    cal: 500,
    protein: 40,
    cost: 35000
  });

  const handleCreateMeal = (e) => {
    e.preventDefault();
    if (!mealInput.food.trim()) return;
    onAddMeal({
      name: mealInput.name,
      food: mealInput.food,
      cal: Number(mealInput.cal),
      protein: Number(mealInput.protein),
      cost: Number(mealInput.cost)
    });
    setShowAddMealModal(false);
    setMealInput({ name: 'Trưa', food: '', cal: 500, protein: 40, cost: 35000 });
  };

  return (
    <>
      <div className="grid nutrition-metrics">
        <Metric
          icon={I.Flame}
          label="CALORIES ĐÃ NẠP"
          value={consumed + ' kcal'}
          sub={`Mục tiêu ${data.profile.calories} kcal (${Math.max(0, data.profile.calories - consumed)} kcal còn lại)`}
          good={consumed <= data.profile.calories}
        />
        <Metric
          icon={I.Beef}
          label="PROTEIN ĐÃ NẠP"
          value={protein + ' g'}
          sub={`Mục tiêu ${data.profile.protein}g (${Math.max(0, data.profile.protein - protein)}g còn thiếu)`}
          good={protein >= data.profile.protein * 0.8}
        />
        <Metric
          icon={I.Wheat}
          label="CARBOHYDRATE"
          value="182 g"
          sub={`Mục tiêu ${data.profile.carbs}g`}
        />
        <Metric
          icon={I.Droplets}
          label="NƯỚC ĐÃ UỐNG"
          value="2.2 L"
          sub="Mục tiêu 2.5 L"
          good
        />
      </div>

      {/* QUICK COMBO CAROUSEL / SELECTOR */}
      {combos.length > 0 && (
        <Card style={{ marginBottom: 24, padding: '20px 22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
            <div>
              <span className="eyebrow" style={{ color: '#0284c7' }}>GỢI Ý DINH DƯỠNG NHANH</span>
              <h3 style={{ margin: '2px 0 0', fontSize: 17, fontWeight: 800 }}>🍱 Nạp Nhanh Combo Bữa Ăn (1 Chạm)</h3>
            </div>
            <button className="btn-secondary" onClick={onOpenRecipes} style={{ fontSize: 12.5, padding: '7px 14px' }}>
              <I.ChefHat size={15} /> Mở Trình Tạo Combo & Món Ăn
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 12
          }}>
            {combos.slice(0, 3).map((combo, idx) => {
              const itemsText = Array.isArray(combo.items)
                ? combo.items.map(it => (typeof it === 'string' ? it : it.name)).slice(0, 2).join(' + ') + (combo.items.length > 2 ? '...' : '')
                : combo.name;

              return (
                <div
                  key={combo.id || idx}
                  style={{
                    background: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 14,
                    padding: '12px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <b style={{ fontSize: 13.5, color: 'var(--text-main)' }}>{combo.name}</b>
                    <span style={{ fontSize: 11, background: 'var(--primary-light)', color: '#0284c7', padding: '2px 8px', borderRadius: 8, fontWeight: 700 }}>
                      {combo.mealType || 'Trưa'}
                    </span>
                  </div>

                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    🥗 {itemsText}
                  </span>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 800 }}>
                      🔥 {combo.cal} kcal · <b style={{ color: '#0284c7' }}>{combo.protein}g đạm</b>
                    </span>
                    <button
                      className="primary"
                      onClick={() => onEatCombo(combo, combo.mealType || 'Trưa')}
                      style={{ padding: '6px 12px', fontSize: 12, borderRadius: 8 }}
                      title="Nạp ngay combo này vào hôm nay"
                    >
                      + Nạp ngay
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <Card>
        <div className="section-head">
          <div>
            <span className="eyebrow">NHẬT KÝ ĂN UỐNG</span>
            <h2>Các bữa ăn hôm nay</h2>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-secondary" onClick={onOpenRecipes} style={{ padding: '9px 16px', borderRadius: 10, fontSize: 13 }}>
              <I.ChefHat size={16} /> Gợi ý món & Video nấu ăn
            </button>
            <button className="primary" onClick={() => setShowAddMealModal(true)} style={{ padding: '9px 16px', borderRadius: 10, fontSize: 13 }}>
              <I.Plus size={16} /> + Thêm bữa ăn
            </button>
          </div>
        </div>

        {data.meals.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '28px 0' }}>Chưa có bữa ăn nào được ghi nhận hôm nay.</p>
        ) : (
          data.meals.map((m, i) => (
            <div className="meal-row" key={i}>
              <div className="food-dot">
                {m.name === 'Sáng' ? '🌅' : m.name === 'Trưa' ? '🍗' : m.name === 'Tối' ? '🥩' : '🥛'}
              </div>
              <div>
                <b>{m.name}: {m.food}</b>
                <p>Chi phí: {money(m.cost)}</p>
              </div>
              <span>{m.cal} kcal</span>
              <span style={{ fontWeight: 700, color: '#0284c7' }}>{m.protein}g Protein</span>
              <div style={{ textAlign: 'right' }}>
                <button
                  className="action-icon-btn"
                  onClick={() => onDeleteMeal(i)}
                  title="Xóa bữa ăn này"
                >
                  <I.Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </Card>

      {showAddMealModal && (
        <div className="modal-backdrop" onClick={() => setShowAddMealModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Thêm bữa ăn vào nhật ký</h3>
              <button className="modal-close" onClick={() => setShowAddMealModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateMeal}>
              <div className="modal-body">
                <div className="input-row">
                  <label>Thời điểm bữa ăn</label>
                  <select
                    value={mealInput.name}
                    onChange={e => setMealInput({ ...mealInput, name: e.target.value })}
                  >
                    <option value="Sáng">Bữa Sáng</option>
                    <option value="Trưa">Bữa Trưa</option>
                    <option value="Tối">Bữa Tối</option>
                    <option value="Snack">Bữa Phụ (Snack)</option>
                  </select>
                </div>
                <div className="input-row">
                  <label>Món ăn & Thực phẩm</label>
                  <input
                    required
                    placeholder="Ví dụ: Cơm + 200g ức gà + rau luộc"
                    value={mealInput.food}
                    onChange={e => setMealInput({ ...mealInput, food: e.target.value })}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  <div className="input-row">
                    <label>Calo (kcal)</label>
                    <input
                      type="number"
                      required
                      value={mealInput.cal}
                      onChange={e => setMealInput({ ...mealInput, cal: e.target.value })}
                    />
                  </div>
                  <div className="input-row">
                    <label>Protein (g)</label>
                    <input
                      type="number"
                      required
                      value={mealInput.protein}
                      onChange={e => setMealInput({ ...mealInput, protein: e.target.value })}
                    />
                  </div>
                  <div className="input-row">
                    <label>Chi phí (₫)</label>
                    <input
                      type="number"
                      value={mealInput.cost}
                      onChange={e => setMealInput({ ...mealInput, cost: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-foot">
                <button type="button" className="btn-secondary" onClick={() => setShowAddMealModal(false)}>
                  Hủy
                </button>
                <button type="submit" className="primary">
                  Lưu bữa ăn
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

// ---------------- RECOVERY COMPONENT ----------------
function Recovery() {
  return (
    <>
      <div className="recovery-score">
        <div className="score-ring">
          <b>82</b>
          <span>/100</span>
        </div>
        <div>
          <span className="eyebrow">CHỈ SỐ HỒI PHỤC</span>
          <h2>Trạng thái: Sẵn sàng tập nặng 🟢</h2>
          <p>
            Giấc ngủ đạt 7h30m, nhịp tim nghỉ ngơi ổn định và cơ bắp hồi phục tốt. Bạn hoàn toàn đủ điều kiện để thực hiện mức tạ mục tiêu hôm nay.
          </p>
        </div>
      </div>
      <div className="grid metrics">
        <Metric icon={I.Moon} label="GIẤC NGỦ" value="7h 30m" sub="+25m so với trung bình" good />
        <Metric icon={I.Brain} label="CĂNG THẲNG" value="Thấp" sub="2 / 10" good />
        <Metric icon={I.Zap} label="NĂNG LƯỢNG" value="8 / 10" sub="Sung sức" good />
        <Metric icon={I.Activity} label="ĐAU MỎI CƠ" value="2 / 10" sub="Rất nhẹ" good />
      </div>
    </>
  );
}

// ---------------- PROGRESS COMPONENT ----------------
function Progress({ data }) {
  const pts = [51.2, 51.5, 51.4, 51.8, 52.0, 52.4, 52.2, 52.4];
  return (
    <>
      <div className="grid metrics">
        <Metric icon={I.Scale} label="CÂN NẶNG HIỆN TẠI" value={data.profile.weight + ' kg'} sub="Mục tiêu: 58 kg" good />
        <Metric icon={I.TrendingUp} label="SỨC MẠNH" value="+12%" sub="so với tháng trước" good />
        <Metric icon={I.Ruler} label="VÒNG EO" value="71 cm" sub="−1 cm (giữ nét cơ)" good />
      </div>
      <Card>
        <div className="section-head">
          <div>
            <span className="eyebrow">XU HƯỚNG CÂN NẶNG</span>
            <h2>Biểu đồ 8 tuần gần nhất</h2>
          </div>
          <span className="pill">+1.2 kg cơ nạc</span>
        </div>
        <div className="chart">
          <svg viewBox="0 0 800 240" preserveAspectRatio="none">
            <polyline
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              points={pts.map((v, i) => `${i * 110 + 20},${220 - (v - 50) * 45}`).join(' ')}
            />
            {pts.map((v, i) => (
              <circle key={i} cx={i * 110 + 20} cy={220 - (v - 50) * 45} r="5" fill="currentColor" />
            ))}
          </svg>
        </div>
        <div className="chart-labels">
          {['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4', 'Tuần 5', 'Tuần 6', 'Tuần 7', 'Tuần 8'].map(x => (
            <span key={x}>{x}</span>
          ))}
        </div>
      </Card>
    </>
  );
}

// ---------------- MONEY COMPONENT ----------------
function Money({ data, spent, onAddExpense, onDeleteExpense }) {
  const [showModal, setShowModal] = useState(false);
  const [item, setItem] = useState('');
  const [amount, setAmount] = useState(35000);
  const [cat, setCat] = useState('Thịt');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!item.trim()) return;
    onAddExpense({ item, amount: Number(amount), cat });
    setShowModal(false);
    setItem('');
    setAmount(35000);
  };

  const usedPercent = Math.min(100, Math.round((spent / data.profile.budget) * 100));

  return (
    <>
      <div className="grid metrics">
        <Metric
          icon={I.Wallet}
          label="ĐÃ CHI HÔM NAY"
          value={money(spent)}
          sub={`Ngân sách ngày ${money(data.profile.budget)}`}
          good={spent <= data.profile.budget}
        />
        <Metric icon={I.CalendarDays} label="TUẦN NÀY" value={money(428000)} sub="−6% so với tuần trước" good />
        <Metric icon={I.ChartNoAxesCombined} label="THÁNG NÀY" value={money(1650000)} sub="Trong tầm kiểm soát" good />
      </div>

      <Card>
        <div className="section-head">
          <div>
            <span className="eyebrow">CHI TIÊU THỰC PHẨM</span>
            <h2>Các khoản chi hôm nay</h2>
          </div>
          <button className="primary" onClick={() => setShowModal(true)}>
            <I.Plus size={16} /> Thêm chi tiêu
          </button>
        </div>

        {data.expenses.map((e, i) => (
          <div className="expense" key={i}>
            <div>
              <b>{e.item}</b>
              <span>{e.cat}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 14 }}>
              <strong style={{ fontSize: 15 }}>{money(e.amount)}</strong>
              <button className="action-icon-btn" onClick={() => onDeleteExpense(i)} title="Xóa khoản chi">
                <I.Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}

        <div className="budget-line">
          <span>Ngân sách đã dùng: {money(spent)} / {money(data.profile.budget)}</span>
          <b>{usedPercent}%</b>
          <div className="bar">
            <i style={{ width: `${usedPercent}%` }} />
          </div>
        </div>
      </Card>

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Thêm khoản chi tiêu mới</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body">
                <div className="input-row">
                  <label>Tên món / Mặt hàng</label>
                  <input
                    required
                    placeholder="Ví dụ: Ức gà, Trứng, Sữa tươi, Whey..."
                    value={item}
                    onChange={e => setItem(e.target.value)}
                  />
                </div>
                <div className="input-row">
                  <label>Số tiền (VNĐ)</label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                  />
                </div>
                <div className="input-row">
                  <label>Danh mục</label>
                  <select value={cat} onChange={e => setCat(e.target.value)}>
                    <option value="Thịt">Thịt / Cá</option>
                    <option value="Trứng">Trứng</option>
                    <option value="Sữa">Sữa / Sữa chua</option>
                    <option value="Rau củ">Rau củ / Hoa quả</option>
                    <option value="Thực phẩm bổ sung">Thực phẩm bổ sung (Whey, Creatine)</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
              </div>
              <div className="modal-foot">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Hủy
                </button>
                <button type="submit" className="primary">
                  Lưu chi tiêu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

// ---------------- AI COACH COMPONENT ----------------
function Coach({ data, consumed, protein, spent }) {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [showConfig, setShowConfig] = useState(false);
  const [keyInput, setKeyInput] = useState(apiKey);
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      from: 'ai',
      text: `Chào ${data.profile.name || 'bạn'} 👋 Mình là AI Coach hệ thống Fitness của bạn.\n- Lịch tập hôm nay: ${data.todayStatus === 'rest' ? 'Nghỉ ngơi (Rest Day)' : data.selectedProgram}\n- Calo nạp: ${consumed} / ${data.profile.calories} kcal (Còn thiếu ${Math.max(0, data.profile.calories - consumed)} kcal)\n- Protein nạp: ${protein} / ${data.profile.protein}g (Còn thiếu ${Math.max(0, data.profile.protein - protein)}g)\n- Ngân sách: Còn ${money(Math.max(0, data.profile.budget - spent))}\n\nBạn cần mình gợi ý món ăn kèm video hướng dẫn, hay chiến lược tập luyện hôm nay?`
    }
  ]);
  const [q, setQ] = useState('');
  const msgEndRef = useRef(null);

  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const saveKey = () => {
    const trimmed = keyInput.trim();
    setApiKey(trimmed);
    localStorage.setItem('gemini_api_key', trimmed);
    setShowConfig(false);
  };

  const handleSend = async (presetText) => {
    const promptText = (presetText || q).trim();
    if (!promptText || isLoading) return;
    setQ('');

    const newMsgs = [...messages, { from: 'user', text: promptText }];
    setMessages(newMsgs);
    setIsLoading(true);

    if (apiKey) {
      try {
        const reply = await askGeminiCoach({
          apiKey,
          messages: newMsgs,
          context: {
            profile: data.profile,
            meals: data.meals,
            exercises: data.exercises,
            expenses: data.expenses,
            todayStatus: data.todayStatus,
            selectedProgram: data.selectedProgram,
            consumed,
            protein,
            spent,
          }
        });
        setMessages(m => [...m, { from: 'ai', text: reply }]);
      } catch (err) {
        setMessages(m => [
          ...m,
          { from: 'ai', text: `⚠️ Lỗi Gemini API: ${err.message}. Kiểm tra lại API Key hoặc kết nối mạng.` }
        ]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setTimeout(() => {
        let answer = '';
        const lower = promptText.toLowerCase();
        if (lower.includes('ăn') || lower.includes('món') || lower.includes('nấu')) {
          answer = `🍳 [Gợi ý dinh dưỡng]: Bạn còn thiếu ${Math.max(0, data.profile.protein - protein)}g protein và ${Math.max(0, data.profile.calories - consumed)} kcal.\n\n👉 Món gợi ý: "Ức gà áp chảo sốt tiêu đen" (52g Protein, 380 kcal, ~35.000₫).\n- Cách nấu: Ức gà khứa nhẹ ướp tiêu đen, tỏi băm, xì dầu và dầu hào trong 10 phút. Áp chảo mỗi mặt 4 phút trên lửa vừa, đậy vung 2 phút cho thịt mềm mọng nước không bị khô!\n- Có sẵn video Youtube hướng dẫn chi tiết trong tab "Món ăn & Nấu ăn"!`;
        } else if (lower.includes('tập') || lower.includes('bài')) {
          answer = `💪 [Chiến lược tập luyện]: Hôm nay lịch tập của bạn là "${data.selectedProgram}".\n- Nhớ khởi động xoay khớp vai và ngực 5 phút.\n- Tập trung tăng tạ ở bài Bench Press: lên 57.5 kg x 8-10 reps.\n- Thời gian nghỉ lý tưởng: 90s (sử dụng đồng hồ Rest Timer trong tab Workout để đếm ngược).`;
        } else {
          answer = `📈 [Đánh giá thể trạng]: Bạn đang tăng cân đều đặn (+1.2kg trong 8 tuần), chỉ số mỡ vòng eo giữ ở mức 71cm rất nét. Hãy duy trì đều đặn việc ăn đủ calo và protein mỗi ngày!`;
        }
        answer += '\n\n💡 *Mẹo: Nhập Gemini API Key (bấm nút góc trên) để trò chuyện với AI thật không giới hạn.*';
        setMessages(m => [...m, { from: 'ai', text: answer }]);
        setIsLoading(false);
      }, 600);
    }
  };

  return (
    <div className="coach">
      <Card className="chat">
        <div className="chat-head">
          <div className="ai-icon">
            <I.Sparkles size={22} />
          </div>
          <div style={{ flex: 1 }}>
            <b>AI Fitness Coach</b>
            <span>Đồng bộ: Thể trạng · Món ăn & Video nấu · Lịch tháng · Chi tiêu</span>
          </div>
          <div>
            <button className="text-btn" onClick={() => setShowConfig(!showConfig)} style={{ fontSize: 13 }}>
              {apiKey ? <span className="api-badge">🟢 Gemini Live</span> : <span className="api-badge offline">🔑 Cấu hình API Key</span>}
            </button>
          </div>
        </div>

        {showConfig && (
          <div className="api-bar">
            <span>🔑 Gemini API Key:</span>
            <input
              type="password"
              placeholder="Dán Google Gemini API key vào đây..."
              value={keyInput}
              onChange={e => setKeyInput(e.target.value)}
            />
            <button onClick={saveKey}>Lưu Key</button>
            {apiKey && (
              <button
                onClick={() => {
                  setApiKey('');
                  setKeyInput('');
                  localStorage.removeItem('gemini_api_key');
                }}
                style={{ background: '#cbd5e1', color: '#0f172a' }}
              >
                Xóa
              </button>
            )}
          </div>
        )}

        <div className="messages">
          {messages.map((m, i) => (
            <div className={'msg ' + m.from} key={i}>
              <pre>{m.text}</pre>
            </div>
          ))}
          {isLoading && (
            <div className="msg ai typing">
              <span></span><span></span><span></span>
            </div>
          )}
          <div ref={msgEndRef} />
        </div>

        <div className="suggestions">
          <button onClick={() => handleSend('Đánh giá những gì tôi đã tập và đã ăn hôm nay xem đã đủ calo, protein và tối ưu phát triển cơ bắp chưa?')}>
            📊 Đánh giá bài tập & món ăn hôm nay
          </button>
          <button onClick={() => handleSend('Tôi nên ăn món gì hôm nay và cách nấu thế nào để đủ protein?')}>
            🍳 Hôm nay nên ăn món gì & cách nấu?
          </button>
          <button onClick={() => handleSend('Hôm nay tôi nên tập những bài gì và tăng tạ ra sao?')}>
            🏋️ Hôm nay nên tập bài gì & tăng tạ?
          </button>
          <button onClick={() => handleSend('Gợi ý cho tôi bữa phụ tăng cân nhanh gọn dưới 25.000₫')}>
            🥤 Món tăng cân tiết kiệm?
          </button>
        </div>

        <div className="chat-input">
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Hỏi AI Coach về món ăn, cách nấu, bài tập, ngân sách..."
          />
          <button className="primary" onClick={() => handleSend()} disabled={isLoading}>
            <I.Send size={18} />
          </button>
        </div>
      </Card>
    </div>
  );
}

// ---------------- PROFILE & DATABASE COMPONENT ----------------
function Profile({ data, setData, notify, onExport, onImport, onReset, onSyncDb, onLoadDb }) {
  const [p, setP] = useState(data.profile);

  // State kết nối Supabase Cloud (Tự động nhận diện Key của bạn)
  const [supabaseKey, setSupabaseKey] = useState(() => localStorage.getItem('supabase_anon_key') || DEFAULT_SUPABASE_KEY);
  const [supabaseLoading, setSupabaseLoading] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState('connected');
  const [copiedSql, setCopiedSql] = useState(false);

  const save = () => {
    setData({
      ...data,
      profile: {
        ...p,
        age: Number(p.age),
        height: Number(p.height),
        weight: Number(p.weight),
        calories: Number(p.calories),
        protein: Number(p.protein),
        carbs: Number(p.carbs),
        fat: Number(p.fat),
        budget: Number(p.budget),
        days: Number(p.days),
        minutes: Number(p.minutes)
      }
    });
    notify('Đã lưu thông số Fitness Profile');
  };

  const handleSaveSupabaseKey = () => {
    const trimmed = supabaseKey.trim();
    localStorage.setItem('supabase_anon_key', trimmed);
    setSupabaseKey(trimmed);
    setSupabaseStatus(trimmed ? 'ready' : 'empty');
    notify('Đã lưu Supabase Anon Key vào hệ thống!');
  };

  const handleTestSupabase = async () => {
    const key = supabaseKey.trim();
    if (!key) {
      alert('Vui lòng dán Supabase Anon Key vào ô bên dưới trước khi kiểm tra.');
      return;
    }
    setSupabaseLoading(true);
    try {
      await testConnection(key);
      setSupabaseStatus('connected');
      notify('🎉 Kết nối tới Supabase Cloud thành công 100%!');
    } catch (err) {
      setSupabaseStatus('error');
      alert(`Không kết nối được: ${err.message}\n\n👉 Nếu chưa tạo bảng, bạn chỉ cần copy đoạn mã SQL bên dưới và Run trong Supabase SQL Editor!`);
    } finally {
      setSupabaseLoading(false);
    }
  };

  const handlePushSupabase = async () => {
    const key = supabaseKey.trim();
    if (!key) {
      alert('Vui lòng dán Supabase Anon Key trước khi lưu.');
      return;
    }
    setSupabaseLoading(true);
    try {
      const time = await saveToSupabase(data, key);
      setSupabaseStatus('connected');
      notify(`☁️ Đã lưu toàn bộ dữ liệu lên Supabase Cloud thành công lúc ${new Date(time).toLocaleTimeString()}!`);
    } catch (err) {
      alert(`Lỗi lưu lên Supabase: ${err.message}\n\n👉 Hãy chắc chắn bạn đã tạo bảng bằng đoạn SQL bên dưới.`);
    } finally {
      setSupabaseLoading(false);
    }
  };

  const handlePullSupabase = async () => {
    const key = supabaseKey.trim();
    if (!key) {
      alert('Vui lòng dán Supabase Anon Key trước khi tải.');
      return;
    }
    setSupabaseLoading(true);
    try {
      const { fitnessData, updatedAt } = await loadFromSupabase(key);
      setData(fitnessData);
      setSupabaseStatus('connected');
      notify(`📥 Đã tải và đồng bộ dữ liệu từ Supabase Cloud thành công! (Bản lưu: ${new Date(updatedAt).toLocaleTimeString()})`);
    } catch (err) {
      alert('Lỗi tải từ Supabase: ' + err.message);
    } finally {
      setSupabaseLoading(false);
    }
  };

  const sqlScript = `-- 1. Tạo bảng lưu trữ dữ liệu Fitness OS
create table if not exists public.fitness_data (
  id text primary key default 'main',
  data jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Cho phép truy cập đọc/ghi an toàn qua anon key
alter table public.fitness_data enable row level security;

drop policy if exists "Allow all operations for anon" on public.fitness_data;
create policy "Allow all operations for anon" on public.fitness_data
  for all
  using (true)
  with check (true);`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlScript);
    setCopiedSql(true);
    notify('Đã sao chép đoạn mã SQL vào Clipboard!');
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <Card className="profile">
      <span className="eyebrow">CÁ NHÂN HÓA</span>
      <h2>Hồ sơ Thể trạng & Mục tiêu dinh dưỡng</h2>
      <div className="form-grid">
        {[
          ['name', 'Họ & Tên'],
          ['age', 'Tuổi'],
          ['height', 'Chiều cao (cm)'],
          ['weight', 'Cân nặng (kg)'],
          ['goal', 'Mục tiêu (Tăng cơ / Giảm mỡ)'],
          ['days', 'Số buổi tập / tuần'],
          ['minutes', 'Thời lượng buổi tập (phút)'],
          ['calories', 'Mục tiêu Calo ngày (kcal)'],
          ['protein', 'Mục tiêu Protein ngày (g)'],
          ['carbs', 'Mục tiêu Carbs ngày (g)'],
          ['fat', 'Mục tiêu Chất béo ngày (g)'],
          ['budget', 'Ngân sách ăn uống / ngày (₫)']
        ].map(([k, l]) => (
          <label key={k}>
            {l}
            <input
              value={p[k]}
              onChange={e => setP({ ...p, [k]: e.target.value })}
            />
          </label>
        ))}
      </div>
      <button className="primary" onClick={save}>
        <I.Save size={16} /> Lưu hồ sơ cá nhân
      </button>

      {/* ---------------- SUPABASE CLOUD DATABASE SECTION ---------------- */}
      <div className="supabase-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: '#10b981', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 24, fontWeight: 900 }}>
              ⚡
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 18 }}>Kết nối Supabase Cloud Database (Đám mây)</h3>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                Dự án: <b style={{ color: '#10b981' }}>ngminhthuan1701-cyber's Project</b> ({SUPABASE_URL})
              </span>
            </div>
          </div>

          <div>
            {supabaseStatus === 'connected' ? (
              <span className="supabase-badge">🟢 Đã kết nối Supabase Cloud</span>
            ) : supabaseStatus === 'error' ? (
              <span className="supabase-badge offline">🔴 Chưa tạo bảng hoặc sai Key</span>
            ) : (
              <span className="supabase-badge offline">⚪ Chưa kết nối</span>
            )}
          </div>
        </div>

        <p style={{ fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.6, margin: '0 0 16px' }}>
          Đồng bộ vĩnh viễn toàn bộ bài tập, món ăn và lịch sử lên đám mây Supabase PostgreSQL. Bạn có thể mở web từ điện thoại, máy tính bảng hay bất cứ máy tính nào cũng có dữ liệu tức thì.
        </p>

        {/* Form nhập Supabase Anon Key */}
        <div style={{ background: 'var(--bg-subtle)', padding: 18, borderRadius: 16, border: '1px solid var(--border-subtle)', marginBottom: 20 }}>
          <label style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-main)', display: 'block', marginBottom: 8 }}>
            🔑 Dán Supabase Anon Key (Public Key) của bạn vào đây:
          </label>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <input
              type="password"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS..."
              value={supabaseKey}
              onChange={e => setSupabaseKey(e.target.value)}
              style={{ flex: 1, minWidth: 260, padding: '11px 14px', borderRadius: 10, fontSize: 13.5 }}
            />
            <button className="primary" onClick={handleSaveSupabaseKey} style={{ whiteSpace: 'nowrap' }}>
              <I.Save size={15} /> Lưu Key
            </button>
            <button className="btn-secondary" onClick={handleTestSupabase} disabled={supabaseLoading} style={{ whiteSpace: 'nowrap' }}>
              {supabaseLoading ? 'Đang test...' : 'Kiểm tra kết nối'}
            </button>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
            <button className="primary" onClick={handlePushSupabase} disabled={supabaseLoading} style={{ fontSize: 13, padding: '10px 18px', background: '#10b981', borderColor: '#059669' }}>
              <I.UploadCloud size={16} /> Lưu toàn bộ dữ liệu lên Supabase Cloud
            </button>
            <button className="btn-secondary" onClick={handlePullSupabase} disabled={supabaseLoading} style={{ fontSize: 13, padding: '10px 18px' }}>
              <I.DownloadCloud size={16} /> Tải dữ liệu từ Supabase Cloud về máy
            </button>
          </div>
        </div>

        {/* Hướng dẫn tạo bảng trong Supabase */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 16 }}>
          <b style={{ fontSize: 14.5, display: 'block', marginBottom: 8, color: 'var(--primary)' }}>
            📋 Hướng dẫn 3 bước tạo bảng trên Supabase (Chỉ cần làm 1 lần duy nhất):
          </b>
          <ol style={{ paddingLeft: 22, margin: '8px 0 14px', fontSize: 13.5, color: 'var(--text-main)', lineHeight: 1.7 }}>
            <li>
              Trên màn hình Supabase của bạn, bấm vào biểu tượng <b>`&gt;_ SQL Editor`</b> (biểu tượng thứ 3 từ trên xuống ở thanh menu màu đen bên trái).
            </li>
            <li>Bấm nút <b>`+ New query`</b> ở trên cùng.</li>
            <li>Copy đoạn mã SQL bên dưới, dán vào rồi bấm nút màu xanh lá <b>`Run`</b> (hoặc phím tắt Ctrl+Enter) là xong!</li>
          </ol>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-muted)' }}>Mã SQL tạo bảng `fitness_data`:</span>
            <button className="btn-secondary" onClick={copySql} style={{ fontSize: 12, padding: '6px 12px', borderRadius: 8 }}>
              {copiedSql ? '✓ Đã copy mã!' : '📋 Copy mã SQL'}
            </button>
          </div>

          <pre className="sql-code-box">{sqlScript}</pre>
        </div>
      </div>

      {/* Backup & Restore Data Section */}
      <div className="backup-section" style={{ marginTop: 24 }}>
        <span className="eyebrow">AN TOÀN DỮ LIỆU CỤC BỘ</span>
        <h2>Sao lưu & Khôi phục file JSON</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 13.5, margin: '6px 0 16px', lineHeight: 1.6 }}>
          Tải toàn bộ dữ liệu về máy tính thành file JSON hoặc nạp file backup bất kỳ lúc nào.
        </p>
        <div className="backup-actions">
          <button className="primary backup-btn" onClick={onExport}>
            <I.Download size={16} /> Tải file sao lưu (Export JSON)
          </button>
          <button className="btn-secondary backup-btn" onClick={onImport}>
            <I.Upload size={16} /> Khôi phục từ file (Import JSON)
          </button>
          <button className="btn-danger backup-btn" onClick={onReset}>
            <I.RefreshCw size={16} /> Đặt lại mặc định (Reset Data)
          </button>
        </div>
      </div>

      {/* Database Local Options & Guide */}
      <div className="db-info-card" style={{ marginTop: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <I.Database size={24} color="#0284c7" />
            <div>
              <h3 style={{ margin: 0, fontSize: 17 }}>Cơ sở dữ liệu Database trên máy (Local Database Server)</h3>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Lưu vào file `fitness_database.json` trên máy tính (Port 3001)</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="primary" onClick={onSyncDb} style={{ fontSize: 12.5, padding: '8px 14px' }}>
              <I.Server size={15} /> Lưu vào Local DB
            </button>
            <button className="btn-secondary" onClick={onLoadDb} style={{ fontSize: 12.5, padding: '8px 14px' }}>
              <I.Download size={15} /> Nạp từ Local DB
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}

createRoot(document.getElementById('root')).render(<App />);
