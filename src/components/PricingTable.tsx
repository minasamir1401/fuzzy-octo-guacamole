import { API_URL } from "@/config/api";
// import { prisma } from "@/lib/prisma";

interface PricingTableProps {
  locale: string;
}

export default async function PricingTable({ locale }: PricingTableProps) {
  let prices = [];
  try {
    const res = await fetch(`${API_URL}/api/prices`, { cache: "no-store" });
    if (res.ok) {
      prices = await res.json();
    }
  } catch (error) {
    console.error("Error fetching prices:", error);
  }

  if (prices.length === 0) return null;

  // Group by category
  const groupedPrices = prices.reduce((acc: Record<string, any[]>, curr: any) => {
    if (!acc[curr.category]) acc[curr.category] = [];
    acc[curr.category].push(curr);
    return acc;
  }, {} as Record<string, any[]>);

  const parseName = (jsonStr: string) => {
    try {
      return JSON.parse(jsonStr)[locale] || JSON.parse(jsonStr).en || "Unnamed";
    } catch {
      return jsonStr;
    }
  };

  const parseDescription = (jsonStr: string | null) => {
    if (!jsonStr) return null;
    try {
      const parsed = JSON.parse(jsonStr);
      return parsed[locale] || parsed.en || null;
    } catch {
      return null;
    }
  };

  return (
    <section className="py-24 relative overflow-hidden bg-accent/30">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-6">
            {locale === 'ar' ? 'الأسعار والخدمات' : 'Pricing & Services'}
          </h2>
          <p className="text-xl text-foreground/60 max-w-2xl mx-auto font-light">
            {locale === 'ar' 
              ? 'نقدم لك أفضل أسعار الغوص في الغردقة بجودة وخدمة لا تضاهى.' 
              : 'Discover our premium diving services with competitive pricing.'}
          </p>
        </div>

        <div className="space-y-12">
          {(Object.entries(groupedPrices) as [string, any[]][]).map(([category, items]) => (
            <div key={category} className="bg-white rounded-[3rem] p-8 md:p-12 border border-primary/10 shadow-xl">
              <h3 className="text-2xl font-bold text-primary mb-8 uppercase tracking-widest flex items-center gap-4">
                <span className="w-12 h-1 bg-secondary rounded-full" />
                {category}
              </h3>
              
              <div className="divide-y divide-primary/5">
                {items.map((item) => (
                  <div key={item.id} className="py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-accent/30 px-4 rounded-2xl transition-colors">
                    <div className="flex flex-col">
                      <span className="text-xl font-medium text-foreground">{parseName(item.name)}</span>
                      {parseDescription(item.description) && (
                        <span className="text-sm text-foreground/50 font-light mt-1">
                          {parseDescription(item.description)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="h-[1px] w-12 md:w-32 bg-primary/10 hidden md:block" />
                      <span className="text-2xl font-bold text-primary bg-primary/5 px-6 py-2 rounded-full border border-primary/10 shadow-inner">
                        {item.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
