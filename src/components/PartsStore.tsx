import React, { useState } from "react";
import { Wrench, ShoppingCart, ShieldCheck, Check, Trash2, ArrowRight, DollarSign, Sparkles, AlertCircle } from "lucide-react";
import { PartsItem } from "../types";

interface PartsStoreProps {
  initialParts: PartsItem[];
  userEmail: string;
}

export default function PartsStore({ initialParts, userEmail }: PartsStoreProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [cart, setCart] = useState<Array<{ item: PartsItem; quantity: number }>>([]);
  const [isCheckout, setIsCheckout] = useState<boolean>(false);
  const [paymentStatusText, setPaymentStatusText] = useState<string>("Demo Mode: Double check parts compatibility.");
  const [paymentLoading, setPaymentLoading] = useState<boolean>(false);
  const [cardNumber, setCardNumber] = useState<string>("4000 1234 5678 9010");

  const categories = ["All", "Engine", "Brakes", "Filters", "Electrical", "Accessories"];

  const filtered = initialParts.filter(
    (p) => selectedCategory === "All" || p.category === selectedCategory
  );

  function addToCart(part: PartsItem) {
    const existing = cart.find((entry) => entry.item.id === part.id);
    if (existing) {
      setCart(
        cart.map((entry) =>
          entry.item.id === part.id ? { ...entry, quantity: entry.quantity + 1 } : entry
        )
      );
    } else {
      setCart([...cart, { item: part, quantity: 1 }]);
    }
  }

  function removeFromCart(partId: string) {
    setCart(cart.filter((entry) => entry.item.id !== partId));
  }

  function updateQuantity(partId: string, q: number) {
    if (q <= 0) {
      removeFromCart(partId);
      return;
    }
    setCart(
      cart.map((entry) =>
        entry.item.id === partId ? { ...entry, quantity: q } : entry
      )
    );
  }

  const subtotal = cart.reduce((total, entry) => total + entry.item.price * entry.quantity, 0);
  const deliveryCharges = subtotal > 15000 ? 0 : 450;
  const totalAmount = subtotal + deliveryCharges;

  async function handleCheckoutSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPaymentLoading(true);
    setPaymentStatusText("");

    setTimeout(() => {
      setPaymentStatusText("SUCCESS! Your payment is confirmed via secure Stripe sandbox. Authorized parts shipping details forwarded to: " + (userEmail || "starpanther0@gmail.com"));
      setPaymentLoading(false);
      setTimeout(() => {
        setCart([]);
        setIsCheckout(false);
        setPaymentStatusText("Demo Mode: Double check parts compatibility.");
      }, 3500);
    }, 2000);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-slate-800 bg-[#F8FAFC]">
      
      {/* Header section */}
      <div className="text-center mb-10">
        <span className="text-xs font-bold font-mono tracking-widest text-[#0D7A43] bg-[#0D7A43]/10 px-3 py-1.5 rounded-full uppercase">
          DriveSphere 3S Spares
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mt-3 text-slate-950">
          Genuine Certified Parts Store
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto mt-2 text-sm md:text-base">
          Safeguard your vehicle lifespan with 100% official Toyota Indus compatible lubricants, active cabin carbon purifiers, and high coefficient braking plates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Parts listing catalog - left */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Category filter pills */}
          <div className="flex flex-wrap gap-1 bg-white p-2 border border-slate-100 rounded-xl shadow-sm">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedCategory === cat ? "bg-[#0D7A43] text-white" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Parts Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((part) => (
              <div
                key={part.id}
                id={`part-item-${part.id}`}
                className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-mono uppercase bg-slate-100 text-slate-500 px-2 py-0.5 rounded leading-none">
                      Code: {part.partNo}
                    </span>
                    <span className="text-[10px] bg-[#0D7A43]/10 text-[#0D7A43] font-bold px-2 py-0.5 rounded leading-none">
                      {part.category}
                    </span>
                  </div>

                  <h3 className="text-md font-extrabold text-slate-900 leading-tight">{part.name}</h3>
                  <p className="text-[11px] text-slate-500 mt-2 line-clamp-2 leading-relaxed">{part.description}</p>
                  
                  <div className="bg-slate-50 border border-slate-100 p-2 rounded-xl mt-3 text-[10.5px]">
                    <span className="block font-bold text-slate-700">OEM Compatibility matching:</span>
                    <span className="block mt-0.5 text-slate-600 italic font-mono">{part.compatibility}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50">
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase font-mono">Verified Price</span>
                    <strong className="text-md font-mono text-[#0D7A43] font-black">
                      PKR {part.price.toLocaleString()}
                    </strong>
                  </div>

                  <button
                    id={`btn-add-part-${part.id}`}
                    onClick={() => addToCart(part)}
                    className="px-3.5 py-1.5 bg-[#0D7A43] hover:bg-[#07532d] text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <span>ADD TO CART</span>
                    <ShoppingCart className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Shopping Cart Sidebar Section - right */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 shadow-xl border border-slate-100 min-h-[460px] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3 text-slate-900">
              <ShoppingCart className="w-5 h-5 text-[#0D7A43]" />
              <h2 className="text-md font-bold">Your Checkout Basket ({cart.length})</h2>
            </div>

            {/* Cart Items list */}
            <div className="space-y-3.5 max-h-[250px] overflow-y-auto pr-1 text-xs">
              {cart.map((entry) => (
                <div key={entry.item.id} className="flex items-start justify-between gap-2 border-b border-slate-50 pb-2.5">
                  <div className="flex-1">
                    <span className="font-bold text-slate-900 block leading-tight">{entry.item.name}</span>
                    <span className="text-[10px] text-slate-400 block font-mono mt-0.5">PKR {entry.item.price.toLocaleString()} each</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg">
                      <button
                        onClick={() => updateQuantity(entry.item.id, entry.quantity - 1)}
                        className="font-bold text-slate-500 hover:text-slate-800 text-xs px-1"
                      >
                        -
                      </button>
                      <span className="font-mono font-bold text-slate-800">{entry.quantity}</span>
                      <button
                        onClick={() => updateQuantity(entry.item.id, entry.quantity + 1)}
                        className="font-bold text-slate-500 hover:text-slate-800 text-xs px-1"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(entry.item.id)}
                      className="p-1 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {cart.length === 0 && (
                <div className="py-12 text-center text-slate-400 italic">
                  <ShoppingCart className="w-10 h-10 mx-auto mb-2 stroke-[1.2] opacity-50" />
                  <span>Basket is currently empty. Add authorized parts from catalog listings.</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 space-y-4">
            
            {/* Totals Box */}
            {cart.length > 0 && (
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal:</span>
                  <span className="font-mono text-slate-800">PKR {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Delivery Dispatch Cargo:</span>
                  <span className="font-mono text-slate-800">
                    {deliveryCharges === 0 ? "FREE Shipping" : `PKR ${deliveryCharges}`}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold border-t border-slate-100 pt-2 text-slate-900">
                  <span>Grand Total amount:</span>
                  <span className="font-mono text-[#0D7A43] text-base">PKR {totalAmount.toLocaleString()}</span>
                </div>
                
                <span className="text-[10px] text-gray-400 block font-mono italic leading-none pt-1">
                  * Free cargo dispatch on orders exceeding PKR 15,000 threshold.
                </span>
              </div>
            )}

            {cart.length > 0 && (
              <button
                id="parts-checkout-trigger"
                onClick={() => setIsCheckout(true)}
                className="w-full py-3 bg-[#0D7A43] hover:bg-[#07532d] text-white font-bold rounded-xl text-xs tracking-wider transition-all flex items-center justify-center gap-1.5"
              >
                <span>PROCEED TO PAYMENT</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

          </div>

        </div>

      </div>

      {/* SECURE CHECKOUT INNER PANEL CARD OVERLAY */}
      {isCheckout && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsCheckout(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 font-bold text-lg"
            >
              &times;
            </button>

            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
              <Sparkles className="w-5 h-5 text-[#D4AF37]" />
              <h3 className="text-md font-extrabold text-slate-900 font-sans uppercase">DriveSphere Spares Checkout</h3>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block uppercase font-mono">Invoice Order Summary</span>
                <div className="flex justify-between font-bold text-slate-800 text-sm mt-1">
                  <span>Authorized Spare Components</span>
                  <span className="font-mono text-[#0D7A43]">PKR {totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Shipping Shipping Address</label>
                <textarea
                  required
                  placeholder="Street Plot, Sector Blvd Road, Karachi/Lahore"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-[#0D7A43]"
                  rows={2}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Card Details (Simulated Stripe Gateway)</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono ml-0 focus:outline-none"
                  placeholder="Card Number"
                />
              </div>

              {paymentStatusText && (
                <div className={`p-3 rounded-lg text-[10.5px] leading-relaxed ${
                  paymentStatusText.includes("SUCCESS") ? "bg-green-50 border border-green-200 text-green-700" : "bg-blue-50 text-blue-700"
                }`}>
                  {paymentStatusText}
                </div>
              )}

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCheckout(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  BACK
                </button>
                <button
                  type="submit"
                  disabled={paymentLoading}
                  className="flex-1 py-2.5 bg-[#0D7A43] hover:bg-[#07532d] text-white font-bold rounded-xl transition-all"
                >
                  {paymentLoading ? "PROCESSING SECURE TOKEN..." : "CONFIRM & TRANSACT"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
