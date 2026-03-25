import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Smartphone, Building2, Wallet, ArrowLeft, CheckCircle, Lock, Shield, Clock, IndianRupee, Star, Check } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Payment() {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
    upiId: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    walletType: '',
    amount: '50000',
    saveCard: false
  });

  const location = useLocation();
  const caseData = location.state || {};
  const { caseId, caseTitle, fees, lawyerName } = caseData;
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);

  const paymentMethods = [
    {
      id: 'upi',
      name: 'UPI',
      icon: Smartphone,
      description: 'Google Pay, PhonePe, Paytm',
      popular: true,
      color: 'bg-green-50 border-green-200'
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Visa, Mastercard, RuPay',
      popular: true,
      color: 'bg-blue-50 border-blue-200'
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: Building2,
      description: 'All major banks',
      popular: false,
      color: 'bg-purple-50 border-purple-200'
    },
    {
      id: 'wallet',
      name: 'Digital Wallets',
      icon: Wallet,
      description: 'Paytm, Mobikwik, Ola Money',
      popular: false,
      color: 'bg-orange-50 border-orange-200'
    }
  ];

  const savedCards = [
    {
      id: 1,
      type: 'Visa',
      last4: '4242',
      expiry: '12/26',
      name: 'John Doe'
    },
    {
      id: 2,
      type: 'Mastercard',
      last4: '8888',
      expiry: '08/25',
      name: 'John Doe'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      setCompleted(true);
      setTimeout(() => {
        navigate('/client-dashboard');
      }, 4000);
    }, 4000);
  };

  const renderPaymentForm = () => {
    switch (selectedMethod) {
      case 'card':
        return (
          <div className="space-y-6">
            {/* Saved Cards */}
            {savedCards.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-slate-700">Saved Cards</h4>
                {savedCards.map((card) => (
                  <motion.div
                    key={card.id}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-between p-4 border border-slate-200 rounded-lg cursor-pointer hover:border-slate-300"
                  >
                    <div className="flex items-center space-x-3">
                      <CreditCard className="w-5 h-5 text-slate-600" />
                      <div>
                        <p className="font-medium text-slate-900">•••• •••• •••• {card.last4}</p>
                        <p className="text-sm text-slate-500">{card.type} • Expires {card.expiry}</p>
                      </div>
                    </div>
                    <Check className="w-5 h-5 text-green-500" />
                  </motion.div>
                ))}
                <div className="text-center py-2">
                  <span className="text-sm text-slate-500">or</span>
                </div>
              </div>
            )}

            {/* New Card Form */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-slate-700">Enter Card Details</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={paymentData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Expiry Date</label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={paymentData.expiryDate}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    value={paymentData.cvv}
                    onChange={handleInputChange}
                    placeholder="123"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    name="name"
                    value={paymentData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="saveCard"
                  name="saveCard"
                  checked={paymentData.saveCard}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, saveCard: e.target.checked }))}
                  className="rounded"
                />
                <label htmlFor="saveCard" className="text-sm text-slate-600">Save card for future payments</label>
              </div>
            </div>
          </div>
        );

      case 'upi':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">UPI ID</label>
              <input
                type="text"
                name="upiId"
                value={paymentData.upiId}
                onChange={handleInputChange}
                placeholder="yourname@upi"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                required
              />
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800 mb-3">
                <strong>Popular UPI Apps:</strong>
              </p>
              <div className="grid grid-cols-5 gap-4">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border">
                    <img src="https://img.icons8.com/color/48/google-pay.png" alt="Google Pay" className="w-8 h-8" />
                  </div>
                  <span className="text-xs text-green-700 font-medium">Google Pay</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border">
                    <img src="https://img.icons8.com/color/48/phone-pe.png" alt="PhonePe" className="w-8 h-8" />
                  </div>
                  <span className="text-xs text-green-700 font-medium">PhonePe</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border">
                    <img src="https://img.icons8.com/color/48/paytm.png" alt="Paytm" className="w-8 h-8" />
                  </div>
                  <span className="text-xs text-green-700 font-medium">Paytm</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border">
                    <img src="https://img.icons8.com/color/48/bhim.png" alt="BHIM" className="w-8 h-8" />
                  </div>
                  <span className="text-xs text-green-700 font-medium">BHIM</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border">
                    <img src="https://img.icons8.com/ios-filled/50/apple-pay.png" alt="Apple Pay" className="w-8 h-8" />
                  </div>
                  <span className="text-xs text-green-700 font-medium">Apple Pay</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'netbanking':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Select Your Bank</label>
              <select
                name="bankName"
                value={paymentData.bankName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                required
              >
                <option value="">Choose your bank</option>
                <option value="sbi">State Bank of India</option>
                <option value="hdfc">HDFC Bank</option>
                <option value="icici">ICICI Bank</option>
                <option value="axis">Axis Bank</option>
                <option value="pnb">Punjab National Bank</option>
                <option value="kotak">Kotak Mahindra Bank</option>
                <option value="idbi">IDBI Bank</option>
                <option value="federal">Federal Bank</option>
                <option value="other">Other Banks</option>
              </select>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Building2 className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-purple-900">Secure Banking</p>
                  <p className="text-sm text-purple-700">You will be redirected to your bank's secure login page.</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'wallet':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Digital Wallet</label>
              <select
                name="walletType"
                value={paymentData.walletType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                required
              >
                <option value="">Choose your wallet</option>
                <option value="paytm">Paytm</option>
                <option value="mobikwik">Mobikwik</option>
                <option value="ola">Ola Money</option>
                <option value="amazon">Amazon Pay</option>
                <option value="freecharge">FreeCharge</option>
                <option value="jio">JioMoney</option>
              </select>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Wallet className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-sm font-medium text-orange-900">Digital Wallet</p>
                  <p className="text-sm text-orange-700">Login to your digital wallet to complete the payment.</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (completed) {
    return (
      <div className="pt-24 pb-16 bg-slate-50 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Payment Successful!</h2>
          <p className="text-slate-600 mb-4">Your payment has been processed successfully.</p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-green-800">
              <strong>Transaction ID:</strong> TXN{Date.now()}<br/>
              <strong>Amount Paid:</strong> ₹{parseInt(paymentData.amount).toLocaleString()}<br/>
              <strong>Payment Method:</strong> {paymentMethods.find(m => m.id === selectedMethod)?.name}
            </p>
          </div>
          <p className="text-sm text-slate-500">Redirecting to dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/client-dashboard')}
                  className="bg-white/20 text-white p-2 rounded-lg hover:bg-white/30 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </motion.button>
                <div>
                  <h1 className="text-2xl font-bold text-white">Payment</h1>
                  <p className="text-slate-200">Complete your secure payment</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-white text-sm">100% Secure</span>
              </div>
            </div>
          </div>

          <div className="px-8 py-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Payment Methods */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="lg:col-span-1"
              >
                <h3 className="text-lg font-semibold text-slate-900 mb-6">Choose Payment Method</h3>
                <div className="space-y-3">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <motion.div
                        key={method.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedMethod(method.id)}
                        className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedMethod === method.id
                            ? 'border-slate-800 bg-slate-50 shadow-md'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {method.popular && (
                          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            Popular
                          </span>
                        )}
                        <div className="flex items-center space-x-3">
                          <Icon className={`w-6 h-6 ${
                            selectedMethod === method.id ? 'text-slate-800' : 'text-slate-600'
                          }`} />
                          <div>
                            <p className={`font-medium ${
                              selectedMethod === method.id ? 'text-slate-900' : 'text-slate-700'
                            }`}>
                              {method.name}
                            </p>
                            <p className="text-sm text-slate-500">{method.description}</p>
                          </div>
                        </div>
                        {selectedMethod === method.id && (
                          <Check className="w-5 h-5 text-slate-800 absolute top-4 right-4" />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Payment Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-2"
              >
                <h3 className="text-lg font-semibold text-slate-900 mb-6">
                  {paymentMethods.find(m => m.id === selectedMethod)?.name}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {renderPaymentForm()}

                  {/* Order Summary */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="bg-slate-50 rounded-lg p-6 border"
                  >
                    <h4 className="text-lg font-semibold text-slate-900 mb-4">Order Summary</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Case: {caseTitle || 'Property Dispute'}</span>
                        <span className="text-slate-900">₹{fees ? parseInt(fees).toLocaleString() : parseInt(paymentData.amount).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Lawyer: {lawyerName || 'Advocate Priya Sharma'}</span>
                        <span className="text-slate-900">Included</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Processing Fee</span>
                        <span className="text-slate-900">₹0</span>
                      </div>
                      <hr className="border-slate-200" />
                      <div className="flex justify-between text-lg font-semibold">
                        <span className="text-slate-900">Total Amount</span>
                        <span className="text-slate-900">₹{fees ? parseInt(fees).toLocaleString() : parseInt(paymentData.amount).toLocaleString()}</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Terms */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="space-y-4"
                  >
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id="terms"
                        className="mt-1"
                        required
                      />
                      <label htmlFor="terms" className="text-sm text-slate-600">
                        I agree to the <a href="#" className="text-slate-800 underline">Terms of Service</a> and
                        <a href="#" className="text-slate-800 underline ml-1">Privacy Policy</a>
                      </label>
                    </div>
                  </motion.div>

                  {/* Pay Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={processing}
                    className="w-full bg-slate-800 text-white py-4 px-6 rounded-lg font-semibold hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
                  >
                    {processing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Processing Payment...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5" />
                        <IndianRupee className="w-5 h-5" />
                        <span>Pay ₹{fees ? parseInt(fees).toLocaleString() : parseInt(paymentData.amount).toLocaleString()}</span>
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
