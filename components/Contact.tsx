import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import emailjs from '@emailjs/browser';

interface ContactProps {
  onReturn: () => void;
}

const Contact: React.FC<ContactProps> = ({ onReturn }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await emailjs.send(
        'service_g68041j',
        'template_hko1id9',
        {
          to_email: 'nishanttyagi.developer@gmail.com',
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message
        },
        'UEzLnQaQCBZa4R3-5'
      );

      if (result.text === 'OK') {
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (err) {
      alert("Error: There was a problem sending your message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-widest mb-6">
            Support Node
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
            Direct Line to <span className="text-gradient">Engineers</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Need help with ClaimGuard integration or found a potential fraud pattern anomaly? Our support team is active 24/7.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Info Cards */}
          <div className="lg:col-span-2 space-y-6">
            <ContactInfoCard 
              icon={<MapPin className="text-purple-400" />} 
              title="Global HQ" 
              content="Wave City, Ghaziabad, India" 
            />
            <ContactInfoCard 
              icon={<Phone className="text-indigo-400" />} 
              title="Hotline" 
              content="+91 77425 96946" 
            />
            <ContactInfoCard 
              icon={<Mail className="text-pink-400" />} 
              title="Secure Email" 
              content="support@claimguard.ai" 
            />
            
            <div className="glass-card p-8 rounded-3xl border-dashed border-white/10 flex flex-col items-center text-center">
              <MessageSquare className="text-gray-500 mb-4" size={32} />
              <h4 className="text-white font-bold mb-1">Live Chat</h4>
              <p className="text-gray-500 text-sm">Typical response time: <span className="text-emerald-500 font-bold">2 mins</span></p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <motion.div 
              className="glass-card rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden"
            >
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="text-emerald-500" size={40} />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Message Encrypted & Sent</h2>
                  <p className="text-gray-400">Our support staff will review your transmission and reply within 4 hours.</p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="mt-8 text-purple-400 font-bold hover:text-white transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField 
                      label="Full Name" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      placeholder="John Doe" 
                    />
                    <InputField 
                      label="Email Address" 
                      name="email" 
                      type="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      placeholder="john@company.com" 
                    />
                  </div>
                  <InputField 
                    label="Subject" 
                    name="subject" 
                    value={formData.subject} 
                    onChange={handleChange} 
                    placeholder="Technical Inquiry" 
                  />
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder-white/10"
                      placeholder="Detail your request..."
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-purple-50 transition-all flex items-center justify-center gap-2 group shadow-xl shadow-white/5 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Encrypting...' : 'Dispatch Message'}
                    <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const ContactInfoCard = ({ icon, title, content }: { icon: React.ReactNode, title: string, content: string }) => (
  <div className="glass-card p-6 rounded-3xl flex items-center gap-4 hover:border-white/20 transition-colors">
    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div>
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">{title}</h3>
      <p className="text-white font-medium">{content}</p>
    </div>
  </div>
);

const InputField = ({ label, name, value, onChange, placeholder, type = "text" }: any) => (
  <div>
    <label className="block text-gray-400 text-sm font-medium mb-2">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required
      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder-white/10"
      placeholder={placeholder}
    />
  </div>
);

export default Contact;
