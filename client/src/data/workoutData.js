export const EXERCISE_LIBRARY = [
  // Chest
  {
    name: "Bench Press",
    category: "Chest",
    formCue: "Drive feet through floor, keep shoulder blades packed.",
    steps: [
      "Lie on your back on a flat bench. Grip the barbell with hands slightly wider than shoulder-width.",
      "Bring the bar down slowly to your mid-chest while inhaling.",
      "Push the bar back up to the starting position while exhaling, focusing on using your chest muscles.",
      "Lock your elbows at the top and repeat for the desired number of reps."
    ],
    requirements: ["Barbell", "Flat Bench", "Weights"]
  },
  {
    name: "Incline Bench Press",
    category: "Chest",
    formCue: "Lower to upper chest, maintain stable position.",
    steps: [
      "Set an incline bench to 30-45 degrees.",
      "Lie back and grip the barbell slightly wider than shoulder-width.",
      "Lower the bar to your upper chest in a controlled manner.",
      "Drive the weight back up until arms are extended, keeping your core tight."
    ],
    requirements: ["Barbell", "Incline Bench", "Weights"]
  },
  {
    name: "Dumbbell Chest Press",
    category: "Chest",
    formCue: "Full range, controlled tempo.",
    steps: [
      "Sit on a flat bench with a dumbbell in each hand, resting on your thighs.",
      "Lay back, bringing the dumbbells to the sides of your chest with elbows at 45-90 degrees.",
      "Press the dumbbells straight up until arms are fully extended.",
      "Lower the dumbbells back down slowly to the start position."
    ],
    requirements: ["Dumbbells", "Flat Bench"]
  },
  {
    name: "Cable Chest Fly",
    category: "Chest",
    formCue: "Squeeze at top, slight elbow bend.",
    steps: [
      "Stand between two cable machines with handles at chest height.",
      "Step forward and lean slightly, holding handles with a slight bend in your elbows.",
      "Bring your hands together in front of your chest in a wide arc.",
      "Slowly return to the starting position, feeling the stretch in your chest."
    ],
    requirements: ["Cable Machine", "D-Handles"]
  },
  {
    name: "Push-ups",
    category: "Chest",
    formCue: "Keep body straight, lower to 90 degrees.",
    steps: [
      "Start in a plank position with hands slightly wider than shoulders.",
      "Lower your body until your chest nearly touches the floor.",
      "Keep your core engaged and your back flat throughout the movement.",
      "Push back up to the starting position."
    ],
    requirements: ["None (Bodyweight)"]
  },

  // Back
  {
    name: "Deadlift",
    category: "Back",
    formCue: "Hinge from hips, keep bar close to shins.",
    steps: [
      "Stand with feet hip-width apart, bar over mid-foot.",
      "Hinge at the hips and grip the bar just outside your legs.",
      "Flatten your back, drop your hips, and pull the slack out of the bar.",
      "Drive through your heels to stand up, keeping the bar close to your body."
    ],
    requirements: ["Barbell", "Weights"]
  },
  {
    name: "Lat Pulldown",
    category: "Back",
    formCue: "Pull elbows toward hips, avoid leaning back.",
    steps: [
      "Sit at a lat pulldown machine and grab the bar with a wide overhand grip.",
      "Pull the bar down toward your upper chest, focusing on pulling with your elbows.",
      "Squeeze your shoulder blades at the bottom of the movement.",
      "Slowly return the bar to the start position."
    ],
    requirements: ["Lat Pulldown Machine"]
  },
  {
    name: "Barbell Rows",
    category: "Back",
    formCue: "Retract shoulder blades, hinge from hips.",
    steps: [
      "Hinge at the hips with a slight bend in the knees, holding a barbell with an overhand grip.",
      "Pull the bar toward your lower ribs, keeping your back flat.",
      "Squeeze your lats and shoulder blades at the top.",
      "Lower the bar back down with control."
    ],
    requirements: ["Barbell", "Weights"]
  },
  {
    name: "Assisted Pull-ups",
    category: "Back",
    formCue: "Full range of motion, chest to bar.",
    steps: [
      "Kneel or stand on the platform of an assisted pull-up machine.",
      "Grab the handles and pull yourself up until your chin is above your hands.",
      "Focus on driving your elbows down to lift your body.",
      "Lower yourself back down slowly until arms are extended."
    ],
    requirements: ["Pull-up Machine"]
  },
  {
    name: "Face Pulls",
    category: "Back",
    formCue: "External rotation, squeeze rear delts.",
    steps: [
      "Set a cable machine to eye level with a rope attachment.",
      "Pull the rope toward your forehead, pulling the ends apart.",
      "Keep your elbows high and focus on rotating your shoulders back.",
      "Slowly return to the start position."
    ],
    requirements: ["Cable Machine", "Rope Attachment"]
  },

  // Shoulders
  {
    name: "Shoulder Press",
    category: "Shoulders",
    formCue: "Squeeze glutes, keep ribs stacked over hips.",
    steps: [
      "Stand or sit with a barbell or dumbbells at shoulder height.",
      "Press the weight directly overhead until arms are locked.",
      "Keep your core tight and avoid arching your back.",
      "Lower the weight back to shoulder height with control."
    ],
    requirements: ["Barbell or Dumbbells", "Stand or Bench"]
  },
  {
    name: "Lateral Raises",
    category: "Shoulders",
    formCue: "Slight bend in elbow, raise to shoulder height.",
    steps: [
      "Stand with dumbbells at your sides, palms facing in.",
      "Lift the weights out to your sides until they are level with your shoulders.",
      "Keep a slight bend in your elbows and lead with your pinkies.",
      "Lower the weights back down slowly."
    ],
    requirements: ["Dumbbells"]
  },
  {
    name: "Machine Shoulder Press",
    category: "Shoulders",
    formCue: "Full range, controlled descent.",
    steps: [
      "Sit in the machine and adjust the seat so the handles are at shoulder level.",
      "Press the handles upward until your arms are fully extended.",
      "Lower the handles back down to the starting position with control."
    ],
    requirements: ["Shoulder Press Machine"]
  },
  {
    name: "Plate Raises",
    category: "Shoulders",
    formCue: "Arms extended, squeeze at top.",
    steps: [
      "Hold a weight plate with both hands in front of your thighs.",
      "Lift the plate until it is at eye level, keeping arms extended.",
      "Control the descent back to the starting position."
    ],
    requirements: ["Weight Plate"]
  },

  // Legs
  {
    name: "Squats",
    category: "Legs",
    formCue: "Brace core, knees track over mid-foot.",
    steps: [
      "Place a barbell across your upper back (traps) and stand with feet shoulder-width apart.",
      "Lower your hips as if sitting in a chair, keeping your chest up and back flat.",
      "Go as deep as your mobility allows, ideally until thighs are parallel to the floor.",
      "Drive back up through your heels to the starting position."
    ],
    requirements: ["Barbell", "Squat Rack", "Weights"]
  },
  {
    name: "Leg Press",
    category: "Legs",
    formCue: "Full range, knees aligned with toes.",
    steps: [
      "Sit in the machine and place your feet shoulder-width apart on the platform.",
      "Release the safety locks and lower the platform until knees are at 90 degrees.",
      "Press the platform back up, but do not lock your knees at the top.",
      "Repeat for the desired number of reps."
    ],
    requirements: ["Leg Press Machine", "Weights"]
  },
  {
    name: "Lunges",
    category: "Legs",
    formCue: "Stay tall, keep front knee stable.",
    steps: [
      "Stand tall and take a large step forward with one leg.",
      "Lower your hips until both knees are bent at approximately 90 degrees.",
      "Ensure your front knee is directly above your ankle.",
      "Push back up to the starting position and repeat on the other leg."
    ],
    requirements: ["Dumbbells (Optional)"]
  },
  {
    name: "Leg Curl",
    category: "Legs",
    formCue: "Controlled motion, full range of motion.",
    steps: [
      "Lie or sit in the leg curl machine with the pad against your lower calves.",
      "Curl your legs toward your glutes, squeezing the hamstrings.",
      "Slowly return your legs to the starting position."
    ],
    requirements: ["Leg Curl Machine"]
  },
  {
    name: "Leg Extensions",
    category: "Legs",
    formCue: "Full lockout, squeeze quadriceps.",
    steps: [
      "Sit in the machine with the pad against your lower shins.",
      "Extend your legs until they are straight, squeezing your quads at the top.",
      "Lower the weight back down slowly."
    ],
    requirements: ["Leg Extension Machine"]
  },
  {
    name: "Bulgarian Split Squats",
    category: "Legs",
    formCue: "Balance and stability, 90-degree angle.",
    steps: [
      "Stand a few feet in front of a bench and place the top of one foot on it.",
      "Lower your hips until your front thigh is parallel to the ground.",
      "Keep your torso upright and your front knee stable.",
      "Drive back up to the starting position."
    ],
    requirements: ["Bench", "Dumbbells (Optional)"]
  },

  // Arms
  {
    name: "Barbell Curls",
    category: "Arms",
    formCue: "Keep elbows fixed, full range.",
    steps: [
      "Stand with a barbell in your hands, palms facing forward.",
      "Curl the bar toward your shoulders, keeping your elbows locked by your sides.",
      "Squeeze your biceps at the top of the movement.",
      "Lower the bar back down slowly."
    ],
    requirements: ["Barbell", "Weights"]
  },
  {
    name: "Tricep Dips",
    category: "Arms",
    formCue: "Lower chest height, controlled descent.",
    steps: [
      "Hold onto dip bars or the edge of a bench with arms extended.",
      "Lower your body until your shoulders are below your elbows.",
      "Push back up until your arms are fully extended.",
      "Keep your core engaged to stay stable."
    ],
    requirements: ["Dip Bars or Bench"]
  },
  {
    name: "Overhead Tricep Extension",
    category: "Arms",
    formCue: "Full range, squeeze at top.",
    steps: [
      "Hold a dumbbell over your head with both hands.",
      "Lower the weight behind your head by bending your elbows.",
      "Keep your elbows close to your ears.",
      "Press the weight back up until arms are straight."
    ],
    requirements: ["Dumbbell"]
  },
  {
    name: "Hammer Curls",
    category: "Arms",
    formCue: "Neutral grip, slow and controlled.",
    steps: [
      "Hold dumbbells at your sides with a neutral (hammer) grip.",
      "Curl the weights toward your shoulders while keeping elbows fixed.",
      "Squeeze at the top and lower back down slowly."
    ],
    requirements: ["Dumbbells"]
  },

  // Core
  {
    name: "Plank",
    category: "Core",
    formCue: "Tuck pelvis, keep neck neutral.",
    steps: [
      "Start in a push-up position but rest your weight on your forearms instead of your hands.",
      "Keep your body in a straight line from head to heels.",
      "Engage your core and squeeze your glutes.",
      "Hold the position for the desired time."
    ],
    requirements: ["None (Bodyweight)"]
  },
  {
    name: "Crunches",
    category: "Core",
    formCue: "Controlled motion, exhale at top.",
    steps: [
      "Lie on your back with knees bent and feet flat on the floor.",
      "Place your hands behind your head or across your chest.",
      "Lift your shoulders off the floor, contracting your abs.",
      "Lower back down slowly."
    ],
    requirements: ["None (Bodyweight)"]
  },
  {
    name: "Cable Woodchops",
    category: "Core",
    formCue: "Rotate from core, full range.",
    steps: [
      "Set a cable machine to high or low position and stand sideways.",
      "Grip the handle with both hands and pull across your body in a diagonal motion.",
      "Rotate from your core, keeping your arms extended.",
      "Control the weight back to the starting position."
    ],
    requirements: ["Cable Machine", "D-Handle"]
  },
  {
    name: "Ab Wheel Rollout",
    category: "Core",
    formCue: "Controlled descent and return.",
    steps: [
      "Kneel on the floor and hold the ab wheel with both hands.",
      "Roll the wheel forward, extending your body as far as you can while maintaining a flat back.",
      "Use your abs to pull yourself back to the starting position."
    ],
    requirements: ["Ab Wheel"]
  },

  // Cardio
  {
    name: "Cycling",
    category: "Cardio",
    formCue: "Maintain steady cadence, relaxed shoulders.",
    steps: [
      "Adjust the seat height so your leg is slightly bent at the bottom of the pedal stroke.",
      "Maintain a steady pace and keep your core slightly engaged.",
      "Focus on smooth, circular pedal strokes."
    ],
    requirements: ["Stationary Bike or Bicycle"]
  },
  {
    name: "Treadmill Running",
    category: "Cardio",
    formCue: "Natural stride, relaxed posture.",
    steps: [
      "Start with a brisk walk to warm up.",
      "Increase the speed to a jogging or running pace.",
      "Keep your chest up and look straight ahead.",
      "Gradually decrease speed to cool down."
    ],
    requirements: ["Treadmill"]
  },
  {
    name: "Rowing Machine",
    category: "Cardio",
    formCue: "Drive legs first, then pull.",
    steps: [
      "Sit on the rower and secure your feet.",
      "Push off with your legs, then lean back slightly and pull the handle toward your lower ribs.",
      "Reverse the motion: extend arms, lean forward, then bend knees."
    ],
    requirements: ["Rowing Machine"]
  },
  {
    name: "Elliptical",
    category: "Cardio",
    formCue: "Consistent pace, upright posture.",
    steps: [
      "Step onto the machine and grab the handles.",
      "Move your legs in a fluid, circular motion.",
      "Maintain an upright posture and use your arms for additional resistance."
    ],
    requirements: ["Elliptical Machine"]
  },
];

export const ALL_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const BUILDER_MODES = [
  { value: "standard", label: "Standard" },
  { value: "superset", label: "Superset" },
  { value: "drop-set", label: "Drop-set" },
  { value: "circuit", label: "Circuit" },
];

export const EXERCISE_CATEGORIES = ["Chest", "Back", "Shoulders", "Legs", "Arms", "Core", "Cardio"];
