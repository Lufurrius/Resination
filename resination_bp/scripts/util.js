export const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
export const minBound = (num, bound) => (num > 0) ? Math.max(num, Math.abs(bound)) : Math.min(num, Math.abs(bound) * -1);
export const distance2D = (locA, locB) => ((((locB.x - locA.x) ** 2) + ((locB.y - locA.y) ** 2)) ** 1 / 2);
export const distance3D = (locA, locB) => ((((locB.x - locA.x) ** 2) + ((locB.y - locA.y) ** 2) + ((locB.z - locA.z) ** 2)) ** 1 / 2);
export const MS_PER_TICK = 50;
export const TICKS_PER_SECOND = 20;
export const TICKS_PER_MC_DAY = 24000;
export function increment(value, array, increment) { // General function for incerementing arrays
	const currentIndex = array.indexOf(value);
	const newIndex = (currentIndex + increment) % array.length;
	return array[newIndex];
}
export function normalize(vector) {
	const length = Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z)
	return {
		x: vector.x / length,
		y: vector.y / length,
		z: vector.z / length
	};
}
export function scale(vector, scalar) {
	return {
		x: vector.x * scalar,
		y: vector.y * scalar,
		z: vector.z * scalar
	};
}
export function addVectors(v1, v2) {
	return {
		x: v1.x + v2.x,
		y: v1.y + v2.y,
		z: v1.z + v2.z
	};
}
export function subVectors(v1, v2) {
	return {
		x: v1.x - v2.x,
		y: v1.y - v2.y,
		z: v1.z - v2.z
	};
}
export function distance(vec1, vec2) {
	const dx = vec2.x - vec1.x;
	const dy = vec2.y - vec1.y;
	const dz = vec2.z - vec1.z;
	return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
export function vec3ToYaw(vector) {
	const { x, z } = vector;

	const yawRadians = Math.atan2(-x, z);

	const yawDegrees = yawRadians * (180 / Math.PI);

	return (yawDegrees + 360) % 360;
}
export function randomizeDirection(vector, maxAngleDegrees) {
	const maxAngleRadians = (Math.PI / 180) * maxAngleDegrees;

	const randomYaw = (Math.random() - 0.5) * 2 * maxAngleRadians;
	const randomPitch = (Math.random() - 0.5) * 2 * maxAngleRadians;

	const length = Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);
	const theta = Math.atan2(vector.z, vector.x);
	const phi = Math.acos(vector.y / length);

	const newTheta = theta + randomYaw;
	const newPhi = phi + randomPitch;

	return {
		x: length * Math.sin(newPhi) * Math.cos(newTheta),
		y: length * Math.cos(newPhi),
		z: length * Math.sin(newPhi) * Math.sin(newTheta)
	};
}
export function randomOffset(value, range) {
	return value + Math.random() * (range * 2) - range
}
export function hasItem(entity, itemName, itemCount) {
	const container = entity.getComponent("inventory").container;
	const size = container.size;
	let total = 0;
	for (let i = 0; i < size; i++) {
		const item = container.getItem(i);
		if (item?.typeId != itemName) continue; // If not correct item, skip
		else if (itemCount == null) return true; // If correct item & no count is set, return true
		else if (total + item?.amount >= itemCount) return true; // If correct item & total + num of items meets count, return true
		else total += item?.amount; // If correct item, but total + num of items doesn't meet count, increment total by num of items.
	}
	return false;
}