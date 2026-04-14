import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Zap, 
  Cpu, 
  LayoutDashboard, 
  Bot, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  BarChart3, 
  MousePointer2,
  Menu,
  X,
  PlayCircle,
  Users,
  Globe,
  Star
} from 'lucide-react';
import VideoModal from '../components/VideoModal';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState('home');
  const [isDemoOpen, setIsDemoOpen] = React.useState(false);

  // Features data with richer colors and gradients
  const features = [
    {
      title: "Smart Dashboard",
      description: "A clean and powerful dashboard that gives a complete overview of your activities and system insights.",
      icon: <LayoutDashboard className="w-6 h-6 text-white" />,
      gradient: "from-blue-500 to-indigo-600",
      shadow: "shadow-blue-200"
    },
    {
      title: "Intelligent Automation",
      description: "Automate repetitive tasks and workflows with smart system intelligence.",
      icon: <Bot className="w-6 h-6 text-white" />,
      gradient: "from-purple-500 to-pink-600",
      shadow: "shadow-purple-200"
    },
    {
      title: "Secure Data Handling",
      description: "Your records and data are protected with reliable and secure architecture.",
      icon: <Lock className="w-6 h-6 text-white" />,
      gradient: "from-emerald-500 to-teal-600",
      shadow: "shadow-emerald-200"
    },
    {
      title: "Fast Performance",
      description: "Optimized system designed for speed and seamless user experience.",
      icon: <Zap className="w-6 h-6 text-white" />,
      gradient: "from-amber-400 to-orange-500",
      shadow: "shadow-amber-200"
    },
    {
      title: "Organized Management",
      description: "Manage tasks, data, and processes in a structured and efficient way.",
      icon: <Cpu className="w-6 h-6 text-white" />,
      gradient: "from-indigo-500 to-blue-700",
      shadow: "shadow-indigo-200"
    },
    {
      title: "User Friendly Interface",
      description: "Minimal and intuitive design that makes the platform easy to use for everyone.",
      icon: <MousePointer2 className="w-6 h-6 text-white" />,
      gradient: "from-pink-500 to-rose-600",
      shadow: "shadow-pink-200"
    }
  ];

  const handleNav = (section) => {
    setActiveSection(section);
    setIsMenuOpen(false);
    window.scrollTo(0,0);
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 font-sans">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNav('home')}>
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 overflow-hidden">
              <img src="/nexoralogo.png" alt="Logo" className="w-8 h-8 object-contain" />
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900 uppercase">Nexora<span className="text-indigo-600">AI</span></span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            <button 
              onClick={() => handleNav('home')} 
              className={`text-sm font-bold transition-all ${activeSection === 'home' ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}
            >
              Home
            </button>
            <button 
              onClick={() => handleNav('features')} 
              className={`text-sm font-bold transition-all ${activeSection === 'features' ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}
            >
              Features
            </button>
            <button 
              onClick={() => handleNav('about')} 
              className={`text-sm font-bold transition-all ${activeSection === 'about' ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}
            >
              About
            </button>
            <button onClick={() => navigate('/login')} className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-all">Login</button>
            <button 
              onClick={() => navigate('/register')}
              className="px-6 py-2.5 bg-slate-900 text-white rounded-full text-sm font-bold hover:bg-indigo-600 transition-all hover:shadow-xl hover:shadow-indigo-500/20 transform hover:-translate-y-0.5"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-lg border-b border-slate-200 p-8 flex flex-col gap-6 animate-fadeIn">
            <button onClick={() => handleNav('home')} className={`text-xl font-bold text-left ${activeSection === 'home' ? 'text-indigo-600' : 'text-slate-900'}`}>Home</button>
            <button onClick={() => handleNav('features')} className={`text-xl font-bold text-left ${activeSection === 'features' ? 'text-indigo-600' : 'text-slate-900'}`}>Features</button>
            <button onClick={() => handleNav('about')} className={`text-xl font-bold text-left ${activeSection === 'about' ? 'text-indigo-600' : 'text-slate-900'}`}>About</button>
            <button onClick={() => navigate('/login')} className="text-xl font-bold text-slate-900 text-left">Login</button>
            <button 
              onClick={() => navigate('/register')}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-center shadow-lg"
            >
              Get Started
            </button>
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="pt-20">
        
        {/* Render HERO ONLY on home */}
        {activeSection === 'home' && (
          <>
            <section className="pt-20 pb-24 px-6 relative overflow-hidden bg-transparent">
              <div className="absolute top-0 right-[-10%] w-[600px] h-[600px] bg-indigo-100/40 rounded-full blur-[120px] -z-10"></div>
              <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-purple-100/40 rounded-full blur-[100px] -z-10"></div>

              <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
                <div className="flex-1 text-center lg:text-left animate-fadeIn">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100/50 text-indigo-700 text-[10px] font-black mb-8 tracking-widest uppercase">
                    <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span>
                    The Intelligent Future
                  </div>
                  <h1 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight tracking-tighter mb-6">
                    NexoraAI — The <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Smarter Way</span> to Manage Workflows
                  </h1>
                  <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0 font-medium">
                    An AI-powered platform designed to simplify complex workflows, multiply productivity, and centralize your digital ecosystem in one intuitive workspace.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                    <button 
                      onClick={() => navigate('/register')}
                      className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-xl font-black flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all hover:scale-[1.05] shadow-xl shadow-indigo-500/20"
                    >
                      Get Started Now <ArrowRight className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => setIsDemoOpen(true)}
                      className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-xl font-black flex items-center justify-center gap-3 hover:bg-slate-50 transition-all shadow-sm"
                    >
                      <PlayCircle className="w-5 h-5 text-indigo-600" /> Watch Demo
                    </button>
                  </div>
                </div>

                <div className="flex-1 w-full max-w-2xl relative animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-all duration-500"></div>
                    <div className="relative z-10 rounded-2xl border border-white/50 shadow-2xl overflow-hidden bg-white/80 p-1">
                      <img 
                        src="/images/hero_v3.png" 
                        alt="NexoraAI Interface" 
                        className="w-full h-auto rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Trust Section (Small) */}
            <section className="py-12 bg-white">
              <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-wrap justify-center items-center gap-12 opacity-30 grayscale contrast-125">
                   <div className="flex items-center gap-2">
                      <Globe className="w-6 h-6" /> <span className="text-lg font-black tracking-tighter uppercase">GlobalNet</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <Cpu className="w-6 h-6" /> <span className="text-lg font-black tracking-tighter uppercase">InfoTech</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <Users className="w-6 h-6" /> <span className="text-lg font-black tracking-tighter uppercase">TeamFlow</span>
                   </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* Render FEATURES ONLY on features */}
        {activeSection === 'features' && (
          <section className="py-24 px-6 bg-transparent min-h-[80vh] flex flex-col justify-center animate-fadeIn">
            <div className="max-w-7xl mx-auto">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 text-pink-700 text-[10px] font-black mb-4 tracking-widest uppercase">
                  Core Capabilities
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tighter">Engineered for Excellence</h2>
                <p className="text-slate-500 text-lg font-medium">Experience the perfect balance of power and simplicity with our state-of-the-art feature set.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, idx) => (
                  <div key={idx} className="group relative p-8 bg-white rounded-3xl border border-slate-100 hover:border-blue-200 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10 overflow-hidden">
                    <div className={`w-14 h-14 rounded-xl mb-6 flex items-center justify-center transition-all duration-500 bg-gradient-to-br ${feature.gradient} shadow-lg ${feature.shadow}`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight">{feature.title}</h3>
                    <p className="text-slate-500 leading-relaxed font-medium text-sm">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Render ABOUT ONLY on about */}
        {activeSection === 'about' && (
          <section className="py-24 px-6 bg-transparent min-h-[80vh] flex flex-col justify-center animate-fadeIn">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
               <div className="flex-1 relative">
                  <div className="relative group">
                    <div className="absolute -inset-4 bg-blue-600/5 blur-3xl -z-10 rounded-[3rem]"></div>
                    <img 
                      src="/images/about_v2.png" 
                      alt="Our Vision" 
                      className="w-full h-auto rounded-3xl shadow-xl border-4 border-white"
                    />
                  </div>
                  {/* Testimonial */}
                  <div className="absolute -bottom-8 -right-4 p-6 bg-indigo-600 text-white rounded-2xl shadow-2xl max-w-xs hidden md:block">
                     <p className="text-sm font-bold italic mb-4">"NexoraAI has completely transformed how our decentralized team executes projects. It's not just a tool, it's a team member."</p>
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                           <Users className="w-5 h-5" />
                        </div>
                        <div>
                           <p className="font-bold text-xs uppercase tracking-tighter">Abhinay Gowda</p>
                           <p className="text-[10px] text-indigo-200 uppercase font-black tracking-widest">Founder @ Nexora</p>
                        </div>
                     </div>
                  </div>
               </div>
               
               <div className="flex-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-black mb-6 tracking-widest uppercase">
                    About NexoraAI
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tighter leading-tight">Beyond Automation. <br/>Intelligent Collaboration.</h2>
                  <p className="text-lg text-slate-600 leading-relaxed mb-8 font-medium">
                    We started NexoraAI with a simple mission: to eliminate the friction between human creativity and digital processes. Today, we power thousands of workflows with our proprietary AI engine.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 mb-4">
                           <Star className="text-blue-600 w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-slate-900 mb-2">Our Mission</h4>
                        <p className="text-xs text-slate-600">To create the world's most intuitive workspace where AI and humans perform in harmony.</p>
                     </div>
                     <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-50 mb-4">
                           <Users className="text-purple-600 w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-slate-900 mb-2">Our Community</h4>
                        <p className="text-xs text-slate-600">A global network of developers, managers, and creators pushing the limits of the possible.</p>
                     </div>
                  </div>
               </div>
            </div>
          </section>
        )}

      </main>

      {/* Shared Footer */}
      <footer className="py-16 px-6 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
           <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg overflow-hidden">
                  <img src="/nexoralogo.png" alt="Logo" className="w-6 h-6 object-contain" />
                </div>
                <span className="text-xl font-black tracking-tighter text-white uppercase">Nexora<span className="text-indigo-500">AI</span></span>
              </div>
              
              <div className="flex gap-10 text-xs font-black text-slate-500 uppercase tracking-widest">
                <button onClick={() => handleNav('home')} className="hover:text-indigo-500 transition-colors">Home</button>
                <button onClick={() => handleNav('features')} className="hover:text-indigo-500 transition-colors">Features</button>
                <button onClick={() => handleNav('about')} className="hover:text-indigo-500 transition-colors">About</button>
                <button className="hover:text-indigo-500 transition-colors">Contact</button>
              </div>
           </div>

           <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-10 border-t border-slate-800">
              <p className="text-slate-600 text-[10px] font-black tracking-[0.2em] uppercase">
                © 2026 NexoraAI. BY ABHINAY GOWDA.
              </p>
              <div className="flex gap-6 text-[10px] text-slate-600 font-bold uppercase">
                <a href="#" className="hover:text-indigo-500">Privacy</a>
                <a href="#" className="hover:text-indigo-500">Terms</a>
              </div>
           </div>
        </div>
      </footer>

      {/* Demo Video Modal */}
      <VideoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
    </div>
  );
};

export default LandingPage;
