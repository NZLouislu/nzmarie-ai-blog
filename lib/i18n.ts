import { useLanguageStore } from "./stores/languageStore";

type Language = "en" | "zh";

interface Translations {
  [key: string]: {
    en: string;
    zh: string;
  };
}

const translations: Translations = {
  aboutMeTitle: {
    en: "Marie Nian",
    zh: "Marie Nian",
  },
  aboutMeDescription: {
    en: "Real Estate Agent, Property Expert, and Lifetime Learner.",
    zh: "房地产经纪人、房产专家和终身学习者。",
  },
  featuredTags: {
    en: "Featured Tags",
    zh: "精选标签",
  },
  friends: {
    en: "Friends",
    zh: "友情链接",
  },
  friendsDescription: {
    en: "Explore amazing content",
    zh: "发现更多精彩内容",
  },
  comments: {
    en: "Comments",
    zh: "评论",
  },
  leaveComment: {
    en: "Leave Comment",
    zh: "发表评论",
  },
  cancel: {
    en: "Cancel",
    zh: "取消",
  },
  name: {
    en: "Name",
    zh: "姓名",
  },
  email: {
    en: "Email",
    zh: "邮箱",
  },
  comment: {
    en: "Comment",
    zh: "评论",
  },
  commentAnonymously: {
    en: "Comment anonymously",
    zh: "匿名评论",
  },
  submitComment: {
    en: "Submit Comment",
    zh: "提交评论",
  },
  submitting: {
    en: "Submitting...",
    zh: "提交中...",
  },
  noComments: {
    en: "No comments yet. Be the first to leave a comment!",
    zh: "暂无评论。来发表第一条评论吧！",
  },
  anonymous: {
    en: "Anonymous",
    zh: "匿名用户",
  },
  aiSummary: {
    en: "AI Summary",
    zh: "AI摘要",
  },
  generating: {
    en: "Generating...",
    zh: "生成中...",
  },
  generatingSummary: {
    en: "Generating Summary, please wait...",
    zh: "正在生成摘要，请稍候...",
  },
  askAiAboutArticle: {
    en: "Ask AI About This Article",
    zh: "向AI询问本文内容",
  },
  askMeAnything: {
    en: "Ask me anything about this article!",
    zh: "向我询问本文的任何问题！",
  },
  thinking: {
    en: "Thinking...",
    zh: "思考中...",
  },
  ask: {
    en: "Ask",
    zh: "提问",
  },
  askQuestionPlaceholder: {
    en: "Ask a question about this article...",
    zh: "询问本文相关问题...",
  },
  generationFailed: {
    en: "Generation failed, please try again later",
    zh: "生成失败，请稍后重试",
  },
  networkError: {
    en: "Network error: Failed to submit comment. Please try again.",
    zh: "网络错误：评论提交失败，请重试。",
  },
  failedToSubmit: {
    en: "Failed to submit comment",
    zh: "评论提交失败",
  },
  unknownError: {
    en: "Unknown error",
    zh: "未知错误",
  },
  sorryError: {
    en: "Sorry, I encountered an error. Please try again.",
    zh: "抱歉，遇到错误，请重试。",
  },
};

export function useTranslation() {
  const { language } = useLanguageStore();

  const t = (key: keyof Translations): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation key "${key}" not found`);
      return String(key);
    }
    return translation[language] || translation.en;
  };

  return { t, language };
}

export type { Language, Translations };
