import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Globe, Instagram, ShoppingBag, Calendar, Loader2, Store as StoreIcon, Crown, Download, Lock } from 'lucide-react';
import api from '../api/axios';
import EventCard from '../components/EventCard';

const StorePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Tab State
  const [activeTab, setActiveTab] = useState('events');

  useEffect(() => {
    api.get(`/api/stores/${slug}/`)
       .then(res => setStore(res.data))
       .catch(() => navigate('/'))
       .finally(() => setLoading(false));
  }, [slug, navigate]);

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary w-8 h-8"/></div>;

  const tabs = [
      { id: 'events', label: 'Events', icon: Calendar },
      { id: 'merch', label: 'Merch', icon: ShoppingBag },
      { id: 'membership', label: 'Membership', icon: Crown },
      { id: 'digital', label: 'Digital', icon: Download },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
       {/* Banner */}
       <div className="h-64 md:h-80 relative w-full overflow-hidden">
           {store.banner_image ? (
               <img src={store.banner_image} className="w-full h-full object-cover" alt="Banner" />
           ) : (
               <div className="w-full h-full bg-zinc-800 relative">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
               </div>
           )}
           <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
       </div>

       <div className="max-w-7xl mx-auto px-6 -mt-24 relative z-10">
           
           {/* --- PROFILE HEADER --- */}
           <div className="flex flex-col md:flex-row items-end md:items-start gap-6 mb-10">
               {/* Logo */}
               <div className="w-32 h-32 md:w-48 md:h-48 rounded-3xl bg-black border-4 border-surface shadow-2xl overflow-hidden shrink-0 relative z-20">
                   {store.logo_image ? (
                       <img src={store.logo_image} className="w-full h-full object-cover" alt="Logo" />
                   ) : (
                       <div className="w-full h-full flex items-center justify-center text-zinc-700"><StoreIcon className="w-12 h-12" /></div>
                   )}
               </div>
               
               <div className="flex-1 pb-2 text-center md:text-left">
                   <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-3 shadow-black drop-shadow-lg">{store.name}</h1>
                   <p className="text-zinc-300 max-w-2xl text-lg leading-relaxed drop-shadow-md mx-auto md:mx-0">{store.description}</p>
                   
                   {/* Socials */}
                   <div className="flex gap-3 mt-6 justify-center md:justify-start">
                       {store.instagram_link && (
                           <a href={store.instagram_link} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-pink-500 hover:text-white hover:border-pink-500 transition-all backdrop-blur-md group">
                               <Instagram className="w-5 h-5" />
                           </a>
                       )}
                       {store.website_link && (
                           <a href={store.website_link} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all backdrop-blur-md group">
                               <Globe className="w-5 h-5" />
                           </a>
                       )}
                   </div>
               </div>
           </div>

           {/* --- MODERN TABS --- */}
          
           <div className="mb-10 border-b border-white/10">
               <div className="flex justify-start md:justify-start overflow-x-auto no-scrollbar px-6 -mx-6 md:px-0 md:mx-0 gap-8">
                   {tabs.map((tab) => {
                       const isActive = activeTab === tab.id;
                       return (
                           <button
                               key={tab.id}
                               onClick={() => setActiveTab(tab.id)}
                               className={`relative pb-4 px-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap shrink-0 ${
                                   isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                               }`}
                           >
                               <tab.icon className={`w-4 h-4 ${isActive ? 'text-primary' : ''}`} />
                               {tab.label}
                               {isActive && (
                                   <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-secondary shadow-[0_0_10px_rgba(236,72,153,0.5)]" />
                               )}
                           </button>
                       );
                   })}
               </div>
           </div>

           {/* --- TAB CONTENT --- */}
           <div className="min-h-[400px] animate-fade-in">
               
               {/* 1. EVENTS TAB */}
               {activeTab === 'events' && (
                   <div>
                       {store.events && store.events.length > 0 ? (
                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                               {store.events.map((event: any) => (
                                   <EventCard 
                                       key={event.id} 
                                       event={{
                                           ...event,
                                           date: new Date(event.start_datetime).toLocaleDateString(),
                                           imageUrl: event.poster_image,
                                           location: event.location_name,
                                           price: `KES ${event.lowest_price}`,
                                           category: event.category
                                       }} 
                                       onPress={() => navigate(`/event/${event.id}`)} 
                                   />
                               ))}
                           </div>
                       ) : (
                           <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5">
                               <Calendar className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                               <p className="text-zinc-500 font-medium">No upcoming events listed.</p>
                           </div>
                       )}
                   </div>
               )}

               {/* 2, 3, 4. COMING SOON PLACEHOLDERS */}
               {['merch', 'membership', 'digital'].includes(activeTab) && (
                   <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-surface p-12 md:p-20 text-center group">
                       
                       {/* Background Animation */}
                       <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5"></div>
                       <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 animate-spin-slow opacity-50 blur-3xl pointer-events-none" />

                       <div className="relative z-10 flex flex-col items-center">
                           <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-500">
                               {activeTab === 'merch' && <ShoppingBag className="w-8 h-8 text-zinc-400" />}
                               {activeTab === 'membership' && <Crown className="w-8 h-8 text-zinc-400" />}
                               {activeTab === 'digital' && <Download className="w-8 h-8 text-zinc-400" />}
                           </div>
                           
                           <h3 className="text-2xl font-heading font-bold text-white mb-2">
                               {activeTab === 'merch' && "Official Merch Store"}
                               {activeTab === 'membership' && "Exclusive Memberships"}
                               {activeTab === 'digital' && "Digital Downloads"}
                           </h3>
                           
                           <p className="text-zinc-400 max-w-md mx-auto mb-8">
                               {activeTab === 'merch' && "Grab exclusive drops, apparel, and accessories directly from the creator."}
                               {activeTab === 'membership' && "Join the inner circle for early access tickets, discounts, and premium content."}
                               {activeTab === 'digital' && "Download DJ mixes, high-res photo packs, and exclusive digital assets."}
                           </p>

                           <div className="inline-flex items-center px-4 py-2 bg-black/50 backdrop-blur-md border border-white/10 rounded-full text-xs font-bold uppercase tracking-widest text-zinc-500">
                               <Lock className="w-3 h-3 mr-2" />
                               Launching Soon
                           </div>
                       </div>
                   </div>
               )}

           </div>
       </div>
    </div>
  );
};

export default StorePage;