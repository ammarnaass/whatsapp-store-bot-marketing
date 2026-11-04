import { useState } from 'react';
import { api } from '../../../api-bridge';

export interface SandboxMessage {
  role: 'user' | 'agent';
  text: string;
  tools?: any[];
  latency?: number;
}

export function useAgentSandbox() {
  const [messages, setMessages] = useState<SandboxMessage[]>([
    {
      role: 'agent',
      text: 'مرحباً بك! أنا وكيلك الذكي في متجر واتساب، مدرب لبيع المنتجات الفيزيائية والرقمية والرد بدقة ضمن حدودك الرسمية (0% خصم). جرب محادثتي بسؤال، طلب منتج، أو طلب خصم!',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (textToSend?: string) => {
    const message = textToSend || input;
    if (!message.trim() || isLoading) return;

    const newHistory = [...messages, { role: 'user' as const, text: message }];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      const response = await api.agent.testSandbox(message);
      setMessages([
        ...newHistory,
        {
          role: 'agent',
          text: response.replyText,
          tools: response.toolsCalled,
          latency: response.latencyMs,
        },
      ]);
    } catch {
      setMessages([
        ...newHistory,
        {
          role: 'agent',
          text: 'عذراً، حدث خطأ أثناء تشغيل المحاكاة. يرجى التأكد من إدخال مفتاح Gemini API في الإعدادات.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([
      {
        role: 'agent',
        text: 'تمت إعادة تعيين ساحة التجربة. جرب سيناريو بيع جديد!',
      },
    ]);
  };

  return {
    messages,
    input,
    setInput,
    isLoading,
    sendMessage,
    clearMessages,
  };
}
