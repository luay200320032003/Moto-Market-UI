
import React from 'react';
import { DollarSign, ShieldCheck, Search, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Variants } from "framer-motion";

const features = [
  {
    icon: Search,
    title: "Largest Selection",
    description: "Find your perfect ride from thousands of new, used, and certified motorcycles nationwide.",
  },
  {
    icon: DollarSign,
    title: "Transparent Pricing",
    description: "No hidden fees. Compare prices, get dealer quotes, and find the best financing options.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted Sellers",
    description: "We partner with reputable dealers and verify private sellers to ensure a safe transaction.",
  },
  {
    icon: Users,
    title: "Community & Reviews",
    description: "Read real reviews from other riders and get advice from our passionate community.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.42, 0, 0.58, 1] } }
};

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why MotoTrade?</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            We're more than just a marketplace. We're your partner in the journey to finding the perfect motorcycle, offering tools and resources to help you buy with confidence.
          </p>
        </div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <div className="text-center p-6 bg-gray-50 rounded-xl h-full">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-red-100 text-red-600 rounded-full mb-5">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
