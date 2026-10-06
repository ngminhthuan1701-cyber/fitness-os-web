// Gemini AI Coach Service
export async function askGeminiCoach({ apiKey, messages, context }) {
  if (!apiKey) {
    throw new Error('Chưa cấu hình API Key');
  }

  const { profile, meals, exercises, expenses, recovery } = context;

  const systemPrompt = `Bạn là AI Fitness Coach chuyên nghiệp, thông minh và thân thiện trong hệ thống "AI Fitness OS".
Nhiệm vụ của bạn là đưa ra lời khuyên cá nhân hóa dựa trên dữ liệu thời gian thực của người dùng.
Luôn trả lời ngắn gọn, thực tế, động viên và dùng tiếng Việt tự nhiên (xưng "mình", gọi người dùng theo tên).

DỮ LIỆU HIỆN TẠI CỦA NGƯỜI DÙNG:
- Tên: ${profile.name || 'Người dùng'}, ${profile.age || 23} tuổi, chiều cao ${profile.height || 165}cm, cân nặng ${profile.weight || 52}kg.
- Mục tiêu: ${profile.goal || 'Tăng cơ / Tăng cân'}.
- Lịch tập: ${profile.days || 4} ngày/tuần, mỗi buổi ~${profile.minutes || 60} phút.
- Mục tiêu dinh dưỡng ngày: ${profile.calories || 2300} kcal, ${profile.protein || 150}g Protein, ${profile.carbs || 280}g Carbs, ${profile.fat || 70}g Fat.
- Ngân sách ăn uống ngày: ${profile.budget ? profile.budget.toLocaleString('vi-VN') + '₫' : '150.000₫'}.

TRẠNG THÁI HÔM NAY:
- Đã nạp: ${context.consumed} kcal / ${profile.calories} kcal (Còn lại: ${profile.calories - context.consumed} kcal).
- Protein đã nạp: ${context.protein}g / ${profile.protein}g (Còn thiếu: ${Math.max(0, profile.protein - context.protein)}g).
- Bữa ăn đã ghi nhận: ${meals.map(m => `${m.name}: ${m.food} (${m.cal} kcal, ${m.protein}g P, ${m.cost?.toLocaleString('vi-VN')}₫)`).join('; ') || 'Chưa ghi'}.
- Chi tiêu hôm nay: ${context.spent?.toLocaleString('vi-VN')}₫ / ${profile.budget?.toLocaleString('vi-VN')}₫.
- Buổi tập hôm nay: ${exercises.map(e => `${e.name} (${e.muscle}, ${e.sets} sets x ${e.reps}, ${e.weight}kg)`).join(', ')}.
- Chỉ số hồi phục (Recovery): Điểm 82/100, Giấc ngủ 7h30m, Mức năng lượng 8/10, Đau mỏi cơ thấp (2/10).

Hãy tư vấn thực đơn cụ thể, bài tập, progressive overload hoặc ngân sách phù hợp với tình trạng trên khi người dùng hỏi.`;

  // Format contents for Gemini API (only user and model turns)
  const contents = messages.map(msg => ({
    role: msg.from === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }]
  }));

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: systemPrompt }]
      },
      contents: contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800,
      }
    })
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    const message = errData?.error?.message || `Lỗi API (${response.status})`;
    throw new Error(message);
  }

  const data = await response.json();
  const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!reply) {
    throw new Error('Không nhận được phản hồi hợp lệ từ Gemini');
  }

  return reply;
}
