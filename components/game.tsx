"use client";
 
import { motion, useAnimation } from "framer-motion";
import { useRef, useEffect } from "react";

export default function AirHockeyGame() {
  const boundingBox = useRef(null);
  const puckControls = useAnimation();
  
  // Initialize puck with some properties
  const puckState = useRef({
    velocity: { x: 0, y: 0 },
    position: { x: 200, y: 200 }, // Start in middle
    friction: 0.99
  });

  useEffect(() => {
    // Animation loop for the puck
    const updatePuck = () => {
      const puck = puckState.current;
      
      // Update position based on velocity
      puck.position.x += puck.velocity.x;
      puck.position.y += puck.velocity.y;
      
      // Apply friction
      puck.velocity.x *= puck.friction;
      puck.velocity.y *= puck.friction;

      // Add boundary checks with puck size consideration
      const bounds = boundingBox.current?.getBoundingClientRect();
      if (bounds) {
        // Right boundary
        if (puck.position.x > bounds.width - 40) {
          puck.position.x = bounds.width - 40;
          puck.velocity.x *= -0.8;
        }
        // Left boundary
        if (puck.position.x < 0) {
          puck.position.x = 0;
          puck.velocity.x *= -0.8;
        }
        // Bottom boundary
        if (puck.position.y > bounds.height - 40) {
          puck.position.y = bounds.height - 40;
          puck.velocity.y *= -0.8;
        }
        // Top boundary
        if (puck.position.y < 0) {
          puck.position.y = 0;
          puck.velocity.y *= -0.8;
        }
      }

      // Update puck position
      puckControls.set({
        x: puck.position.x,
        y: puck.position.y
      });

      requestAnimationFrame(updatePuck);
    };

    updatePuck();
  }, []);

  // Handle collision between player and puck
  const handleCollision = (playerInfo: any) => {
    const puck = puckState.current;
    const impact = 15;
    
    const bounds = boundingBox.current?.getBoundingClientRect();
    if (!bounds) return;
    
    const playerX = playerInfo.point.x - bounds.left;
    const playerY = playerInfo.point.y - bounds.top;
    
    const dx = puck.position.x - playerX;
    const dy = puck.position.y - playerY;
    
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 50) {
      const minVelocity = 0;
      const velocityX = (dx / distance) * impact;
      const velocityY = (dy / distance) * impact;
      
      puck.velocity.x = Math.abs(velocityX) < minVelocity ? Math.sign(velocityX) * minVelocity : velocityX;
      puck.velocity.y = Math.abs(velocityY) < minVelocity ? Math.sign(velocityY) * minVelocity : velocityY;
      
      puck.position.x += (dx / distance) * 2;
      puck.position.y += (dy / distance) * 2;
      
      puckControls.set({
        x: puck.position.x,
        y: puck.position.y
      });
    }
  };

  return (
    <div ref={boundingBox} className="relative h-96 w-full border-2 border-gray-300 rounded-lg p-6 bg-white overflow-hidden">
      {/* Player controlled circle */}
      <motion.div
        drag
        dragConstraints={boundingBox}
        dragMomentum={true}
        dragElastic={0}
        onDrag={(event, info) => handleCollision(info)}
        className="h-10 w-10 rounded-full bg-pink-500 absolute cursor-grab active:cursor-grabbing"
      />

      {/* Puck */}
      <motion.div
        animate={puckControls}
        initial={{ x: 400, y: 400 }}
        className="h-10 w-10 rounded-full bg-yellow-400 absolute"
      />
    </div>
  );
}