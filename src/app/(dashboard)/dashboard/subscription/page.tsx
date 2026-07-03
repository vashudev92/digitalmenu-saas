'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Sparkles, Check, Calendar, Lock, Clock, ArrowRight, ShieldCheck, Landmark } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import ImageCropper from '@/components/image-cropper';

interface Plan {
  id: string;
  name: string;
  price: number;
  description: string | null;
  features: string[];
  diningAreasAllowed: number;
  qrCodesAllowed: number;
  galleryImagesAllowed: number;
  premiumThemesAllowed: boolean;
  storageGb: number;
  supportLevel: string;
  billingCycleQuarterlyCost: number;
  billingCycleYearlyCost: number;
}

interface Subscription {
  id: string;
  status: string;
  planId: string;
  billingCycle: string;
  startDate: string;
  endDate: string;
  plan: Plan;
}

interface UpgradeRequest {
  id: string;
  planId: string;
  billingCycle: string;
  amount: number;
  referenceNo: string | null;
  status: string;
  createdAt: string;
  plan: Plan;
}

export default function SubscriptionPage() {
  const [loading, setLoading] = useState(true);
  const [sub, setSub] = useState<Subscription | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [pendingReqs, setPendingReqs] = useState<UpgradeRequest[]>([]);
  
  // Upgrade Modal State
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'QUARTERLY' | 'YEARLY'>('MONTHLY');
  const [referenceNo, setReferenceNo] = useState('');
  const [gstNo, setGstNo] = useState('');
  const [paymentProof, setPaymentProof] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load restaurant details & sub
      const resProfile = await fetch('/api/profile');
      const profileData = await resProfile.json();
      
      if (profileData && profileData.subscription) {
        setSub(profileData.subscription);
      }

      // Load plans
      const resPlans = await fetch('/api/admin/plans');
      const plansData = await resPlans.json();
      if (plansData.plans) {
        setPlans(plansData.plans);
      } else {
        // Fallback default mock plans if admin endpoint has issue
        setPlans([
          {
            id: 'free',
            name: 'Free',
            price: 0,
            description: 'Perfect for small cafes to display a simple digital menu.',
            features: ['Up to 2 Categories', 'Up to 15 Menu Items', '1 QR Code Template', 'Standard Theme'],
            diningAreasAllowed: 1,
            qrCodesAllowed: 1,
            galleryImagesAllowed: 2,
            premiumThemesAllowed: false,
            storageGb: 0.5,
            supportLevel: 'Standard',
            billingCycleQuarterlyCost: 0,
            billingCycleYearlyCost: 0,
          }
        ]);
      }

      // Load pending requests
      const resReqs = await fetch('/api/profile/upgrade');
      const reqsData = await resReqs.json();
      if (reqsData.requests) {
        setPendingReqs(reqsData.requests);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateRequest = async () => {
    if (!selectedPlan) return;
    if (!referenceNo.trim()) {
      alert('Please provide transaction reference/UTR number.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/profile/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: selectedPlan.id,
          billingCycle,
          paymentMode: 'BANK_TRANSFER',
          paymentProof,
          referenceNo,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate upgrade request');
      }

      alert('Your subscription upgrade request has been logged successfully and is pending verification.');
      setSelectedPlan(null);
      setReferenceNo('');
      setPaymentProof(null);
      loadData();
    } catch (err) {
      alert('Error updating plan. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getPlanPrice = (plan: Plan, cycle: 'MONTHLY' | 'QUARTERLY' | 'YEARLY') => {
    if (cycle === 'YEARLY') return plan.billingCycleYearlyCost || plan.price * 12 * 0.8;
    if (cycle === 'QUARTERLY') return plan.billingCycleQuarterlyCost || plan.price * 3 * 0.9;
    return plan.price;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-8 h-8 rounded-full border-2 border-[#D4A437] border-t-transparent animate-spin" />
        <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">Loading subscription profiles...</span>
      </div>
    );
  }

  const activeRequest = pendingReqs[0];

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-left">
      <div>
        <h1 className="font-serif text-3xl font-bold flex items-center gap-2 text-white">
          <CreditCard className="w-8 h-8 text-[#D4A437]" /> Subscription & Billing
        </h1>
        <p className="text-gray-400 text-sm mt-1">Review your plan tier, renew licenses, or upgrade limits.</p>
      </div>

      {/* Warning/Pending banner */}
      {activeRequest && (
        <div className="p-5 rounded-3xl bg-[#D4A437]/5 border border-[#D4A437]/20 flex items-start gap-4">
          <Clock className="w-5 h-5 text-[#D4A437] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-[#D4A437] uppercase tracking-wider">Upgrade Request Pending Verification</h4>
            <p className="text-xs text-gray-300">
              Your request to upgrade to the <strong className="text-white">{activeRequest.plan?.name}</strong> plan ({activeRequest.billingCycle}) is currently under review by our operations team. UTR Reference No: <span className="font-mono text-white bg-white/5 px-1.5 py-0.5 rounded">{activeRequest.referenceNo}</span>.
            </p>
            <p className="text-[10px] text-gray-500">Requested on: {new Date(activeRequest.createdAt).toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Active Subscription Status Banner */}
      {sub ? (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-[#D4A437]/10 to-[#D4A437]/0 border border-white/[0.04] flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-[#D4A437]/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Current Plan</span>
              <Badge variant="gold">{sub.status}</Badge>
              <span className="text-[10px] text-gray-400 font-mono">({sub.billingCycle})</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-white">{sub.plan.name} Tier</h2>
            <p className="text-xs text-gray-400 leading-relaxed max-w-md">
              {sub.plan.description || 'Premium layout experiences and multi-area QR capabilities.'}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/[0.02] border border-white/[0.04] px-5 py-4 rounded-2xl shrink-0">
            <Calendar className="w-5 h-5 text-[#D4A437]" />
            <div>
              <span className="block text-[8px] text-gray-500 font-bold uppercase tracking-wider">Expires On</span>
              <span className="block text-sm font-semibold text-white font-mono">
                {new Date(sub.endDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.04] text-center">
          <p className="text-xs text-gray-500">No active subscription found. Please request plan activation.</p>
        </div>
      )}

      {/* Plans Comparison Grid */}
      <div className="space-y-6">
        <h3 className="font-serif text-xl font-bold text-white">Choose a Higher Tier</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isActive = sub?.planId === plan.id;
            return (
              <Card
                key={plan.id}
                variant={isActive ? 'glass' : 'default'}
                className={`p-6 flex flex-col justify-between relative ${isActive ? 'border-[#D4A437]/30' : ''}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-sm text-white tracking-wide uppercase">{plan.name}</h4>
                    {isActive && <Badge variant="gold">Active</Badge>}
                  </div>
                  
                  <div className="flex items-baseline mb-4">
                    <span className="text-2xl font-serif font-bold text-white">${plan.price}</span>
                    <span className="text-gray-500 text-[10px] ml-1">/ month</span>
                  </div>
                  
                  <p className="text-[11px] text-gray-400 mb-6 leading-normal min-h-[36px]">{plan.description}</p>
                  
                  <div className="border-t border-white/5 my-4" />
                  
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2 text-[10px] text-gray-300">
                      <Check className="w-3.5 h-3.5 text-[#D4A437]" />
                      <span>{plan.diningAreasAllowed} Dining Areas</span>
                    </li>
                    <li className="flex items-center gap-2 text-[10px] text-gray-300">
                      <Check className="w-3.5 h-3.5 text-[#D4A437]" />
                      <span>{plan.qrCodesAllowed} QR Formats</span>
                    </li>
                    <li className="flex items-center gap-2 text-[10px] text-gray-300">
                      <Check className="w-3.5 h-3.5 text-[#D4A437]" />
                      <span>{plan.storageGb} GB File Storage</span>
                    </li>
                    {plan.features.slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-[10px] text-gray-300">
                        <Check className="w-3.5 h-3.5 text-[#D4A437]" />
                        <span className="truncate">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {!isActive ? (
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setSelectedPlan(plan);
                      setBillingCycle('MONTHLY');
                    }}
                  >
                    Select Plan <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm" className="w-full" disabled>
                    Active Plan
                  </Button>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* Manual Payment request form drawer */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-zinc-950 border border-white/5 rounded-3xl p-6 relative flex flex-col gap-6 text-left max-h-[90vh] overflow-y-auto">
            <div>
              <h3 className="font-serif text-xl font-bold text-white">Upgrade Request: {selectedPlan.name}</h3>
              <p className="text-gray-400 text-xs mt-1">Submit bank transfer receipt proof to activate your upgraded quotas.</p>
            </div>

            <button
              onClick={() => setSelectedPlan(null)}
              className="absolute top-5 right-5 p-1 rounded-lg text-gray-500 hover:text-white"
            >
              Close
            </button>

            {/* Step 1: Billing Cycle */}
            <div className="space-y-3">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Select Cycle</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setBillingCycle('MONTHLY')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    billingCycle === 'MONTHLY'
                      ? 'border-[#D4A437] bg-[#D4A437]/5 text-[#D4A437]'
                      : 'border-white/5 bg-white/[0.01] text-gray-400'
                  }`}
                >
                  <span className="block text-xs font-bold">Monthly</span>
                  <span className="text-[10px]">${getPlanPrice(selectedPlan, 'MONTHLY')}/mo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('QUARTERLY')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    billingCycle === 'QUARTERLY'
                      ? 'border-[#D4A437] bg-[#D4A437]/5 text-[#D4A437]'
                      : 'border-white/5 bg-white/[0.01] text-gray-400'
                  }`}
                >
                  <span className="block text-xs font-bold">Quarterly</span>
                  <span className="text-[10px]">${getPlanPrice(selectedPlan, 'QUARTERLY')}/qt</span>
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('YEARLY')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    billingCycle === 'YEARLY'
                      ? 'border-[#D4A437] bg-[#D4A437]/5 text-[#D4A437]'
                      : 'border-white/5 bg-white/[0.01] text-gray-400'
                  }`}
                >
                  <span className="block text-xs font-bold">Yearly (Save)</span>
                  <span className="text-[10px]">${getPlanPrice(selectedPlan, 'YEARLY')}/yr</span>
                </button>
              </div>
            </div>

            {/* Step 2: Bank transfer instructions */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
              <div className="flex items-center gap-2">
                <Landmark className="w-4 h-4 text-[#D4A437]" />
                <span className="text-[10px] text-white font-bold uppercase tracking-wider">Bank Details</span>
              </div>
              <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
                <div>
                  <span className="block text-[9px] text-gray-500 font-bold uppercase">Bank Name</span>
                  <span className="text-white font-semibold">Antigravity Commercial Bank</span>
                </div>
                <div>
                  <span className="block text-[9px] text-gray-500 font-bold uppercase">Account Name</span>
                  <span className="text-white font-semibold">DigitalMenu SaaS Inc.</span>
                </div>
                <div>
                  <span className="block text-[9px] text-gray-500 font-bold uppercase">Account No</span>
                  <span className="text-white font-semibold font-mono">9876 5432 1010</span>
                </div>
                <div>
                  <span className="block text-[9px] text-gray-500 font-bold uppercase">IFSC Code</span>
                  <span className="text-white font-semibold font-mono">ACBI0001337</span>
                </div>
              </div>
              <div className="border-t border-white/5 pt-2 flex items-center justify-between">
                <span className="text-xs text-gray-400">Total Transfer Amount:</span>
                <span className="text-sm font-bold text-[#D4A437]">
                  ${getPlanPrice(selectedPlan, billingCycle).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Step 3: Transaction proof */}
            <div className="space-y-4">
              <Input
                label="UTR / Bank Transaction Reference No (Required)"
                value={referenceNo}
                onChange={(e) => setReferenceNo(e.target.value)}
                placeholder="Enter 12-digit transaction ID"
              />
              
              <Input
                label="GSTIN Number (Optional)"
                value={gstNo}
                onChange={(e) => setGstNo(e.target.value)}
                placeholder="27AAAAA1111A1Z1"
              />

              <div>
                <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">Upload Transfer Receipt</span>
                <ImageCropper
                  label="Receipt Proof File"
                  aspectRatio="square"
                  value={paymentProof || ''}
                  onChange={(val) => setPaymentProof(val)}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                variant="ghost"
                onClick={() => setSelectedPlan(null)}
                className="flex-1"
              >
                Cancel
              </Button>
              
              <Button
                variant="primary"
                onClick={handleCreateRequest}
                isLoading={submitting}
                className="flex-1"
              >
                Request Verification
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
