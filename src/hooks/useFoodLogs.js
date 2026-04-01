// src/hooks/useFoodLogs.js
import { supabase } from "../lib/supabaseClient";

/**
 * Log a meal for a member and update Gamification status.
 */
export async function logMeal(memberId, trainerId, logData) {
  // 1. Insert the log entry
  const { data: log, error } = await supabase
    .from("food_logs")
    .insert([{
      member_id: memberId,
      trainer_id: trainerId,
      food_name: logData.name,
      calories: logData.cal,
      protein: logData.p,
      carbs: logData.c,
      fat: logData.f,
      meal_type: logData.type
    }])
    .select()
    .single();
  
  if (error) throw error;

  // 2. Update Member Gamification (Points & Streaks)
  // Logic: +10 points per meal logged. Simple streak: if last log was yesterday, streak++.
  const today = new Date().toISOString().split('T')[0];
  
  const { data: member } = await supabase
    .from("members")
    .select("points, streak_count, last_log_date")
    .eq("id", memberId)
    .single();

  if (member) {
    let newStreak = member.streak_count || 0;
    const lastDate = member.last_log_date;
    
    if (!lastDate || lastDate !== today) {
       // Check if it was "yesterday"
       const yesterday = new Date();
       yesterday.setDate(yesterday.getDate() - 1);
       if (lastDate === yesterday.toISOString().split('T')[0]) {
         newStreak++;
       } else {
         newStreak = 1;
       }
    }

    await supabase
      .from("members")
      .update({
        points: (member.points || 0) + 10,
        streak_count: newStreak,
        last_log_date: today
      })
      .eq("id", memberId);
  }

  return log;
}

/**
 * Fetch logs for a member.
 */
export async function fetchMemberLogs(memberId) {
  const { data, error } = await supabase
    .from("food_logs")
    .select("*")
    .eq("member_id", memberId)
    .order("logged_at", { ascending: false });
  
  if (error) throw error;
  return data;
}

/**
 * Fetch recent logs for a trainer (for the live dashboard feeds).
 */
export async function fetchTrainerLogs(trainerId, limit = 5) {
  const { data, error } = await supabase
    .from("food_logs")
    .select("*, members(name)")
    .eq("trainer_id", trainerId)
    .order("logged_at", { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data;
}
