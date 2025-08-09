import { validateWorkoutSchema, validateExerciseLinking, validateHIITIntervals } from './workoutValidation';

// Example workout data that demonstrates all the features
export const exampleWorkout = {
  sessionId: "550e8400-e29b-41d4-a716-446655440000",
  startTime: "2024-01-15T10:00:00Z",
  workoutBlocks: [
    {
      blockId: "550e8400-e29b-41d4-a716-446655440001",
      blockType: "strength",
      exercises: [
        {
          exerciseId: "550e8400-e29b-41d4-a716-446655440002",
          exerciseName: "Bench Press",
          exerciseType: "compound",
          muscleGroups: ["chest", "triceps", "shoulders"],
          equipment: ["barbell", "bench"],
          sets: [
            {
              setNumber: 1,
              target: {
                type: "weight",
                value: 135,
                unit: "lbs"
              },
              restAfterSet: 180
            },
            {
              setNumber: 2,
              target: {
                type: "weight",
                value: 155,
                unit: "lbs"
              },
              restAfterSet: 180
            }
          ]
        }
      ],
      restBetweenSets: 180,
      restBetweenBlocks: 300
    },
    {
      blockId: "550e8400-e29b-41d4-a716-446655440004",
      blockType: "superset",
      exercises: [
        {
          exerciseId: "550e8400-e29b-41d4-a716-446655440005",
          exerciseName: "Push-ups",
          exerciseType: "bodyweight",
          muscleGroups: ["chest", "triceps"],
          equipment: [],
          sets: [
            {
              setNumber: 1,
              target: {
                type: "reps",
                value: 15,
                unit: "reps"
              },
              restAfterSet: 0
            }
          ],
          supersetWith: ["550e8400-e29b-41d4-a716-446655440003"]
        },
        {
          exerciseId: "550e8400-e29b-41d4-a716-446655440003",
          exerciseName: "Dips",
          exerciseType: "bodyweight",
          muscleGroups: ["triceps", "chest"],
          equipment: ["dip bars"],
          sets: [
            {
              setNumber: 1,
              target: {
                type: "reps",
                value: 12,
                unit: "reps"
              },
              restAfterSet: 120
            }
          ],
          supersetWith: ["550e8400-e29b-41d4-a716-446655440002"]
        }
      ],
      restBetweenSets: 0,
      restBetweenBlocks: 300
    },
    {
      blockId: "550e8400-e29b-41d4-a716-446655440006",
      blockType: "hiit",
      exercises: [
        {
          exerciseId: "550e8400-e29b-41d4-a716-446655440007",
          exerciseName: "Burpees",
          exerciseType: "cardio",
          muscleGroups: ["full body"],
          equipment: [],
          sets: [
            {
              setNumber: 1,
              target: {
                type: "time",
                value: 20,
                unit: "seconds"
              },
              restAfterSet: 20
            },
            {
              setNumber: 2,
              target: {
                type: "time",
                value: 20,
                unit: "seconds"
              },
              restAfterSet: 20
            }
          ]
        }
      ],
      restBetweenSets: 20,
      restBetweenBlocks: 300
    }
  ],
  goals: [
    {
      goalId: "550e8400-e29b-41d4-a716-446655440008",
      exerciseId: "550e8400-e29b-41d4-a716-446655440002",
      goalType: "weight",
      targetValue: 225,
      targetUnit: "lbs",
      targetDate: "2024-06-15T10:00:00Z",
      currentProgress: 155
    }
  ]
};

// Example of a workout with exercise linking (progression tracking)
export const exampleLinkedWorkout = {
  sessionId: "550e8400-e29b-41d4-a716-446655440009",
  startTime: "2024-01-20T10:00:00Z",
  workoutBlocks: [
    {
      blockId: "550e8400-e29b-41d4-a716-44665544000a",
      blockType: "strength",
      exercises: [
        {
          exerciseId: "550e8400-e29b-41d4-a716-44665544000b",
          exerciseName: "Bench Press",
          exerciseType: "compound",
          muscleGroups: ["chest", "triceps", "shoulders"],
          equipment: ["barbell", "bench"],
          sets: [
            {
              setNumber: 1,
              target: {
                type: "weight",
                value: 160,
                unit: "lbs"
              },
              restAfterSet: 180
            }
          ],
          linkedToWorkout: "550e8400-e29b-41d4-a716-446655440000"
        }
      ],
      restBetweenSets: 180,
      restBetweenBlocks: 300
    }
  ]
};

// Function to demonstrate validation usage
export function demonstrateValidation() {
  console.log("=== Validating Example Workout ===");
  const result1 = validateWorkoutSchema(exampleWorkout);
  console.log("Main validation:", result1.isValid ? "✅ Valid" : "❌ Invalid");
  if (!result1.isValid) {
    console.log("Errors:", result1.errors);
  }

  console.log("\n=== Validating Exercise Linking ===");
  const result2 = validateExerciseLinking(exampleWorkout);
  console.log("Linking validation:", result2.isValid ? "✅ Valid" : "❌ Invalid");
  if (!result2.isValid) {
    console.log("Errors:", result2.errors);
  }

  console.log("\n=== Validating HIIT Intervals ===");
  const result3 = validateHIITIntervals(exampleWorkout);
  console.log("HIIT validation:", result3.isValid ? "✅ Valid" : "❌ Invalid");
  if (!result3.isValid) {
    console.log("Errors:", result3.errors);
  }

  console.log("\n=== Validating Linked Workout ===");
  const result4 = validateWorkoutSchema(exampleLinkedWorkout);
  console.log("Linked workout validation:", result4.isValid ? "✅ Valid" : "❌ Invalid");
  if (!result4.isValid) {
    console.log("Errors:", result4.errors);
  }
} 