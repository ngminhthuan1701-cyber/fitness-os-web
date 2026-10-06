// Danh sách món ăn thể hình chuẩn Việt Nam kèm dinh dưỡng, cách làm và link video hướng dẫn
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
    summary: 'Món ăn kinh điển cho người tập gym: ức gà mềm mọng nước không bị khô, đậm đà vị tiêu đen cay thơm.',
    videoUrl: 'https://www.youtube.com/watch?v=kYJzEw1lQ2o', // Link video hướng dẫn áp chảo ức gà mềm mọng
    ingredients: [
      '200g ức gà tươi không da',
      '1 thìa cà phê tiêu đen xay giã dập',
      '1 thìa nước tương (xì dầu)',
      '1 thìa dầu hào',
      '1 tép tỏi băm nhỏ',
      '1 thìa nhỏ dầu ô liu'
    ],
    steps: [
      'Sơ chế: Ức gà rửa sạch với muối loãng, dùng dao khứa vài đường xéo nông trên bề mặt để thấm gia vị nhanh.',
      'Ướp gà: Trộn đều gà với tỏi băm, tiêu đen giã dập, 1 thìa nước tương, 1 thìa dầu hào trong 10-15 phút.',
      'Làm nóng chảo: Dùng chảo chống dính, cho 1 thìa nhỏ dầu ô liu, bật lửa vừa cho chảo nóng già.',
      'Áp chảo chuẩn kỹ thuật: Đặt ức gà vào chảo, áp chảo mỗi mặt khoảng 4-5 phút cho vàng xém cạnh. Đậy nắp vung 2 phút ở lửa nhỏ nhất để thịt chín thấu bên trong mà không bị mất nước.',
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
    summary: 'Thịt bò dồi dào kẽm, sắt và creatine tự nhiên kết hợp cùng bông cải xanh giàu chất xơ và vitamin C.',
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
    summary: 'Bữa sáng siêu tiết kiệm, dễ làm nhưng cung cấp lượng protein chất lượng cao từ trứng và thịt gà.',
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
    summary: 'Cá basa giá thành rất rẻ, giàu đạm và axit béo Omega-3 tốt cho tim mạch và phục hồi khớp xương.',
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
    summary: 'Nguồn calo sạch dồi dào, hấp thu nhanh, lý tưởng trước hoặc sau buổi tập cho người gầy muốn tăng cân tăng cơ.',
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
    summary: 'Món ăn gia đình quen thuộc, giàu protein từ đậu nành và thịt nạc heo, chi phí cực kỳ tiết kiệm.',
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
