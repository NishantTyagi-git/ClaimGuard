import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, CheckCircle2, Loader2, Database, 
  BrainCircuit, BarChart4, Activity, Target, Info, 
  ShieldAlert, MessageSquare, Send, Sparkles, X, ChevronRight, Settings
} from 'lucide-react';
import { DecisionTree } from './../Services/DecisionTree.ts';
import { analyzeClaimRisk, chatWithForensics } from './../Services/GeminiService';
import { ClaimInputs, PredictionResult, Message } from './../types';

const severityMapping: Record<string, number> = {
  'Trivial Damage': 0, 
  'Minor Damage': 1, 
  'Major Damage': 2, 
  'Total Loss': 3
};

const fieldHelp = {
  months_as_customer: "Total time you've been a loyal customer with our company.",
  policy_deductable: "The 'Initial Repair Cost' you pay yourself before insurance covers the rest.",
  umbrella_limit: "Extra safety net protection that goes above and beyond your basic insurance.",
  policy_annual_premium: "The total yearly price you pay to keep your insurance active.",
  vehicle_claim: "The estimated total cost to repair or replace the damaged vehicle.",
  incident_hour_of_the_day: "The specific hour (0-23) when the accident actually occurred.",
  incident_severity: "A standard rating of how bad the vehicle damage is after the crash."
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'assess' | 'model'>('assess');
  const [loading, setLoading] = useState(false);
  const [training, setTraining] = useState(true);
  const [model, setModel] = useState<DecisionTree | null>(null);
  const [metrics, setMetrics] = useState({ trainAcc: 0, testAcc: 0, sampleSize: 0 });
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const [inputs, setInputs] = useState<ClaimInputs>({
    months_as_customer: 328,
    policy_deductable: 1000,
    umbrella_limit: 0,
    policy_annual_premium: 1406.91,
    incident_hour_of_the_day: 5,
    vehicle_claim: 52080,
    incident_severity: 'Major Damage'
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    trainPipeline();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const trainPipeline = async () => {
    setTraining(true);
    try {
      const csvData = `months_as_customer,policy_state,policy_csl,policy_deductable,policy_annual_premium,umbrella_limit,insured_zip,insured_sex,insured_education_level,insured_occupation,insured_hobbies,insured_relationship,capital-gains,capital-loss,incident_date,incident_type,collision_type,incident_severity,authorities_contacted,incident_state,incident_city,incident_location,incident_hour_of_the_day,number_of_vehicles_involved,property_damage,bodily_injuries,witnesses,police_report_available,total_claim_amount,injury_claim,property_claim,vehicle_claim,auto_make,auto_model,auto_year,fraud_reported
328,OH,250/500,1000,1406.91,0,466132,MALE,MD,craft-repair,sleeping,husband,53300,0,2015-01-25,Single Vehicle Collision,Side Collision,Major Damage,Police,SC,Columbus,9935 4th Drive,5,1,YES,1,2,YES,71610,6510,13020,52080,Saab,92x,2004,Y
228,IN,250/500,2000,1197.22,5000000,468176,MALE,MD,machine-op-insp,reading,other-relative,0,0,2015-01-21,Vehicle Theft,?,Minor Damage,None,VA,Riverwood,6608 MLK Hwy,8,1,?,0,0,?,5070,780,780,3510,Mercedes,E400,2007,Y
134,OH,100/300,2000,1413.14,5000000,430632,FEMALE,PhD,sales,board-games,own-child,35100,0,2015-02-22,Multi-vehicle Collision,Rear Collision,Minor Damage,Police,NY,Columbus,10021 Harley Ave,7,3,NO,2,3,NO,34650,7700,3850,23100,Dodge,RAM,2007,N
483,IL,100/300,2000,1415.74,6000000,608117,FEMALE,Associate,executive-manager,board-games,unmarried,48400,0,2015-01-10,Single Vehicle Collision,Front Collision,Major Damage,Police,OH,Arlington,6977 5th Ave,5,1,?,1,2,NO,63400,6340,6340,50720,Chevrolet,Tahoe,2014,Y
256,IL,250/500,1000,1583.91,6000000,610706,MALE,Associate,sales,board-games,unmarried,66000,-46000,2015-01-02,Single Vehicle Collision,Rear Collision,Major Damage,Fire,NY,Arlington,2524 Stringer St,20,1,NO,0,1,YES,6500,1300,6500,52000,Accura,RSX,2009,Y
165,IL,500/1000,1000,1351.1,0,478456,FEMALE,PhD,tech-support,bungie-jumping,unmarried,0,-31000,2015-01-02,Multi-vehicle Collision,Rear Collision,Major Damage,Fire,SC,Arlington,3473 Wood St,19,3,NO,2,2,NO,64960,11810,11810,41340,Saab,95,2003,N
175,IL,250/500,500,1352.03,0,441314,MALE,MD,machine-op-insp,reading,other-relative,70000,-75000,2015-02-14,Multi-vehicle Collision,Front Collision,Major Damage,Police,NY,Springfield,3242 1st Drive,18,3,?,1,1,YES,31350,2850,5700,22800,Nissan,Pathfinder,2012,N
240,IL,100/300,1000,1137.03,0,603195,MALE,Associate,tech-support,base-jumping,unmarried,0,0,2015-02-03,Multi-vehicle Collision,Front Collision,Total Loss,Police,OH,Columbus,3283 1st Ave,21,3,?,2,1,YES,77990,14180,14180,49630,Audi,A5,2015,Y
240,IL,100/300,1000,1137.03,0,603195,MALE,Associate,tech-support,base-jumping,unmarried,0,0,2015-02-03,Multi-vehicle Collision,Front Collision,Total Loss,Police,OH,Columbus,3283 1st Ave,21,3,?,2,1,YES,77990,14180,14180,49630,Audi,A5,2015,Y
328,IL,100/300,1000,1137.03,0,603195,MALE,Associate,tech-support,base-jumping,unmarried,0,0,2015-02-03,Multi-vehicle Collision,Front Collision,Total Loss,Police,OH,Columbus,3283 1st Ave,21,3,?,2,1,YES,77990,14180,14180,49630,Audi,A5,2015,N
`;
      
      const lines = csvData.trim().split('\n').slice(1);
      const dataset: number[][] = lines.map(line => {
        const c = line.split(',');
        return [
          parseInt(c[0]),  
          parseInt(c[3]),  
          parseInt(c[5]),  
          parseFloat(c[4]),
          parseInt(c[22]), 
          parseInt(c[31]), 
          severityMapping[c[17]] ?? 1, 
          c[35] === 'Y' ? 1 : 0 
        ];
      }).filter(row => !row.some(isNaN));

      const augmentedData = [...dataset];
      for(let i=0; i<50; i++) {
        const base = dataset[Math.floor(Math.random() * dataset.length)];
        augmentedData.push(base.map(v => v * (0.9 + Math.random() * 0.2)));
      }

      const shuffled = [...augmentedData].sort(() => Math.random() - 0.5);
      const splitIdx = Math.floor(shuffled.length * 0.8);
      const trainSet = shuffled.slice(0, splitIdx);
      const testSet = shuffled.slice(splitIdx);

      const dt = new DecisionTree(4);
      dt.train(trainSet);

      const getAccuracy = (data: number[][]) => {
        const correct = data.filter(row => {
          const pred = dt.predict(row.slice(0, -1)) > 0.5 ? 1 : 0;
          return pred === (row[row.length - 1] > 0.5 ? 1 : 0);
        }).length;
        return (correct / data.length) * 100;
      };

      setMetrics({
        trainAcc: getAccuracy(trainSet),
        testAcc: getAccuracy(testSet),
        sampleSize: augmentedData.length
      });
      setModel(dt);
    } catch (err) {
      console.error("ML Error:", err);
    } finally {
      setTraining(false);
    }
  };

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!model) return;
    
    setLoading(true);
    const x = [
      inputs.months_as_customer,
      inputs.policy_deductable,
      inputs.umbrella_limit,
      inputs.policy_annual_premium,
      inputs.incident_hour_of_the_day,
      inputs.vehicle_claim,
      severityMapping[inputs.incident_severity]
    ];

    const prob = model.predict(x);
    const isFraud = prob > 0.5;

    const analysis = await analyzeClaimRisk(inputs, prob);

    setPredictionResult({
      isFraud,
      prob: Math.round(prob * 100),
      aiAnalysis: analysis
    });

    setChatHistory([
      { role: 'model', text: `Forensic alert: Local ML predicts ${Math.round(prob * 100)}% risk. I've prepared a forensic analysis. How can I help you investigate further?` }
    ]);
    
    setLoading(false);
  };

  const handleChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMessage: Message = { role: 'user', text: chatInput };
    setChatHistory(prev => [...prev, userMessage]);
    setChatInput('');
    setChatLoading(true);

    const response = await chatWithForensics([...chatHistory, userMessage], inputs);
    setChatHistory(prev => [...prev, { role: 'model', text: response }]);
    setChatLoading(false);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 lg:p-12 bg-[#020617] text-slate-100 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-purple-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute top-[40%] -right-[10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full"></div>
      </div>

      <header className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-600/40">
            <ShieldAlert className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Assessment <span className="text-purple-500">Form</span></h1>
            <p className="text-slate-400 text-sm font-medium">Advanced Insurance Fraud Forensics</p>
          </div>
        </div>

        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
          <button 
            onClick={() => setActiveTab('assess')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'assess' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            <BrainCircuit size={16} /> Investigation
          </button>
          <button 
            onClick={() => setActiveTab('model')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'model' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            <Activity size={16} /> Neural Metrics
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        <div className="lg:col-span-7 space-y-8">
          <AnimatePresence mode="wait">
            {activeTab === 'assess' ? (
              <motion.div 
                key="assess-tab"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass-card rounded-[2rem] p-8 lg:p-10"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold flex items-center gap-3">
                    <Target className="text-purple-400" /> Assessment Form
                  </h2>
                  {training && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded-full text-xs font-bold border border-yellow-500/20">
                      <Loader2 className="animate-spin" size={14} /> Training Engine...
                    </div>
                  )}
                </div>

                <form onSubmit={handlePredict} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField 
                    label="Customer Longevity (Months)" 
                    helpText={fieldHelp.months_as_customer}
                    value={inputs.months_as_customer} 
                    onChange={v => setInputs({...inputs, months_as_customer: parseInt(v)})} 
                  />
                  <InputField 
                    label="Initial Repair Cost (Deductible)" 
                    helpText={fieldHelp.policy_deductable}
                    value={inputs.policy_deductable} 
                    onChange={v => setInputs({...inputs, policy_deductable: parseInt(v)})} 
                  />
                  <InputField 
                    label="Extra Safety Protection" 
                    helpText={fieldHelp.umbrella_limit}
                    value={inputs.umbrella_limit} 
                    onChange={v => setInputs({...inputs, umbrella_limit: parseInt(v)})} 
                  />
                  <InputField 
                    label="Yearly Policy Fee" 
                    helpText={fieldHelp.policy_annual_premium}
                    value={inputs.policy_annual_premium} 
                    onChange={v => setInputs({...inputs, policy_annual_premium: parseFloat(v)})} 
                  />
                  <InputField 
                    label="Estimated Repair Value" 
                    helpText={fieldHelp.vehicle_claim}
                    value={inputs.vehicle_claim} 
                    onChange={v => setInputs({...inputs, vehicle_claim: parseInt(v)})} 
                  />
                  <InputField 
                    label="Time of Incident (0-23)" 
                    helpText={fieldHelp.incident_hour_of_the_day}
                    value={inputs.incident_hour_of_the_day} 
                    onChange={v => setInputs({...inputs, incident_hour_of_the_day: parseInt(v)})} 
                  />
                  
                  <div className="md:col-span-2">
                    <div className="flex items-center gap-2 mb-2 ml-1">
                      <label className="block text-slate-300 text-[11px] font-bold uppercase tracking-wider">Damage Severity Level</label>
                      <Tooltip text={fieldHelp.incident_severity} />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {Object.keys(severityMapping).map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setInputs({...inputs, incident_severity: s})}
                          className={`px-3 py-3 rounded-xl text-xs font-bold border transition-all ${inputs.incident_severity === s ? 'bg-purple-600 border-purple-500 text-white shadow-lg' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || training}
                    className="md:col-span-2 mt-4 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl shadow-purple-600/20 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} className="text-purple-200" />}
                    {loading ? 'Analyzing Neural Pathways...' : 'Run Forensic Intelligence'}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div 
                key="model-tab"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass-card rounded-[2rem] p-8 lg:p-10 space-y-8"
              >
                <h3 className="text-xl font-bold flex items-center gap-3">
                  <BarChart4 className="text-purple-400" /> Training Results
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <StatBox label="Train Accuracy" value={`${metrics.trainAcc.toFixed(1)}%`} sub={`N=${Math.floor(metrics.sampleSize * 0.8)} Samples`} />
                  <StatBox label="Test Accuracy" value={`${metrics.testAcc.toFixed(1)}%`} sub={`N=${Math.floor(metrics.sampleSize * 0.2)} Samples`} />
                </div>

                <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                  <h4 className="text-sm font-bold text-slate-400 flex items-center gap-2">
                    <Settings size={14} /> Core Configuration
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                    <ManifestRow label="Algorithm" value="CART Decision Tree" />
                    <ManifestRow label="Weighting" value="Balanced (Class Ratio)" />
                    <ManifestRow label="Criterion" value="Gini Impurity" />
                    <ManifestRow label="Max Depth" value="4 Levels" />
                    <ManifestRow label="Features" value="7 Telemetry Points" />
                    <ManifestRow label="GenAI" value="Gemini Forensic Agent" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <AnimatePresence mode="wait">
            {predictionResult ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div className={`glass-card rounded-[2rem] p-10 text-center relative overflow-hidden flex flex-col items-center border-t-4 ${predictionResult.isFraud ? 'border-t-rose-500' : 'border-t-emerald-500'}`}>
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${predictionResult.isFraud ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                    {predictionResult.isFraud ? <AlertTriangle size={40} /> : <CheckCircle2 size={40} />}
                  </div>
                  <h2 className={`text-4xl font-black mb-2 ${predictionResult.isFraud ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {predictionResult.isFraud ? 'FRAUD RISK' : 'CLEARED'}
                  </h2>
                  <div className="flex items-center gap-2 mb-6">
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Confidence Score:</span>
                    <span className="text-white text-lg font-black">{predictionResult.prob}%</span>
                  </div>
                  
                  <div className="w-full h-1 bg-white/5 rounded-full mb-8 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${predictionResult.prob}%` }}
                      className={`h-full ${predictionResult.isFraud ? 'bg-rose-500' : 'bg-emerald-500'}`}
                    />
                  </div>

                  <div className="w-full text-left bg-purple-600/5 p-6 rounded-3xl border border-purple-500/20 relative">
                    <div className="flex items-center gap-2 text-purple-400 mb-3">
                      <Sparkles size={16} />
                      <span className="text-[11px] font-bold uppercase tracking-widest">Forensic AI Analysis</span>
                    </div>
                    <div className="text-sm text-slate-300 leading-relaxed italic">
                      {predictionResult.aiAnalysis}
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setChatOpen(true)}
                    className="mt-6 flex items-center gap-2 text-purple-400 text-sm font-bold hover:text-purple-300 transition-colors"
                  >
                    Discuss this case with AI <ChevronRight size={16} />
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="glass-card rounded-[2rem] p-12 h-full flex flex-col justify-center text-center min-h-[400px] border-dashed border-white/20">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Database className="text-slate-700" size={32} />
                </div>
                <h4 className="text-white font-bold mb-2 text-lg">Awaiting Investigation</h4>
                <p className="text-slate-500 text-sm max-w-[280px] mx-auto leading-relaxed">
                  Engine is warmed up and calibrated. Input claim telemetry to generate a forensic report.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 w-[400px] h-[600px] glass-card rounded-[2.5rem] shadow-2xl z-50 flex flex-col border border-white/20 overflow-hidden glow-purple"
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-purple-600/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
                  <MessageSquare className="text-white" size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Forensic Agent</h4>
                  <p className="text-[10px] text-purple-400 font-bold uppercase">Active Case Investigation</p>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-purple-600 text-white rounded-br-none' 
                      : 'bg-white/10 text-slate-200 rounded-bl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/10 px-4 py-3 rounded-2xl rounded-bl-none">
                    <Loader2 className="animate-spin text-purple-400" size={16} />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleChat} className="p-4 bg-white/5 border-t border-white/10">
              <div className="relative">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask forensics something..."
                  className="w-full glass-input rounded-2xl py-3 pl-4 pr-12 text-sm text-black focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
                <button 
                  type="submit"
                  disabled={chatLoading}
                  className="absolute right-2 top-2 w-8 h-8 bg-purple-600 rounded-xl flex items-center justify-center hover:bg-purple-500 transition-colors disabled:opacity-50"
                >
                  <Send size={14} className="text-white" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {!chatOpen && predictionResult && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => setChatOpen(true)}
          className="fixed bottom-8 right-8 w-16 h-16 bg-purple-600 rounded-full shadow-2xl flex items-center justify-center hover:bg-purple-500 transition-all z-40 group shadow-purple-600/40"
        >
          <MessageSquare className="text-white group-hover:scale-110 transition-transform" size={24} />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 border-2 border-[#020617] rounded-full flex items-center justify-center text-[10px] font-bold">1</div>
        </motion.button>
      )}
    </div>
  );
};

const Tooltip = ({ text }: { text: string }) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative inline-block ml-1">
      <div 
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className="cursor-help text-slate-500 hover:text-purple-400 transition-colors"
      >
        <Info size={14} />
      </div>
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-[10px] text-slate-200 rounded-lg shadow-xl border border-white/10 z-50 pointer-events-none"
          >
            {text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-800" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const InputField = ({ label, value, onChange, helpText }: any) => (
  <div className="w-full">
    <div className="flex items-center gap-2 mb-2 ml-1">
      <label className="block text-slate-300 text-[11px] font-bold uppercase tracking-wider">{label}</label>
      <Tooltip text={helpText} />
    </div>
    <input
      type="number"
      step="any"
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-sm font-semibold shadow-inner"
    />
  </div>
);

const StatBox = ({ label, value, sub }: any) => (
  <div className="bg-white/5 p-6 rounded-3xl border border-white/10 hover:border-white/20 transition-colors">
    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</div>
    <div className="text-3xl font-black text-white">{value}</div>
    <div className="text-[11px] text-slate-500 mt-1 font-bold uppercase">{sub}</div>
  </div>
);

const ManifestRow = ({ label, value }: any) => (
  <div className="flex justify-between items-center text-xs py-1">
    <span className="text-slate-500 font-bold uppercase tracking-widest">{label}</span>
    <span className="text-slate-200 font-semibold bg-white/5 px-2 py-1 rounded border border-white/5">{value}</span>
  </div>
);

export default App;

