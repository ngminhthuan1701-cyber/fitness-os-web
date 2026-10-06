// Dữ liệu giải phẫu cơ bắp và thư viện bài tập chi tiết kèm hình ảnh & video hướng dẫn

export const muscleGroupsData = [
  {
    id: 'chest',
    name: 'Ngực',
    latinName: 'Pectoralis Major & Minor',
    view: 'front',
    color: '#ef4444',
    summary: 'Nhóm cơ quan trọng nhất cho phần thân trên phía trước, chịu trách nhiệm cho các động tác đẩy (push) và ép cánh tay vào thân người.',
    subMuscles: ['Ngực trên (Clavicular)', 'Ngực giữa (Sternal)', 'Ngực dưới (Costal)'],
    exercises: [
      {
        id: 'bench-press',
        name: 'Barbell Flat Bench Press',
        vietnameseName: 'Đẩy ngực ngang đòn tạ',
        targetMuscle: 'Toàn bộ cơ ngực (đặc biệt ngực giữa)',
        secondaryMuscles: ['Tay sau (Triceps)', 'Vai trước (Front Delts)'],
        equipment: 'Đòn tạ Barbell & Ghế phẳng',
        level: 'Cơ bản - Nâng cao',
        image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
        videoUrl: 'https://www.youtube.com/embed/rT7DgCr-3pg',
        suggestedSets: '4 sets',
        suggestedReps: '6 - 10 reps',
        instructions: [
          'Nằm ngửa trên ghế phẳng, mắt đặt ngay dưới thanh đòn, bàn chân ấn chặt xuống sàn.',
          'Nắm đòn tạ rộng hơn vai khoảng 1.5 lần, ghì chặt bả vai (retract scapula) vào mặt ghế.',
          'Nhấc tạ ra, hít sâu gồng core, hạ tạ có kiểm soát xuống phần ngực giữa trong 2-3 giây.',
          'Đẩy tạ dứt khoát lên vị trí ban đầu và thở ra, không khóa chết khớp khuỷu tay ở đỉnh.'
        ],
        formTips: 'Luôn giữ cổ tay thẳng, không để cổ tay bị bẻ gập về phía sau khi tải nặng.',
        commonMistakes: 'Nâng mông khỏi ghế, thả tạ rơi tự do đập vào ngực, mở khuỷu tay quá vuông góc 90 độ.'
      },
      {
        id: 'incline-db-press',
        name: 'Incline Dumbbell Press',
        vietnameseName: 'Đẩy ngực trên tạ đơn',
        targetMuscle: 'Cơ ngực trên',
        secondaryMuscles: ['Vai trước', 'Tay sau'],
        equipment: 'Ghế dốc 30-45 độ & Tạ đôi Dumbbell',
        level: 'Trung bình',
        image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=80',
        videoUrl: 'https://www.youtube.com/embed/8iPEnn-ltC8',
        suggestedSets: '3 - 4 sets',
        suggestedReps: '8 - 12 reps',
        instructions: [
          'Chỉnh ghế nghiêng một góc lý tưởng khoảng 30 độ (tránh quá dốc sẽ ăn vào vai).',
          'Ngồi tựa lưng, dùng đầu gối hất tạ lên vị trí chuẩn bị trước ngực.',
          'Hạ tạ chậm rãi xuống hai bên ngực trên, cảm nhận cơ ngực được kéo giãn tối đa.',
          'Ép mạnh cơ ngực đẩy hai quả tạ lên theo hình vòng cung nhẹ, không chạm tạ vào nhau.'
        ],
        formTips: 'Góc khuỷu tay chếch khoảng 45 - 60 độ so với thân người để bảo vệ bao khớp vai.',
        commonMistakes: 'Chỉnh ghế quá dốc (>45 độ) khiến áp lực dồn hết vào cơ vai trước.'
      },
      {
        id: 'cable-crossover',
        name: 'Cable Fly / Cable Crossover',
        vietnameseName: 'Kéo cáp ép ngực',
        targetMuscle: 'Cơ ngực trong & Rãnh ngực',
        secondaryMuscles: ['Vai trước'],
        equipment: 'Dàn máy cáp đôi (Cable Crossover)',
        level: 'Trung bình',
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
        videoUrl: 'https://www.youtube.com/embed/taI4XduLpBe',
        suggestedSets: '3 sets',
        suggestedReps: '12 - 15 reps',
        instructions: [
          'Chỉnh ròng rọc ở vị trí ngang ngực hoặc trên cao, bước 1 chân lên trước để giữ thăng bằng.',
          'Tay hơi cong nhẹ cùi chỏ và cố định góc cong này trong suốt chuyển động.',
          'Dùng lực cơ ngực ép hai tay vào nhau trước ngực, siết chặt cơ ngực 1-2 giây ở đỉnh.',
          'Mở tay rộng ra từ từ để cơ ngực căng tối đa rồi lặp lại.'
        ],
        formTips: 'Hình dung như bạn đang ôm một thân cây to lớn, không duỗi thẳng đơ cánh tay.',
        commonMistakes: 'Dùng lực đẩy của tay sau thay vì dùng cơ ngực để khép tay.'
      }
    ]
  },
  {
    id: 'back',
    name: 'Lưng & Xô',
    latinName: 'Latissimus Dorsi, Rhomboids, Traps',
    view: 'back',
    color: '#0ea5e9',
    summary: 'Nhóm cơ rộng lớn nhất thân trên, giúp định hình vóc dáng chữ V (V-taper) và giữ cột sống thẳng, phòng tránh gù lưng.',
    subMuscles: ['Cơ xô (Lats)', 'Lưng giữa (Rhomboids)', 'Lưng dưới (Erector Spinae)', 'Cầu vai (Traps)'],
    exercises: [
      {
        id: 'lat-pulldown',
        name: 'Lat Pulldown',
        vietnameseName: 'Kéo xô máy cáp',
        targetMuscle: 'Cơ xô (Độ rộng lưng chữ V)',
        secondaryMuscles: ['Tay trước (Biceps)', 'Lưng giữa'],
        equipment: 'Máy kéo cáp Lat Pulldown',
        level: 'Cơ bản',
        image: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=800&auto=format&fit=crop&q=80',
        videoUrl: 'https://www.youtube.com/embed/CAwf7n6Luuc',
        suggestedSets: '4 sets',
        suggestedReps: '8 - 12 reps',
        instructions: [
          'Ngồi đùi kẹp chặt vào đệm giữ, nắm thanh kéo rộng hơn vai, lòng bàn tay hướng về phía trước.',
          'Hơi ngửa người ra sau khoảng 10-15 độ, ưỡn ngực.',
          'Dùng cơ xô kéo thanh đòn xuống chạm vào phần ngực trên, hướng cùi chỏ xuống đất và ra sau.',
          'Giữ 1 giây ở đáy, sau đó từ từ đưa thanh đòn trở lại vị trí ban đầu có kiểm soát.'
        ],
        formTips: 'Tập trung kéo bằng khuỷu tay (elbows drive down) thay vì gồng cẳng tay kéo bằng bàn tay.',
        commonMistakes: 'Đung đưa thân người giật tạ, kéo thanh đòn ra sau gáy dễ gây chấn thương cổ.'
      },
      {
        id: 'barbell-row',
        name: 'Bent Over Barbell Row',
        vietnameseName: 'Kéo đòn tạ gập người',
        targetMuscle: 'Độ dày lưng & Lưng giữa',
        secondaryMuscles: ['Cơ xô', 'Tay trước', 'Lưng dưới'],
        equipment: 'Đòn tạ Barbell',
        level: 'Trung bình - Nâng cao',
        image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&auto=format&fit=crop&q=80',
        videoUrl: 'https://www.youtube.com/embed/FWJR5Ve8gkQ',
        suggestedSets: '4 sets',
        suggestedReps: '8 - 10 reps',
        instructions: [
          'Đứng hai chân rộng bằng hông, gập hông ra sau sao cho thân người nghiêng khoảng 45 độ.',
          'Lưng luôn giữ thẳng tự nhiên, khóa chặt cơ bụng.',
          'Kéo thanh đòn sát vào phần rốn hoặc bụng dưới, kẹp chặt hai bả vai vào nhau.',
          'Hạ thanh tạ xuống từ từ cảm nhận cơ lưng căng giãn ra.'
        ],
        formTips: 'Giữ lưng dưới thẳng tuyệt đối, không được cong vòm lưng sẽ gây áp lực lên đĩa đệm.',
        commonMistakes: 'Dựng người quá đứng hoặc dùng đà nhấp nhổm toàn thân để giật tạ.'
      },
      {
        id: 'pull-ups',
        name: 'Pull-Up',
        vietnameseName: 'Hít xà đơn rộng tay',
        targetMuscle: 'Cơ xô & Toàn bộ cơ lưng',
        secondaryMuscles: ['Tay trước', 'Cơ bụng'],
        equipment: 'Xà đơn',
        level: 'Trung bình - Nâng cao',
        image: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800&auto=format&fit=crop&q=80',
        videoUrl: 'https://www.youtube.com/embed/eGo4IYlbE5g',
        suggestedSets: '3 - 4 sets',
        suggestedReps: 'Max reps',
        instructions: [
          'Nắm xà rộng hơn vai, treo người hoàn toàn để cơ lưng giãn tối đa.',
          'Gồng cơ bụng, ghì bả vai xuống trước khi bắt đầu kéo.',
          'Kéo người lên cho đến khi cằm vượt qua thanh xà, ngực chạm nhẹ hoặc hướng về xà.',
          'Hạ người xuống từ từ trong 2-3 giây về vị trí treo người hoàn toàn.'
        ],
        formTips: 'Không vung vẩy chân để lấy đà (kipping), thực hiện chậm rãi từng lần một.'
      }
    ]
  },
  {
    id: 'shoulders',
    name: 'Vai',
    latinName: 'Deltoid (Anterior, Lateral, Posterior)',
    view: 'both',
    color: '#f59e0b',
    summary: 'Cơ vai dạng quả cầu 3D giúp bờ vai vuông vức, rộng mở và tăng sức mạnh cho toàn bộ chuyển động đẩy nâng.',
    subMuscles: ['Vai trước (Anterior)', 'Vai giữa (Lateral - mở rộng vai)', 'Vai sau (Posterior)'],
    exercises: [
      {
        id: 'overhead-press',
        name: 'Standing Overhead Press (OHP)',
        vietnameseName: 'Đẩy vai đòn tạ đứng',
        targetMuscle: 'Vai trước & Sức mạnh tổng thể vai',
        secondaryMuscles: ['Tay sau', 'Cơ bụng', 'Cầu vai'],
        equipment: 'Đòn tạ Barbell',
        level: 'Trung bình - Nâng cao',
        image: 'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?w=800&auto=format&fit=crop&q=80',
        videoUrl: 'https://www.youtube.com/embed/2yjwXTZQDDI',
        suggestedSets: '4 sets',
        suggestedReps: '6 - 8 reps',
        instructions: [
          'Đứng vững hai chân rộng bằng vai, siết mông và bụng để giữ cột sống trung tính.',
          'Đặt thanh tạ trước ngực trên, cùi chỏ hơi chếch về phía trước.',
          'Đẩy thanh tạ thẳng đứng lên qua đầu, khi tạ qua trán thì hơi đưa đầu về phía trước.',
          'Khóa tạ trên đỉnh rồi hạ xuống có kiểm soát về vị trí xương đòn.'
        ],
        formTips: 'Siết mông thật chặt để tránh bị ưỡn võng lưng dưới khi tạ nặng.',
        commonMistakes: 'Ngả người ra sau quá nhiều biến bài tập thành đẩy ngực dốc.'
      },
      {
        id: 'lateral-raise',
        name: 'Dumbbell Lateral Raise',
        vietnameseName: 'Nâng tạ đôi ngang vai',
        targetMuscle: 'Vai giữa (Tạo độ rộng bo tròn vai)',
        secondaryMuscles: ['Cầu vai'],
        equipment: 'Tạ đôi Dumbbell',
        level: 'Cơ bản',
        image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80',
        videoUrl: 'https://www.youtube.com/embed/3VcKaXpzqRo',
        suggestedSets: '4 sets',
        suggestedReps: '12 - 15 reps',
        instructions: [
          'Đứng thẳng, hai tay cầm tạ đôi ở hai bên đùi, khuỷu tay hơi cong nhẹ.',
          'Nâng hai tạ sang hai bên theo mặt phẳng bả vai (chếch về trước khoảng 15 độ).',
          'Nâng cho tới khi cánh tay song song với mặt đất, giữ 1 nhịp ở đỉnh.',
          'Hạ tạ chậm rãi trong 2-3 giây, không để tạ chạm đùi để duy trì áp lực.'
        ],
        formTips: 'Tập trung nâng cùi chỏ lên chứ không phải giật cổ tay, không cần dùng tạ quá nặng.'
      },
      {
        id: 'face-pull',
        name: 'Cable Face Pull',
        vietnameseName: 'Kéo cáp vào mặt',
        targetMuscle: 'Vai sau & Cơ xoay bả vai (Rotator Cuff)',
        secondaryMuscles: ['Lưng giữa', 'Cầu vai'],
        equipment: 'Dây thừng Rope & Máy cáp',
        level: 'Cơ bản',
        image: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=800&auto=format&fit=crop&q=80',
        videoUrl: 'https://www.youtube.com/embed/rep-qVOkqgk',
        suggestedSets: '4 sets',
        suggestedReps: '15 - 20 reps',
        instructions: [
          'Chỉnh ròng rọc ngang tầm mắt, nắm 2 đầu dây thừng bằng ngón cái hướng về sau.',
          'Kéo dây thẳng về phía sống mũi và trán, đồng thời xoay ngoài khớp vai mở rộng hai tay ra.',
          'Siết chặt bả vai và vai sau ở cuối chuyển động trong 1 giây.',
          'Nhả tạ từ từ về vị trí ban đầu.'
        ],
        formTips: 'Bài tập vàng cho việc sửa tật gù vai, gù lưng ở dân văn phòng.'
      }
    ]
  },
  {
    id: 'arms',
    name: 'Tay (Biceps & Triceps)',
    latinName: 'Biceps Brachii & Triceps Brachii',
    view: 'both',
    color: '#8b5cf6',
    summary: 'Cánh tay săn chắc, cơ bắp cuồn cuộn với tỷ lệ 60% tay sau (Triceps) và 40% tay trước (Biceps).',
    subMuscles: ['Tay trước (Biceps Long/Short Head)', 'Tay sau (Triceps 3 đầu)', 'Cẳng tay (Brachioradialis)'],
    exercises: [
      {
        id: 'barbell-curl',
        name: 'Barbell Bicep Curl',
        vietnameseName: 'Cuốn tay trước đòn tạ EZ/Thẳng',
        targetMuscle: 'Cơ tay trước (Biceps)',
        secondaryMuscles: ['Cẳng tay'],
        equipment: 'Đòn tạ EZ Bar / Barbell',
        level: 'Cơ bản',
        image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&auto=format&fit=crop&q=80',
        videoUrl: 'https://www.youtube.com/embed/ykJmrZ5v0Oo',
        suggestedSets: '3 - 4 sets',
        suggestedReps: '10 - 12 reps',
        instructions: [
          'Đứng thẳng, nắm thanh đòn ngửa lòng bàn tay, khuỷu tay ép sát hai bên sườn.',
          'Cố định vị trí khuỷu tay, dùng lực tay trước cuộn thanh đòn lên phía ngực.',
          'Siết chặt bắp tay 1 giây ở điểm cao nhất.',
          'Hạ tạ có kiểm soát xuống hết biên độ nhưng không khóa cứng khớp.'
        ],
        formTips: 'Không đung đưa hông hoặc ngả người ra sau để lấy đà.'
      },
      {
        id: 'tricep-pushdown',
        name: 'Tricep Rope Pushdown',
        vietnameseName: 'Kéo cáp tay sau dây thừng',
        targetMuscle: 'Cơ tay sau (Triceps Lateral & Medial Head)',
        secondaryMuscles: ['Cẳng tay'],
        equipment: 'Dây thừng Rope & Máy cáp',
        level: 'Cơ bản',
        image: 'https://images.unsplash.com/photo-1584466977773-e625c37cdd50?w=800&auto=format&fit=crop&q=80',
        videoUrl: 'https://www.youtube.com/embed/vB5OHsJ3EME',
        suggestedSets: '4 sets',
        suggestedReps: '12 - 15 reps',
        instructions: [
          'Đứng hơi nghiêng người về trước khoảng 10 độ, giữ khuỷu tay cố định sát hông.',
          'Đẩy dây cáp thẳng xuống dưới cho đến khi cánh tay duỗi thẳng hoàn toàn.',
          'Tách hai đầu dây thừng sang hai bên ở điểm thấp nhất để ép sâu vào cơ tay sau.',
          'Đưa tạ lên chậm rãi đến góc 90 độ rồi lặp lại.'
        ],
        formTips: 'Khuỷu tay phải đóng vai trò như một chiếc bản lề cố định, không di chuyển ra trước ra sau.'
      },
      {
        id: 'hammer-curl',
        name: 'Dumbbell Hammer Curl',
        vietnameseName: 'Cuốn búa tạ đôi',
        targetMuscle: 'Cơ tay trước ngoài (Brachialis) & Cẳng tay',
        secondaryMuscles: ['Biceps'],
        equipment: 'Tạ đôi Dumbbell',
        level: 'Cơ bản',
        image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=80',
        videoUrl: 'https://www.youtube.com/embed/zC3nLlEvin4',
        suggestedSets: '3 sets',
        suggestedReps: '10 - 12 reps',
        instructions: [
          'Cầm tạ với hai lòng bàn tay hướng vào nhau (dáng cầm búa).',
          'Nâng tạ lên một cách có kiểm soát, giữ cổ tay cố định.',
          'Hạ tạ chậm rãi để tăng kích thước bề dày bắp tay và cẳng tay.'
        ],
        formTips: 'Bài tập tuyệt vời để tăng độ dày bắp tay khi nhìn từ góc nghiêng.'
      }
    ]
  },
  {
    id: 'legs',
    name: 'Đùi & Mông (Lower Body)',
    latinName: 'Quadriceps, Hamstrings, Glutes',
    view: 'both',
    color: '#10b981',
    summary: 'Nhóm cơ lớn nhất chiếm hơn 50% khối lượng cơ toàn thân, đốt cháy calo cực khủng và kích thích giải phóng hormone tăng trưởng tự nhiên.',
    subMuscles: ['Đùi trước (Quads)', 'Đùi sau (Hamstrings)', 'Mông (Glutes)', 'Bắp chuối (Calves)'],
    exercises: [
      {
        id: 'barbell-squat',
        name: 'Barbell Back Squat',
        vietnameseName: 'Gánh tạ đòn ngồi xổm',
        targetMuscle: 'Toàn bộ cơ đùi trước, đùi sau & cơ mông',
        secondaryMuscles: ['Cơ bụng (Core)', 'Lưng dưới'],
        equipment: 'Khung Squat & Đòn tạ Barbell',
        level: 'Trung bình - Nâng cao',
        image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80',
        videoUrl: 'https://www.youtube.com/embed/bEv6CCg2BC8',
        suggestedSets: '4 sets',
        suggestedReps: '6 - 10 reps',
        instructions: [
          'Đặt thanh đòn trên cơ cầu vai (High bar) hoặc gai bả vai (Low bar).',
          'Đứng hai chân rộng hơn vai một chút, mũi chân mở chếch ra ngoài khoảng 15-30 độ.',
          'Hít sâu nén bụng (Valsalva maneuver), đẩy hông ra sau và gập gối ngồi xuống sâu.',
          'Xuống cho tới khi đùi song song hoặc sâu hơn mặt sàn, dậm gót chân đứng phắt dậy dứt khoát.'
        ],
        formTips: 'Đầu gối luôn mở theo hướng mũi chân, ngực ưỡn tự nhiên, không cong vẹo lưng.',
        commonMistakes: 'Đầu gối chụm vào trong (valgus) hoặc nhấc gót chân khỏi sàn khi xuống sâu.'
      },
      {
        id: 'romanian-deadlift',
        name: 'Romanian Deadlift (RDL)',
        vietnameseName: 'Deadlift kiểu Romania (Đùi sau & Mông)',
        targetMuscle: 'Cơ đùi sau (Hamstrings) & Cơ mông (Glutes)',
        secondaryMuscles: ['Lưng dưới', 'Cẳng tay'],
        equipment: 'Đòn tạ Barbell / Tạ đôi Dumbbell',
        level: 'Trung bình',
        image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
        videoUrl: 'https://www.youtube.com/embed/JCXUYuzwNrM',
        suggestedSets: '4 sets',
        suggestedReps: '8 - 12 reps',
        instructions: [
          'Đứng thẳng cầm tạ trước đùi, đầu gối mở khóa nhẹ (hơi chùng khoảng 10-15 độ).',
          'Đẩy hông ra sau hết mức có thể, giữ thanh đòn lướt sát mặt đùi đi xuống.',
          'Hạ tạ đến ngang dưới đầu gối hoặc giữa cẳng chân khi cảm thấy đùi sau căng hết cỡ.',
          'Dùng lực cơ mông và đùi sau đẩy hông về phía trước để đứng thẳng dậy.'
        ],
        formTips: 'Hình dung bạn đang dùng mông để đóng một cánh cửa phía sau bạn.',
        commonMistakes: 'Gập gối quá nhiều biến thành squat hoặc cong lưng khi tạ xuống thấp.'
      },
      {
        id: 'bulgarian-split-squat',
        name: 'Bulgarian Split Squat',
        vietnameseName: 'Squat một chân ghế sau',
        targetMuscle: 'Cơ mông & Đùi trước từng bên',
        secondaryMuscles: ['Khả năng giữ thăng bằng', 'Core'],
        equipment: 'Ghế phẳng & Tạ đôi Dumbbell',
        level: 'Trung bình',
        image: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=800&auto=format&fit=crop&q=80',
        videoUrl: 'https://www.youtube.com/embed/2C-uNgKwPLE',
        suggestedSets: '3 sets mỗi chân',
        suggestedReps: '10 - 12 reps',
        instructions: [
          'Đứng cách ghế khoảng 2 bước chân, đặt mu bàn chân sau lên mép ghế.',
          'Hạ trọng tâm thẳng xuống cho đến khi đùi chân trước song song với sàn.',
          'Dồn lực vào gót chân trước và đứng dậy có kiểm soát.'
        ],
        formTips: 'Nghiêng nhẹ thân người về trước 15 độ sẽ kích hoạt cơ mông nhiều hơn.'
      }
    ]
  },
  {
    id: 'core',
    name: 'Cơ Bụng & Core',
    latinName: 'Rectus Abdominis, Obliques, Transverse',
    view: 'front',
    color: '#06b6d4',
    summary: 'Trung tâm chịu lực bảo vệ cột sống, kết nối sức mạnh thân trên và thân dưới, tạo cơ bụng 6 múi săn chắc.',
    subMuscles: ['Cơ thẳng bụng 6 múi (Rectus Abdominis)', 'Cơ liên sườn (Obliques)', 'Cơ bụng trong (Transverse)'],
    exercises: [
      {
        id: 'hanging-leg-raise',
        name: 'Hanging Leg Raise',
        vietnameseName: 'Treo người nâng chân xà đơn',
        targetMuscle: 'Cơ bụng dưới & Toàn bộ cơ bụng',
        secondaryMuscles: ['Cơ gập hông (Hip Flexors)', 'Cẳng tay'],
        equipment: 'Xà đơn',
        level: 'Trung bình - Nâng cao',
        image: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800&auto=format&fit=crop&q=80',
        videoUrl: 'https://www.youtube.com/embed/hdng3Nm1x_E',
        suggestedSets: '3 - 4 sets',
        suggestedReps: '12 - 15 reps',
        instructions: [
          'Treo người trên thanh xà đơn, giữ hai chân thẳng hoặc hơi cong nhẹ đầu gối.',
          'Gồng chặt cơ bụng, cuộn xương chậu lên và nâng hai chân lên phía trước.',
          'Nâng cho tới khi chân song song với sàn (hoặc chạm xà nếu nâng cao).',
          'Hạ chân xuống chậm rãi, không để cơ thể đung đưa như con lắc.'
        ],
        formTips: 'Tập trung cuộn xương chậu lên trên thay vì chỉ đơn thuần nhấc chân.'
      },
      {
        id: 'plank',
        name: 'Standard Forearm Plank',
        vietnameseName: 'Plank chống cùi chỏ tĩnh',
        targetMuscle: 'Cơ bụng sâu & Cơ lõi toàn thân',
        secondaryMuscles: ['Vai', 'Mông', 'Lưng'],
        equipment: 'Thảm tập yoga',
        level: 'Cơ bản',
        image: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=800&auto=format&fit=crop&q=80',
        videoUrl: 'https://www.youtube.com/embed/ASdvN_XEl_c',
        suggestedSets: '3 sets',
        suggestedReps: '45 - 60 giây',
        instructions: [
          'Chống hai cùi chỏ vuông góc dưới vai, mũi chân ấn xuống sàn.',
          'Giữ cơ thể thành một đường thẳng tắp từ đầu tới gót chân.',
          'Siết chặt mông, gồng cứng cơ bụng, hít thở đều nhịp nhàng.',
          'Không để hông bị chùng võng xuống hay nhô cao lên trời.'
        ],
        formTips: 'Tưởng tượng ai đó chuẩn bị đấm vào bụng bạn, đó là cách gồng cơ core chính xác.'
      },
      {
        id: 'cable-woodchopper',
        name: 'Cable Woodchopper',
        vietnameseName: 'Kéo cáp chém gỗ xoay eo',
        targetMuscle: 'Cơ liên sườn (Obliques)',
        secondaryMuscles: ['Vai', 'Cơ bụng trước'],
        equipment: 'Máy cáp ròng rọc',
        level: 'Trung bình',
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
        videoUrl: 'https://www.youtube.com/embed/pAplQXk3dkU',
        suggestedSets: '3 sets mỗi bên',
        suggestedReps: '12 - 15 reps',
        instructions: [
          'Đứng nghiêng so với máy cáp, hai tay nắm tay cầm cáp trên cao.',
          'Dùng lực xoay thân người và cơ liên sườn kéo cáp chéo xuống phía hông đối diện.',
          'Giữ cánh tay thẳng tương đối, xoay bàn chân sau để chuyển lực mượt mà.',
          'Kiểm soát tạ đưa trở lại vị trí ban đầu rồi đổi bên.'
        ],
        formTips: 'Xoay bằng cơ bụng và eo chứ không dùng lực kéo của cánh tay.'
      }
    ]
  }
];
