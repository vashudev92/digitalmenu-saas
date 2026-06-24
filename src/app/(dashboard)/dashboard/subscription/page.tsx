import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { CreditCard, Sparkles, Check, Calendar, Lock } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SubscriptionPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/login');
  }

  const restaurant = await db.restaurant.findUnique({
    where: { ownerId: session.user.id },
    include: {
      subscription: {
        include: {
          plan: true,
        },
      },
    },
  });

  if (!restaurant) {
    redirect('/register');
  }

  const activeSub = restaurant.subscription;
  const activePlanId = activeSub?.planId;

  // Fetch all plans
  const plans = await db.plan.findMany({
    orderBy: { price: 'asc' },
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold flex items-center gap-2">
          <CreditCard className="w-8 h-8 text-[#D4A437]" /> Subscription & Billing
        </h1>
        <p className="text-gray-400 text-sm mt-1">Review your plan tier, renew licenses, or upgrade limits.</p>
      </div>

      {/* Active Subscription Status Banner */}
      {activeSub && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-[#D4A437]/15 to-[#D4A437]/5 border border-[#D4A437]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Active Plan</span>
              <span className="px-2 py-0.5 rounded bg-[#D4A437]/20 border border-[#D4A437]/30 text-[10px] font-bold text-[#D4A437]">
                {activeSub.status}
              </span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-white">{activeSub.plan.name} Tier</h2>
            <p className="text-xs text-gray-400">
              {activeSub.plan.description}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-gray-950/60 border border-gray-900 px-4 py-3 rounded-2xl shrink-0">
            <Calendar className="w-5 h-5 text-[#D4A437]" />
            <div>
              <span className="block text-[10px] text-gray-500 font-bold uppercase tracking-wider">Expires On</span>
              <span className="block text-sm font-semibold text-white">
                {new Date(activeSub.endDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Plans Comparison Grid */}
      <div className="space-y-6">
        <h3 className="font-serif text-xl font-bold">Available Plan Tiers</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isActive = activePlanId === plan.id;
            return (
              <div
                key={plan.id}
                className={`glass p-6 rounded-3xl flex flex-col justify-between transition-all duration-300 ${
                  isActive
                    ? 'border-[#D4A437] bg-gradient-to-b from-[#D4A437]/5 to-transparent'
                    : 'border-gray-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-lg text-white">{plan.name}</h4>
                    {isActive && (
                      <span className="text-[10px] bg-[#D4A437] text-black px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                        Active
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline mb-4">
                    <span className="text-3xl font-serif font-bold">${plan.price}</span>
                    <span className="text-gray-500 text-xs ml-1">/ month</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-6 leading-relaxed min-h-[36px]">{plan.description}</p>
                  
                  <div className="border-t border-gray-900 my-4" />
                  
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-300">
                        <Check className="w-3.5 h-3.5 text-[#D4A437] shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {!isActive && (
                  <button
                    disabled
                    className="w-full text-center py-3 rounded-xl border border-gray-950 text-gray-500 bg-gray-950/40 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-not-allowed"
                  >
                    <Lock className="w-3.5 h-3.5" /> Upgrade Sandbox Only
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
