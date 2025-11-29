import React, { useState, useEffect } from 'react';
import {
    Camera, Heart, Calendar, MapPin, ChevronRight, X, Menu, Maximize2, Plane, Ticket,
    ArrowRight, Compass, Cloud, Image as ImageIcon, LayoutDashboard, Plus, Trash2,
    Upload, Loader2, Edit3, LogOut, Folder, ArrowLeft, CheckSquare, Square, Lock, Home
} from 'lucide-react';

// ==========================================
// 1. 全局配置与数据层 (Data Layer)
// ==========================================

// !!! 核心开关 !!!
// true: 使用浏览器内存模拟数据 (无需后端即可体验所有功能)
// false: 连接真实 Spring Boot 后端 (http://localhost:8080)
const USE_MOCK_DATA = true;
const API_BASE = 'http://localhost:8080/api';

const CONFIG = {
    names: "Alex & Luna",
    startDate: "2022-05-20",
    heroTitle: "陪你走过的四季",
    heroSubtitle: "世界很大，但我的镜头里只有你。",
};

const CATEGORIES = ["全部", "旅行", "日常", "纪念日", "美食"];

// --- 初始化模拟数据 (适配你的前端字段) ---
const INITIAL_DB = {
    albums: [
        { id: 1, title: '默认相册', count: 13, description: '所有照片' }
    ],
    // 使用你提供的 PHOTO_DATA 作为初始数据
    photos: [
        { id: 1, url: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80", category: "旅行", location: "Paris", title: "巴黎街头", author: "2023.10.05", albumId: 1 },
        { id: 2, url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80", category: "日常", location: "Home", title: "你的侧脸", author: "2023.11.12", albumId: 1 },
        { id: 3, url: "https://images.unsplash.com/photo-1517867065872-72a53d41a847?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80", category: "纪念日", location: "Home", title: "一周年快乐", author: "2022.05.20", albumId: 1 },
        { id: 4, url: "https://images.unsplash.com/photo-1496345885665-81c818191636?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80", category: "旅行", location: "Sanya", title: "海边日落", author: "2023.08.15", albumId: 1 },
        { id: 5, url: "https://images.unsplash.com/photo-1621621667797-e06afc217fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80", category: "美食", location: "Home", title: "第一次做饭", author: "2023.02.14", albumId: 1 },
        { id: 6, url: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80", category: "日常", location: "Home", title: "周末赖床", author: "2024.01.20", albumId: 1 },
        { id: 7, url: "https://images.unsplash.com/photo-1513279922550-250c2129b13a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80", category: "纪念日", location: "Home", title: "圣诞惊喜", author: "2023.12.25", albumId: 1 },
        { id: 8, url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80", category: "旅行", location: "Sanya", title: "那个夏天", author: "2022.07.30", albumId: 1 },
        { id: 9, url: "https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80", category: "日常", location: "Shanghai", title: "图书馆", author: "2023.09.10", albumId: 1 },
        { id: 10, url: "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80", category: "美食", location: "Tokyo", title: "最爱的咖啡店", author: "2023.03.15", albumId: 1 },
        { id: 11, url: "https://images.unsplash.com/photo-1524613032530-449a5d94c285?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80", category: "旅行", location: "Tokyo", title: "涩谷路口", author: "2023.04.02", albumId: 1 },
        { id: 12, url: "https://images.unsplash.com/photo-1499856871940-a09627c6dcf6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80", category: "旅行", location: "Paris", title: "塞纳河畔", author: "2023.10.04", albumId: 1 },
        { id: 13, url: "https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80", category: "旅行", location: "Shanghai", title: "外滩夜景", author: "2022.09.11", albumId: 1 },
    ],
    // 使用你提供的 FOOTPRINTS 作为初始数据
    footprints: [
        { id: 1, city: "Tokyo", country: "Japan", date: "2023.04.01 - 2023.04.07", code: "HND", weather: "18°C Sunny", img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80", title: "樱花树下的约定", desc: "在目黑川看夜樱，人很多，但你回头的瞬间，世界好像安静了。吃了最好吃的拉面，在中古店淘到了你喜欢的唱片。每一片飘落的花瓣都像是我们许下的愿望。", coords: "35.6762° N, 139.6503° E" },
        { id: 2, city: "Paris", country: "France", date: "2023.10.02 - 2023.10.09", code: "CDG", weather: "12°C Rainy", img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80", title: "午夜巴黎", desc: "虽然在这个浪漫之都丢了地铁票，但在塞纳河游船上看到的埃菲尔铁塔闪灯真的太美了。下次一定要去卢浮宫，也要再去那家街角的咖啡馆坐一下午。", coords: "48.8566° N, 2.3522° E" },
        { id: 3, city: "Sanya", country: "China", date: "2024.01.15 - 2024.01.20", code: "SYX", weather: "26°C Clear", img: "https://images.unsplash.com/photo-1589710883204-711c42289c09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80", title: "逃离冬天的海岛", desc: "在海边躺平的一周。每天就是看海、吃椰子鸡、散步。你说这是我们最放松的一次旅行。海风吹过的时候，感觉时间都慢下来了。", coords: "18.2528° N, 109.5120° E" },
        { id: 4, city: "Shanghai", country: "China", date: "2022.09.10 - 2022.09.12", code: "SHA", weather: "22°C Cloudy", img: "https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80", title: "初次旅行", desc: "一切的开始。外滩的风很大，我们走了很久很久，聊了很多关于未来的话题。那时候的我们还很青涩，手牵手走过南京路的时候，心跳得很快。", coords: "31.2304° N, 121.4737° E" },
    ]
};

// 内存数据库，用于 Mock 模式
let MockDB = JSON.parse(JSON.stringify(INITIAL_DB));

// --- API 请求封装 ---
const api = {
    async get(endpoint) {
        if (USE_MOCK_DATA) {
            await new Promise(r => setTimeout(r, 300));
            if (endpoint === '/albums') return MockDB.albums;
            if (endpoint === '/photos') return { records: MockDB.photos };
            if (endpoint.startsWith('/photos?albumId=')) {
                const albumId = parseInt(endpoint.split('=')[1]);
                return { records: MockDB.photos.filter(p => p.albumId === albumId) };
            }
            if (endpoint === '/footprints') return MockDB.footprints;
            return [];
        }
        const token = localStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        const res = await fetch(`${API_BASE}${endpoint}`, { headers });
        return res.json();
    },

    async post(endpoint, body) {
        if (USE_MOCK_DATA) {
            await new Promise(r => setTimeout(r, 500));
            if (endpoint === '/auth/login') {
                const { username, password } = JSON.parse(body);
                if (username === 'admin' && password === 'admin') return { token: 'mock-jwt-token-123' };
                throw new Error('Invalid credentials');
            }
            if (endpoint === '/albums') {
                const newAlbum = { id: Date.now(), count: 0, ...JSON.parse(body) };
                MockDB.albums.push(newAlbum);
                return newAlbum;
            }
            if (endpoint === '/photos/upload') {
                const file = body.get('file');
                const albumId = parseInt(body.get('albumId'));
                const newPhoto = {
                    id: Date.now(), albumId,
                    url: URL.createObjectURL(file),
                    title: file.name,
                    category: '日常', location: 'New', author: new Date().toLocaleDateString()
                };
                MockDB.photos.unshift(newPhoto);
                const album = MockDB.albums.find(a => a.id === albumId);
                if(album) album.count++;
                return true;
            }
            if (endpoint === '/footprints') {
                const newItem = { id: Date.now(), ...JSON.parse(body) };
                MockDB.footprints.unshift(newItem);
                return true;
            }
            return {};
        }
        const headers = {
            ...(body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        };
        const res = await fetch(`${API_BASE}${endpoint}`, { method: 'POST', headers, body });
        if (!res.ok) throw new Error('API Error');
        return res.json();
    },

    async delete(endpoint, body) {
        if (USE_MOCK_DATA) {
            if (endpoint === '/photos/batch') {
                const ids = JSON.parse(body);
                MockDB.photos = MockDB.photos.filter(p => !ids.includes(p.id));
                return true;
            }
            if (endpoint.startsWith('/footprints/')) {
                const id = parseInt(endpoint.split('/').pop());
                MockDB.footprints = MockDB.footprints.filter(f => f.id !== id);
                return true;
            }
        }
        const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` };
        await fetch(`${API_BASE}${endpoint}`, { method: 'DELETE', headers, body });
    }
};

// ==========================================
// 2. 根组件 (App) - 负责视图切换
// ==========================================
export default function App() {
    const [view, setView] = useState('display'); // 'display' | 'admin'

    // 支持通过 URL hash 直接进入后台 (e.g. localhost:5173/#admin)
    useEffect(() => {
        if (window.location.hash === '#admin') setView('admin');
    }, []);

    return (
        <>
            {view === 'display' ? (
                <DisplayApp onSwitchToAdmin={() => setView('admin')} />
            ) : (
                <AdminApp onSwitchToDisplay={() => setView('display')} />
            )}
        </>
    );
}

// ==========================================
// 3. 展示端 (DisplayApp)
// ==========================================
function DisplayApp({ onSwitchToAdmin }) {
    const [currentPage, setCurrentPage] = useState('home');
    const [loading, setLoading] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);
    const [daysTogether, setDaysTogether] = useState(0);

    // 动态数据 (从 MockDB/Backend 获取)
    const [photos, setPhotos] = useState([]);
    const [footprints, setFootprints] = useState([]);

    const [galleryFilter, setGalleryFilter] = useState("全部");
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedFootprint, setSelectedFootprint] = useState(null);

    useEffect(() => {
        const init = async () => {
            const start = new Date(CONFIG.startDate);
            setDaysTogether(Math.floor((new Date() - start) / (1000 * 60 * 60 * 24)));

            // 并行获取数据
            const [pData, fData] = await Promise.all([
                api.get('/photos'),
                api.get('/footprints')
            ]);
            setPhotos(pData.records || []);
            setFootprints(fData || []);
            setLoading(false);
        };
        init();
    }, []);

    const handleNavClick = (page) => {
        setCurrentPage(page);
        setMenuOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (page === 'gallery') setGalleryFilter('全部');
    };

    const handleJumpToGallery = (city) => {
        setSelectedFootprint(null);
        setGalleryFilter('全部');
        setCurrentPage('gallery');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) {
        return (
            <div className="h-screen w-full bg-black flex flex-col items-center justify-center text-white z-50 fixed inset-0">
                <div className="relative">
                    <Heart className="w-16 h-16 animate-pulse text-red-500 opacity-80" />
                    <div className="absolute inset-0 bg-red-500 opacity-20 blur-xl animate-pulse"></div>
                </div>
                <h2 className="mt-8 text-xl font-light tracking-[0.5em] uppercase animate-pulse">{CONFIG.names}</h2>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-red-500 selection:text-white">

            {/* 全局导航栏 */}
            <nav className="fixed top-0 w-full z-40 bg-black/80 backdrop-blur-xl border-b border-white/10 py-4">
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <div className="flex items-center gap-2 group cursor-pointer" onClick={() => handleNavClick('home')}>
                        <div className="relative">
                            <Camera className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors" />
                            <Heart className="w-3 h-3 text-red-500 absolute -top-1 -right-1 fill-red-500 animate-pulse" />
                        </div>
                        <span className="text-xl font-bold tracking-tighter uppercase group-hover:tracking-widest transition-all duration-300">{CONFIG.names}</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <NavButton active={currentPage === 'home'} onClick={() => handleNavClick('home')}>首页</NavButton>
                        <NavButton active={currentPage === 'footprints'} onClick={() => handleNavClick('footprints')}>足迹</NavButton>
                        <NavButton active={currentPage === 'gallery'} onClick={() => handleNavClick('gallery')}>相册</NavButton>
                        <div className="px-4 py-1.5 border border-white/10 rounded-full text-xs font-mono text-gray-400">
                            Day <span className="text-red-400 font-bold">{daysTogether}</span>
                        </div>
                    </div>

                    <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {menuOpen && (
                    <div className="md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-xl border-b border-white/10 py-8 px-6 flex flex-col gap-6 animate-in slide-in-from-top-10">
                        <button onClick={() => handleNavClick('home')} className="text-xl font-light hover:text-red-400 text-left transition-colors">首页</button>
                        <button onClick={() => handleNavClick('footprints')} className="text-xl font-light hover:text-red-400 text-left transition-colors">足迹</button>
                        <button onClick={() => handleNavClick('gallery')} className="text-xl font-light hover:text-red-400 text-left transition-colors">相册</button>
                        <div className="text-sm text-gray-500 pt-4 border-t border-white/10">Together for {daysTogether} days</div>
                    </div>
                )}
            </nav>

            {/* 页面内容区域 */}
            <main className="pt-20 min-h-screen">
                {currentPage === 'home' && <HomePage setPage={handleNavClick} />}
                {currentPage === 'footprints' && <FootprintsPage data={footprints} onCardClick={setSelectedFootprint} />}
                {currentPage === 'gallery' && <GalleryPage data={photos} onImageClick={setSelectedImage} filter={galleryFilter} setFilter={setGalleryFilter} />}
            </main>

            {/* Footer & Admin Entry */}
            <footer className="py-12 border-t border-white/10 text-center text-gray-600 text-xs">
                <p className="mb-2">Made with <Heart className="w-3 h-3 inline text-red-800" /> for Us.</p>
                <button onClick={onSwitchToAdmin} className="mt-4 px-4 py-1 border border-white/10 rounded-full hover:bg-white/10 hover:text-white transition-all flex items-center gap-2 mx-auto">
                    <Lock className="w-3 h-3" /> <span className="uppercase tracking-widest text-[10px]">Admin Login</span>
                </button>
            </footer>

            {/* Modals */}
            {selectedFootprint && (
                <FootprintModal
                    footprint={selectedFootprint}
                    allPhotos={photos}
                    onClose={() => setSelectedFootprint(null)}
                    onImageClick={setSelectedImage}
                    onJumpToGallery={handleJumpToGallery}
                />
            )}

            {selectedImage && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/98 backdrop-blur-xl p-4 md:p-12 animate-in fade-in duration-300" onClick={() => setSelectedImage(null)}>
                    <button className="absolute top-6 right-6 p-2 text-white/50 hover:text-white transition-colors z-50 hover:rotate-90 duration-300" onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}>
                        <X className="w-8 h-8" />
                    </button>
                    <div className="relative max-w-full max-h-full flex flex-col items-center" onClick={e => e.stopPropagation()}>
                        <img src={selectedImage.url} alt={selectedImage.title} className="max-h-[80vh] max-w-full object-contain shadow-2xl rounded-sm" />
                        <div className="mt-6 text-center">
                            <h3 className="text-2xl font-bold text-white mb-1">{selectedImage.title}</h3>
                            <p className="text-gray-400 font-light text-sm tracking-widest uppercase">
                                {selectedImage.author} · {selectedImage.location || selectedImage.category}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* 全局样式 */}
            <style>{`
        @keyframes sublte-zoom { 0% { transform: scale(1.05); } 50% { transform: scale(1.1); } 100% { transform: scale(1.05); } }
        .animate-subtle-zoom { animation: sublte-zoom 20s infinite ease-in-out; }
        @keyframes slide-up { 0% { transform: translateY(30px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
        .animate-slide-up { animation: slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #000; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
      `}</style>
        </div>
    );
}

// --- Display Sub-Components ---

function NavButton({ active, onClick, children }) {
    return (
        <button onClick={onClick} className={`text-sm font-medium transition-all duration-300 relative group ${active ? 'text-white' : 'text-gray-400 hover:text-white'}`}>
            {children}
            <span className={`absolute -bottom-2 left-0 h-[2px] bg-red-500 transition-all duration-300 ${active ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
        </button>
    );
}

function HomePage({ setPage }) {
    return (
        <div className="h-[calc(100vh-80px)] relative flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
                <img src="https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" alt="Couple Background" className="w-full h-full object-cover opacity-50 animate-subtle-zoom" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            </div>
            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                <div className="mb-6 flex justify-center opacity-0 animate-slide-up">
                    <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs tracking-[0.3em] uppercase text-gray-200 border border-white/10 shadow-lg">Est. {CONFIG.startDate}</span>
                </div>
                <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 animate-slide-up delay-100">{CONFIG.heroTitle}</h1>
                <p className="text-lg md:text-xl text-gray-300 font-light max-w-2xl mx-auto mb-12 leading-relaxed opacity-0 animate-slide-up delay-200">{CONFIG.heroSubtitle}</p>
                <div className="flex flex-col md:flex-row justify-center gap-4 opacity-0 animate-slide-up delay-300">
                    <button onClick={() => setPage('footprints')} className="px-8 py-3 rounded-full bg-white text-black font-bold tracking-widest hover:bg-gray-200 transition-all transform hover:scale-105 flex items-center justify-center gap-2"><MapPin className="w-4 h-4" /> 查看足迹</button>
                    <button onClick={() => setPage('gallery')} className="px-8 py-3 rounded-full bg-transparent border border-white/30 text-white font-bold tracking-widest hover:bg-white/10 transition-all transform hover:scale-105 flex items-center justify-center gap-2"><Camera className="w-4 h-4" /> 浏览相册</button>
                </div>
            </div>
            <div className="absolute bottom-8 left-0 w-full flex justify-between px-8 text-xs text-gray-500 font-mono opacity-50"><span>31.2304° N, 121.4737° E</span><span>SCROLL FOR NOTHING</span><span>© FOR US</span></div>
        </div>
    );
}

function FootprintsPage({ data, onCardClick }) {
    if (!data || data.length === 0) return <div className="min-h-screen flex items-center justify-center text-gray-500 text-sm">暂无足迹，请去后台添加。</div>;
    return (
        <div className="min-h-screen pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="py-20 px-6 text-center border-b border-white/5 bg-gradient-to-b from-transparent to-neutral-900/50">
                <h2 className="text-4xl md:text-6xl font-bold mb-4">世界地图</h2>
                <p className="text-gray-400 max-w-xl mx-auto flex items-center justify-center gap-2"><Plane className="w-4 h-4" /><span>目前已点亮 {data.length} 个城市，未来还有更多。</span></p>
            </div>
            <div className="max-w-4xl mx-auto px-6 mt-16 space-y-24">
                {data.map((trip, index) => (
                    <div key={trip.id} className="relative group cursor-pointer" onClick={() => onCardClick(trip)}>
                        {index !== data.length - 1 && <div className="absolute left-[19px] top-[60px] bottom-[-96px] w-[1px] bg-gradient-to-b from-red-500/50 to-transparent md:left-1/2 md:-ml-[0.5px] md:from-red-500/20 md:via-white/10 md:to-transparent z-0"></div>}
                        <div className={`flex flex-col md:flex-row gap-8 items-stretch ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                            <div className="md:hidden absolute left-0 top-0 w-10 h-10 flex items-center justify-center bg-black z-10"><div className="w-3 h-3 rounded-full bg-red-500 ring-4 ring-black group-hover:scale-125 transition-transform duration-300"></div></div>
                            <div className={`flex-1 pt-2 md:pt-12 ${index % 2 !== 0 ? 'md:text-left' : 'md:text-right'}`}>
                                <div className="hidden md:flex flex-col items-center absolute left-1/2 top-12 -translate-x-1/2 z-10"><div className="w-3 h-3 rounded-full bg-red-500 ring-4 ring-black mb-2 group-hover:scale-150 transition-transform duration-300"></div><div className="text-[10px] font-mono text-gray-500 bg-black px-2 py-1 border border-white/10 rounded-full">{trip.date}</div></div>
                                <div className="pl-12 md:pl-0 transition-opacity duration-300 group-hover:opacity-80">
                                    <div className="text-5xl md:text-8xl font-black text-white/5 font-mono leading-none -mb-4 select-none relative z-0">{trip.code}</div>
                                    <h3 className="text-3xl font-bold relative z-10 group-hover:text-red-400 transition-colors duration-300">{trip.city}</h3>
                                    <p className="text-red-400 font-medium text-sm tracking-widest uppercase mb-4">{trip.country}</p>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-xs text-gray-400 border border-white/5 mb-6"><Cloud className="w-3 h-3" /> {trip.weather}</div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 font-mono opacity-60 justify-start md:justify-end"><Compass className="w-3 h-3" /> {trip.coords}</div>
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden group-hover:border-red-500/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,50,50,0.1)] transform group-hover:-translate-y-2">
                                    <div className="h-64 overflow-hidden relative">
                                        <img src={trip.img} alt={trip.city} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent opacity-80"></div>
                                        <div className="absolute bottom-4 left-4 right-4"><h4 className="text-xl font-bold text-white mb-1">{trip.title}</h4></div>
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"><span className="border border-white/50 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-sm">View Log</span></div>
                                    </div>
                                    <div className="p-6 relative">
                                        <p className="text-gray-400 leading-relaxed text-sm line-clamp-3">{trip.desc}</p>
                                        <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center"><Ticket className="w-4 h-4 text-gray-600" /><span className="text-xs text-gray-600 font-mono">CLICK TO EXPAND</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function GalleryPage({ data, onImageClick, filter, setFilter }) {
    const filteredPhotos = filter === "全部" ? data : data.filter(p => p.category === filter);
    if (!data || data.length === 0) return <div className="min-h-screen flex items-center justify-center text-gray-500">暂无照片，请在后台上传。</div>;

    return (
        <div className="py-12 px-4 md:px-8 max-w-7xl mx-auto animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 border-b border-white/10 pb-8">
                <div><h2 className="text-4xl md:text-5xl font-bold mb-2">美好瞬间</h2><p className="text-gray-400 text-sm">共收藏 {data.length} 张照片</p></div>
                <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(cat => (
                        <button key={cat} onClick={() => setFilter(cat)} className={`px-4 py-1.5 rounded-full text-sm transition-all duration-300 border border-white/10 ${filter === cat ? "bg-white text-black font-bold" : "bg-transparent text-gray-400 hover:text-white hover:border-white/50"}`}>{cat}</button>
                    ))}
                </div>
            </div>
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                {filteredPhotos.map((photo) => (
                    <div key={photo.id} onClick={() => onImageClick(photo)} className="break-inside-avoid group relative cursor-pointer overflow-hidden rounded-lg bg-neutral-900">
                        <img src={photo.url} alt={photo.title} className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110 group-hover:opacity-80" />
                        <div className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
                            <span className="text-red-400 text-xs font-bold tracking-widest uppercase mb-1">{photo.category}</span>
                            <h3 className="text-lg font-bold text-white">{photo.title}</h3>
                            <p className="text-gray-400 text-xs mt-1">{photo.author} · {photo.location}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function FootprintModal({ footprint, allPhotos, onClose, onImageClick, onJumpToGallery }) {
    const relatedPhotos = allPhotos.filter(p => p.location === footprint.city);
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 animate-in fade-in duration-300" onClick={onClose}>
            <div className="relative w-full max-w-5xl bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <button className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur rounded-full text-white/70 hover:text-white transition-colors z-50 hover:rotate-90 duration-300" onClick={onClose}><X className="w-6 h-6" /></button>
                <div className="w-full md:w-5/12 h-48 md:h-auto relative shrink-0">
                    <img src={footprint.img} alt={footprint.city} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#0a0a0a]"></div>
                    <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white">
                        <h2 className="text-6xl font-black font-mono opacity-20 select-none mb-[-20px]">{footprint.code}</h2>
                        <h3 className="text-4xl font-bold relative z-10">{footprint.city}</h3>
                        <p className="text-red-400 font-medium tracking-widest uppercase">{footprint.country}</p>
                    </div>
                </div>
                <div className="w-full md:w-7/12 p-6 md:p-12 overflow-y-auto flex flex-col custom-scrollbar">
                    <div className="space-y-8 flex-grow">
                        <div className="flex items-center gap-4 text-xs font-mono text-gray-500 border-b border-white/10 pb-6">
                            <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {footprint.date}</span>
                            <span className="w-[1px] h-3 bg-gray-700"></span>
                            <span className="flex items-center gap-2"><Cloud className="w-4 h-4" /> {footprint.weather}</span>
                        </div>
                        <div><h4 className="text-2xl font-bold text-white mb-4">{footprint.title}</h4><p className="text-gray-300 leading-loose font-light text-base md:text-lg">{footprint.desc}</p></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-lg bg-white/5 border border-white/5"><div className="text-gray-500 text-xs uppercase tracking-widest mb-1">Coordinates</div><div className="flex items-center gap-2 text-sm font-mono text-white"><Compass className="w-4 h-4 text-red-500" />{footprint.coords}</div></div>
                            <div className="p-4 rounded-lg bg-white/5 border border-white/5"><div className="text-gray-500 text-xs uppercase tracking-widest mb-1">Memory ID</div><div className="flex items-center gap-2 text-sm font-mono text-white"><Ticket className="w-4 h-4 text-red-500" />#{footprint.id.toString().padStart(4, '0')}</div></div>
                        </div>
                        <div className="pt-6 border-t border-white/10">
                            <div className="flex justify-between items-center mb-4">
                                <h5 className="text-sm font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Visual Log</h5>
                                {relatedPhotos.length > 0 && (<button onClick={() => onJumpToGallery(footprint.city)} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors">View in Gallery <ArrowRight className="w-3 h-3" /></button>)}
                            </div>
                            {relatedPhotos.length > 0 ? (
                                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                                    {relatedPhotos.map((photo) => (
                                        <div key={photo.id} className="aspect-square rounded-md overflow-hidden cursor-pointer group relative" onClick={() => onImageClick(photo)}>
                                            <img src={photo.url} alt={photo.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                                        </div>
                                    ))}
                                </div>
                            ) : (<div className="p-4 rounded-lg border border-dashed border-white/10 text-center text-gray-600 text-sm">暂无关联照片</div>)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ==========================================
// 4. 管理端 (Admin Frontend)
// ==========================================
function AdminApp({ onSwitchToDisplay }) {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [activeTab, setActiveTab] = useState('albums');

    if (!token) return <LoginPage onLogin={(t) => { localStorage.setItem('token', t); setToken(t); }} onBack={onSwitchToDisplay} />;

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex">
            <aside className="w-64 border-r border-white/10 bg-black/50 flex flex-col fixed h-full z-10">
                <div className="p-6 border-b border-white/10">
                    <h1 className="text-xl font-bold flex items-center gap-2"><LayoutDashboard className="text-red-500" /> Admin</h1>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <AdminNavButton active={activeTab === 'albums'} onClick={() => setActiveTab('albums')} icon={Folder}>相册管理</AdminNavButton>
                    <AdminNavButton active={activeTab === 'footprints'} onClick={() => setActiveTab('footprints')} icon={MapPin}>足迹管理</AdminNavButton>
                </nav>
                <div className="p-4 border-t border-white/10 space-y-2">
                    <button onClick={onSwitchToDisplay} className="w-full flex items-center gap-2 text-gray-400 hover:text-white text-sm"><Home className="w-4 h-4" /> 返回首页</button>
                    <button onClick={() => { localStorage.removeItem('token'); setToken(null); }} className="w-full flex items-center gap-2 text-gray-400 hover:text-white text-sm"><LogOut className="w-4 h-4" /> 退出登录</button>
                </div>
            </aside>
            <main className="flex-1 ml-64 p-8">
                {activeTab === 'albums' ? <AlbumManager /> : <FootprintManager />}
            </main>
        </div>
    );
}

function AdminNavButton({ active, onClick, icon: Icon, children }) {
    return (
        <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${active ? 'bg-white text-black font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
            <Icon className={`w-5 h-5 ${active ? 'text-red-600' : ''}`} /> {children}
        </button>
    );
}

function LoginPage({ onLogin, onBack }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({username: '', password: ''});

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await api.post('/auth/login', JSON.stringify(formData));
            onLogin(data.token);
        } catch (e) { alert('登录失败 (默认: admin/admin)'); }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#111] border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-6 text-center text-white">Lumina Admin</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Username" className="w-full bg-black border border-white/10 rounded px-4 py-3 text-white" value={formData.username} onChange={e=>setFormData({...formData, username:e.target.value})} />
                    <input type="password" placeholder="Password" className="w-full bg-black border border-white/10 rounded px-4 py-3 text-white" value={formData.password} onChange={e=>setFormData({...formData, password:e.target.value})} />
                    <button type="submit" disabled={loading} className="w-full bg-red-600 py-3 rounded font-bold text-white hover:bg-red-500">{loading ? 'Logging in...' : 'Login'}</button>
                </form>
                <button onClick={onBack} className="w-full mt-4 text-sm text-gray-500 hover:text-white">返回展示页</button>
            </div>
        </div>
    );
}

// --- Admin: Album Manager ---
function AlbumManager() {
    const [view, setView] = useState('list');
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    return view === 'list'
        ? <AlbumList onSelect={(a) => { setSelectedAlbum(a); setView('detail'); }} />
        : <AlbumDetail album={selectedAlbum} onBack={() => setView('list')} />;
}

function AlbumList({ onSelect }) {
    const [albums, setAlbums] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => { api.get('/albums').then(setAlbums); }, []);

    const handleCreate = async (data) => {
        await api.post('/albums', JSON.stringify(data));
        setIsOpen(false);
        api.get('/albums').then(setAlbums);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">相册列表</h2>
                <button onClick={() => setIsOpen(true)} className="bg-white text-black px-4 py-2 rounded-full font-bold flex gap-2 items-center hover:bg-gray-200"><Plus className="w-4 h-4"/> 新建</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {albums.map(a => (
                    <div key={a.id} onClick={() => onSelect(a)} className="bg-[#111] rounded-xl overflow-hidden border border-white/5 cursor-pointer hover:border-white/30 hover:-translate-y-1 transition-all">
                        <div className="aspect-[4/3] bg-gray-900 relative">
                            {a.coverUrl && <img src={a.coverUrl} className="w-full h-full object-cover" />}
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent"></div>
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-white">{a.title}</h3>
                            <p className="text-xs text-gray-500">{a.count} photos</p>
                        </div>
                    </div>
                ))}
            </div>
            {isOpen && <Modal onClose={() => setIsOpen(false)} title="新建相册" onSave={handleCreate}>
                {(data, setData) => (
                    <>
                        <input className="w-full bg-black border border-white/10 p-2 rounded mb-2 text-white" placeholder="标题" onChange={e => setData({...data, title: e.target.value})} />
                        <input className="w-full bg-black border border-white/10 p-2 rounded text-white" placeholder="描述" onChange={e => setData({...data, description: e.target.value})} />
                    </>
                )}
            </Modal>}
        </div>
    );
}

function AlbumDetail({ album, onBack }) {
    const [photos, setPhotos] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [isUpload, setIsUpload] = useState(false);

    const fetchPhotos = () => api.get(`/photos?albumId=${album.id}`).then(res => setPhotos(res.records));
    useEffect(() => { fetchPhotos(); }, [album]);

    const handleUpload = async (file) => {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('albumId', album.id);
        await api.post('/photos/upload', fd);
        setIsUpload(false);
        fetchPhotos();
    };

    const handleDelete = async () => {
        if (!confirm(`删除 ${selectedIds.length} 张照片?`)) return;
        await api.delete('/photos/batch', JSON.stringify(selectedIds));
        setSelectedIds([]);
        fetchPhotos();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="hover:bg-white/10 p-2 rounded-full"><ArrowLeft /></button>
                    <div><h2 className="text-2xl font-bold">{album.title}</h2><p className="text-xs text-gray-500">{photos.length} items</p></div>
                </div>
                <div className="flex gap-2">
                    {selectedIds.length > 0 && <button onClick={handleDelete} className="bg-red-900/50 text-red-200 px-3 py-1 rounded hover:bg-red-900">删除选中</button>}
                    <button onClick={() => setIsUpload(true)} className="bg-white text-black px-4 py-2 rounded-full font-bold flex gap-2 items-center hover:bg-gray-200"><Upload className="w-4 h-4"/> 上传</button>
                </div>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {photos.map(p => (
                    <div key={p.id} onClick={() => setSelectedIds(prev => prev.includes(p.id) ? prev.filter(i=>i!==p.id) : [...prev, p.id])}
                         className={`aspect-square relative cursor-pointer border-2 rounded overflow-hidden ${selectedIds.includes(p.id) ? 'border-red-500' : 'border-transparent'}`}>
                        <img src={p.url} className="w-full h-full object-cover" />
                        {selectedIds.includes(p.id) && <div className="absolute top-1 right-1 bg-red-500 p-1 rounded"><CheckSquare className="w-3 h-3 text-white"/></div>}
                    </div>
                ))}
            </div>
            {isUpload && <Modal onClose={() => setIsUpload(false)} title="上传照片" hideSave>
                {() => (
                    <div className="border-2 border-dashed border-white/20 p-8 text-center relative rounded-lg hover:border-white/50 transition-colors">
                        <Upload className="mx-auto w-10 h-10 text-gray-500 mb-2" />
                        <p className="text-gray-400 text-sm">点击选择图片</p>
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleUpload(e.target.files[0])} />
                    </div>
                )}
            </Modal>}
        </div>
    );
}

// --- Admin: Footprint Manager (适配展示端字段) ---
function FootprintManager() {
    const [footprints, setFootprints] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => { api.get('/footprints').then(setFootprints); }, []);

    const handleSave = async (data) => {
        await api.post('/footprints', JSON.stringify(data));
        setIsOpen(false);
        api.get('/footprints').then(setFootprints);
    };

    const handleDelete = async (id) => {
        if (!confirm('删除此足迹?')) return;
        await api.delete(`/footprints/${id}`);
        api.get('/footprints').then(setFootprints);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">足迹管理</h2>
                <button onClick={() => setIsOpen(true)} className="bg-white text-black px-4 py-2 rounded-full font-bold flex gap-2 items-center hover:bg-gray-200"><Plus className="w-4 h-4"/> 新增</button>
            </div>
            <div className="space-y-4">
                {footprints.map(f => (
                    <div key={f.id} className="bg-[#111] p-4 rounded-lg flex justify-between items-center border border-white/5 hover:border-white/20 transition-all">
                        <div className="flex gap-4 items-center">
                            <img src={f.img} className="w-20 h-12 object-cover rounded bg-gray-800" />
                            <div>
                                <h3 className="font-bold text-white">{f.city} <span className="text-gray-500 font-normal text-sm">/ {f.country}</span></h3>
                                <p className="text-xs text-gray-500">{f.date} · {f.code}</p>
                            </div>
                        </div>
                        <button onClick={() => handleDelete(f.id)} className="text-red-500 hover:bg-white/10 p-2 rounded transition-colors"><Trash2 className="w-4 h-4"/></button>
                    </div>
                ))}
            </div>
            {isOpen && <Modal onClose={() => setIsOpen(false)} title="新增足迹" onSave={handleSave}>
                {(data, setData) => (
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                            <input className="bg-black border border-white/10 p-2 rounded text-white text-sm" placeholder="城市 (Tokyo)" onChange={e => setData({...data, city: e.target.value})} />
                            <input className="bg-black border border-white/10 p-2 rounded text-white text-sm" placeholder="国家 (Japan)" onChange={e => setData({...data, country: e.target.value})} />
                        </div>
                        <input className="w-full bg-black border border-white/10 p-2 rounded text-white text-sm" placeholder="代码 (HND)" onChange={e => setData({...data, code: e.target.value})} />
                        <input className="w-full bg-black border border-white/10 p-2 rounded text-white text-sm" placeholder="日期 (2023.01.01)" onChange={e => setData({...data, date: e.target.value})} />
                        <input className="w-full bg-black border border-white/10 p-2 rounded text-white text-sm" placeholder="天气 (Sunny)" onChange={e => setData({...data, weather: e.target.value})} />
                        <input className="w-full bg-black border border-white/10 p-2 rounded text-white text-sm" placeholder="坐标 (35.6 N, 139.6 E)" onChange={e => setData({...data, coords: e.target.value})} />
                        <input className="w-full bg-black border border-white/10 p-2 rounded text-white text-sm" placeholder="标题" onChange={e => setData({...data, title: e.target.value})} />
                        <textarea className="w-full bg-black border border-white/10 p-2 rounded text-white text-sm h-24" placeholder="描述" onChange={e => setData({...data, desc: e.target.value})} />
                        <div className="relative border border-white/10 p-2 text-center text-sm text-gray-500 rounded cursor-pointer hover:border-white/30">
                            {data.img ? '已选择图片' : '上传封面图 (Mock: 点击选择)'}
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setData({...data, img: URL.createObjectURL(e.target.files[0])})} />
                        </div>
                    </div>
                )}
            </Modal>}
        </div>
    );
}

// --- Generic Modal ---
function Modal({ onClose, title, onSave, children, hideSave }) {
    const [data, setData] = useState({});
    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in zoom-in-95">
            <div className="bg-[#1a1a1a] w-full max-w-md p-6 rounded-2xl border border-white/10 shadow-2xl">
                <div className="flex justify-between mb-4 items-center">
                    <h3 className="font-bold text-xl text-white">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-5 h-5"/></button>
                </div>
                <div className="mb-6">
                    {children(data, setData)}
                </div>
                {!hideSave && <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 text-sm text-gray-400 hover:text-white">取消</button>
                    <button onClick={() => onSave(data)} className="bg-red-600 hover:bg-red-500 px-6 py-2 rounded-full font-bold text-sm text-white transition-colors">保存</button>
                </div>}
            </div>
        </div>
    );
}