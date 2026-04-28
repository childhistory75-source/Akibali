/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, 
  Mouse, 
  Gift, 
  ShieldCheck, 
  Timer, 
  Truck, 
  CreditCard, 
  RotateCcw, 
  CheckCircle2, 
  ChevronRight,
  Plus,
  Minus,
  Trash2,
  X,
  Smartphone,
  Eye,
  TrendingDown
} from 'lucide-react';
import { cn } from './lib/utils';

// --- Types ---
interface Order {
  id: number;
  date: string;
  name: string;
  phone: string;
  address: string;
  qty: number;
  total: number;
  status: 'new' | 'viewed';
}

// --- Constants ---
const PRICE = 999;
const OLD_PRICE = 1450;
const DISCOUNT = "৩১% ছাড়";
const ADMIN_PASSWORD = "11002299";

export default function App() {
  // --- States ---
  const [qty, setQty] = useState(1);
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  const [showToast, setShowToast] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminModal, setIsAdminModal] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [adminError, setAdminError] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  
  const nameInputRef = useRef<HTMLInputElement>(null);

  // --- Effects ---
  useEffect(() => {
    const savedOrders = localStorage.getItem('mouseBoxOrders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  const saveToLocal = (newOrders: Order[]) => {
    localStorage.setItem('mouseBoxOrders', JSON.stringify(newOrders));
    setOrders(newOrders);
  };

  // --- Handlers ---
  const scrollToOrder = () => {
    const element = document.getElementById('order');
    element?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => nameInputRef.current?.focus(), 800);
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) return;

    const newOrder: Order = {
      id: Date.now(),
      date: new Date().toLocaleString('bn-BD'),
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      qty,
      total: qty * PRICE,
      status: 'new'
    };

    const updatedOrders = [newOrder, ...orders];
    saveToLocal(updatedOrders);
    
    setShowToast(true);
    setFormData({ name: '', phone: '', address: '' });
    setQty(1);
    
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleAdminAuth = () => {
    if (adminPass === ADMIN_PASSWORD) {
      setIsAdminOpen(true);
      setIsAdminModal(false);
      setAdminPass("");
      setAdminError("");
    } else {
      setAdminError("ভুল পাসওয়ার্ড! আবার চেষ্টা করুন।");
      setAdminPass("");
    }
  };

  const markAsViewed = (id: number) => {
    const updated = orders.map(o => o.id === id ? { ...o, status: 'viewed' as const } : o);
    saveToLocal(updated);
  };

  const deleteOrder = (id: number) => {
    const updated = orders.filter(o => o.id !== id);
    saveToLocal(updated);
  };

  const clearAllOrders = () => {
    if (window.confirm("আপনি কি নিশ্চিতভাবে সব অর্ডার মুছতে চান?")) {
      saveToLocal([]);
    }
  };

  const stats = {
    total: orders.length,
    new: orders.filter(o => o.status === 'new').length,
    sales: orders.reduce((acc, curr) => acc + curr.total, 0)
  };

  return (
    <div className="min-h-screen">
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 30 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-0 left-1/2 -translate-x-1/2 z-[100] bg-green-500 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 border-2 border-white"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-20 px-4 md:px-8">
        <div className="absolute top-20 left-10 w-64 h-64 bg-pink-light rounded-full opacity-30 animate-pulse-slow blur-3xl -z-10" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-red-200 rounded-full opacity-20 animate-pulse-slow blur-3xl -z-10" />
        
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }} 
              transition={{ repeat: Infinity, duration: 2 }}
              className="inline-block bg-accent-orange text-white text-sm px-4 py-1 rounded-full font-bold mb-6 shadow-lg"
            >
              সীমিত স্টক!
            </motion.div>
            
            <h1 className="text-4xl md:text-7xl font-extrabold text-pink-deep leading-tight mb-4">
              শিশুর জন্য মাউস সেভিং বক্স <br />
              <span className="text-gray-800">পিগি ব্যাংক</span>
            </h1>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative mb-12 w-full max-w-lg"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border-[1px] border-pink-200 rounded-full animate-ring -z-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] border-[1px] border-pink-300 rounded-full animate-ring -z-10 opacity-50" style={{ animationDirection: 'reverse' }} />
            
            <img 
              src="https://i.ibb.co.com/zTVJ84QH/gemini-2-5-flash-image-Top-down-flat-lay-pink-cat-piggy-bank-in-center-surrounded-by-scattered-gold.jpg" 
              alt="Mouse Saving Box" 
              className="w-full mx-auto drop-shadow-2xl animate-float relative z-10 rounded-[3rem]"
              referrerPolicy="no-referrer"
            />
            
            {/* Info Tags */}
            <motion.div 
              animate={{ y: [0, -10, 0] }} 
              transition={{ repeat: Infinity, duration: 3 }}
              className="absolute top-10 -right-4 bg-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 border-l-4 border-pink-deep z-20"
            >
              <Lock className="w-4 h-4 text-pink-deep" />
              <span className="text-xs font-bold font-heading">🔐 পাসওয়ার্ড লক</span>
            </motion.div>
            
            <motion.div 
              animate={{ y: [0, 10, 0] }} 
              transition={{ repeat: Infinity, duration: 3, delay: 0.5 }}
              className="absolute bottom-10 -left-6 bg-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 border-l-4 border-accent-orange z-20"
            >
              <Smartphone className="w-4 h-4 text-accent-orange" />
              <span className="text-xs font-bold font-heading">🐾 বয়স ৩+</span>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="text-4xl font-bold text-pink-deep">৳{PRICE}</div>
              <div className="text-2xl text-gray-400 line-through">৳{OLD_PRICE}</div>
              <div className="bg-red-100 text-red-500 text-xs px-3 py-1 rounded-full font-bold">{DISCOUNT}</div>
            </div>
            
            <button 
              onClick={scrollToOrder}
              className="group relative inline-flex items-center gap-3 bg-pink-deep text-white px-10 py-5 rounded-full font-bold text-xl shadow-xl hover:shadow-pink-300 transition-all hover:-translate-y-1 active:scale-95"
            >
              এখনই অর্ডার করুন
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex flex-wrap justify-center gap-4 md:gap-8 mt-12">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/50 rounded-full shadow-sm">
                <Truck className="w-5 h-5 text-pink-deep" />
                <span className="text-sm font-bold text-gray-700">ফ্রি ডেলিভারি</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/50 rounded-full shadow-sm">
                <ShieldCheck className="w-5 h-5 text-pink-deep" />
                <span className="text-sm font-bold text-gray-700">নিরাপদ পেমেন্ট</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/50 rounded-full shadow-sm">
                <RotateCcw className="w-5 h-5 text-pink-deep" />
                <span className="text-sm font-bold text-gray-700">৭ দিন রিটার্ন</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Buy Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-16 text-gray-800">
            কেন কিনবেন আমাদের <br />
            <span className="text-pink-deep">মাউস সেভিং বক্স?</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: '🔐', title: 'পাসওয়ার্ড সুরক্ষিত', desc: 'শিশুদের প্রিয় জিনিসের নিরাপত্তা নিশ্চিত করতে ডিজিটাল পাসওয়ার্ড ব্যবহার করা যায়।' },
              { icon: '🐭', title: 'কিউট ডিজাইন', desc: 'সুন্দর মাউস/ইঁদুর আকৃতির ডিজাইন যা শিশুদের প্রথম দেখাতেই পছন্দ হবে।' },
              { icon: '💰', title: 'সঞ্চয়ের অভ্যাস', desc: 'ছোটবেলা থেকেই সঞ্চয় করার ভালো অভ্যাস গড়ে তুলতে সাহায্য করে।' },
              { icon: '🎁', title: 'পারফেক্ট গিফট', desc: 'জন্মদিন বা যেকোনো উৎসবে শিশুর জন্য সেরা উপহার হতে পারে এই পিগি ব্যাংক।' },
              { icon: '🏧', title: 'ATM স্টাইল', desc: 'টাকা ঢোকানোর সময় এটি আসল ATM-এর মতো শব্দ করে এবং স্বয়ংক্রিয়ভাবে টাকা টেনে নেয়।' },
              { icon: '🛡️', title: 'নিরাপদ উপকরণ', desc: 'সম্পূর্ণরূপে উন্নতমানের অ-বিষাক্ত প্লাস্টিক দিয়ে তৈরি যা শিশুর জন্য শতভাগ নিরাপদ।' }
            ].map((item, id) => (
              <motion.div 
                key={id}
                whileHover={{ y: -10 }}
                className="p-8 bg-pink-pale rounded-3xl border-t-8 border-pink-deep shadow-sm hover:shadow-xl transition-all"
              >
                <div className="text-5xl mb-6">{item.icon}</div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Setup Guide Section */}
      <section className="py-24 px-4 bg-dark-bg text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-pink-300 via-transparent to-transparent" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-16">
            অপারেশন <span className="text-pink-light">গাইড</span>
          </h2>
          
          <div className="relative flex flex-col md:flex-row justify-between items-center gap-12">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-10 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-pink-400 to-transparent -z-10" />
            
            {[
              { step: '০১', title: 'ব্যাটারি লাগান', icon: '🔋' },
              { step: '০২', title: 'চালু করুন', icon: '✨' },
              { step: '০৩', title: 'পাসওয়ার্ড সেট করুন', icon: '🔏' },
              { step: '০৪', title: 'টাকা জমান', icon: '💵' }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center w-full md:w-1/4">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-primary to-pink-deep rounded-full flex items-center justify-center text-2xl font-bold mb-6 border-4 border-dark-bg outline outline-2 outline-pink-light shadow-2xl">
                  {item.step}
                </div>
                <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                <div className="text-4xl">{item.icon}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specifications Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
             <img 
              src="https://i.ibb.co.com/jPbry2TJ/gemini-2-5-flash-image-Place-the-pink-cat-piggy-bank-on-a-pure-white-surface-shoot-straight-on-front.jpg" 
              alt="Specs" 
              className="rounded-3xl shadow-2xl"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          
          <div>
            <h2 className="text-3xl font-extrabold mb-8 text-gray-800">
              প্রোডাক্ট <span className="text-pink-deep">স্পেসিফিকেশন</span>
            </h2>
            <div className="space-y-4">
              {[
                { l: 'রঙ', v: 'কিউট পিঙ্ক / গোলাপী' },
                { l: 'মাপ', v: '১৯ x ১৩ x ১৩ সেমি' },
                { l: 'বক্সের মাপ', v: '২০ x ১৪ x ১৪ সেমি' },
                { l: 'ব্যাটারি', v: '৩টি AA ব্যাটারি (অন্তর্ভুক্ত নয়)' },
                { l: 'বয়স', v: '৩ বছর বা তার বেশি' },
                { l: 'পাসওয়ার্ড', v: '৪ ডিজিট (ডিফল্ট: ০০০০)' },
                { l: 'প্যাকেজিং', v: 'রঙিন কার্টুন বক্স' },
                { l: 'নিশ্চয়তা', v: 'চেক করে নেওয়ার সুযোগ' }
              ].map((spec, i) => (
                <div key={i} className="flex justify-between items-center py-3 border-b border-dashed border-pink-200">
                  <span className="font-bold text-gray-700">{spec.l}</span>
                  <span className="text-gray-600">{spec.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Order Form Section */}
      <section id="order" className="py-24 px-4 bg-pink-pale">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="order-gradient p-1 rounded-3xl shadow-2xl"
          >
            <div className="bg-white rounded-[1.4rem] p-8 md:p-12">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-extrabold mb-4 text-gray-800">অর্ডার কনফার্ম করুন</h2>
                <p className="text-gray-500">নিচের ফরমটি পূরণ করে আপনার অর্ডারটি বুক করুন।</p>
              </div>
              
              <form onSubmit={handleOrderSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">আপনার নাম</label>
                  <input 
                    ref={nameInputRef}
                    required
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="পুরো নাম লিখুন"
                    className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 focus:border-pink-primary focus:ring-0 transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">মোবাইল নম্বর</label>
                  <input 
                    required
                    type="tel" 
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    placeholder="০১********* লিখুন"
                    className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 focus:border-pink-primary focus:ring-0 transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">ডেলিভারি ঠিকানা</label>
                  <textarea 
                    required
                    rows={3}
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    placeholder="বাসা নম্বর, রাস্তা, এলাকা ও জেলার নাম লিখুন"
                    className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 focus:border-pink-primary focus:ring-0 transition-colors"
                  />
                </div>
                
                <div className="flex flex-col md:flex-row gap-6 mt-10">
                  <div className="flex-1">
                    <label className="block text-sm font-bold text-gray-700 mb-3 text-center md:text-left">পরিমাণ</label>
                    <div className="flex items-center justify-center md:justify-start gap-4">
                      <button 
                        type="button"
                        onClick={() => setQty(Math.max(1, qty - 1))}
                        className="w-12 h-12 rounded-full border-2 border-pink-primary flex items-center justify-center text-pink-deep hover:bg-pink-primary hover:text-white transition-all"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <span className="text-2xl font-bold w-8 text-center">{qty}</span>
                      <button 
                        type="button"
                        onClick={() => setQty(qty + 1)}
                        className="w-12 h-12 rounded-full border-2 border-pink-primary flex items-center justify-center text-pink-deep hover:bg-pink-primary hover:text-white transition-all"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="order-gradient p-6 rounded-2xl text-white text-center shadow-lg">
                      <div className="text-sm opacity-90 mb-1">মোট বিল</div>
                      <div className="text-4xl font-extrabold font-heading">৳{qty * PRICE}</div>
                    </div>
                  </div>
                </div>
                
                <button 
                  type="submit"
                  className="w-full bg-pink-deep text-white py-5 rounded-2xl font-extrabold text-xl shadow-xl hover:shadow-pink-300 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                >
                  <CheckCircle2 className="w-6 h-6" />
                  অর্ডার কনফার্ম করুন
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-bg text-gray-400 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12 text-center md:text-left">
            <div>
              <h3 className="text-2xl font-extrabold text-white mb-6">মাউস সেভিং বক্স</h3>
              <p className="leading-relaxed">শিশুদের সঞ্চয় শিক্ষা এবং মজার জন্য সেরা পিগি ব্যাংক। আমরা সারা বাংলাদেশে দ্রুত ফ্রি ডেলিভারি দিয়ে থাকি।</p>
            </div>
            
            <div className="flex flex-col items-center md:items-start">
              <h4 className="text-lg font-bold text-white mb-6">যোগাযোগ</h4>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-pink-primary" />
                  <span>কল করুন: ০১৮০৪৯৮৩৬২৬</span>
                </li>
                <li className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-pink-primary" />
                  <span>ঢাকার ভিতরে: ২৪-৪৮ ঘণ্টা</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-pink-primary" />
                  <span>ঢাকার বাইরে: ৩-৫ দিন</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 text-center text-sm">
            © {new Date().getFullYear()} মাউস সেভিং বক্স - সর্বস্বত্ব সংরক্ষিত।
          </div>
        </div>
      </footer>

      {/* Admin Bar Trigger (Invisible) */}
      <div 
        onClick={() => setIsAdminModal(true)}
        className="h-8 w-full bg-transparent cursor-default select-none"
      />

      {/* Admin Auth Modal */}
      <AnimatePresence>
        {isAdminModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setIsAdminModal(false); setAdminPass(""); setAdminError(""); }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 w-full max-w-sm relative z-10 shadow-2xl"
            >
              <h3 className="text-xl font-bold text-center mb-6">অ্যাডমিন প্রবেশ</h3>
              <div className="space-y-4">
                <input 
                  autoFocus
                  type="password" 
                  value={adminPass}
                  onChange={e => setAdminPass(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAdminAuth()}
                  placeholder="পাসওয়ার্ড লিখুন"
                  className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-pink-primary outline-none text-center text-2xl tracking-[0.5em]"
                />
                {adminError && <div className="text-red-500 text-sm text-center">{adminError}</div>}
                <button 
                  onClick={handleAdminAuth}
                  className="w-full bg-dark-bg text-white py-4 rounded-xl font-bold shadow-lg active:scale-95 transition-all"
                >
                  লগইন করুন
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Full Admin Panel Overlay */}
      <AnimatePresence>
        {isAdminOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[300] bg-[#0f0a1a] text-white flex flex-col font-sans"
          >
            {/* Admin Header */}
            <header className="p-6 border-b border-white/10 flex justify-between items-center bg-black/20 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-pink-deep rounded-xl flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight">অর্ডার্স ড্যাশবোর্ড</h1>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={clearAllOrders}
                  className="px-4 py-2 bg-red-900/30 text-red-400 border border-red-900/50 rounded-lg hover:bg-red-900/50 transition-all flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> সব মুছুন
                </button>
                <button 
                  onClick={() => setIsAdminOpen(false)}
                  className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </header>

            <main className="flex-1 overflow-auto p-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                  { label: 'মোট অর্ডার', val: stats.total, color: 'from-blue-600 to-blue-800' },
                  { label: 'নতুন অর্ডার', val: stats.new, color: 'from-green-600 to-green-800' },
                  { label: 'মোট বিক্রয় (৳)', val: stats.sales, color: 'from-pink-600 to-pink-800' }
                ].map((s, i) => (
                  <div key={i} className={cn("p-6 rounded-2xl bg-gradient-to-br shadow-xl", s.color)}>
                    <div className="text-sm font-medium opacity-80 mb-2">{s.label}</div>
                    <div className="text-3xl font-bold">{s.val}</div>
                  </div>
                ))}
              </div>

              {/* Orders Table */}
              <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                {orders.length === 0 ? (
                  <div className="p-20 text-center text-gray-500 uppercase tracking-widest italic">
                    কোনো অর্ডার পাওয়া যায়নি
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-white/5 border-b border-white/10 uppercase text-[10px] tracking-wider text-gray-400">
                          <th className="px-6 py-4">#</th>
                          <th className="px-6 py-4">তারিখ</th>
                          <th className="px-6 py-4">পণ্য তথ্য</th>
                          <th className="px-6 py-4">গ্রাহক তথ্য</th>
                          <th className="px-6 py-4">পেমেন্ট</th>
                          <th className="px-6 py-4">স্ট্যাটাস</th>
                          <th className="px-6 py-4 text-center">অ্যাকশন</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {orders.map((order, idx) => (
                          <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                            <td className="px-6 py-5 text-gray-500">{orders.length - idx}</td>
                            <td className="px-6 py-5">
                              <div className="text-xs">{order.date.split(',')[0]}</div>
                              <div className="text-[10px] opacity-40">{order.date.split(',')[1]}</div>
                            </td>
                            <td className="px-6 py-5">
                              <div className="font-bold">{order.qty}টি বক্স</div>
                              <div className="text-xs text-pink-400">৳{order.total}</div>
                            </td>
                            <td className="px-6 py-5">
                              <div className="font-bold text-sm">{order.name}</div>
                              <a href={`tel:${order.phone}`} className="text-xs text-blue-400 hover:underline flex items-center gap-1">
                                <Smartphone className="w-3 h-3" /> {order.phone}
                              </a>
                              <div className="text-[10px] opacity-60 mt-1 max-w-[200px] truncate">{order.address}</div>
                            </td>
                            <td className="px-6 py-5">
                              <span className="text-[10px] px-2 py-1 bg-white/10 rounded uppercase">COD</span>
                            </td>
                            <td className="px-6 py-5">
                              {order.status === 'new' ? (
                                <span className="flex items-center gap-2 text-[10px] font-bold text-green-400 bg-green-400/10 px-3 py-1 rounded-full uppercase ring-1 ring-green-400/20">
                                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> নতুন
                                </span>
                              ) : (
                                <span className="flex items-center gap-2 text-[10px] font-bold text-gray-400 bg-white/5 px-3 py-1 rounded-full uppercase">
                                  <Eye className="w-3 h-3" /> দেখা হয়েছে
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex justify-center gap-2">
                                {order.status === 'new' && (
                                  <button 
                                    onClick={() => markAsViewed(order.id)}
                                    title="Mark as Viewed"
                                    className="w-10 h-10 bg-green-600/20 text-green-500 rounded-xl flex items-center justify-center hover:bg-green-600/40 transition-all border border-green-600/30"
                                  >
                                    <CheckCircle2 className="w-5 h-5" />
                                  </button>
                                )}
                                <button 
                                  onClick={() => deleteOrder(order.id)}
                                  title="Delete"
                                  className="w-10 h-10 bg-red-600/20 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-600/40 transition-all border border-red-600/30"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
