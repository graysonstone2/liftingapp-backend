/**
 * COMPREHENSIVE WORKOUT SCHEMA DOCUMENTATION
 * ==========================================
 * 
 * This document outlines every possible schema structure for workout data in the Lifting App.
 * The schema supports complex workout patterns including supersets, HIIT training, and exercise linking.
 * 
 * CORE CONCEPTS:
 * 1. Workout UUID: Unique identifier to link exercises across workouts
 * 2. Goal Types: Time, Weight, or % of 1RM
 * 3. Supersets: Multiple exercises performed back-to-back
 * 4. HIIT Training: Time-based intervals with work/rest cycles
 * 
 * SCHEMA HIERARCHY:
 * WorkoutSession -> WorkoutBlock -> ExerciseSet -> Exercise
 * 
 * DETAILED SCHEMA BREAKDOWN:
 * 
 * WORKOUT SESSION (Top Level)
 * ├── sessionId: string (UUID)
 * ├── startTime: ISO timestamp
 * ├── endTime: ISO timestamp (optional)
 * ├── workoutBlocks: WorkoutBlock[]
 * ├── metadata: {
 * │   ├── notes: string
 * │   ├── mood: number (1-10)
 * │   ├── energy: number (1-10)
 * │   └── tags: string[]
 * │ }
 * └── goals: WorkoutGoal[]
 * 
 * WORKOUT BLOCK (Group of related exercises)
 * ├── blockId: string (UUID)
 * ├── blockType: 'strength' | 'cardio' | 'hiit' | 'superset' | 'circuit'
 * ├── exercises: ExerciseSet[]
 * ├── restBetweenSets: number (seconds)
 * ├── restBetweenBlocks: number (seconds)
 * └── notes: string
 * 
 * EXERCISE SET (Individual exercise with sets)
 * ├── exerciseId: string (UUID)
 * ├── exerciseName: string
 * ├── exerciseType: 'compound' | 'isolation' | 'cardio' | 'bodyweight'
 * ├── muscleGroups: string[]
 * ├── equipment: string[]
 * ├── sets: ExerciseSet[]
 * ├── supersetWith: string[] (UUIDs of other exercises)
 * ├── linkedToWorkout: string (UUID of previous workout for progression)
 * └── notes: string
 * 
 * EXERCISE SET (Individual set within an exercise)
 * ├── setNumber: number
 * ├── target: {
 * │   ├── type: 'weight' | 'time' | 'reps' | 'distance' | 'percentage'
 * │   ├── value: number
 * │   ├── unit: string
 * │   └── percentageOf1RM: number (0-100)
 * │ }
 * ├── actual: {
 * │   ├── weight: number
 * │   ├── reps: number
 * │   ├── time: number (seconds)
 * │   ├── distance: number
 * │   └── RPE: number (Rate of Perceived Exertion 1-10)
 * │ }
 * ├── restAfterSet: number (seconds)
 * └── notes: string
 * 
 * WORKOUT GOAL (Performance targets)
 * ├── goalId: string (UUID)
 * ├── exerciseId: string (UUID)
 * ├── goalType: 'weight' | 'time' | 'reps' | 'distance' | 'percentage'
 * ├── targetValue: number
 * ├── targetUnit: string
 * ├── targetDate: ISO timestamp
 * ├── currentProgress: number
 * └── notes: string
 * 
 * HIIT SPECIFIC SCHEMA:
 * ├── intervalType: 'work' | 'rest' | 'active-rest'
 * ├── duration: number (seconds)
 * ├── intensity: number (1-10)
 * ├── targetHeartRate: {
 * │   ├── min: number
 * │   └── max: number
 * │ }
 * └── workRestRatio: number (e.g., 1.0 for 1:1, 2.0 for 2:1)
 * 
 * SUPERSET SPECIFIC SCHEMA:
 * ├── supersetGroup: string (UUID)
 * ├── exercisesInSuperset: string[] (UUIDs)
 * ├── restBetweenExercises: number (seconds)
 * └── restAfterSuperset: number (seconds)
 * 
 * EXERCISE LINKING SCHEMA:
 * ├── linkedWorkoutId: string (UUID)
 * ├── linkedExerciseId: string (UUID)
 * ├── progressionType: 'weight' | 'reps' | 'time' | 'volume'
 * ├── progressionValue: number
 * └── notes: string
 * 
 * VALIDATION RULES:
 * 1. All UUIDs must be valid format
 * 2. Time values must be positive numbers
 * 3. Percentages must be 0-100
 * 4. RPE must be 1-10
 * 5. Superset exercises must exist
 * 6. Linked workouts must reference valid UUIDs
 * 7. Goal targets must be achievable
 * 8. Rest periods must be reasonable (0-3600 seconds)
 * 9. Exercise names must be non-empty strings
 * 10. Muscle groups must be from predefined list
 */

import { z } from 'zod';

// Define the complete workout schema using Zod
const ExerciseTargetSchema = z.object({
  type: z.enum(['weight', 'time', 'reps', 'distance', 'percentage']),
  value: z.number().positive(),
  unit: z.string().min(1),
  percentageOf1RM: z.number().min(0).max(100).optional(),
});

const ExerciseActualSchema = z.object({
  weight: z.number().min(0).optional(),
  reps: z.number().min(0).optional(),
  time: z.number().min(0).optional(),
  distance: z.number().min(0).optional(),
  RPE: z.number().min(1).max(10).optional(),
});

const ExerciseSetSchema = z.object({
  setNumber: z.number().positive(),
  target: ExerciseTargetSchema,
  actual: ExerciseActualSchema.optional(),
  restAfterSet: z.number().min(0).max(3600),
  notes: z.string().optional(),
});

const ExerciseSchema = z.object({
  exerciseId: z.string().uuid(),
  exerciseName: z.string().min(1),
  exerciseType: z.enum(['compound', 'isolation', 'cardio', 'bodyweight']),
  muscleGroups: z.array(z.string()).min(1),
  equipment: z.array(z.string()),
  sets: z.array(ExerciseSetSchema).min(1),
  supersetWith: z.array(z.string().uuid()).optional(),
  linkedToWorkout: z.string().uuid().optional(),
  notes: z.string().optional(),
});

const WorkoutBlockSchema = z.object({
  blockId: z.string().uuid(),
  blockType: z.enum(['strength', 'cardio', 'hiit', 'superset', 'circuit']),
  exercises: z.array(ExerciseSchema).min(1),
  restBetweenSets: z.number().min(0).max(3600),
  restBetweenBlocks: z.number().min(0).max(3600),
  notes: z.string().optional(),
});

const WorkoutGoalSchema = z.object({
  goalId: z.string().uuid(),
  exerciseId: z.string().uuid(),
  goalType: z.enum(['weight', 'time', 'reps', 'distance', 'percentage']),
  targetValue: z.number().positive(),
  targetUnit: z.string().min(1),
  targetDate: z.string(),
  currentProgress: z.number().min(0),
  notes: z.string().optional(),
});

const WorkoutSessionSchema = z.object({
  sessionId: z.string().uuid(),
  startTime: z.string(),
  endTime: z.string().optional(),
  workoutBlocks: z.array(WorkoutBlockSchema).min(1),
  metadata: z.object({
    notes: z.string().optional(),
    mood: z.number().min(1).max(10).optional(),
    energy: z.number().min(1).max(10).optional(),
    tags: z.array(z.string()).optional(),
  }).optional(),
  goals: z.array(WorkoutGoalSchema).optional(),
});

// Main validation function
export function validateWorkoutSchema(data: any): { 
  isValid: boolean; 
  errors?: string[]; 
  validatedData?: any;
} {
  try {
    const validatedData = WorkoutSessionSchema.parse(data);
    return {
      isValid: true,
      validatedData,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const zodError = error as any;
      if (zodError.errors && Array.isArray(zodError.errors)) {
        const errors = zodError.errors.map((err: any) => 
          `${err.path.join('.')}: ${err.message}`
        );
        return {
          isValid: false,
          errors,
        };
      }
    }
    return {
      isValid: false,
      errors: ['Unknown validation error'],
    };
  }
}

// Helper function to validate just the exercise linking
export function validateExerciseLinking(workoutData: any): { 
  isValid: boolean; 
  errors?: string[]; 
} {
  const errors: string[] = [];
  
  try {
    const data = WorkoutSessionSchema.parse(workoutData);
    
    // Check superset references
    data.workoutBlocks.forEach((block: any) => {
      block.exercises.forEach((exercise: any) => {
        if (exercise.supersetWith) {
          exercise.supersetWith.forEach((supersetId: string) => {
            // Check if the superset exercise exists in the same block
            const exists = block.exercises.some((e: any) => e.exerciseId === supersetId);
            if (!exists) {
              errors.push(`Superset reference ${supersetId} not found in block ${block.blockId}`);
            }
          });
        }
        
        if (exercise.linkedToWorkout) {
          // In a real app, you'd validate this against existing workout UUIDs
          // For now, just check it's a valid UUID format
          if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(exercise.linkedToWorkout)) {
            errors.push(`Invalid linked workout UUID: ${exercise.linkedToWorkout}`);
          }
        }
      });
    });
    
    return {
      isValid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch (error) {
    return {
      isValid: false,
      errors: ['Invalid workout data structure'],
    };
  }
}

// Helper function to validate HIIT intervals
export function validateHIITIntervals(workoutData: any): { 
  isValid: boolean; 
  errors?: string[]; 
} {
  const errors: string[] = [];
  
  try {
    const data = WorkoutSessionSchema.parse(workoutData);
    
    data.workoutBlocks.forEach((block: any) => {
      if (block.blockType === 'hiit') {
        // Check that HIIT blocks have reasonable work/rest ratios
        const totalWorkTime = block.exercises.reduce((total: number, exercise: any) => {
          return total + exercise.sets.reduce((setTotal: number, set: any) => {
            return setTotal + (set.target.type === 'time' ? set.target.value : 0);
          }, 0);
        }, 0);
        
        const totalRestTime = block.restBetweenSets + block.restBetweenBlocks;
        
        if (totalWorkTime > 0 && totalRestTime > 0) {
          const ratio = totalWorkTime / totalRestTime;
          if (ratio < 0.1 || ratio > 10) {
            errors.push(`HIIT block ${block.blockId} has extreme work/rest ratio: ${ratio.toFixed(2)}`);
          }
        }
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch (error) {
    return {
      isValid: false,
      errors: ['Invalid workout data structure'],
    };
  }
}

// Export the schema for use in other parts of the application
export { WorkoutSessionSchema, ExerciseSchema, WorkoutBlockSchema }; 