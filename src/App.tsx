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
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "new" | "viewed">("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [visitorCount, setVisitorCount] = useState(0);
  
  const nameInputRef = useRef<HTMLInputElement>(null);

  // --- Effects ---
  useEffect(() => {
    // Load Orders
    const savedOrders = localStorage.getItem('mouseBoxOrders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }

    // Load and Increment Visitor Count
    const savedVisits = localStorage.getItem('mouseBoxVisits');
    const currentVisits = savedVisits ? parseInt(savedVisits) : 0;
    
    // Only increment if not visited in this session
    if (!sessionStorage.getItem('mouseBox_session_visited')) {
      const newVisits = currentVisits + 1;
      localStorage.setItem('mouseBoxVisits', newVisits.toString());
      setVisitorCount(newVisits);
      sessionStorage.setItem('mouseBox_session_visited', 'true');
    } else {
      setVisitorCount(currentVisits);
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

  const exportToCSV = () => {
    const headers = ["ID", "Date", "Name", "Phone", "Address", "Qty", "Total", "Status"];
    const rows = orders.map(o => [o.id, o.date, o.name, o.phone, `"${o.address}"`, o.qty, o.total, o.status]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `orders_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [isAdminInvoice, setIsAdminInvoice] = useState<Order | null>(null);

  return (
    <div className="min-h-screen">
      {/* Scroll to Top / Floating Bottom Button */}
      <motion.button 
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        onClick={scrollToOrder}
        className="md:hidden fixed bottom-6 right-6 z-[60] bg-pink-deep text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center animate-bounce"
      >
        <Smartphone className="w-6 h-6" />
      </motion.button>

      {/* Invoice View Modal */}
      <AnimatePresence>
        {isAdminInvoice && (
          <div className="fixed inset-0 z-[500] bg-white text-black overflow-auto md:p-12 p-4">
             <div className="max-w-3xl mx-auto border-2 border-gray-100 p-8 rounded-none md:rounded-3xl shadow-none md:shadow-2xl font-sans print:border-0 print:p-0">
                <div className="flex justify-between items-center mb-12 border-b-4 border-pink-deep pb-8">
                   <div>
                     <h1 className="text-3xl font-black text-pink-deep uppercase tracking-tighter">INVOICE</h1>
                     <p className="text-gray-500 font-mono text-sm">#{isAdminInvoice.id}</p>
                   </div>
                   <div className="text-right">
                     <h2 className="text-xl font-bold">মাউস সেভিং বক্স</h2>
                     <p className="text-xs text-gray-500">ফোন: ০১৮০৪৯৮৩৬২৬</p>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-12 mb-12">
                   <div>
                     <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">গ্রাহক তথ্য:</h4>
                     <p className="font-bold text-xl mb-1">{isAdminInvoice.name}</p>
                     <p className="text-sm font-mono mb-2">{isAdminInvoice.phone}</p>
                     <p className="text-sm text-gray-600 leading-relaxed max-w-[250px]">{isAdminInvoice.address}</p>
                   </div>
                   <div className="text-right">
                     <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">অর্ডার তথ্য:</h4>
                     <p className="text-sm">তারিখ: <span className="font-bold">{isAdminInvoice.date}</span></p>
                     <p className="text-sm">পেমেন্ট: <span className="font-bold">CASH ON DELIVERY</span></p>
                   </div>
                </div>

                <table className="w-full mb-12 border-collapse">
                   <thead>
                     <tr className="bg-gray-50 text-left text-xs font-bold">
                       <th className="p-4 border-b">পণ্য</th>
                       <th className="p-4 border-b text-center">পরিমাণ</th>
                       <th className="p-4 border-b text-right">ইউনিট মূল্য</th>
                       <th className="p-4 border-b text-right">মোট</th>
                     </tr>
                   </thead>
                   <tbody>
                     <tr>
                       <td className="p-4 border-b font-medium italic">মাউস সেভিং বক্স (কিউট পিঙ্ক)</td>
                       <td className="p-4 border-b text-center">{isAdminInvoice.qty}</td>
                       <td className="p-4 border-b text-right">৳{PRICE}</td>
                       <td className="p-4 border-b text-right font-bold">৳{isAdminInvoice.total}</td>
                     </tr>
                   </tbody>
                </table>

                <div className="flex flex-col items-end gap-2 mb-12 bg-gray-50 p-6 rounded-2xl">
                   <div className="flex justify-between w-64 text-sm">
                      <span>সাব-টোটাল:</span>
                      <span className="font-mono">৳{isAdminInvoice.total}</span>
                   </div>
                   <div className="flex justify-between w-64 text-sm">
                      <span>ডেলিভারি চার্জ:</span>
                      <span className="font-mono">৳০</span>
                   </div>
                   <div className="flex justify-between w-64 text-xl font-black text-pink-deep border-t border-pink-100 pt-4 mt-2">
                      <span>সর্বমোট:</span>
                      <span className="font-mono">৳{isAdminInvoice.total}</span>
                   </div>
                </div>

                <div className="text-center text-[10px] text-gray-400 border-t pt-8">
                   <p className="mb-1 uppercase tracking-widest font-bold">Thank you for choosing us!</p>
                   <p>This is a digital generated invoice.</p>
                </div>

                <div className="mt-12 flex justify-center gap-4 print:hidden">
                   <button onClick={() => window.print()} className="bg-pink-deep text-white px-8 py-3 rounded-full font-bold shadow-lg hover:-translate-y-1 transition-all">প্রিন্ট করুন</button>
                   <button onClick={() => setIsAdminInvoice(null)} className="bg-gray-100 text-gray-800 px-8 py-3 rounded-full font-bold">বন্ধ করুন</button>
                </div>
             </div>
          </div>
        )}
      </AnimatePresence>

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

      {/* Testimonials Section */}
      <section className="py-24 px-4 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-800 mb-4">আমাদের গ্রাহকদের <span className="text-pink-deep">মতামত</span></h2>
            <div className="flex justify-center gap-1">
              {[...Array(5)].map((_, i) => <CheckCircle2 key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400" />)}
            </div>
            <p className="mt-4 text-gray-500 font-bold">৪.৯/৫ রেটিং (৫০০+ রিভিও)</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'আরিফুল ইসলাম', text: 'খুবই সুন্দর প্রোডাক্ট! আমার মেয়ের জন্মদিনে গিফট করেছি, সে অনেক খুশি হয়েছে।', location: 'ঢাকা' },
              { name: 'নুসরাত জাহান', text: 'পাসওয়ার্ড সিস্টেমটা অসাধারন। বাচ্চাদের জন্য শিক্ষামূলক এবং নিরাপদ একটি খেলনা।', location: 'চট্টগ্রাম' },
              { name: 'তানভীর আহমেদ', text: 'ডেলিভারি খুব দ্রুত পেয়েছি। প্যাকেজিংও অনেক ভালো ছিল। ধন্যবাদ!', location: 'সিলেট' }
            ].map((review, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 bg-pink-pale rounded-[2.5rem] relative"
              >
                <div className="flex gap-1 mb-4">
                   {[...Array(5)].map((_, i) => <CheckCircle2 key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />)}
                </div>
                <p className="text-gray-700 italic mb-6">"{review.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-pink-primary rounded-full flex items-center justify-center text-white font-bold">
                    {review.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{review.name}</h4>
                    <p className="text-xs text-gray-500">{review.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4 bg-pink-pale">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-16 text-gray-800">
            আপনার কিছু <span className="text-pink-deep">জিজ্ঞাসা?</span>
          </h2>
          
          <div className="space-y-4">
            {[
              { q: 'টাকা জমানো ছাড়া আর কি কাজ করে?', a: 'এটি শুধু জমা করা নয়, বরং শিশুদের মধ্যে সঞ্চয়ের মানসিকতা এবং দায়িত্বশীলতা গড়ে তোলে।' },
              { q: 'পাসওয়ার্ড ভুলে গেলে কি করব?', a: 'ব্যাটারি খুলে ২ মিনিট পর আবার লাগালে পাসওয়ার্ড ডিফল্ট (০০০০) হয়ে যাবে।' },
              { q: 'সব ধরণের নোট কি নেয়া যায়?', a: 'হ্যাঁ, এটি ১, ২, ৫, ১০, ২০, ৫০, ১০০, ২০০, ৫০০ এবং ১০০০ টাকার সব নোট অটোমেটিক টেনে নেয়।' },
              { q: 'ডেলিভারি কি সারা দেশে পাবেন?', a: 'হ্যাঁ! ক্যাশ অন ডেলিভারিতে আমরা সারা বাংলাদেশে পণ্য পাঠিয়ে থাকি।' }
            ].map((item, i) => (
              <motion.details 
                key={i}
                className="group bg-white rounded-2xl shadow-sm overflow-hidden"
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <h4 className="font-bold text-gray-800">{item.q}</h4>
                  <Plus className="w-5 h-5 text-pink-deep group-open:rotate-45 transition-transform" />
                </summary>
                <div className="p-6 pt-0 text-gray-600 leading-relaxed border-t border-pink-50">
                  {item.a}
                </div>
              </motion.details>
            ))}
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
                <p className="text-gray-500 mb-6">নিচের ফরমটি পূরণ করে আপনার অর্ডারটি বুক করুন।</p>
                
                {/* Stock Progress Bar */}
                <div className="max-w-xs mx-auto mb-8">
                  <div className="flex justify-between text-xs font-bold text-pink-deep mb-2">
                    <span>স্টক সীমিত</span>
                    <span>১২টি বাকি</span>
                  </div>
                  <div className="h-3 bg-pink-100 rounded-full overflow-hidden border border-pink-200">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: '85%' }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-pink-primary to-pink-deep"
                    />
                  </div>
                </div>
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
            <header className="p-6 border-b border-white/10 flex flex-wrap gap-4 justify-between items-center bg-black/20 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-pink-deep rounded-xl flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-white" />
                </div>
                <div>
                   <h1 className="text-xl md:text-2xl font-bold tracking-tight leading-none mb-1">প্রো অ্যাডমিন ড্যাশবোর্ড</h1>
                   <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em]">Management System v2.0</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={exportToCSV}
                  className="px-4 py-2 bg-blue-900/30 text-blue-400 border border-blue-900/50 rounded-lg hover:bg-blue-900/50 transition-all flex items-center gap-2 text-xs font-bold"
                >
                  <CreditCard className="w-4 h-4" /> এক্সপোর্ট (CSV)
                </button>
                <button 
                  onClick={clearAllOrders}
                  className="px-4 py-2 bg-red-900/30 text-red-400 border border-red-900/50 rounded-lg hover:bg-red-900/50 transition-all flex items-center gap-2 text-xs font-bold"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  { label: 'মোট ভিজিটর', val: visitorCount, color: 'from-purple-600 to-purple-900', icon: <Eye className="w-4 h-4" /> },
                  { label: 'মোট অর্ডার', val: stats.total, color: 'from-blue-600 to-blue-800', icon: <Smartphone className="w-4 h-4" /> },
                  { label: 'নতুন অর্ডার', val: stats.new, color: 'from-green-600 to-green-800', icon: <Plus className="w-4 h-4" /> },
                  { label: 'মোট বিক্রয় (৳)', val: stats.sales, color: 'from-pink-600 to-pink-800', icon: <CreditCard className="w-4 h-4" /> }
                ].map((s, i) => (
                  <div key={i} className={cn("p-6 rounded-2xl bg-gradient-to-br shadow-xl border border-white/5", s.color)}>
                    <div className="flex justify-between items-center opacity-80 mb-2">
                       <span className="text-xs font-bold uppercase tracking-wider">{s.label}</span>
                       {s.icon}
                    </div>
                    <div className="text-3xl font-black">{s.val.toLocaleString('bn-BD')}</div>
                  </div>
                ))}
              </div>

              {/* Controls */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    placeholder="নাম বা ফোন নম্বর দিয়ে সার্চ করুন..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3 focus:border-pink-primary outline-none"
                  />
                  <Mouse className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                </div>
                <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
                  {["all", "new", "viewed"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilterStatus(f as any)}
                      className={cn(
                        "px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all",
                        filterStatus === f ? "bg-pink-deep text-white shadow-lg" : "text-gray-400 hover:text-white"
                      )}
                    >
                      {f === "all" ? "সব" : f === "new" ? "নতুন" : "দেখা হয়েছে"}
                    </button>
                  ))}
                </div>
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
                          <th className="px-6 py-4">সময় ও তারিখ</th>
                          <th className="px-6 py-4">গ্রাহকের নাম ও ফোন</th>
                          <th className="px-6 py-4">সম্পূর্ণ ঠিকানা</th>
                          <th className="px-6 py-4">পরিমাণ ও দাম</th>
                          <th className="px-6 py-4">স্ট্যাটাস</th>
                          <th className="px-6 py-4 text-center">অ্যাকশন</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {orders
                          .filter(o => 
                            (filterStatus === "all" || o.status === filterStatus) &&
                            (o.name.toLowerCase().includes(searchQuery.toLowerCase()) || o.phone.includes(searchQuery))
                          )
                          .map((order, idx) => (
                          <tr 
                            key={order.id} 
                            onClick={() => setSelectedOrder(order)}
                            className="hover:bg-white/[0.05] cursor-pointer transition-colors group"
                          >
                            <td className="px-6 py-5 text-gray-500">{orders.length - idx}</td>
                            <td className="px-6 py-5">
                              <div className="text-xs font-medium text-gray-300">{order.date.split(',')[0]}</div>
                              <div className="text-[10px] opacity-40">{order.date.split(',')[1]}</div>
                            </td>
                            <td className="px-6 py-5">
                              <div className="font-bold text-sm text-white group-hover:text-pink-primary transition-colors">{order.name}</div>
                              <div className="text-xs text-blue-400 flex items-center gap-1 mt-1 font-mono">
                                <Smartphone className="w-3 h-3" /> {order.phone}
                              </div>
                            </td>
                            <td className="px-6 py-5 max-w-[200px]">
                              <div className="text-xs text-gray-300 leading-relaxed break-words">{order.address}</div>
                            </td>
                            <td className="px-6 py-5">
                              <div className="font-bold text-sm text-white">{order.qty} টি বক্স</div>
                              <div className="text-xs text-green-400 font-mono">৳{order.total}</div>
                            </td>
                            <td className="px-6 py-5">
                              {order.status === 'new' ? (
                                <span className="inline-flex items-center gap-2 text-[10px] font-bold text-green-400 bg-green-400/10 px-3 py-1 rounded-full uppercase ring-1 ring-green-400/20">
                                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> নতুন
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-2 text-[10px] font-bold text-gray-400 bg-white/5 px-3 py-1 rounded-full uppercase">
                                  দেখা হয়েছে
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-5" onClick={(e) => e.stopPropagation()}>
                              <div className="flex justify-center gap-2">
                                <button 
                                  onClick={() => setIsAdminInvoice(order)}
                                  title="Generate Invoice"
                                  className="w-9 h-9 bg-white/5 text-gray-300 border border-white/10 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all"
                                >
                                  <CreditCard className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => {
                                    const text = `নাম: ${order.name}\nফোন: ${order.phone}\nঠিকানা: ${order.address}\nপরিমাণ: ${order.qty}\nমোট: ${order.total}`;
                                    navigator.clipboard.writeText(text);
                                    alert("সব তথ্য কপি করা হয়েছে!");
                                  }}
                                  title="Copy All Info"
                                  className="w-9 h-9 bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-lg flex items-center justify-center hover:bg-blue-600/40 transition-all"
                                >
                                  <Smartphone className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => markAsViewed(order.id)}
                                  className={cn(
                                    "w-9 h-9 rounded-lg flex items-center justify-center transition-all border",
                                    order.status === 'new' 
                                      ? "bg-green-600/20 text-green-500 border-green-600/30 hover:bg-green-600/40" 
                                      : "bg-white/5 text-gray-500 border-white/10 opacity-50 cursor-not-allowed"
                                  )}
                                  disabled={order.status !== 'new'}
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => deleteOrder(order.id)}
                                  title="Delete"
                                  className="w-9 h-9 bg-red-600/20 text-red-500 border border-red-600/30 rounded-lg flex items-center justify-center hover:bg-red-600/40 transition-all"
                                >
                                  <Trash2 className="w-4 h-4" />
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

            {/* Order Detail Modal */}
            <AnimatePresence>
              {selectedOrder && (
                <div className="fixed inset-0 z-[400] flex items-center justify-center px-4">
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={() => setSelectedOrder(null)}
                    className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                  />
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 20 }} 
                    animate={{ scale: 1, opacity: 1, y: 0 }} 
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="bg-[#1a1425] border border-white/10 rounded-3xl p-8 w-full max-w-lg relative z-10 shadow-2xl"
                  >
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-1">অর্ডার ডিটেইলস</h3>
                        <p className="text-xs text-gray-500 font-mono">ID: {selectedOrder.id}</p>
                      </div>
                      <button 
                        onClick={() => setSelectedOrder(null)}
                        className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-all"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                          <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">তারিখ</div>
                          <div className="text-sm font-bold">{selectedOrder.date}</div>
                        </div>
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                          <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">স্ট্যাটাস</div>
                          <div className="flex items-center gap-2">
                             <div className={cn("w-2 h-2 rounded-full", selectedOrder.status === 'new' ? "bg-green-500 animate-pulse" : "bg-gray-500")} />
                             <span className="text-sm font-bold uppercase">{selectedOrder.status === 'new' ? 'নতুন' : 'দেখা হয়েছে'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                        <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
                           <span className="text-xs font-bold text-pink-primary uppercase tracking-widest">গ্রাহকের তথ্য</span>
                           <button 
                             onClick={() => {
                               const text = `নাম: ${selectedOrder.name}\nফোন: ${selectedOrder.phone}\nঠিকানা: ${selectedOrder.address}\nপরিমাণ: ${selectedOrder.qty}\nমোট: ${selectedOrder.total}`;
                               navigator.clipboard.writeText(text);
                               alert("পুরো অর্ডার কপি করা হয়েছে!");
                             }}
                             className="text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 hover:bg-blue-400/20"
                           >
                             <CheckCircle2 className="w-3 h-3" /> সব কপি করুন
                           </button>
                        </div>
                        <div className="space-y-4">
                          <div className="flex justify-between group">
                            <div className="flex-1">
                              <div className="text-[10px] text-gray-500 mb-1">নাম</div>
                              <div className="text-lg font-bold text-white">{selectedOrder.name}</div>
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] text-gray-500 mb-1">ফোন</div>
                            <div className="text-lg font-bold text-white font-mono">{selectedOrder.phone}</div>
                          </div>
                          <div>
                            <div className="text-[10px] text-gray-500 mb-1">ঠিকানা</div>
                            <div className="text-sm text-gray-300 leading-relaxed bg-black/20 p-3 rounded-lg border border-white/5 mt-1">
                              {selectedOrder.address}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 bg-gradient-to-br from-pink-900/40 to-pink-primary/20 rounded-2xl border border-pink-primary/20">
                         <div className="flex justify-between items-center text-white">
                            <div>
                               <div className="text-[10px] opacity-60 uppercase font-bold mb-1">পণ্য ও পরিমাণ</div>
                               <div className="text-xl font-bold">{selectedOrder.qty} টি বক্স</div>
                            </div>
                            <div className="text-right">
                               <div className="text-[10px] opacity-60 uppercase font-bold mb-1">মোট বিল</div>
                               <div className="text-2xl font-black text-pink-primary font-mono">৳{selectedOrder.total}</div>
                            </div>
                         </div>
                      </div>

                      <div className="flex gap-4">
                        <button 
                          onClick={() => { markAsViewed(selectedOrder.id); setSelectedOrder(null); }}
                          disabled={selectedOrder.status !== 'new'}
                          className={cn(
                            "flex-1 py-4 rounded-xl font-bold transition-all",
                            selectedOrder.status === 'new' ? "bg-green-600 text-white shadow-lg active:scale-95" : "bg-white/5 text-gray-500 cursor-not-allowed"
                          )}
                        >
                          দেখা হয়েছে হিসেবে মার্ক করুন
                        </button>
                        <button 
                          onClick={() => { deleteOrder(selectedOrder.id); setSelectedOrder(null); }}
                          className="px-6 py-4 bg-red-600/20 text-red-500 border border-red-600/30 rounded-xl hover:bg-red-600 transition-all active:scale-95"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
