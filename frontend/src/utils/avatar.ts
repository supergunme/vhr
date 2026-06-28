/**
 * Local animal avatars available in /public/avatars/
 */
export const ANIMAL_AVATARS = [
  '/avatars/cat.svg',
  '/avatars/dog.svg',
  '/avatars/rabbit.svg',
  '/avatars/bear.svg',
  '/avatars/bird.svg',
];

/**
 * Get a valid avatar URL. If the userface is an external URL (http) or empty,
 * returns a local animal avatar based on the employee ID (deterministic).
 */
export function getAvatarUrl(userface?: string | null, id?: number): string {
  // If it's already a local path, use it directly
  if (userface && userface.startsWith('/avatars/')) {
    return userface;
  }
  // If it's an external URL or empty, pick a local avatar based on ID
  if (!userface || userface.startsWith('http')) {
    const index = (id || 0) % ANIMAL_AVATARS.length;
    return ANIMAL_AVATARS[index];
  }
  // For any other path (like /userface/xxx), proxy it
  return userface;
}

/**
 * Get a random animal avatar (for new users)
 */
export function getRandomAvatar(): string {
  const index = Math.floor(Math.random() * ANIMAL_AVATARS.length);
  return ANIMAL_AVATARS[index];
}
