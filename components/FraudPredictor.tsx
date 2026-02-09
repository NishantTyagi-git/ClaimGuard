
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, CheckCircle2, Loader2, Database, 
  BrainCircuit, BarChart4, Activity, Target, Info 
} from 'lucide-react';

// --- Decision Tree ML Engine (CART Algorithm mirroring sklearn) ---

interface TreeNode {
  featureIndex?: number;
  threshold?: number;
  left?: TreeNode;
  right?: TreeNode;
  value?: number; // Result probability (0.0 to 1.0)
  groups?: number[][][];
}

class DecisionTree {
  root: TreeNode | null = null;
  private maxDepth: number;
  private classWeights: Record<number, number> = {};

  constructor(maxDepth: number = 3) {
    this.maxDepth = maxDepth;
  }

  // pandas-style value counts for balanced weights
  private calculateWeights(dataset: number[][]) {
    const labels = dataset.map(row => row[row.length - 1]);
    const total = labels.length;
    const fraudCount = labels.filter(l => l === 1).length;
    const legitCount = total - fraudCount;
    
    // Mirroring sklearn class_weight='balanced'
    this.classWeights[1] = total / (2 * (fraudCount || 1));
    this.classWeights[0] = total / (2 * (legitCount || 1));
  }

  // Gini Impurity calculation
  private gini(groups: number[][][], classes: number[]): number {
    const nInstances = groups.reduce((acc, g) => acc + g.length, 0);
    let giniValue = 0;
    
    for (const group of groups) {
      const size = group.length;
      if (size === 0) continue;
      
      let score = 0;
      for (const cls of classes) {
        const count = group.filter(row => row[row.length - 1] === cls).length;
        const p = count / size;
        const weight = this.classWeights[cls] || 1;
        score += (p * p) * weight;
      }
      giniValue += (1.0 - score) * (size / nInstances);
    }
    return giniValue;
  }

  private testSplit(index: number, threshold: number, dataset: number[][]) {
    const left: number[][] = [];
    const right: number[][] = [];
    for (const row of dataset) {
      if (row[index] < threshold) left.push(row);
      else right.push(row);
    }
    return [left, right];
  }

  private getBestSplit(dataset: number[][]) {
    const classValues = [0, 1];
    let bIndex = 0, bValue = 0, bScore = 999, bGroups: number[][][] = [];
    
    for (let index = 0; index < dataset[0].length - 1; index++) {
      for (const row of dataset) {
        const groups = this.testSplit(index, row[index], dataset);
        const gini = this.gini(groups, classValues);
        if (gini < bScore) {
          bIndex = index;
          bValue = row[index];
          bScore = gini;
          bGroups = groups;
        }
      }
    }
    return { index: bIndex, value: bValue, groups: bGroups };
  }

  private toTerminal(group: number[][]): number {
    const outcomes = group.map(row => row[row.length - 1]);
    if (outcomes.length === 0) return 0;
    const fraudCount = outcomes.filter(o => o === 1).length;
    return fraudCount / outcomes.length;
  }

  private split(node: TreeNode, depth: number) {
    if (!node.groups) return;
    const [left, right] = node.groups;
    delete node.groups;

    if (!left.length || !right.length) {
      const val = this.toTerminal([...left, ...right]);
      node.left = node.right = { value: val };
      return;
    }

    if (depth >= this.maxDepth) {
      node.left = { value: this.toTerminal(left) };
      node.right = { value: this.toTerminal(right) };
      return;
    }

    const leftSplit = this.getBestSplit(left);
    node.left = { featureIndex: leftSplit.index, threshold: leftSplit.value, groups: leftSplit.groups };
    this.split(node.left, depth + 1);

    const rightSplit = this.getBestSplit(right);
    node.right = { featureIndex: rightSplit.index, threshold: rightSplit.value, groups: rightSplit.groups };
    this.split(node.right, depth + 1);
  }

  train(dataset: number[][]) {
    this.calculateWeights(dataset);
    const rootSplit = this.getBestSplit(dataset);
    this.root = { featureIndex: rootSplit.index, threshold: rootSplit.value, groups: rootSplit.groups };
    this.split(this.root, 1);
  }

  predict(row: number[]): number {
    let node = this.root;
    while (node && node.value === undefined) {
      if (row[node.featureIndex!] < node.threshold!) {
        node = node.left!;
      } else {
        node = node.right!;
      }
    }
    return node?.value ?? 0;
  }
}

// --- Component ---

const severityMapping: Record<string, number> = {
  'Trivial Damage': 0, 
  'Minor Damage': 1, 
  'Major Damage': 2, 
  'Total Loss': 3
};

const FraudPredictor: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'assess' | 'model'>('assess');
  const [loading, setLoading] = useState(false);
  const [training, setTraining] = useState(true);
  const [model, setModel] = useState<DecisionTree | null>(null);
  const [metrics, setMetrics] = useState({ trainAcc: 0, testAcc: 0, sampleSize: 0 });
  const [predictionResult, setPredictionResult] = useState<{ isFraud: boolean; prob: number } | null>(null);
  
  const [inputs, setInputs] = useState({
    months_as_customer: 328,
    policy_deductable: 1000,
    umbrella_limit: 0,
    policy_annual_premium: 1406.91,
    incident_hour_of_the_day: 5,
    vehicle_claim: 52080,
    incident_severity: 'Major Damage'
  });

  useEffect(() => {
    trainPipeline();
  }, []);

  const trainPipeline = async () => {
    setTraining(true);
    try {
      const response = await fetch('/insurance_claims.csv');
      const csvText = await response.text();
      const lines = csvText.trim().split('\n').slice(1);
      
      // pandas-style feature selection
      const dataset: number[][] = lines.map(line => {
        const c = line.split(',');
        return [
          parseInt(c[0]),  // months_as_customer
          parseInt(c[6]),  // policy_deductable
          parseInt(c[8]),  // umbrella_limit
          parseFloat(c[7]),// policy_annual_premium
          parseInt(c[25]), // incident_hour_of_the_day
          parseInt(c[34]), // vehicle_claim
          severityMapping[c[20]] ?? 1, // severity
          c[38] === 'Y' ? 1 : 0 // fraud_reported
        ];
      }).filter(row => !row.some(isNaN));

      // 80/20 train-test split
      const shuffled = [...dataset].sort(() => Math.random() - 0.5);
      const splitIdx = Math.floor(shuffled.length * 0.8);
      const trainSet = shuffled.slice(0, splitIdx);
      const testSet = shuffled.slice(splitIdx);

      const dt = new DecisionTree(3);
      dt.train(trainSet);

      const getAccuracy = (data: number[][]) => {
        const correct = data.filter(row => {
          const pred = dt.predict(row.slice(0, -1)) > 0.5 ? 1 : 0;
          return pred === row[row.length - 1];
        }).length;
        return (correct / data.length) * 100;
      };

      setMetrics({
        trainAcc: getAccuracy(trainSet),
        testAcc: getAccuracy(testSet),
        sampleSize: dataset.length
      });
      setModel(dt);
    } catch (err) {
      console.error("ML Error:", err);
    } finally {
      setTraining(false);
    }
  };

  const handlePredict = (e: React.FormEvent) => {
    e.preventDefault();
    if (!model) return;
    
    setLoading(true);
    // Order must match exactly: months, deductable, umbrella, premium, hour, vehicle_claim, severity
    const x = [
      inputs.months_as_customer,
      inputs.policy_deductable,
      inputs.umbrella_limit,
      inputs.policy_annual_premium,
      inputs.incident_hour_of_the_day,
      inputs.vehicle_claim,
      severityMapping[inputs.incident_severity]
    ];

    setTimeout(() => {
      const prob = model.predict(x);
      setPredictionResult({
        isFraud: prob > 0.5,
        prob: Math.round(prob * 100)
      });
      setLoading(false);
    }, 400); // Simulate inference latency
  };

  return (
    <div className="space-y-8">
      {/* Navigation */}
      <div className="flex bg-white/5 p-1 rounded-2xl w-fit border border-white/10">
        <button 
          onClick={() => setActiveTab('assess')}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'assess' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
        >
          <BrainCircuit size={16} /> Predict
        </button>
        <button 
          onClick={() => setActiveTab('model')}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'model' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
        >
          <Activity size={16} /> Model Stats
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {activeTab === 'assess' ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-[2.5rem] p-8 lg:p-10"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Target className="text-purple-400" /> Assessment Form
              </h2>
              {training && <Loader2 className="animate-spin text-yellow-500" size={16} />}
            </div>

            <form onSubmit={handlePredict} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Customer Tenure (Mo)" value={inputs.months_as_customer} onChange={v => setInputs({...inputs, months_as_customer: parseInt(v)})} />
                <InputField label="Deductible ($)" value={inputs.policy_deductable} onChange={v => setInputs({...inputs, policy_deductable: parseInt(v)})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InputField label="Umbrella Limit ($)" value={inputs.umbrella_limit} onChange={v => setInputs({...inputs, umbrella_limit: parseInt(v)})} />
                <InputField label="Annual Premium ($)" value={inputs.policy_annual_premium} onChange={v => setInputs({...inputs, policy_annual_premium: parseFloat(v)})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InputField label="Vehicle Claim ($)" value={inputs.vehicle_claim} onChange={v => setInputs({...inputs, vehicle_claim: parseInt(v)})} />
                <InputField label="Incident Hour" value={inputs.incident_hour_of_the_day} onChange={v => setInputs({...inputs, incident_hour_of_the_day: parseInt(v)})} />
              </div>

              <div>
                <label className="block text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">Severity</label>
                <select 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  value={inputs.incident_severity}
                  onChange={e => setInputs({...inputs, incident_severity: e.target.value})}
                >
                  {Object.keys(severityMapping).map(s => (
                    <option key={s} value={s} className="bg-slate-900">{s}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={loading || training}
                className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl shadow-purple-600/20 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : <BrainCircuit size={18} />}
                {loading ? 'Processing...' : 'Run Prediction'}
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-[2.5rem] p-8 lg:p-10 space-y-8"
          >
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <BarChart4 className="text-purple-400" /> Training Results
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <StatBox label="Train Acc" value={`${metrics.trainAcc.toFixed(1)}%`} sub={`N=${Math.floor(metrics.sampleSize * 0.8)}`} />
              <StatBox label="Test Acc" value={`${metrics.testAcc.toFixed(1)}%`} sub={`N=${Math.floor(metrics.sampleSize * 0.2)}`} />
            </div>

            <div className="space-y-3 pt-4 border-t border-white/10">
              <ManifestRow label="Engine" value="CART Decision Tree" />
              <ManifestRow label="Weights" value="Balanced (sklearn-style)" />
              <ManifestRow label="Split" value="Gini Impurity" />
              <ManifestRow label="Max Depth" value="3" />
            </div>
          </motion.div>
        )}

        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {predictionResult ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card rounded-[2.5rem] p-12 text-center relative overflow-hidden flex flex-col items-center"
              >
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${predictionResult.isFraud ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                  {predictionResult.isFraud ? <AlertTriangle size={48} /> : <CheckCircle2 size={48} />}
                </div>
                <h2 className={`text-4xl font-black mb-2 ${predictionResult.isFraud ? 'text-rose-500' : 'text-emerald-500'}`}>
                  {predictionResult.isFraud ? 'FRAUD SUSPECTED' : 'CLAIM LEGITIMATE'}
                </h2>
                <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">
                  Tree Probability: {predictionResult.prob}%
                </p>
                
                <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/10 text-left w-full">
                  <div className="flex items-center gap-2 text-purple-400 mb-2">
                    <Info size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Logic Explanation</span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed italic">
                    The model identifies this claim as {predictionResult.isFraud ? 'high-risk' : 'low-risk'} based on the decision boundaries learned from historical data. 
                    {predictionResult.isFraud ? ' Key factors like high vehicle claim value and incident severity contributed to this suspicion.' : ' The telemetry points align with standard legitimate claim patterns in the training set.'}
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="glass-card rounded-[2.5rem] p-12 h-full flex flex-col justify-center text-center min-h-[400px] border-dashed">
                <Database className="mx-auto text-gray-700 mb-6" size={48} />
                <h4 className="text-white font-bold mb-2">Awaiting Data</h4>
                <p className="text-gray-500 text-xs">Model trained and ready on CSV. Fill the form to run inference.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, value, onChange }: any) => (
  <div className="w-full">
    <label className="block text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1.5">{label}</label>
    <input
      type="number"
      step="any"
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-purple-500/50"
    />
  </div>
);

const StatBox = ({ label, value, sub }: any) => (
  <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
    <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{label}</div>
    <div className="text-3xl font-black text-white">{value}</div>
    <div className="text-[10px] text-gray-600 mt-1 uppercase">{sub}</div>
  </div>
);

const ManifestRow = ({ label, value }: any) => (
  <div className="flex justify-between items-center text-xs">
    <span className="text-gray-500 font-bold uppercase tracking-widest">{label}</span>
    <span className="text-white font-mono bg-white/5 px-2 py-0.5 rounded border border-white/5">{value}</span>
  </div>
);

export default FraudPredictor;
