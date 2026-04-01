import { supabase } from "../lib/supabaseClient";

/**
 * Save or update a member profile. Returns the member record.
 */
export async function upsertMember(trainerId, clientData) {
  const { name, age, gender, height, weight, goal, activity, medical, vegetarian, allergies } = clientData;

  // Check if member already exists (same trainer + name + phone)
  const { data: existing } = await supabase
    .from("members")
    .select("id")
    .eq("trainer_id", trainerId)
    .eq("name", name)
    .limit(1)
    .single();

  if (existing) {
    // Update existing member
    const { data } = await supabase
      .from("members")
      .update({ age, gender, height, weight, goal, activity, medical, vegetarian, allergies })
      .eq("id", existing.id)
      .select()
      .single();
    return data;
  }

  // Create new member
  const { data } = await supabase
    .from("members")
    .insert([{ trainer_id: trainerId, name, age, gender, height, weight, goal, activity, medical, vegetarian, allergies }])
    .select()
    .single();

  return data;
}

/**
 * Save a generated plan (auto-creates version history entry).
 */
export async function savePlan(trainerId, memberId, planData, metrics, duration) {
  // 1. Deactivate previous active plans for this member
  await supabase
    .from("plans")
    .update({ is_active: false })
    .eq("member_id", memberId)
    .eq("trainer_id", trainerId);

  // 2. Insert new plan
  const { data: plan, error } = await supabase
    .from("plans")
    .insert([{
      member_id: memberId,
      trainer_id: trainerId,
      duration,
      plan_data: planData,
      metrics,
      is_active: true,
      meal_overrides: null
    }])
    .select()
    .single();

  if (error || !plan) return null;

  // 3. Save version history snapshot
  const { data: versions } = await supabase
    .from("plan_versions")
    .select("version_number")
    .eq("plan_id", plan.id)
    .order("version_number", { ascending: false })
    .limit(1);

  const nextVersion = (versions?.[0]?.version_number ?? 0) + 1;

  await supabase.from("plan_versions").insert([{
    plan_id: plan.id,
    version_number: nextVersion,
    snapshot: { plan_data: planData, metrics, duration },
    changed_by: trainerId,
  }]);

  return plan;
}

/**
 * Update the customized meal swaps for a plan.
 */
export async function updatePlanSwaps(planId, overrides) {
  const { data, error } = await supabase
    .from("plans")
    .update({ meal_overrides: overrides })
    .eq("id", planId)
    .select()
    .single();

  if (error) {
    console.error("Swap sync error:", error);
    return null;
  }
  return data;
}

/**
 * Fetch all members for a trainer with their latest plan info.
 */
export async function fetchMembersWithPlans(trainerId) {
  const { data, error } = await supabase
    .from("members")
    .select(`
      *,
      plans (id, duration, is_active, created_at, plan_data, metrics, meal_overrides)
    `)
    .eq("trainer_id", trainerId)
    .order("created_at", { ascending: false });

  if (error) return [];
  return data || [];
}

/**
 * Fetch all historical versions of a member's plans.
 */
export async function fetchPlanVersions(memberId) {
  const { data } = await supabase
    .from("plans")
    .select(`id, duration, created_at, is_active, meal_overrides, plan_versions(version_number, created_at, snapshot)`)
    .eq("member_id", memberId)
    .order("created_at", { ascending: false });

  return data || [];
}
