import { Code2, Palette, Radio, Sparkles, Users, Zap } from "lucide-react"

const FEATURES = [
    {
    icon: Sparkles,
    title: "AI-Powered",
    description: "Get intelligent code suggestions and error detection powered by advanced AI.",
    gradient: "from-indigo-500 to-purple-500",

  },
  {
    icon: Radio,
    title: "Real-time Collaboration",
    description: "Code together with shared sessions, live cursors, and synced editing.",
    gradient: "from-teal-500 to-sky-500", 
  },
  {
    icon: Code2,
    title: "Multi-Language Support",
    description: "Write and execute code in JavaScript, Python, Java, C++, Go, Rust, and more.",
    gradient: "from-blue-500 to-cyan-500",
   
  },
    {
    icon: Users,
    title: "Community Driven",
    description: "Share code snippets, collaborate with developers, and learn from the community.",
    gradient: "from-green-500 to-emerald-500",
    
  },
  {
    icon: Palette,
    title: "Beautiful Themes",
    description: "Choose from 5 carefully crafted themes including VS Dark, GitHub Dark, and Monokai.",
    gradient: "from-purple-500 to-pink-500",
   
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Instant code execution with our optimized runtime environment and caching.",
    gradient: "from-yellow-500 to-orange-500",
   
  },

]

function FeatureGrids() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {FEATURES.map((feature, index) => (
            <div
              key={index}
              className="animated-border-card "
            
            >
             <style>
                  {`
                  /* CSS Custom Property for the rotating angle */
                  @property --angle {
                  syntax: "<angle>";
                  initial-value: 0deg;
                  inherits: false;
                  }

                  /* Animated border card styles */
                  .animated-border-card {
                  position: relative;
                  padding: 3px; /* This creates the border width */
                  background: transparent; /* Remove background */
                  border-radius: 1rem;
                  animation: fadeInUp 0.6s ease-out forwards;
                  opacity: 0;
                  transform: translateY(30px);
                  transition: transform 0.3s ease;
                  }

                  .animated-border-card:hover {
                  transform: translateY(-5px) scale(1.02);
                  }

                  /* Fade in animation for cards */
                  @keyframes fadeInUp {
                  to {
                  opacity: 1;
                  transform: translateY(0);
                  }
                  }

                  /* Border animation pseudo-elements */
                  .animated-border-card:hover::after,
                  .animated-border-card:hover::before {
                  content: "";
                  position: absolute;
                  height: 100%;
                  width: 100%;
                  background-image: conic-gradient(from var(--angle), #ff4545, #00ff99, #006aff, #ff0095, #ff4545);
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  z-index: -1;
                  padding: 3px;
                  border-radius: 1rem;
                  animation: 2.5s spin linear infinite;
                  }

                  /* Blurred background effect */
                  .animated-border-card:hover::before {
                  filter: blur(1.5rem);
                  opacity: 0.5;
                  }

                  /* Spinning animation */
                  @keyframes spin {
                  from {
                  --angle: 0deg;
                  }
                  to {
                  --angle: 360deg;
                  }
                  }

                  /* Card content positioning - this creates the mask effect */
                  .card-content {
                  position: relative;
                  z-index: 1;
                  height: 100%;
                  background: #000;
                  padding: 1.5rem;
            
                  }

                  /* Ensure proper stacking context */
                  .animated-border-card {
                  isolation: isolate;
                  }
                  `}
             </style>

              <div className="flex flex-col items-center justify-center card-content hover:cursor-pointer backdrop-blur-sm rounded-2xl border border-white/20  transition-all duration-300 ">               
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-r ${feature.gradient} bg-opacity-10 mb-6 `}>
                  <feature.icon className="w-7 h-7 text-white  hover:scale-110 transition-transform duration-300" />
                </div>
                

                {/* Content */}
               <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-blue-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-center leading-relaxed  hyphens-auto">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>    
  )
}

export default FeatureGrids;
