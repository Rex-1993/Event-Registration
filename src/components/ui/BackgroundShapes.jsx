import { useMemo } from "react"

export default function BackgroundShapes({ themeColor = "#6366f1", density = 6 }) {
  const shapes = useMemo(() => {
    return Array.from({ length: density }).map((_, i) => ({
      id: i,
      top: Math.random() * 100, // %
      left: Math.random() * 100, // %
      size: 50 + Math.random() * 200, // px, smaller for lines
      opacity: 0.1 + Math.random() * 0.2, // Subtle
      animationDuration: 20 + Math.random() * 30, // s, slower
      rotationDuration: 30 + Math.random() * 60, // s
      rotationDirection: Math.random() > 0.5 ? 1 : -1,
      delay: Math.random() * 5, // s
      color: themeColor,
      isCircle: Math.random() > 0.4, // Mix of circles and squares
      borderWidth: 1 + Math.random() * 2, // 1px - 3px
    }))
  }, [themeColor, density])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 select-none">
      {shapes.map((shape) => (
        <div
          key={shape.id}
          className={`absolute transition-all duration-1000 ${shape.isCircle ? 'rounded-full' : 'rounded-[30px]'}`}
          style={{
            top: `${shape.top}%`,
            left: `${shape.left}%`,
            width: `${shape.size}px`,
            height: `${shape.size}px`,
            backgroundColor: 'transparent',
            border: `${shape.borderWidth}px solid ${shape.color}`,
            opacity: shape.opacity,
            animation: `float ${shape.animationDuration}s ease-in-out infinite, rotate ${shape.rotationDuration}s linear infinite`,
            animationDelay: `${shape.delay}s`,
            animationDirection: `normal, ${shape.rotationDirection > 0 ? 'normal' : 'reverse'}`,
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(-50%, -50%) translate(0, 0); }
          33% { transform: translate(-50%, -50%) translate(30px, -50px); }
          66% { transform: translate(-50%, -50%) translate(-20px, 20px); }
        }
        @keyframes rotate {
          0% { rotate: 0deg; }
          100% { rotate: 360deg; }
        }
      `}</style>
    </div>
  )
}
