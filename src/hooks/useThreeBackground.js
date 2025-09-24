// Custom hook to initialize and animate a Three.js background
// This is used to add a 3D animated sphere in the background

import { useEffect } from "react";
import * as THREE from "three";

const useThreeBackground = (mountRef, darkMode) => {
    useEffect(() => {
        const currentMount = mountRef.current;
        if (!currentMount) return;

        // --- Initialize Three.js Core Elements ---
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            currentMount.clientWidth / currentMount.clientHeight,
            0.1,
            1000
        );
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); // Transparent BG
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        currentMount.appendChild(renderer.domElement);

        // --- Lighting for realistic shading ---
        const ambientLight = new THREE.AmbientLight(0x404040, 2); // Soft white light
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(0, 1, 0);
        scene.add(directionalLight);

        // --- Create 3D Object (Sphere) ---
        const geometry = new THREE.SphereGeometry(1.5, 32, 32);
        const material = new THREE.MeshPhongMaterial({
            color: darkMode ? 0x6a0dad : 0x00aaff, // Color depends on dark mode
            specular: 0x050505,
            shininess: 100,
        });
        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);

        camera.position.z = 5;

        // --- Animation Loop ---
        const animate = () => {
            requestAnimationFrame(animate);

            sphere.rotation.x += 0.002;
            sphere.rotation.y += 0.002;

            // Slowly change color over time
            const hue = (Date.now() * 0.00002) % 1;
            material.color.setHSL(hue, 0.6, darkMode ? 0.3 : 0.7);
            material.needsUpdate = true;

            renderer.render(scene, camera);
        };
        animate();

        // --- Resize Responsiveness ---
        const handleResize = () => {
            camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        };
        window.addEventListener("resize", handleResize);

        // --- Cleanup on unmount ---
        return () => {
            window.removeEventListener("resize", handleResize);
            if (currentMount && renderer.domElement) {
                currentMount.removeChild(renderer.domElement);
            }
            renderer.dispose();
            geometry.dispose();
            material.dispose();
            scene.remove(sphere);
            scene.remove(ambientLight);
            scene.remove(directionalLight);
        };
    }, [mountRef, darkMode]);
};

export default useThreeBackground;
