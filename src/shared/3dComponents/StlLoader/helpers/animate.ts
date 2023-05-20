import * as THREE from 'three'

export function createAnimate(scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer) {
	const triggers: any[] = [];

	function animate() {
		requestAnimationFrame(animate);

		triggers.forEach((trigger) => {
			trigger();
		});

		renderer.render(scene, camera);
	}
	function addTrigger(cb: any) {
		if (typeof cb === "function") triggers.push(cb);
	}
	function offTrigger(cb: any) {
		const triggerIndex = triggers.indexOf(cb);
		if (triggerIndex !== -1) {
			triggers.splice(triggerIndex, 1);
		}
	}
	return {
		animate,
		addTrigger,
		offTrigger,
	};
}