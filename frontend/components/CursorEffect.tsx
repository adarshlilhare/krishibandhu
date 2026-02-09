"use client";

import React, { useEffect, useRef } from 'react';

export default function CursorEffect() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let width = window.innerWidth;
        let height = window.innerHeight;

        // Mouse state
        const mouse = {
            x: -1000,
            y: -1000,
            radius: 150 // Interaction radius
        };

        // Grid configuration
        const gap = 30; // Distance between dots
        const dotSize = 1.5; // Radius of dots
        const dots: { x: number; y: number; originX: number; originY: number; vx: number; vy: number }[] = [];

        // Initialize dots
        const init = () => {
            dots.length = 0;
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;

            for (let x = 0; x < width; x += gap) {
                for (let y = 0; y < height; y += gap) {
                    dots.push({
                        x: x,
                        y: y,
                        originX: x,
                        originY: y,
                        vx: 0,
                        vy: 0
                    });
                }
            }
        };

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < dots.length; i++) {
                const dot = dots[i];

                // Calculate distance to mouse
                const dx = mouse.x - dot.x;
                const dy = mouse.y - dot.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Interaction
                if (distance < mouse.radius) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (mouse.radius - distance) / mouse.radius;
                    const directionX = forceDirectionX * force * 5; // Push strength
                    const directionY = forceDirectionY * force * 5;

                    dot.vx -= directionX;
                    dot.vy -= directionY;
                }

                // Return to origin (spring effect)
                const springForce = 0.1;
                const dxOrigin = dot.originX - dot.x;
                const dyOrigin = dot.originY - dot.y;

                dot.vx += dxOrigin * springForce;
                dot.vy += dyOrigin * springForce;

                // Friction/Damping
                dot.vx *= 0.8;
                dot.vy *= 0.8;

                // Update position
                dot.x += dot.vx;
                dot.y += dot.vy;

                // Draw dot
                ctx.beginPath();
                ctx.arc(dot.x, dot.y, dotSize, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(34, 197, 94, ${Math.max(0.1, 1 - distance / 300)})`; // Green color with distance-based opacity
                ctx.fill();
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        // Event listeners
        const handleResize = () => {
            init();
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        const handleMouseLeave = () => {
            mouse.x = -1000;
            mouse.y = -1000;
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseout', handleMouseLeave);

        init();
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseout', handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10"
            style={{ background: 'transparent' }}
        />
    );
}
