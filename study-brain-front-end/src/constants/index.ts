export const STORAGE_KEYS = {
  API_KEY: 'gemini_api_key',
  CONVERSATIONS: 'pdf_ai_conversations',
  ACTIVE_CONVERSATION: 'pdf_ai_active_conversation',
} as const;

export const FILE_LIMITS = {
  PDF_MAX_SIZE: 200 * 1024 * 1024, // 200MB
  IMAGE_MAX_SIZE: 20 * 1024 * 1024, // 20MB
  ACCEPTED_PDF_TYPES: ['application/pdf'],
  ACCEPTED_IMAGE_TYPES: ['image/png', 'image/jpg', 'image/jpeg', 'image/webp', 'image/gif', 'application/pdf'],
  ACCEPTED_IMAGE_EXTENSIONS: '.png,.jpg,.jpeg,.webp,.gif,.pdf',
} as const;

export const TOAST_MESSAGES = {
  UPLOAD_PDF_FIRST: 'ابتدا فایل PDF را بارگذاری کنید.',
  UPLOAD_SUCCESS: 'فایل با موفقیت بارگذاری شد.',
  INVALID_FILE: 'فرمت فایل پشتیبانی نمی‌شود.',
  TOO_LARGE: 'حداکثر حجم فایل ۲۰۰ مگابایت است.',
  API_KEY_SAVED: 'کلید API با موفقیت ذخیره شد.',
  API_KEY_REQUIRED: 'لطفاً کلید API را وارد کنید.',
  COPY_SUCCESS: 'پیام کپی شد.',
  LOGOUT_SUCCESS: 'با موفقیت خارج شدید.',
  SEND_ERROR: 'خطا در ارسال پیام. لطفاً دوباره تلاش کنید.',
  CONVERSATION_RENAMED: 'نام مکالمه تغییر کرد.',
  CONVERSATION_DELETED: 'مکالمه حذف شد.',
} as const;

export const UI_TEXT = {
  APP_NAME: 'دستیار هوشمند PDF',
  WELCOME_TITLE: 'دستیار مطالعه جزوه برای امتحانات',
  WELCOME_SUBTITLE: 'فایل PDF خود را بارگذاری کنید و سوالات خود را بپرسید.',
  INPUT_PLACEHOLDER: 'پیام خود را بنویسید...',
  HELPER_TEXT: 'ابتدا فایل PDF خود را بارگذاری کنید، سپس می‌توانید تصاویر سوال و پیام خود را ارسال نمایید.',
  NEW_CHAT: 'گفتگوی جدید',
  CHAT_HISTORY: 'تاریخچه گفتگوها',
  SEARCH_PLACEHOLDER: 'جستجو در گفتگوها...',
  LOGOUT: 'خروج از حساب',
  API_KEY_TITLE: 'دستیار هوشمند PDF فارسی',
  API_KEY_SUBTITLE: 'برای استفاده از این سرویس، کلید API گوگل جمینی خود را وارد کنید.',
  API_KEY_LABEL: 'کلید API گوگل جمینی',
  API_KEY_PLACEHOLDER: 'AIza...',
  API_KEY_CONTINUE: 'ورود به دستیار',
  API_KEY_REMEMBER: 'کلید API را به خاطر بسپار',
  API_KEY_GET: 'دریافت کلید API از Google AI Studio',
  SEND: 'ارسال',
  UPLOAD_PDF: 'بارگذاری PDF',
  UPLOAD_IMAGE: 'بارگذاری تصویر',
  LOADING: 'در حال پردازش...',
  COPY: 'کپی پیام',
  REGENERATE: 'تولید مجدد',
  DELETE: 'حذف',
  RENAME: 'تغییر نام',
  CANCEL: 'لغو',
  CONFIRM: 'تایید',
  TODAY: 'امروز',
  YESTERDAY: 'دیروز',
  OLDER: 'قدیمی‌تر',
  NO_CONVERSATIONS: 'هیچ گفتگویی یافت نشد',
  EMPTY_SEARCH: 'نتیجه‌ای برای جستجوی شما یافت نشد.',
} as const;

export const GEMINI_CONFIG = {
  // Gemini 3.1 Flash-Lite is the requested current model.
  MODEL: 'gemini-3.1-flash-lite',
  SYSTEM_PROMPT: `شما یک دستیار هوشمند فارسی‌زبان هستید که در تحلیل و پاسخ به سوالات مربوط به اسناد PDF تخصص دارید.
  
  قوانین:
  - همیشه به فارسی پاسخ دهید مگر اینکه صریحاً خواسته شود.
  - پاسخ‌های دقیق، کامل و مفید ارائه دهید.
  - در صورت عدم اطمینان، صادقانه اعلام کنید.
  - از فرمت markdown برای ساختاردهی بهتر پاسخ‌ها استفاده کنید.
  - اطلاعات مربوطه را از اسناد ارائه‌شده استخراج و ذکر کنید.`,
} as const;
