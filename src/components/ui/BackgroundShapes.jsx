import { useMemo } from "react"

export default function BackgroundShapes({ themeColor = "#6366f1", density = 6 }) {
  const shapes = useMemo(() => {
    return Array.from({ length: density }).map((_, i) => ({
      id: i,
      top: Math.random() * 100, // %
      left: Math.random() * 100, // %
      size: 150 + Math.random() * 300, // px
      opacity: 0.1 + Math.random() * 0.2,
      animationDuration: 15 + Math.random() * 20, // s
      delay: Math.random() * 5, // s
      color: themeColor,
      isBlob: Math.random() > 0.5
    }))
  }, [themeColor, density])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 select-none">
      {shapes.map((shape) => (
        <div
          key={shape.id}
          className={`absolute blur-3xl mix-blend-multiply transition-all duration-1000 ${shape.isBlob ? 'rounded-[30%_70%_70%_30%/30%_30%_70%_70%]' : 'rounded-full'}`}
          style={{
            top: `${shape.top}%`,
            left: `${shape.left}%`,
            width: `${shape.size}px`,
            height: `${shape.size}px`,
            backgroundColor: shape.color,
            opacity: shape.opacity,
            animation: `float ${shape.animationDuration}s ease-in-out infinite`,
            animationDelay: `${shape.delay}s`,
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(-50%, -50%) translate(0, 0) rotate(0deg); }
          33% { transform: translate(-50%, -50%) translate(30px, -50px) rotate(10deg); }
          66% { transform: translate(-50%, -50%) translate(-20px, 20px) rotate(-5deg); }
        }
      `}</style>
    </div>
  )
}
