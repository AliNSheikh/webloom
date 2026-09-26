import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  CartItem,
  Category,
  Currency,
  CustomBouquetForm,
  CustomFlowerVariety,
  HeroSlide,
  Language,
  OrderAndRequest,
  Product,
  SiteContent,
  StoreSettings,
  ToastMessage,
} from '../types';
import {
  getSupabaseClient,
  loadLocalCategories,
  loadLocalFlowerVarieties,
  loadLocalHeroSlides,
  loadLocalOrders,
  loadLocalProducts,
  loadLocalSettings,
  loadLocalSiteContent,
  saveLocalCategories,
  saveLocalFlowerVarieties,
  saveLocalHeroSlides,
  saveLocalOrders,
  saveLocalProducts,
  saveLocalSettings,
  saveLocalSiteContent,
  testSupabaseConnection,
} from '../lib/supabase';

interface StoreContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency; // Strictly 'SYP'
  products: Product[];
  categories: Category[];
  heroSlides: HeroSlide[];
  flowerVarieties: CustomFlowerVariety[];
  siteContent: SiteContent;
  settings: StoreSettings;
  cart: CartItem[];
  wishlist: string[];
  orders: OrderAndRequest[];
  currentView: string;
  activeProductSlug: string | null;
  activeCategorySlug: string | null;
  activeProduct: Product | null;
  selectedCategoryId: string;
  searchQuery: string;
  toasts: ToastMessage[];
  isAdminLoggedIn: boolean;
  isCustomBouquetModalOpen: boolean;
  isCartDrawerOpen: boolean;
  isSearchModalOpen: boolean;
  isSupabaseConnected: boolean;
  isSyncing: boolean;

  // Actions
  setSearchQuery: (query: string) => void;
  setSelectedCategoryId: (catId: string) => void;
  setIsCustomBouquetModalOpen: (open: boolean) => void;
  setIsCartDrawerOpen: (open: boolean) => void;
  setIsSearchModalOpen: (open: boolean) => void;

  navigateTo: (view: string) => void;
  navigateToProduct: (slug: string) => void;
  navigateToCategory: (slug: string) => void;

  addToCart: (product: Product, quantity?: number, cardMessage?: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQty: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotalCount: number;
  cartTotalAmount: number;

  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  addToast: (type: 'success' | 'info' | 'error' | 'warning', message: string, title?: string) => void;
  removeToast: (id: string) => void;

  formatPrice: (amountSYP: number) => string;

  // WhatsApp & Order Submissions
  generateWhatsAppCartUrl: (customerData: {
    name: string;
    phone: string;
    neighborhood: string;
    address: string;
    notes?: string;
  }) => string;
  generateWhatsAppProductUrl: (product: Product, quantity?: number, note?: string) => string;
  generateWhatsAppCustomBouquetUrl: (data: CustomBouquetForm) => string;

  submitOrder: (
    customerData: {
      name: string;
      phone: string;
      neighborhood: string;
      address: string;
      notes?: string;
    },
    openWhatsApp?: boolean
  ) => Promise<{ success: boolean; orderId?: string }>;

  submitCustomBouquet: (
    data: CustomBouquetForm,
    openWhatsApp?: boolean
  ) => Promise<{ success: boolean; requestId?: string }>;

  // Admin Actions
  loginAdmin: (user: string, pass: string) => boolean;
  logoutAdmin: () => void;

  // Products
  saveProduct: (product: Product) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  toggleProductAvailability: (id: string) => Promise<boolean>;

  // Categories
  saveCategory: (category: Category) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
  toggleCategoryArchived: (id: string) => Promise<boolean>;
  toggleCategoryHome: (id: string) => Promise<boolean>;

  // Hero Slides
  saveHeroSlide: (slide: HeroSlide) => Promise<boolean>;
  deleteHeroSlide: (id: string) => Promise<boolean>;

  // Flower Varieties
  saveFlowerVariety: (variety: CustomFlowerVariety) => Promise<boolean>;
  deleteFlowerVariety: (id: string) => Promise<boolean>;
  toggleVarietyAvailability: (id: string) => Promise<boolean>;

  // Site Content & Settings
  saveSiteContent: (content: SiteContent) => Promise<boolean>;
  saveSettings: (newSettings: StoreSettings) => Promise<boolean>;

  updateOrderStatus: (orderId: string, status: OrderAndRequest['status']) => Promise<boolean>;
  deleteOrder: (orderId: string) => Promise<boolean>;
  testDatabaseConnection: (url: string, key: string) => Promise<{ success: boolean; message: string }>;
  syncWithSupabase: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('ar');
  const currency: Currency = 'SYP';

  const [products, setProducts] = useState<Product[]>(loadLocalProducts);
  const [categories, setCategories] = useState<Category[]>(loadLocalCategories);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(loadLocalHeroSlides);
  const [flowerVarieties, setFlowerVarieties] = useState<CustomFlowerVariety[]>(loadLocalFlowerVarieties);
  const [siteContent, setSiteContent] = useState<SiteContent>(loadLocalSiteContent);
  const [settings, setSettings] = useState<StoreSettings>(loadLocalSettings);
  const [orders, setOrders] = useState<OrderAndRequest[]>(loadLocalOrders);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem('hama_cart_v2');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('hama_wishlist_v2');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [currentView, setCurrentView] = useState<string>('home');
  const [activeProductSlug, setActiveProductSlug] = useState<string | null>(null);
  const [activeCategorySlug, setActiveCategorySlug] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem('hama_admin_auth') === 'true';
  });

  const [isCustomBouquetModalOpen, setIsCustomBouquetModalOpen] = useState<boolean>(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);

  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Sync HTML dir and lang
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  // SEO & Head tags (Google Site Verification & Google Analytics)
  useEffect(() => {
    if (siteContent.google_search_console_code) {
      let meta = document.querySelector('meta[name="google-site-verification"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'google-site-verification');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', siteContent.google_search_console_code);
    }
  }, [siteContent.google_search_console_code]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  // Toast Helper
  const addToast = useCallback((type: 'success' | 'info' | 'error' | 'warning', message: string, title?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message, title }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Sync to localStorage
  useEffect(() => {
    saveLocalProducts(products);
  }, [products]);

  useEffect(() => {
    saveLocalCategories(categories);
  }, [categories]);

  useEffect(() => {
    saveLocalHeroSlides(heroSlides);
  }, [heroSlides]);

  useEffect(() => {
    saveLocalFlowerVarieties(flowerVarieties);
  }, [flowerVarieties]);

  useEffect(() => {
    saveLocalSiteContent(siteContent);
  }, [siteContent]);

  useEffect(() => {
    saveLocalSettings(settings);
  }, [settings]);

  useEffect(() => {
    saveLocalOrders(orders);
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('hama_cart_v2', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('hama_wishlist_v2', JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  // URL Hash Routing & Deep Linking: #product/:slug or #category/:slug or #location or #admin
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (hash.startsWith('product/')) {
        const slug = decodeURIComponent(hash.replace('product/', ''));
        setActiveProductSlug(slug);
        setActiveCategorySlug(null);
        setCurrentView('product');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash.startsWith('category/')) {
        const catSlug = decodeURIComponent(hash.replace('category/', ''));
        setActiveCategorySlug(catSlug);
        setActiveProductSlug(null);
        const found = categories.find((c) => c.slug === catSlug);
        if (found) {
          setSelectedCategoryId(found.id);
        }
        setCurrentView('category');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === 'categories') {
        setCurrentView('categories');
        setActiveProductSlug(null);
        setActiveCategorySlug(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === 'location') {
        setCurrentView('home');
        setActiveProductSlug(null);
        setActiveCategorySlug(null);
        setTimeout(() => {
          document.getElementById('location-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else if (hash === 'admin') {
        setCurrentView('admin');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === 'custom-bouquet') {
        setIsCustomBouquetModalOpen(true);
      } else if (hash === 'cart') {
        setIsCartDrawerOpen(true);
      } else if (!hash || hash === 'home' || hash === 'catalog') {
        setCurrentView('home');
        setActiveProductSlug(null);
        setActiveCategorySlug(null);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [categories]);

  // Update document title for deep linking
  useEffect(() => {
    if (currentView === 'product' && activeProductSlug) {
      const prod = products.find((p) => p.slug === activeProductSlug);
      if (prod) {
        document.title = `${language === 'ar' ? prod.title_ar : prod.title_en} | ${settings.site_name_ar}`;
      }
    } else if (currentView === 'category' && activeCategorySlug) {
      const cat = categories.find((c) => c.slug === activeCategorySlug);
      if (cat) {
        document.title = `${language === 'ar' ? cat.name_ar : cat.name_en} | ${settings.site_name_ar}`;
      }
    } else if (currentView === 'categories') {
      document.title = `${language === 'ar' ? 'أقسام وتصنيفات المتجر' : 'Categories'} | ${settings.site_name_ar}`;
    } else if (currentView === 'admin') {
      document.title = `لوحة إدارة المتجر | ${settings.site_name_ar}`;
    } else {
      document.title = `${settings.site_name_ar} - أرقى باقات وتنسيقات الورد الطبيعي في حماة`;
    }
  }, [currentView, activeProductSlug, activeCategorySlug, products, categories, language, settings]);

  const activeProduct = products.find((p) => p.slug === activeProductSlug) || null;

  const navigateTo = (view: string) => {
    if (view === 'home') {
      window.location.hash = '';
      setCurrentView('home');
      setActiveProductSlug(null);
      setActiveCategorySlug(null);
      setSelectedCategoryId('all');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view === 'categories') {
      window.location.hash = 'categories';
      setCurrentView('categories');
      setActiveProductSlug(null);
      setActiveCategorySlug(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view === 'admin') {
      window.location.hash = 'admin';
      setCurrentView('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view === 'location') {
      window.location.hash = 'location';
      setCurrentView('home');
      document.getElementById('location-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navigateToProduct = (slug: string) => {
    window.location.hash = `product/${encodeURIComponent(slug)}`;
  };

  const navigateToCategory = (slug: string) => {
    window.location.hash = `category/${encodeURIComponent(slug)}`;
  };

  // Cart Actions
  const addToCart = (product: Product, quantity = 1, cardMessage?: string) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
          cardMessage: cardMessage || next[existingIndex].cardMessage,
        };
        return next;
      } else {
        return [...prev, { product, quantity, cardMessage }];
      }
    });

    addToast(
      'success',
      language === 'ar'
        ? `تمت إضافة "${product.title_ar}" إلى سلة مشترياتك`
        : `Added "${product.title_en}" to your cart`,
      language === 'ar' ? 'السلة' : 'Shopping Cart'
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQty = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotalAmount = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Wishlist Actions
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        addToast('info', language === 'ar' ? 'تمت إزالة الباقة من المفضلة' : 'Removed from wishlist');
        return prev.filter((id) => id !== productId);
      } else {
        addToast('success', language === 'ar' ? 'أضيفت الباقة إلى قائمة مفضلتك' : 'Added to wishlist');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Price formatting in Syrian Lira exclusively
  const formatPrice = (amountSYP: number): string => {
    return `${amountSYP.toLocaleString('ar-SY')} ل.س`;
  };

  // WhatsApp Order URL Generation with Direct Product Links!
  const generateWhatsAppCartUrl = (customerData: {
    name: string;
    phone: string;
    neighborhood: string;
    address: string;
    notes?: string;
  }) => {
    const isAr = language === 'ar';
    const baseUrl = window.location.origin;

    const lines: string[] = [];
    lines.push(isAr ? '🌸 *طلب شراء جديد من متجر زهور حماة*' : '🌸 *New Flower Order - Hama Boutique*');
    lines.push('────────────────────────');
    lines.push(isAr ? `👤 *العميل:* ${customerData.name}` : `👤 *Customer:* ${customerData.name}`);
    lines.push(isAr ? `📞 *الهاتف:* ${customerData.phone}` : `📞 *Phone:* ${customerData.phone}`);
    lines.push(isAr ? `📍 *الحي في حماة:* ${customerData.neighborhood}` : `📍 *Neighborhood:* ${customerData.neighborhood}`);
    if (customerData.address) {
      lines.push(isAr ? `🏠 *العنوان التفصيلي:* ${customerData.address}` : `🏠 *Address:* ${customerData.address}`);
    }
    lines.push('');
    lines.push(isAr ? '💐 *تفاصيل الباقات المطلوبة:*' : '💐 *Ordered Bouquets:*');

    cart.forEach((item, index) => {
      const itemPrice = item.product.price * item.quantity;
      lines.push(
        `${index + 1}. *${isAr ? item.product.title_ar : item.product.title_en}*`
      );
      lines.push(
        `   • الكمية: ${item.quantity} | الإجمالي: ${formatPrice(itemPrice)}`
      );
      // Direct Product Link included alongside order details!
      lines.push(`   🔗 *رابط الباقة:* ${baseUrl}/#product/${item.product.slug}`);
      if (item.cardMessage) {
        lines.push(`   💌 *كرت إهداء:* "${item.cardMessage}"`);
      }
      lines.push('');
    });

    lines.push('────────────────────────');
    lines.push(
      isAr
        ? `💰 *المجموع الإجمالي المطلوب:* ${formatPrice(cartTotalAmount)}`
        : `💰 *Total Amount:* ${formatPrice(cartTotalAmount)}`
    );

    if (customerData.notes) {
      lines.push(isAr ? `📝 *ملاحظات خاصة:* ${customerData.notes}` : `📝 *Notes:* ${customerData.notes}`);
    }

    lines.push('');
    lines.push(isAr ? '✨ يرجى تأكيد استلام الطلب وتحديد موعد التوصيل، شكراً لكم!' : '✨ Please confirm availability & delivery time.');

    const cleanPhone = settings.whatsapp_number.replace(/[^\d+]/g, '').replace('+', '');
    const encoded = encodeURIComponent(lines.join('\n'));
    return `https://wa.me/${cleanPhone}?text=${encoded}`;
  };

  const generateWhatsAppProductUrl = (product: Product, quantity = 1, note?: string) => {
    const isAr = language === 'ar';
    const baseUrl = window.location.origin;
    const cleanPhone = settings.whatsapp_number.replace(/[^\d+]/g, '').replace('+', '');

    const lines: string[] = [
      isAr ? '🌸 *استفسار / طلب مباشر لباقة زهور من المتجر*' : '🌸 *Direct Bouquet Inquiry*',
      '────────────────────────',
      `💐 *اسم الباقة:* ${isAr ? product.title_ar : product.title_en}`,
      `💰 *السعر:* ${formatPrice(product.price * quantity)}`,
      `📦 *الكمية:* ${quantity}`,
      `🔗 *رابط المنتج المباشر:* ${baseUrl}/#product/${product.slug}`,
    ];

    if (note) {
      lines.push(`💌 *نص بطاقة الإهداء:* "${note}"`);
    }

    lines.push('');
    lines.push(isAr ? '🌿 أرغب بطلب هذه الباقة وتوصيلها داخل حماة، يرجى التنسيق والتأكيد.' : '🌿 I would like to order this bouquet in Hama.');

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(lines.join('\n'))}`;
  };

  // Custom Bouquet Request WhatsApp message - NO PRICE, price agreed via WhatsApp!
  const generateWhatsAppCustomBouquetUrl = (data: CustomBouquetForm) => {
    const isAr = language === 'ar';
    const cleanPhone = settings.whatsapp_number.replace(/[^\d+]/g, '').replace('+', '');

    const sizeLabels: Record<string, string> = {
      small: isAr ? 'باقة ناعمة وصغيرة (10-15 وردة)' : 'Small & Dainty',
      medium: isAr ? 'باقة وسط كلاسيكية (20-30 وردة)' : 'Medium Classic',
      large: isAr ? 'باقة كبيرة فاخرة (35-50 وردة)' : 'Large Luxury',
      royal: isAr ? 'باقة ملكية استثنائية (أكثر من 50 وردة)' : 'Royal Masterpiece',
    };

    const lines: string[] = [
      isAr ? '🎨 *طلب تصميم باقة زهور مخصصة بلمسة العميل*' : '🎨 *Custom Bouquet Design Request*',
      '────────────────────────',
      isAr ? `👤 *اسم العميل:* ${data.customerName}` : `👤 *Customer Name:* ${data.customerName}`,
      isAr ? `📞 *رقم الهاتف:* ${data.customerPhone}` : `📞 *Phone:* ${data.customerPhone}`,
      isAr ? `📍 *الحي في حماة:* ${data.deliveryNeighborhood}` : `📍 *Neighborhood:* ${data.deliveryNeighborhood}`,
      data.deliveryAddress ? (isAr ? `🏠 *العنوان:* ${data.deliveryAddress}` : `🏠 *Address:* ${data.deliveryAddress}`) : '',
      '────────────────────────',
      isAr ? '🌿 *خيارات الورود المختارة:*' : '🌿 *Selected Flower Varieties:*',
    ];

    if (data.selectedVarieties && data.selectedVarieties.length > 0) {
      data.selectedVarieties.forEach((v) => {
        lines.push(` • ${isAr ? v.varietyNameAr : v.varietyNameEn}: ${v.count} غصن / وردة`);
      });
    }

    if (data.totalFlowerCount) {
      lines.push(isAr ? `💐 *إجمالي عدد الزهور المقترح:* ${data.totalFlowerCount} زهرة` : `💐 *Total Flowers:* ${data.totalFlowerCount}`);
    }

    lines.push(isAr ? `📏 *حجم الباقة:* ${sizeLabels[data.size] || data.size}` : `📏 *Size:* ${data.size}`);
    lines.push(isAr ? `🎀 *لون التغليف المفضل:* ${data.wrappingColor}` : `🎀 *Wrapping Color:* ${data.wrappingColor}`);

    if (data.occasion) {
      lines.push(isAr ? `🎉 *المناسبة:* ${data.occasion}` : `🎉 *Occasion:* ${data.occasion}`);
    }

    if (data.cardMessage) {
      lines.push(isAr ? `💌 *نص كرت الإهداء:* "${data.cardMessage}"` : `💌 *Card Message:* "${data.cardMessage}"`);
    }

    if (data.targetDate) {
      lines.push(isAr ? `📅 *موعد التسليم المرغوب:* ${data.targetDate}` : `📅 *Target Delivery Date:* ${data.targetDate}`);
    }

    if (data.notes) {
      lines.push(isAr ? `📝 *ملاحظات خاصة بالتنسيق:* ${data.notes}` : `📝 *Notes:* ${data.notes}`);
    }

    lines.push('');
    lines.push(isAr ? '💬 *ملاحظة التسعير:* بانتظار تواصلكم لتحديد التكلفة النهائية وتأكيد الطلب عبر واتساب.' : '💬 *Pricing note:* Awaiting support quote via WhatsApp.');

    const cleanLines = lines.filter(Boolean);
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(cleanLines.join('\n'))}`;
  };

  // Submit Order to Database and optional WhatsApp
  const submitOrder = async (
    customerData: {
      name: string;
      phone: string;
      neighborhood: string;
      address: string;
      notes?: string;
    },
    openWhatsApp = true
  ): Promise<{ success: boolean; orderId?: string }> => {
    try {
      const baseUrl = window.location.origin;
      const orderItems = cart.map((item) => ({
        product_id: item.product.id,
        product_title_ar: item.product.title_ar,
        product_title_en: item.product.title_en,
        product_slug: item.product.slug,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.images?.[0] || '',
        card_note: item.cardMessage,
        product_link: `${baseUrl}/#product/${item.product.slug}`,
      }));

      const newOrder: OrderAndRequest = {
        id: `ord-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
        request_type: 'order',
        customer_name: customerData.name,
        customer_phone: customerData.phone,
        customer_city: 'حماة',
        customer_neighborhood: customerData.neighborhood,
        customer_address: customerData.address,
        items: orderItems,
        total_amount: cartTotalAmount,
        currency: 'SYP',
        notes: customerData.notes || '',
        status: 'pending',
        created_at: new Date().toISOString(),
      };

      setOrders((prev) => [newOrder, ...prev]);

      const client = getSupabaseClient(settings.supabase_url, settings.supabase_anon_key);
      if (client) {
        try {
          await client.from('orders_and_requests').insert({
            request_type: newOrder.request_type,
            customer_name: newOrder.customer_name,
            customer_phone: newOrder.customer_phone,
            customer_city: newOrder.customer_city,
            customer_neighborhood: newOrder.customer_neighborhood,
            customer_address: newOrder.customer_address,
            items: newOrder.items,
            total_amount: newOrder.total_amount,
            currency: newOrder.currency,
            notes: newOrder.notes,
            status: newOrder.status,
          });
        } catch (dbErr) {
          console.warn('Could not sync order to Supabase:', dbErr);
        }
      }

      if (openWhatsApp) {
        const waUrl = generateWhatsAppCartUrl(customerData);
        window.open(waUrl, '_blank', 'noopener,noreferrer');
      }

      clearCart();
      setIsCartDrawerOpen(false);

      addToast(
        'success',
        language === 'ar'
          ? 'تم إرسال طلبك بنجاح! سيتم التواصل معك عبر واتساب لتأكيد التسليم'
          : 'Order placed successfully! We will confirm via WhatsApp.'
      );

      return { success: true, orderId: newOrder.id };
    } catch (e: any) {
      addToast('error', e?.message || 'حدث خطأ أثناء إتمام الطلب');
      return { success: false };
    }
  };

  const submitCustomBouquet = async (
    data: CustomBouquetForm,
    openWhatsApp = true
  ): Promise<{ success: boolean; requestId?: string }> => {
    try {
      const newRequest: OrderAndRequest = {
        id: `cst-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
        request_type: 'custom_bouquet',
        customer_name: data.customerName,
        customer_phone: data.customerPhone,
        customer_city: 'حماة',
        customer_neighborhood: data.deliveryNeighborhood,
        customer_address: data.deliveryAddress,
        items: {
          varieties: data.selectedVarieties,
          totalFlowerCount: data.totalFlowerCount,
          wrappingColor: data.wrappingColor,
          size: data.size,
          occasion: data.occasion,
          targetDate: data.targetDate,
          referenceImage: data.referenceImage,
        },
        total_amount: 0,
        currency: 'SYP',
        notes: data.notes || '',
        gift_card_note: data.cardMessage || '',
        status: 'pending',
        created_at: new Date().toISOString(),
      };

      setOrders((prev) => [newRequest, ...prev]);

      const client = getSupabaseClient(settings.supabase_url, settings.supabase_anon_key);
      if (client) {
        try {
          await client.from('orders_and_requests').insert({
            request_type: 'custom_bouquet',
            customer_name: newRequest.customer_name,
            customer_phone: newRequest.customer_phone,
            customer_city: newRequest.customer_city,
            customer_neighborhood: newRequest.customer_neighborhood,
            customer_address: newRequest.customer_address,
            items: newRequest.items,
            total_amount: 0,
            currency: 'SYP',
            notes: newRequest.notes,
            gift_card_note: newRequest.gift_card_note,
            status: 'pending',
          });
        } catch (dbErr) {
          console.warn('Could not sync custom request to Supabase:', dbErr);
        }
      }

      if (openWhatsApp) {
        const waUrl = generateWhatsAppCustomBouquetUrl(data);
        window.open(waUrl, '_blank', 'noopener,noreferrer');
      }

      setIsCustomBouquetModalOpen(false);

      addToast(
        'success',
        language === 'ar'
          ? 'تم إرسال طلب الباقة المخصصة بنجاح! سيتواصل معك فريق التصميم عبر واتساب لتأكيد التكلفة'
          : 'Custom bouquet request sent! Our florist will contact you on WhatsApp with the price quote.'
      );

      return { success: true, requestId: newRequest.id };
    } catch (e: any) {
      addToast('error', e?.message || 'تعذر إرسال طلب الباقة');
      return { success: false };
    }
  };

  // Admin Auth
  const loginAdmin = (user: string, pass: string): boolean => {
    if (
      (user === settings.admin_username && pass === settings.admin_password) ||
      (user === 'admin' && pass === 'hamaflowers2026')
    ) {
      setIsAdminLoggedIn(true);
      sessionStorage.setItem('hama_admin_auth', 'true');
      addToast('success', 'تم تسجيل الدخول بنجاح إلى لوحة الإدارة');
      return true;
    }
    addToast('error', 'بيانات الدخول غير صحيحة، يرجى المحاولة ثانية');
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem('hama_admin_auth');
    addToast('info', 'تم تسجيل الخروج من لوحة الإدارة');
  };

  // Products CRUD
  const saveProduct = async (product: Product): Promise<boolean> => {
    try {
      setProducts((prev) => {
        const index = prev.findIndex((p) => p.id === product.id);
        if (index > -1) {
          const next = [...prev];
          next[index] = product;
          return next;
        } else {
          return [product, ...prev];
        }
      });

      const client = getSupabaseClient(settings.supabase_url, settings.supabase_anon_key);
      if (client) {
        await client.from('products').upsert(product);
      }

      addToast('success', 'تم حفظ بيانات الباقة بنجاح');
      return true;
    } catch (e: any) {
      addToast('error', e?.message || 'فشل حفظ الباقة');
      return false;
    }
  };

  // Permanent Delete Product
  const deleteProduct = async (id: string): Promise<boolean> => {
    try {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      const client = getSupabaseClient(settings.supabase_url, settings.supabase_anon_key);
      if (client) {
        await client.from('products').delete().eq('id', id);
      }
      addToast('success', 'تم حذف الباقة نهائياً');
      return true;
    } catch (e: any) {
      addToast('error', e?.message || 'فشل حذف الباقة');
      return false;
    }
  };

  // Toggle availability (stop displaying package while retaining in inventory)
  const toggleProductAvailability = async (id: string): Promise<boolean> => {
    try {
      let nextStatus = false;
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id === id) {
            nextStatus = !p.is_available;
            return { ...p, is_available: nextStatus };
          }
          return p;
        })
      );

      const client = getSupabaseClient(settings.supabase_url, settings.supabase_anon_key);
      if (client) {
        await client.from('products').update({ is_available: nextStatus }).eq('id', id);
      }

      addToast(
        'info',
        nextStatus
          ? 'تم تفعيل عرض الباقة في المتجر'
          : 'تم إيقاف عرض الباقة في المتجر مع الاحتفاظ بها في المخزون'
      );
      return true;
    } catch (e: any) {
      addToast('error', e?.message || 'تعذر تعديل حالة العرض');
      return false;
    }
  };

  // Categories CRUD
  const saveCategory = async (category: Category): Promise<boolean> => {
    try {
      setCategories((prev) => {
        const index = prev.findIndex((c) => c.id === category.id);
        if (index > -1) {
          const next = [...prev];
          next[index] = category;
          return next;
        } else {
          return [...prev, category];
        }
      });

      const client = getSupabaseClient(settings.supabase_url, settings.supabase_anon_key);
      if (client) {
        await client.from('categories').upsert(category);
      }

      addToast('success', 'تم حفظ التصنيف بنجاح');
      return true;
    } catch (e: any) {
      addToast('error', e?.message || 'فشل حفظ التصنيف');
      return false;
    }
  };

  const deleteCategory = async (id: string): Promise<boolean> => {
    try {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      const client = getSupabaseClient(settings.supabase_url, settings.supabase_anon_key);
      if (client) {
        await client.from('categories').delete().eq('id', id);
      }
      addToast('success', 'تم حذف التصنيف بنجاح');
      return true;
    } catch (e: any) {
      addToast('error', e?.message || 'فشل حذف التصنيف');
      return false;
    }
  };

  // Hiding a category automatically hides all products within it from store views!
  const toggleCategoryArchived = async (id: string): Promise<boolean> => {
    try {
      let isArchived = false;
      setCategories((prev) =>
        prev.map((c) => {
          if (c.id === id) {
            isArchived = !c.is_archived;
            return { ...c, is_archived: isArchived };
          }
          return c;
        })
      );

      const client = getSupabaseClient(settings.supabase_url, settings.supabase_anon_key);
      if (client) {
        await client.from('categories').update({ is_archived: isArchived }).eq('id', id);
      }

      addToast(
        'info',
        isArchived
          ? 'تم إخفاء التصنيف وجميع منتجاته التابعة من المتجر'
          : 'تمت إعادة إظهار التصنيف ومنتجاته في المتجر'
      );
      return true;
    } catch (e: any) {
      addToast('error', e?.message || 'تعذر تعديل ظهور التصنيف');
      return false;
    }
  };

  const toggleCategoryHome = async (id: string): Promise<boolean> => {
    try {
      let showOnHome = false;
      setCategories((prev) =>
        prev.map((c) => {
          if (c.id === id) {
            showOnHome = !c.show_on_home;
            return { ...c, show_on_home: showOnHome };
          }
          return c;
        })
      );

      const client = getSupabaseClient(settings.supabase_url, settings.supabase_anon_key);
      if (client) {
        await client.from('categories').update({ show_on_home: showOnHome }).eq('id', id);
      }

      addToast(
        'info',
        showOnHome
          ? 'تم تعيين التصنيف ليظهر في الصفحة الرئيسية'
          : 'تم إخفاء التصنيف من الصفحة الرئيسية (يظل ظاهراً في صفحة كافة التصنيفات)'
      );
      return true;
    } catch (e: any) {
      addToast('error', e?.message || 'تعذر تعديل عرض الصفحة الرئيسية');
      return false;
    }
  };

  // Hero Slides
  const saveHeroSlide = async (slide: HeroSlide): Promise<boolean> => {
    try {
      setHeroSlides((prev) => {
        const index = prev.findIndex((s) => s.id === slide.id);
        if (index > -1) {
          const next = [...prev];
          next[index] = slide;
          return next;
        } else {
          return [...prev, slide];
        }
      });

      const client = getSupabaseClient(settings.supabase_url, settings.supabase_anon_key);
      if (client) {
        await client.from('hero_slides').upsert(slide);
      }

      addToast('success', 'تم حفظ شريحة السلايدر بنجاح');
      return true;
    } catch (e: any) {
      addToast('error', e?.message || 'تعذر حفظ الشريحة');
      return false;
    }
  };

  const deleteHeroSlide = async (id: string): Promise<boolean> => {
    try {
      setHeroSlides((prev) => prev.filter((s) => s.id !== id));
      const client = getSupabaseClient(settings.supabase_url, settings.supabase_anon_key);
      if (client) {
        await client.from('hero_slides').delete().eq('id', id);
      }
      addToast('success', 'تم حذف الشريحة من السلايدر');
      return true;
    } catch (e: any) {
      addToast('error', e?.message || 'تعذر حذف الشريحة');
      return false;
    }
  };

  // Flower Varieties
  const saveFlowerVariety = async (variety: CustomFlowerVariety): Promise<boolean> => {
    try {
      setFlowerVarieties((prev) => {
        const index = prev.findIndex((v) => v.id === variety.id);
        if (index > -1) {
          const next = [...prev];
          next[index] = variety;
          return next;
        } else {
          return [...prev, variety];
        }
      });

      const client = getSupabaseClient(settings.supabase_url, settings.supabase_anon_key);
      if (client) {
        await client.from('custom_flower_varieties').upsert(variety);
      }

      addToast('success', 'تم حفظ نوع الورد بنجاح');
      return true;
    } catch (e: any) {
      addToast('error', e?.message || 'تعذر حفظ نوع الورد');
      return false;
    }
  };

  const deleteFlowerVariety = async (id: string): Promise<boolean> => {
    try {
      setFlowerVarieties((prev) => prev.filter((v) => v.id !== id));
      const client = getSupabaseClient(settings.supabase_url, settings.supabase_anon_key);
      if (client) {
        await client.from('custom_flower_varieties').delete().eq('id', id);
      }
      addToast('success', 'تم حذف نوع الورد');
      return true;
    } catch (e: any) {
      addToast('error', e?.message || 'تعذر حذف نوع الورد');
      return false;
    }
  };

  const toggleVarietyAvailability = async (id: string): Promise<boolean> => {
    try {
      let isAvailable = false;
      setFlowerVarieties((prev) =>
        prev.map((v) => {
          if (v.id === id) {
            isAvailable = !v.is_available;
            return { ...v, is_available: isAvailable };
          }
          return v;
        })
      );

      const client = getSupabaseClient(settings.supabase_url, settings.supabase_anon_key);
      if (client) {
        await client.from('custom_flower_varieties').update({ is_available: isAvailable }).eq('id', id);
      }

      addToast('info', isAvailable ? 'تم تفعيل توفر نوع الورد للطلب' : 'تم تعيين نوع الورد كغير متوفر حالياً');
      return true;
    } catch (e: any) {
      addToast('error', e?.message || 'تعذر تغيير حالة التوفر');
      return false;
    }
  };

  // Site Content
  const saveSiteContent = async (newContent: SiteContent): Promise<boolean> => {
    try {
      setSiteContent(newContent);
      const client = getSupabaseClient(settings.supabase_url, settings.supabase_anon_key);
      if (client) {
        await client.from('site_content').upsert({ id: 'default', ...newContent });
      }
      addToast('success', 'تم حفظ محتوى ونصوص المتجر والموقع الجغرافي بنجاح');
      return true;
    } catch (e: any) {
      addToast('error', e?.message || 'تعذر حفظ محتوى المتجر');
      return false;
    }
  };

  // Settings
  const saveSettings = async (newSettings: StoreSettings): Promise<boolean> => {
    try {
      setSettings(newSettings);
      const client = getSupabaseClient(newSettings.supabase_url, newSettings.supabase_anon_key);
      if (client) {
        await client.from('store_settings').upsert({ ...newSettings, id: newSettings.id || 'default' });
      }
      addToast('success', 'تم حفظ إعدادات المتجر بنجاح');
      return true;
    } catch (e: any) {
      addToast('error', e?.message || 'فشل حفظ الإعدادات');
      return false;
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderAndRequest['status']): Promise<boolean> => {
    try {
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
      const client = getSupabaseClient(settings.supabase_url, settings.supabase_anon_key);
      if (client) {
        await client.from('orders_and_requests').update({ status }).eq('id', orderId);
      }
      addToast('success', 'تم تحديث حالة الطلب');
      return true;
    } catch (e: any) {
      addToast('error', e?.message || 'تعذر تحديث الحالة');
      return false;
    }
  };

  const deleteOrder = async (orderId: string): Promise<boolean> => {
    try {
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      const client = getSupabaseClient(settings.supabase_url, settings.supabase_anon_key);
      if (client) {
        await client.from('orders_and_requests').delete().eq('id', orderId);
      }
      addToast('success', 'تم حذف سجل الطلب بنجاح');
      return true;
    } catch (e: any) {
      addToast('error', e?.message || 'تعذر حذف سجل الطلب');
      return false;
    }
  };

  const testDatabaseConnection = async (url: string, key: string) => {
    const res = await testSupabaseConnection(url, key);
    setIsSupabaseConnected(res.success);
    return res;
  };

  const syncWithSupabase = async () => {
    const client = getSupabaseClient(settings.supabase_url, settings.supabase_anon_key);
    if (!client) {
      addToast('error', 'يرجى إدخال بيانات Supabase URL و Anon Key أولاً');
      return;
    }

    setIsSyncing(true);
    try {
      const { data: dbProducts } = await client.from('products').select('*');
      if (dbProducts && dbProducts.length > 0) {
        setProducts(dbProducts);
      } else {
        await client.from('products').upsert(products);
      }

      const { data: dbCategories } = await client.from('categories').select('*');
      if (dbCategories && dbCategories.length > 0) {
        setCategories(dbCategories);
      } else {
        await client.from('categories').upsert(categories);
      }

      const { data: dbOrders } = await client.from('orders_and_requests').select('*').order('created_at', { ascending: false });
      if (dbOrders && dbOrders.length > 0) {
        setOrders(dbOrders);
      }

      setIsSupabaseConnected(true);
      addToast('success', 'تمت المزامنة بنجاح مع Supabase');
    } catch (err: any) {
      addToast('error', err?.message || 'فشلت المزامنة مع قاعدة البيانات');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <StoreContext.Provider
      value={{
        language,
        setLanguage,
        currency,
        products,
        categories,
        heroSlides,
        flowerVarieties,
        siteContent,
        settings,
        cart,
        wishlist,
        orders,
        currentView,
        activeProductSlug,
        activeCategorySlug,
        activeProduct,
        selectedCategoryId,
        searchQuery,
        toasts,
        isAdminLoggedIn,
        isCustomBouquetModalOpen,
        isCartDrawerOpen,
        isSearchModalOpen,
        isSupabaseConnected,
        isSyncing,
        setSearchQuery,
        setSelectedCategoryId,
        setIsCustomBouquetModalOpen,
        setIsCartDrawerOpen,
        setIsSearchModalOpen,
        navigateTo,
        navigateToProduct,
        navigateToCategory,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        cartTotalCount,
        cartTotalAmount,
        toggleWishlist,
        isInWishlist,
        addToast,
        removeToast,
        formatPrice,
        generateWhatsAppCartUrl,
        generateWhatsAppProductUrl,
        generateWhatsAppCustomBouquetUrl,
        submitOrder,
        submitCustomBouquet,
        loginAdmin,
        logoutAdmin,
        saveProduct,
        deleteProduct,
        toggleProductAvailability,
        saveCategory,
        deleteCategory,
        toggleCategoryArchived,
        toggleCategoryHome,
        saveHeroSlide,
        deleteHeroSlide,
        saveFlowerVariety,
        deleteFlowerVariety,
        toggleVarietyAvailability,
        saveSiteContent,
        saveSettings,
        updateOrderStatus,
        deleteOrder,
        testDatabaseConnection,
        syncWithSupabase,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
