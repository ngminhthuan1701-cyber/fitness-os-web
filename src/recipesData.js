// Danh sách món ăn thể hình chuẩn Việt Nam kèm hình ảnh thật, dinh dưỡng, cách làm và video hướng dẫn
export const defaultRecipes = [
  {
    id: 'uc-ga-ap-chao',
    name: 'Ức gà áp chảo sốt tiêu đen',
    category: 'High Protein',
    mealType: 'Trưa / Tối',
    time: '20 phút',
    cal: 380,
    protein: 52,
    carbs: 6,
    fat: 9,
    cost: 35000,
    emoji: '🍗',
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80',
    summary: 'Món ăn kinh điển cho người tập gym: ức gà mềm mọng nước không bị khô, đậm đà vị tiêu đen cay thơm.',
    beginnerTip: 'Mẹo cho người mới: Khứa nhẹ bề mặt và đậy nắp vung 2 phút ở lửa nhỏ nhất. Thịt sẽ chín mềm ngọt tự nhiên, không bị khô xơ!',
    videoUrl: 'https://www.youtube.com/watch?v=kYJzEw1lQ2o',
    ingredients: [
      '200g ức gà tươi không da',
      '1 thìa cà phê tiêu đen xay giã dập',
      '1 thìa nước tương (xì dầu)',
      '1 thìa dầu hào',
      '1 tép tỏi băm nhỏ',
      '1 thìa nhỏ dầu ăn'
    ],
    steps: [
      'Sơ chế: Ức gà rửa sạch với muối loãng, dùng khăn giấy thấm khô. Khứa 3-4 đường nông trên mặt ức gà.',
      'Ướp gà: Trộn đều gà với tỏi băm, tiêu đen, 1 thìa nước tương, 1 thìa dầu hào trong 10-15 phút.',
      'Làm nóng chảo: Dùng chảo chống dính, cho 1 thìa nhỏ dầu ăn, bật lửa vừa cho chảo nóng già.',
      'Áp chảo chuẩn kỹ thuật: Đặt ức gà vào chảo, áp chảo mỗi mặt khoảng 4 phút cho vàng xém cạnh. Đậy nắp vung 2 phút ở lửa nhỏ nhất để thịt chín thấu bên trong mà không bị mất nước.',
      'Thưởng thức: Lấy ra thớt để nghỉ 2 phút trước khi thái lát để nước ngọt không bị chảy ra ngoài.'
    ]
  },
  {
    id: 'bo-xao-sup-lo',
    name: 'Thịt bò xào súp lơ xanh & tỏi',
    category: 'High Protein',
    mealType: 'Trưa / Tối',
    time: '15 phút',
    cal: 420,
    protein: 45,
    carbs: 14,
    fat: 16,
    cost: 55000,
    emoji: '🥩',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    summary: 'Thịt bò dồi dào kẽm, sắt và creatine tự nhiên kết hợp cùng bông cải xanh giàu chất xơ và vitamin C.',
    beginnerTip: 'Mẹo cho người mới: Thái bò ngang thớ thịt. Xào bò trên lửa thật to trong 1-2 phút rồi trút ra ngay, xào lâu thịt sẽ bị dai!',
    videoUrl: 'https://www.youtube.com/watch?v=0hM42x11f1E',
    ingredients: [
      '150g thịt bò nạc (thăn hoặc bắp)',
      '150g súp lơ xanh (bông cải xanh)',
      '3 tép tỏi đập dập',
      '1 thìa dầu hào, 1 thìa nước tương, tiêu xay, dầu ăn'
    ],
    steps: [
      'Sơ chế: Bò thái mỏng ngang thớ. Súp lơ cắt miếng vừa ăn, chần sơ qua nước sôi 1 phút rồi vớt ra xả nước lạnh giữ độ giòn.',
      'Ướp bò: Ướp thịt bò với tỏi băm, 1/2 thìa dầu hào, 1 chút tiêu và 1/2 thìa dầu ăn trong 10 phút để thịt mềm.',
      'Xào nhanh: Bật lửa to, phi thơm tỏi, cho thịt bò vào đảo nhanh tay khoảng 1-2 phút cho vừa chín tới rồi trút ra đĩa riêng.',
      'Xào súp lơ: Cho súp lơ vào chảo đảo đều với chút gia vị, sau đó đổ bò vào đảo cùng 30 giây rồi tắt bếp ngay.',
      'Trình bày: Múc ra đĩa, rắc thêm tiêu xay, ăn kèm cơm trắng hoặc cơm gạo lứt nóng hổi.'
    ]
  },
  {
    id: 'trung-cuon-thit-bap',
    name: 'Trứng cuộn bắp cải & ức gà băm',
    category: 'Budget Friendly',
    mealType: 'Sáng / Phụ',
    time: '15 phút',
    cal: 360,
    protein: 34,
    carbs: 10,
    fat: 18,
    cost: 24000,
    emoji: '🍳',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
    summary: 'Bữa sáng siêu tiết kiệm, dễ làm nhưng cung cấp lượng protein chất lượng cao từ trứng và thịt gà.',
    beginnerTip: 'Mẹo cho người mới: Tráng trứng ở lửa nhỏ liu riu. Khi mặt trứng vừa se lại thì cho nhân vào cuộn ngay kẻo trứng chín quá sẽ bị gãy!',
    videoUrl: '',
    ingredients: [
      '3 quả trứng gà',
      '70g ức gà băm nhỏ',
      '50g bắp cải thái sợi mỏng',
      'Hành lá, hạt nêm, tiêu xay'
    ],
    steps: [
      'Xào nhân: Phi thơm hành lá, xào sơ ức gà băm cùng bắp cải thái sợi cho chín tới, nêm nhẹ gia vị.',
      'Đánh trứng: Đập 3 quả trứng vào bát, thêm chút hạt nêm và tiêu rồi đánh tan đều.',
      'Tráng trứng cuộn: Đổ một lớp trứng mỏng vào chảo chống dính lửa nhỏ, khi mặt trứng se lại thì rải nhân vào rồi cuộn tròn.',
      'Cắt lát: Chiên vàng đều hai mặt cuốn trứng rồi lấy ra thớt cắt khoanh 2-3cm vừa miệng.'
    ]
  },
  {
    id: 'ca-basa-ap-chao',
    name: 'Cá basa áp chảo sốt chanh bơ tỏi',
    category: 'Budget Friendly',
    mealType: 'Trưa / Tối',
    time: '20 phút',
    cal: 390,
    protein: 38,
    carbs: 5,
    fat: 22,
    cost: 28000,
    emoji: '🐟',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
    summary: 'Cá basa giá thành rất rẻ, giàu đạm và axit béo Omega-3 tốt cho tim mạch và phục hồi khớp xương.',
    beginnerTip: 'Mẹo cho người mới: Dùng khăn giấy thấm thật khô 2 mặt miếng cá trước khi áp chảo, cá sẽ không bị bắn dầu và có lớp vỏ vàng giòn hấp dẫn.',
    videoUrl: '',
    ingredients: [
      '200g phi lê cá basa tươi',
      '1 thìa bơ thực vật hoặc bơ lạt',
      '1 quả chanh lấy nước cốt',
      'Tỏi băm, muối, tiêu, ớt bột'
    ],
    steps: [
      'Chuẩn bị: Cá basa rửa sạch, thấm khô thật kỹ bằng khăn giấy. Rắc chút muối, tiêu và ớt bột đều 2 mặt.',
      'Áp chảo cá: Cho ít dầu vào chảo nóng, áp chảo cá mỗi bên 4-5 phút đến khi vàng ruộm và săn lại thì vớt ra đĩa.',
      'Làm sốt chanh bơ: Phi thơm tỏi với bơ trên chảo nhỏ, vắt nước cốt chanh vào đảo đều 30 giây.',
      'Rưới sốt: Rưới sốt chanh bơ tỏi thơm ngậy lên trên miếng cá basa và thưởng thức cùng salad rau xà lách.'
    ]
  },
  {
    id: 'sinh-to-chuoi-dau-phong',
    name: 'Sinh tố chuối, bơ đậu phộng & sữa (Tăng cân)',
    category: 'Mass Gainer',
    mealType: 'Bữa phụ / Trước tập',
    time: '5 phút',
    cal: 560,
    protein: 24,
    carbs: 68,
    fat: 22,
    cost: 20000,
    emoji: '🥤',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80',
    summary: 'Nguồn calo sạch dồi dào, hấp thu nhanh, lý tưởng trước hoặc sau buổi tập cho người gầy muốn tăng cân tăng cơ.',
    beginnerTip: 'Mẹo cho người mới: Dùng chuối chín kỹ có đốm nâu (chuối trứng cuốc) sẽ ngọt tự nhiên mà không cần thêm bất kỳ loại đường nào!',
    videoUrl: 'https://www.youtube.com/watch?v=2TzT3d45Fw0',
    ingredients: [
      '2 quả chuối chín',
      '2 thìa canh bơ đậu phộng (khoảng 30g)',
      '250ml sữa tươi tiệt trùng',
      '1 nắm đá viên nhỏ'
    ],
    steps: [
      'Chuẩn bị: Lột vỏ chuối, bẻ miếng nhỏ cho vào cối xay sinh tố.',
      'Thêm nguyên liệu: Thêm bơ đậu phộng, sữa tươi và đá viên vào cối.',
      'Xay mịn: Bật máy xay công suất cao trong 45-60 giây cho đến khi hỗn hợp sánh mịn và bông xốp.',
      'Thưởng thức: Rót ra ly lớn và uống ngay trước buổi tập 45 phút hoặc dùng làm bữa phụ bổ sung calo.'
    ]
  },
  {
    id: 'com-dau-hu-nhoi-thit',
    name: 'Đậu hũ sốt cà chua nhồi thịt nạc',
    category: 'Budget Friendly',
    mealType: 'Trưa / Tối',
    time: '25 phút',
    cal: 460,
    protein: 42,
    carbs: 22,
    fat: 20,
    cost: 32000,
    emoji: '🍲',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    summary: 'Món ăn gia đình quen thuộc, giàu protein từ đậu nành và thịt nạc heo, chi phí cực kỳ tiết kiệm.',
    beginnerTip: 'Mẹo cho người mới: Dùng thìa nhỏ khoét nhẹ giữa bìa đậu, nhồi thịt vừa tay không nhồi quá căng kẻo đậu bị vỡ khi rán.',
    videoUrl: '',
    ingredients: [
      '2 bìa đậu hũ trắng',
      '100g thịt nạc heo băm',
      '2 quả cà chua chín',
      'Mộc nhĩ, hành lá, hành tím, hạt nêm, tiêu'
    ],
    steps: [
      'Làm nhân: Trộn thịt nạc băm với mộc nhĩ băm, hành tím băm, 1 thìa nhỏ hạt nêm và tiêu.',
      'Nhồi đậu: Cắt đậu hũ thành khối vuông, rạch một đường ở giữa rồi nhồi phần thịt băm vào khéo léo.',
      'Rán sơ: Cho đậu nhồi thịt vào chảo rán vàng nhẹ hai mặt.',
      'Nấu sốt cà chua: Cà chua băm nhỏ xào nhừ tạo sốt sệt, thả đậu hũ vào đun lửa nhỏ 7-10 phút cho ngấm đẫm sốt.',
      'Rắc hành lá thái nhỏ lên trên và dùng nóng với cơm.'
    ]
  }
];

// Danh mục nguyên liệu chuẩn kèm định lượng & dinh dưỡng tự động tính
export const standardIngredients = [
  { id: 'uc-ga', name: 'Ức gà tươi (thịt nạc)', unit: '100g', cal: 165, protein: 31, carbs: 0, fat: 3.6, cost: 9000 },
  { id: 'thit-bo', name: 'Thịt bò nạc (thăn/bắp)', unit: '100g', cal: 250, protein: 26, carbs: 0, fat: 15, cost: 28000 },
  { id: 'thit-lon', name: 'Thịt lợn nạc (thăn)', unit: '100g', cal: 145, protein: 26, carbs: 0, fat: 4, cost: 13000 },
  { id: 'ca-basa', name: 'Cá basa phi lê', unit: '100g', cal: 125, protein: 18, carbs: 0, fat: 5.5, cost: 11000 },
  { id: 'trung-ga', name: 'Trứng gà (1 quả)', unit: '1 quả (~55g)', cal: 78, protein: 6.5, carbs: 0.6, fat: 5.2, cost: 3500 },
  { id: 'long-trang-trung', name: 'Lòng trắng trứng (1 quả)', unit: '1 lòng trắng', cal: 17, protein: 3.6, carbs: 0.2, fat: 0.1, cost: 2000 },
  { id: 'com-trang', name: 'Cơm trắng (nấu chín)', unit: '1 bát (~150g)', cal: 205, protein: 4.2, carbs: 45, fat: 0.4, cost: 3000 },
  { id: 'com-lut', name: 'Cơm gạo lứt (nấu chín)', unit: '1 bát (~150g)', cal: 166, protein: 3.5, carbs: 35, fat: 1.5, cost: 5000 },
  { id: 'khoai-lang', name: 'Khoai lang luộc/hấp', unit: '1 củ vừa (~150g)', cal: 130, protein: 2.3, carbs: 30, fat: 0.2, cost: 4000 },
  { id: 'yen-mach', name: 'Yến mạch cán dẹt', unit: '50g', cal: 190, protein: 6.5, carbs: 33, fat: 3.5, cost: 6000 },
  { id: 'chuoi', name: 'Chuối tiêu chín', unit: '1 quả (~100g)', cal: 89, protein: 1.1, carbs: 23, fat: 0.3, cost: 3000 },
  { id: 'sua-tuoi', name: 'Sữa tươi tiệt trùng', unit: '1 hộp (220ml)', cal: 135, protein: 7.2, carbs: 11, fat: 7.0, cost: 8000 },
  { id: 'sua-chua', name: 'Sữa chua không đường', unit: '1 hộp (100g)', cal: 63, protein: 3.5, carbs: 4.7, fat: 3.3, cost: 7000 },
  { id: 'bo-dau-phong', name: 'Bơ đậu phộng nguyên chất', unit: '1 thìa canh (15g)', cal: 95, protein: 4.0, carbs: 3.2, fat: 8.0, cost: 4000 },
  { id: 'dau-hu', name: 'Đậu hũ trắng', unit: '1 bìa (~150g)', cal: 115, protein: 12.5, carbs: 2.8, fat: 6.0, cost: 4000 },
  { id: 'sup-lo', name: 'Súp lơ xanh (bông cải)', unit: '100g', cal: 34, protein: 2.8, carbs: 6.6, fat: 0.4, cost: 6000 },
  { id: 'rau-cai', name: 'Rau cải ngọt / cải thìa', unit: '100g', cal: 18, protein: 1.5, carbs: 2.8, fat: 0.2, cost: 3000 },
  { id: 'whey-protein', name: 'Whey Protein Isolate', unit: '1 muỗng (30g)', cal: 120, protein: 25, carbs: 1.5, fat: 1.0, cost: 20000 }
];

// Danh sách Combo Bữa Ăn gợi ý sẵn (Đã tính sẵn Calo & Macro)
export const defaultCombos = [
  {
    id: 'combo-trua-sieu-tang-co',
    name: 'Combo Trưa: Ức Gà Áp Chảo + Cơm Trắng + Canh Rau Cải',
    target: 'High Protein / Tăng Cơ Nạc',
    mealType: 'Trưa',
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80',
    items: [
      { name: 'Ức gà áp chảo sốt tiêu đen (200g)', cal: 380, protein: 52, cost: 35000 },
      { name: 'Cơm trắng (1 bát to 200g)', cal: 260, protein: 5, cost: 4000 },
      { name: 'Canh rau cải luộc', cal: 30, protein: 2, cost: 5000 }
    ],
    cal: 670,
    protein: 59,
    carbs: 65,
    fat: 11,
    cost: 44000,
    summary: 'Combo trọn gói 59g Protein tinh khiết, no lâu, calo sạch cho buổi trưa sau tập.'
  },
  {
    id: 'combo-sang-nhanh-gon',
    name: 'Combo Sáng: Khoai Lang + 3 Trứng Ốp La + Sữa Tươi',
    target: 'Nhanh 10 Phút / Budget Friendly',
    mealType: 'Sáng',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
    items: [
      { name: 'Khoai lang luộc (1 củ 150g)', cal: 130, protein: 2.3, cost: 4000 },
      { name: '3 quả trứng gà ốp la', cal: 234, protein: 19.5, cost: 10500 },
      { name: '1 hộp sữa tươi tiệt trùng (220ml)', cal: 135, protein: 7.2, cost: 8000 }
    ],
    cal: 499,
    protein: 29,
    carbs: 45,
    fat: 19,
    cost: 22500,
    summary: 'Chỉ mất 8 phút chế biến, chi phí dưới 25.000₫, cung cấp 29g Protein chất lượng cao.'
  },
  {
    id: 'combo-toi-bo-sup-lo',
    name: 'Combo Tối: Thịt Bò Xào Súp Lơ + Cơm Gạo Lứt',
    target: 'Phục Hồi Ban Đêm / Giàu Sắt & Kẽm',
    mealType: 'Tối',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    items: [
      { name: 'Thịt bò xào súp lơ xanh & tỏi (150g bò)', cal: 420, protein: 45, cost: 55000 },
      { name: 'Cơm gạo lứt (1 bát)', cal: 166, protein: 3.5, cost: 5000 }
    ],
    cal: 586,
    protein: 48.5,
    carbs: 48,
    fat: 18,
    cost: 60000,
    summary: 'Tối ưu cho cơ bắp hồi phục ban đêm với creatine, sắt và magie tự nhiên.'
  },
  {
    id: 'combo-phu-tang-can-sach',
    name: 'Combo Bữa Phụ: Sinh Tố Chuối Bơ Đậu Phộng + Trứng Luộc',
    target: 'Mass Gainer / Tăng Cân Nhanh',
    mealType: 'Snack',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80',
    items: [
      { name: 'Sinh tố chuối bơ đậu phộng sữa', cal: 560, protein: 24, cost: 20000 },
      { name: '2 quả trứng luộc', cal: 156, protein: 13, cost: 7000 }
    ],
    cal: 716,
    protein: 37,
    carbs: 80,
    fat: 28,
    cost: 27000,
    summary: 'Bổ sung ngay 716 kcal và 37g Protein cho người khó tăng cân trước/sau tập.'
  }
];
