import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { action, context, jobTitle } = await req.json();

    let ZAI: any;
    try {
      const mod = await import('z-ai-web-dev-sdk');
      ZAI = mod.default || mod;
    } catch {
      return NextResponse.json({ error: 'AI SDK not available' }, { status: 500 });
    }

    const zai = await ZAI.create();
    const isArabic = context?.language === 'ar';

    let prompt = '';
    switch (action) {
      case 'suggestSummary':
        prompt = isArabic
          ? `اكتب ملخصاً احترافياً للسيرة الذاتية لوظيفة "${jobTitle}". يجب أن يكون الملخص 3-4 جمل ويبرز المهارات والخبرات الرئيسية. اكتب الملخص فقط بدون عناوين.`
          : `Write a professional resume summary for a "${jobTitle}" position. 3-4 sentences highlighting key skills and experience. Write only the summary.`;
        break;
      case 'improveDescription':
        prompt = isArabic
          ? `حسّن صياغة الوصف الوظيفي التالي ليكون أكثر احترافية وتأثيراً. استخدم أفعالاً قوية ونتائج قابلة للقياس:\n\n${context?.description || ''}`
          : `Improve the following job description for a resume. Use strong action verbs and measurable results:\n\n${context?.description || ''}`;
        break;
      case 'suggestSkills':
        prompt = isArabic
          ? `اقترح 10 مهارات تقنية و5 مهارات شخصية مناسبة لوظيفة "${jobTitle}". اكتب المهارات فقط مفصولة بفواصل.`
          : `Suggest 10 technical skills and 5 soft skills relevant to a "${jobTitle}" position. List skills only, separated by commas.`;
        break;
      case 'atsKeywords':
        prompt = isArabic
          ? `اقترح 15 كلمة مفتاحية مهمة لأنظمة ATS لوظيفة "${jobTitle}". اكتب الكلمات فقط مفصولة بفواصل.`
          : `Suggest 15 important ATS keywords for a "${jobTitle}" position. Keywords only, separated by commas.`;
        break;
      case 'review':
        prompt = isArabic
          ? `قيّم السيرة الذاتية التالية وأعطِ تقييماً شاملاً يتضمن:\n1. نقاط القوة\n2. نقاط الضعف\n3. اقتراحات التحسين\n4. درجة من 100\n\n${context?.resumeData || ''}`
          : `Review the following resume and provide:\n1. Strengths\n2. Weaknesses\n3. Improvement suggestions\n4. Score out of 100\n\n${context?.resumeData || ''}`;
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a professional resume writing expert. Provide clear, actionable advice. Respond in the same language as the prompt.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const result = completion.choices?.[0]?.message?.content || '';
    return NextResponse.json({ result });
  } catch (error: any) {
    console.error('AI API error:', error);
    return NextResponse.json({ error: error.message || 'AI service error' }, { status: 500 });
  }
}
