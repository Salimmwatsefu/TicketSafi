import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Store, Upload, CheckCircle, Loader2, X, Link, Globe, Image } from 'lucide-react';
import api from '../../api/axios';

const EditStorePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  // State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [instagramLink, setInstagramLink] = useState('');
  const [websiteLink, setWebsiteLink] = useState('');
  
  // Image State
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Fetch existing store data
    api.get(`/api/stores/manage/${id}/`)
       .then(res => {
           const d = res.data;
           setName(d.name);
           setDescription(d.description);
           setInstagramLink(d.instagram_link || '');
           setWebsiteLink(d.website_link || '');
           if(d.logo_image) setLogoPreview(d.logo_image);
           if(d.banner_image) setBannerPreview(d.banner_image);
       })
       .catch(err => {
           console.error(err);
           setError('Failed to load store details.');
       })
       .finally(() => setLoading(false));
  }, [id]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, setFile: any, setPreview: any) => {
    if (e.target.files?.[0]) {
        setFile(e.target.files[0]);
        setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('instagram_link', instagramLink);
        formData.append('website_link', websiteLink);
        if (logoFile) formData.append('logo_image', logoFile);
        if (bannerFile) formData.append('banner_image', bannerFile);

        await api.patch(`/api/stores/manage/${id}/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        navigate('/organizer/stores');
    } catch (err) {
        setError('Failed to update store.');
        setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center pt-20"><Loader2 className="animate-spin text-primary"/></div>;

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <h1 className="text-3xl font-bold text-white mb-8">Edit Storefront</h1>
      
      {error && <div className="p-4 bg-red-500/10 text-red-500 rounded-xl mb-6">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-surface border border-white/10 p-8 rounded-3xl space-y-6">
            <div>
                <label className="block text-xs font-bold text-zinc-500 mb-2">Store Name</label>
                <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none" />
            </div>
            <div>
                <label className="block text-xs font-bold text-zinc-500 mb-2">Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-primary outline-none" />
            </div>
        </div>

        {/* Images */}
        <div className="bg-surface border border-white/10 p-8 rounded-3xl space-y-6">
            <h3 className="font-bold text-white flex items-center"><Image className="w-5 h-5 mr-2 text-secondary"/> Branding</h3>
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold text-zinc-500 mb-2">Logo</label>
                    <div onClick={() => logoInputRef.current?.click()} className="h-40 w-40 rounded-xl border-2 border-dashed border-white/10 cursor-pointer overflow-hidden relative group">
                        {logoPreview ? <img src={logoPreview} className="w-full h-full object-cover" /> : <Upload className="w-6 h-6 text-zinc-500 m-auto top-16 relative" />}
                        <input type="file" ref={logoInputRef} onChange={e => handleFileSelect(e, setLogoFile, setLogoPreview)} className="hidden" />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-zinc-500 mb-2">Banner</label>
                    <div onClick={() => bannerInputRef.current?.click()} className="h-40 w-full rounded-xl border-2 border-dashed border-white/10 cursor-pointer overflow-hidden relative group">
                        {bannerPreview ? <img src={bannerPreview} className="w-full h-full object-cover" /> : <Upload className="w-6 h-6 text-zinc-500 m-auto top-16 relative" />}
                        <input type="file" ref={bannerInputRef} onChange={e => handleFileSelect(e, setBannerFile, setBannerPreview)} className="hidden" />
                    </div>
                </div>
            </div>
        </div>

        <button type="submit" disabled={saving} className="w-full py-4 rounded-xl bg-primary font-bold text-white hover:bg-primary-hover transition-colors flex justify-center items-center">
            {saving ? <Loader2 className="animate-spin"/> : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default EditStorePage;