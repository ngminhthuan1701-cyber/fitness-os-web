// Dữ liệu mẫu các giáo trình tập và thư viện bài tập
export const workoutPrograms = {
  'Upper Body': [
    { name: 'Barbell Bench Press', muscle: 'Ngực', sets: 4, reps: '8–10', weight: 55, note: 'Tăng tạ hiệp cuối nếu hoàn thành tốt' },
    { name: 'Lat Pulldown', muscle: 'Lưng xô', sets: 4, reps: '8–12', weight: 45, note: 'Kéo chạm ngực trên, giữ 1 giây' },
    { name: 'Dumbbell Shoulder Press', muscle: 'Vai', sets: 3, reps: '10–12', weight: 16, note: 'Khóa chặt core khi đẩy' },
    { name: 'Barbell Bicep Curl', muscle: 'Tay trước', sets: 3, reps: '10–12', weight: 20, note: 'Không đung đưa người' },
    { name: 'Tricep Rope Pushdown', muscle: 'Tay sau', sets: 3, reps: '12–15', weight: 25, note: 'Tách dây ở đáy chuyển động' },
  ],
  'Lower Body': [
    { name: 'Barbell Back Squat', muscle: 'Đùi trước / Mông', sets: 4, reps: '6–8', weight: 70, note: 'Xuống sâu dưới song song' },
    { name: 'Romanian Deadlift (RDL)', muscle: 'Đùi sau / Mông', sets: 4, reps: '8–10', weight: 65, note: 'Đẩy hông ra sau, lưng thẳng' },
    { name: 'Bulgarian Split Squat', muscle: 'Đùi / Mông', sets: 3, reps: '10–12', weight: 14, note: 'Mỗi bên chân' },
    { name: 'Standing Calf Raise', muscle: 'Bắp chân', sets: 4, reps: '15–20', weight: 40, note: 'Căng cơ tối đa ở đỉnh' },
  ],
  'Push Day': [
    { name: 'Incline Dumbbell Press', muscle: 'Ngực trên', sets: 4, reps: '8–10', weight: 22, note: 'Ghế nghiêng 30 độ' },
    { name: 'Flat Barbell Bench Press', muscle: 'Ngực giữa', sets: 3, reps: '8–10', weight: 55, note: 'Kiểm soát nhịp hạ tạ 2s' },
    { name: 'Overhead Press (OHP)', muscle: 'Vai trước', sets: 3, reps: '8–10', weight: 35, note: 'Gồng mông và bụng vững' },
    { name: 'Lateral Raise', muscle: 'Vai giữa', sets: 4, reps: '12–15', weight: 8, note: 'Cổ tay thẳng, nâng ngang vai' },
    { name: 'Skull Crusher', muscle: 'Tay sau', sets: 3, reps: '10–12', weight: 22, note: 'Cố định vị trí cùi chỏ' },
  ],
  'Pull Day': [
    { name: 'Barbell Deadlift', muscle: 'Lưng / Toàn thân', sets: 3, reps: '5–6', weight: 90, note: 'Khởi động kỹ trước hiệp chính' },
    { name: 'Chest Supported Row', muscle: 'Lưng giữa', sets: 4, reps: '8–10', weight: 40, note: 'Kẹp bả vai vào nhau' },
    { name: 'Close Grip Pulldown', muscle: 'Lưng xô', sets: 3, reps: '10–12', weight: 45, note: 'Kéo sâu' },
    { name: 'Face Pull', muscle: 'Vai sau', sets: 4, reps: '15', weight: 20, note: 'Cải thiện tư thế vai' },
    { name: 'Incline Dumbbell Curl', muscle: 'Tay trước', sets: 3, reps: '10–12', weight: 12, note: 'Căng cơ bắp tay tối đa' },
  ],
  'Legs & Abs': [
    { name: 'Leg Press', muscle: 'Đùi trước', sets: 4, reps: '10–12', weight: 120, note: 'Không khóa khớp gối ở đỉnh' },
    { name: 'Leg Curl', muscle: 'Đùi sau', sets: 4, reps: '10–12', weight: 35, note: 'Siết cơ 1s ở điểm gập' },
    { name: 'Walking Lunges', muscle: 'Đùi & Mông', sets: 3, reps: '12 bước/chân', weight: 16, note: 'Giữ thăng bằng' },
    { name: 'Hanging Leg Raise', muscle: 'Cơ bụng dưới', sets: 3, reps: '12–15', weight: 0, note: 'Nâng chân không đung đưa' },
  ],
};

export const muscleGroups = ['Tất cả', 'Ngực', 'Lưng', 'Vai', 'Tay', 'Đùi / Mông', 'Bụng'];
