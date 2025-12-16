/**
 * God-Tier 3D Cursor Trail Effect
 * Creates mesmerizing particles that follow the cursor with physics
 */

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 3 + 1;
    this.speedX = Math.random() * 2 - 1;
    this.speedY = Math.random() * 2 - 1;
    this.life = 1;
    this.decay = Math.random() * 0.02 + 0.01;
    
    // Random color between accent colors
    const colors = [
      { r: 34, g: 211, b: 238 },   // cyan
      { r: 168, g: 85, b: 247 },   // purple
      { r: 236, g: 72, b: 153 }    // pink
    ];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life -= this.decay;
    this.size = Math.max(0, this.size - 0.05);
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.life;
    
    // Outer glow
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3);
    gradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.life * 0.8})`);
    gradient.addColorStop(0.5, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.life * 0.3})`);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Core particle
    ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.life})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }

  isDead() {
    return this.life <= 0 || this.size <= 0;
  }
}

class CursorEffect {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.mouseX = 0;
    this.mouseY = 0;
    this.lastX = 0;
    this.lastY = 0;
    this.isActive = false;
    this.animationId = null;
    this.particleInterval = null;
  }

  init() {
    // Create canvas
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'cursor-canvas';
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 50;
      background: transparent;
    `;
    document.body.appendChild(this.canvas);
    
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    
    // Event listeners
    window.addEventListener('resize', () => this.resize());
    document.addEventListener('mousemove', (e) => this.onMouseMove(e));
    document.addEventListener('mousedown', () => this.onMouseDown());
    document.addEventListener('mouseup', () => this.onMouseUp());
    
    // Start animation
    this.isActive = true;
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  onMouseMove(e) {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
    
    // Calculate distance moved
    const dx = this.mouseX - this.lastX;
    const dy = this.mouseY - this.lastY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Create particles based on movement speed
    if (distance > 2) {
      for (let i = 0; i < Math.ceil(distance / 10); i++) {
        this.particles.push(new Particle(this.mouseX, this.mouseY));
      }
    }
    
    this.lastX = this.mouseX;
    this.lastY = this.mouseY;
  }

  onMouseDown() {
    // Burst effect on click
    for (let i = 0; i < 20; i++) {
      this.particles.push(new Particle(this.mouseX, this.mouseY));
    }
  }

  onMouseUp() {
    // Smaller burst on release
    for (let i = 0; i < 10; i++) {
      this.particles.push(new Particle(this.mouseX, this.mouseY));
    }
  }

  animate() {
    if (!this.isActive) return;
    
    // Clear canvas completely (transparent)
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Update and draw particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      particle.update();
      particle.draw(this.ctx);
      
      if (particle.isDead()) {
        this.particles.splice(i, 1);
      }
    }
    
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    this.isActive = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.particleInterval) {
      clearInterval(this.particleInterval);
    }
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}

// Export singleton instance
let cursorEffectInstance = null;

export const initCursorEffect = () => {
  if (!cursorEffectInstance) {
    cursorEffectInstance = new CursorEffect();
    cursorEffectInstance.init();
  }
  return cursorEffectInstance;
};

export const destroyCursorEffect = () => {
  if (cursorEffectInstance) {
    cursorEffectInstance.destroy();
    cursorEffectInstance = null;
  }
};

export default { initCursorEffect, destroyCursorEffect };
