"use client";

import { useState, Dispatch, SetStateAction } from 'react';
import {
  Search,
  Clock, Calendar, Upload, FileText
} from 'lucide-react';
import NewsTypeSelector from './NewsTypeSelector';
import LocationSelector from './LocationSelector';
import TagInput from './TagInput';
import ImageUploader from './ImageUploader';
import VideoEmbedder from './VideoEmbedder';
import ContributorSelector from './ContributorSelector';
import SourceInput from './SourceInput';
import SEOPanel from './SEOPanel';
import { NewsType, ArticleData, ArticleImage, Contributor, Event } from './types';
import type { LucideIcon } from 'lucide-react';


interface SidebarProps {
  onPublish: (_metadata: ArticleData) => void;
  isPublishing: boolean;

  // State Props
  category: string;
  setCategory: (val: string) => void;
  newsType: NewsType;
  setNewsType: (val: NewsType) => void;
  location: string;
  setLocation: (val: string) => void;
  tags: string[];
  setTags: (val: string[]) => void;
  keywords: string[];
  setKeywords: (val: string[]) => void;

  // Media
  images: ArticleImage[];
  setImages: Dispatch<SetStateAction<ArticleImage[]>>;
  videoUrl: string;
  setVideoUrl: (val: string) => void;

  // Attribution
  contributors: Contributor[];
  setContributors: (val: Contributor[]) => void;
  source: string;
  setSource: (val: string) => void;
  sourceUrl: string;
  setSourceUrl: (val: string) => void;

  // SEO
  seoTitle: string;
  setSeoTitle: (val: string) => void;
  seoDescription: string;
  setSeoDescription: (val: string) => void;
  canonicalUrl: string;
  setCanonicalUrl: (val: string) => void;
  onGenerateSEO?: () => void;
  isGeneratingAI?: boolean;

  // Events
  events: Event[];
  eventId: string;
  setEventId: (val: string) => void;

  // Publication
  status: 'draft' | 'published' | 'archived' | 'scheduled';
  setStatus: (val: 'draft' | 'published' | 'archived' | 'scheduled') => void;
  publishedAt: string;
  setPublishedAt: (val: string) => void;
  scheduledAt: string;
  setScheduledAt: (val: string) => void;
}

type Tab = 'publishing' | 'media' | 'details' | 'seo';

export default function Sidebar({ 
    onPublish: _onPublish, 
    isPublishing: _isPublishing, 
    category, 
    setCategory,
    newsType,
    setNewsType,
    location,
    setLocation,
    tags,
    setTags,
    keywords,
    setKeywords,
    images,
    setImages,
    videoUrl,
    setVideoUrl,
    contributors,
    setContributors,
    source,
    setSource,
    sourceUrl,
    setSourceUrl,
    seoTitle,
    setSeoTitle,
    seoDescription,
    setSeoDescription,
    canonicalUrl,
    setCanonicalUrl,
    onGenerateSEO,
    isGeneratingAI,
    events,
    eventId,
    setEventId,
    status,
    setStatus,
    publishedAt,
    setPublishedAt,
    scheduledAt: _scheduledAt,
    setScheduledAt: _setScheduledAt,
}: SidebarProps) {
  const [activeTab, setActiveTab] = useState<Tab>('publishing');
  
  const tabs: { id: Tab; label: string; icon: LucideIcon }[] = [
      { id: 'publishing', label: 'Publication', icon: Calendar },
      { id: 'media', label: 'Media Assets', icon: Upload },
      { id: 'details', label: 'Details & Tags', icon: FileText },
      { id: 'seo', label: 'SEO Config', icon: Search }
  ];

  return (
    <div className="w-full bg-slate-50 border-b border-gray-200 shadow-sm relative z-10 hidden md:block">
      <div className="max-w-screen-2xl mx-auto">
          {/* Header & Tabs */}
          <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100 bg-white/50 backdrop-blur-xl sticky top-0">
              <div className="inline-flex p-1 bg-gray-100/80 rounded-xl gap-1 border border-gray-200/50">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                      activeTab === tab.id 
                        ? 'bg-white text-black shadow-sm ring-1 ring-black/5 scale-[1.02]' 
                        : 'text-gray-500 hover:text-gray-900 hover:bg-black/5'
                    }`}
                  >
                    <tab.icon size={14} className={activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'} />
                    {tab.label}
                  </button>
                ))}
              </div>
              
              <div className="text-xs text-gray-400 font-medium uppercase tracking-wider hidden sm:block">
                  Control Center
              </div>
          </div>

          {/* Content Area */}
          <div className="p-6 md:p-8 min-h-[300px] bg-white">
            <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-top-1 duration-300">
                
                {/* TAB 1: PUBLISHING */}
                {activeTab === 'publishing' && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                        <div className="md:col-span-4 space-y-6">
                             <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <FileText size={14} /> News Type
                                </h3>
                                <NewsTypeSelector value={newsType} onChange={setNewsType} />
                             </div>

                             <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100">
                                <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Calendar size={14} /> Special Event
                                </h3>
                                <select 
                                    value={eventId} 
                                    onChange={(e) => setEventId(e.target.value)}
                                    className="w-full p-3 bg-white border border-blue-200 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm text-blue-900"
                                >
                                    <option value="">None</option>
                                    {events.map((event) => (
                                        <option key={event.id} value={event.id}>
                                            {event.title}
                                        </option>
                                    ))}
                                </select>
                             </div>
                        </div>

                            <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Category</h3>
                                <select 
                                    value={category} 
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                                >
                                    <option value="">Select Category...</option>
                                    
                                    {/* খেলা (Sports) */}
                                    <optgroup label="খেলা (Sports)">
                                        <option value="খেলা">খেলা (Parent)</option>
                                        <option value="ক্রিকেট">ক্রিকেট</option>
                                        <option value="ফুটবল">ফুটবল</option>
                                        <option value="টেনিস">টেনিস</option>
                                        <option value="গলফ">গলফ</option>
                                        <option value="ব্যাডমিন্টন">ব্যাডমিন্টন</option>
                                        <option value="বিবিধ">বিবিধ</option>
                                    </optgroup>
                                    
                                    {/* বিনোদন (Entertainment) */}
                                    <optgroup label="বিনোদন (Entertainment)">
                                        <option value="বিনোদন">বিনোদন (Parent)</option>
                                        <option value="বলিউড">বলিউড</option>
                                        <option value="হলিউড">হলিউড</option>
                                        <option value="ঢালিউড">ঢালিউড</option>
                                        <option value="টেলিভিশন">টেলিভিশন</option>
                                        <option value="মিউজিক">মিউজিক</option>
                                        <option value="ওটিটি">ওটিটি</option>
                                    </optgroup>
                                    
                                    {/* রাজনীতি (Politics) */}
                                    <optgroup label="রাজনীতি (Politics)">
                                        <option value="রাজনীতি">রাজনীতি (Parent)</option>
                                        <option value="আওয়ামী লীগ">আওয়ামী লীগ</option>
                                        <option value="বিএনপি">বিএনপি</option>
                                        <option value="জাতীয় পার্টি">জাতীয় পার্টি</option>
                                        <option value="নির্বাচন">নির্বাচন</option>
                                    </optgroup>

                                    <div className="bg-amber-50 p-5 rounded-xl border border-amber-100 mt-6">
                                        <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <Clock size={14} /> Scheduling & Status
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-[10px] font-bold text-amber-800 uppercase mb-1">Status</label>
                                                <select 
                                                    value={status}
                                                    onChange={(e) => setStatus(e.target.value as 'draft' | 'published' | 'archived' | 'scheduled')}
                                                    className="w-full p-2 bg-white border border-amber-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500/20"
                                                >
                                                    <option value="draft">Draft</option>
                                                    <option value="published">Published</option>
                                                    <option value="scheduled">Scheduled</option>
                                                    <option value="archived">Archived</option>
                                                </select>
                                            </div>
                                            
                                            <div>
                                                <label className="block text-[10px] font-bold text-amber-800 uppercase mb-1">Publication Date</label>
                                                <input 
                                                    type="datetime-local"
                                                    value={publishedAt}
                                                    onChange={(e) => setPublishedAt(e.target.value)}
                                                    className="w-full p-2 bg-white border border-amber-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500/20"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* অর্থনীতি (Economics) */}
                                    <optgroup label="অর্থনীতি (Economics)">
                                        <option value="অর্থনীতি">অর্থনীতি (Parent)</option>
                                        <option value="শিল্প-বাণিজ্য">শিল্প-বাণিজ্য</option>
                                        <option value="শেয়ারবাজার">শেয়ারবাজার</option>
                                        <option value="ব্যাংক-বীমা">ব্যাংক-বীমা</option>
                                        <option value="বাজেট">বাজেট</option>
                                    </optgroup>
                                    
                                    {/* বিশ্ব (World) */}
                                    <optgroup label="বিশ্ব (World)">
                                        <option value="বিশ্ব">বিশ্ব (Parent)</option>
                                        <option value="ইউরোপ">ইউরোপ</option>
                                        <option value="আমেরিকা">আমেরিকা</option>
                                        <option value="মধ্যপ্রাচ্য">মধ্যপ্রাচ্য</option>
                                        <option value="যুদ্ধ-সংঘাত">যুদ্ধ-সংঘাত</option>
                                    </optgroup>
                                    
                                    {/* প্রযুক্তি (Technology) */}
                                    <optgroup label="প্রযুক্তি (Technology)">
                                        <option value="প্রযুক্তি">প্রযুক্তি (Parent)</option>
                                        <option value="গ্যাজেট">গ্যাজেট</option>
                                        <option value="সোশ্যাল মিডিয়া">সোশ্যাল মিডিয়া</option>
                                        <option value="আইটি খাত">আইটি খাত</option>
                                        <option value="বিজ্ঞান">বিজ্ঞান</option>
                                    </optgroup>
                                    
                                    {/* জীবনযাপন (Lifestyle) */}
                                    <optgroup label="জীবনযাপন (Lifestyle)">
                                        <option value="জীবনযাপন">জীবনযাপন (Parent)</option>
                                        <option value="ফ্যাশন">ফ্যাশন</option>
                                        <option value="খাবার">খাবার</option>
                                        <option value="ভ্রমণ">ভ্রমণ</option>
                                        <option value="স্বাস্থ্য টিপস">স্বাস্থ্য টিপস</option>
                                    </optgroup>
                                    
                                    {/* শিক্ষা (Education) */}
                                    <optgroup label="শিক্ষা (Education)">
                                        <option value="শিক্ষা">শিক্ষা (Parent)</option>
                                        <option value="ক্যাম্পাস">ক্যাম্পাস</option>
                                        <option value="ভর্তি">ভর্তি</option>
                                        <option value="পরীক্ষা ও ফল">পরীক্ষা ও ফল</option>
                                        <option value="বৃত্তি">বৃত্তি</option>
                                    </optgroup>
                                    
                                    {/* অপরাধ (Crime) */}
                                    <optgroup label="অপরাধ (Crime)">
                                        <option value="অপরাধ">অপরাধ (Parent)</option>
                                        <option value="খুন">খুন</option>
                                        <option value="দুর্নীতি">দুর্নীতি</option>
                                        <option value="ধর্ষণ">ধর্ষণ</option>
                                        <option value="আদালত">আদালত</option>
                                    </optgroup>
                                    
                                    {/* রাজধানী (Capital) */}
                                    <optgroup label="রাজধানী (Capital)">
                                        <option value="রাজধানী">রাজধানী (Parent)</option>
                                        <option value="উত্তর সিটি">উত্তর সিটি</option>
                                        <option value="দক্ষিণ সিটি">দক্ষিণ সিটি</option>
                                        <option value="যানজট">যানজট</option>
                                    </optgroup>
                                    
                                    {/* বাংলাদেশ (Bangladesh) */}
                                    <optgroup label="বাংলাদেশ (Bangladesh)">
                                        <option value="বাংলাদেশ">বাংলাদেশ (Parent)</option>
                                        <option value="আইন ও বিচার">আইন ও বিচার</option>
                                        <option value="স্বাস্থ্য">স্বাস্থ্য</option>
                                        <option value="কৃষি">কৃষি</option>
                                        <option value="পরিবেশ">পরিবেশ</option>
                                    </optgroup>
                                    
                                    {/* মতামত (Opinion) */}
                                    <optgroup label="মতামত (Opinion)">
                                        <option value="মতামত">মতামত (Parent)</option>
                                        <option value="সাক্ষাৎকার">সাক্ষাৎকার</option>
                                        <option value="চতুরঙ্গ">চতুরঙ্গ</option>
                                        <option value="মুক্তমঞ্চ">মুক্তমঞ্চ</option>
                                        <option value="সম্পাদকীয়">সম্পাদকীয়</option>
                                    </optgroup>
                                </select>
                            </div>

                        <div className="md:col-span-4 space-y-6">
                            <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Location</h3>
                                <LocationSelector value={location} onChange={setLocation} />
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 2: MEDIA */}
                {activeTab === 'media' && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                        <div className="md:col-span-8">
                            <div className="bg-white rounded-xl border-dashed border-2 border-gray-200 p-6 h-full">
                                <h3 className="text-sm font-bold text-gray-900 mb-4">Featured Images & Gallery</h3>
                                <ImageUploader 
                                  images={images} 
                                  onImagesChange={setImages}
                                  maxImages={10}
                                />
                            </div>
                        </div>
                        <div className="md:col-span-4">
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 h-full">
                                <h3 className="text-sm font-bold text-gray-900 mb-4">Video Embed</h3>
                                <VideoEmbedder 
                                  value={videoUrl}
                                  onChange={setVideoUrl}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 3: DETAILS */}
                {activeTab === 'details' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                         <div className="space-y-8">
                             <div>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Attribution</h3>
                                <ContributorSelector 
                                    contributors={contributors} 
                                    onChange={setContributors} 
                                />
                             </div>
                             
                             <div className="pt-8 border-t border-gray-100">
                                <SourceInput 
                                    source={source} 
                                    sourceUrl={sourceUrl}
                                    onSourceChange={setSource}
                                    onUrlChange={setSourceUrl}
                                />
                             </div>
                         </div>

                         <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                             <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Tags & Topics</h3>
                             <TagInput 
                                value={tags} 
                                onChange={setTags} 
                                label="Article Tags"
                                placeholder="Add tags..."
                             />
                             <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                                Add relevant tags to improve content discovery. Press Enter to add.
                             </p>
                         </div>
                    </div>
                )}

                {/* TAB 4: SEO */}
                {activeTab === 'seo' && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                        <div className="md:col-span-7">
                            <SEOPanel 
                                title={seoTitle}
                                onTitleChange={setSeoTitle}
                                description={seoDescription}
                                onDescriptionChange={setSeoDescription}
                                slug={''} 
                                canonicalUrl={canonicalUrl}
                                onCanonicalUrlChange={setCanonicalUrl}
                                onGenerateSEO={onGenerateSEO}
                                isGenerating={isGeneratingAI}
                            />
                        </div>
                        
                        <div className="md:col-span-5">
                            <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
                                <h3 className="text-sm font-bold text-blue-900 mb-4 flex items-center gap-2">
                                    <Search size={16} /> Meta Keywords
                                </h3>
                                <TagInput 
                                  value={keywords} 
                                  onChange={setKeywords}
                                  label=""
                                  placeholder="Add keywords..."
                                />
                                <div className="mt-4 p-4 bg-white/60 rounded-lg text-xs text-blue-800 leading-relaxed">
                                    <strong>Why Keywords?</strong> Although Google doesn&apos;t strictly use meta keywords for ranking, they can be helpful for other search engines and internal tagging systems.
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
          </div>
      </div>
    </div>
  );
}
