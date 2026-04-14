import React from 'react';
import HireIndexContainer from '../components/HireIndex/HireIndexContainer';
import { Target, Info, X } from 'lucide-react';

const HireIndexPage = () => {
    const [showMethodology, setShowMethodology] = React.useState(false);

    const toggleMethodology = () => setShowMethodology(!showMethodology);

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header Section */}
            <header className="page-header">
                <div className="flex items-center space-x-6 mb-6">
                    <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100/50">
                        <Target className="w-10 h-10 text-indigo-600" />
                    </div>
                    <div>
                        <h1 className="page-title">
                            Nexora <span className="text-indigo-600">HireIndex™</span>
                        </h1>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
                            Predictive Readiness Engine
                        </p>
                    </div>
                </div>
                <p className="page-subtitle">
                    The ultimate engineering readiness engine. We use AI-driven weighted analysis to evaluate your performance across 6 core metrics, accurately predicting your transition to full-time roles.
                </p>
            </header>

            {/* Core Feature Section */}
            <div className="grid grid-cols-1 gap-8">
                <HireIndexContainer />
            </div>

            {/* Methodology Modal */}
            {showMethodology && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl space-y-6 relative overflow-hidden">
                        <button
                            onClick={toggleMethodology}
                            className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-slate-400" />
                        </button>

                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                                <Info className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">Nexora HireIndex™ Methodology</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="font-bold text-slate-800">Task Completion</p>
                                <p className="text-indigo-600 font-extrabold text-lg">25% Weight</p>
                                <p className="text-slate-500 text-xs mt-1">Based on total vs completed tasks volume.</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="font-bold text-slate-800">Mentor Rating</p>
                                <p className="text-indigo-600 font-extrabold text-lg">20% Weight</p>
                                <p className="text-slate-500 text-xs mt-1">Direct feedback scores from your supervisor.</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="font-bold text-slate-800">Code Quality</p>
                                <p className="text-indigo-600 font-extrabold text-lg">20% Weight</p>
                                <p className="text-slate-500 text-xs mt-1">Evaluation of modularity and best practices.</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="font-bold text-slate-800">Consistency</p>
                                <p className="text-indigo-600 font-extrabold text-lg">15% Weight</p>
                                <p className="text-slate-500 text-xs mt-1">Punctuality of task submissions (Deadlines).</p>
                            </div>
                        </div>

                        <p className="text-sm text-slate-500 italic border-t border-slate-100 pt-6">
                            Note: GitHub activity and Communication scores (10% each) are also factored into the final predictive score.
                        </p>
                    </div>
                </div>
            )}

            {/* Bottom Info Card */}
            <div className="bg-slate-900 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 shadow-xl shadow-slate-200">
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-slate-800 rounded-full">
                        <Info className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Understanding the Weights</h3>
                        <p className="text-slate-400 text-sm">Task Completion (25%) | Mentor (20%) | Code Quality (20%) | Consistency (15%)</p>
                    </div>
                </div>
                <button
                    onClick={toggleMethodology}
                    className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors uppercase tracking-widest whitespace-nowrap"
                >
                    View Methodology
                </button>
            </div>
        </div>
    );
};

export default HireIndexPage;
