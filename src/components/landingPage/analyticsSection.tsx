import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const chartColors = ['#6366F1', '#3B82F6', '#EC4899', '#F59E0B'];

const pieData = [
  { name: 'Electronics', value: 400 },
  { name: 'Furniture', value: 300 },
  { name: 'Groceries', value: 200 },
  { name: 'Others', value: 100 }
];

const barData = [
  { month: 'Jan', sales: 3000 },
  { month: 'Feb', sales: 4000 },
  { month: 'Mar', sales: 3500 },
  { month: 'Apr', sales: 5000 },
  { month: 'May', sales: 4200 },
  { month: 'Jun', sales: 5300 },
  { month: 'Jul', sales: 6000 },
  { month: 'Aug', sales: 4900 },
  { month: 'Sep', sales: 4700 },
  { month: 'Oct', sales: 5200 },
  { month: 'Nov', sales: 6100 },
  { month: 'Dec', sales: 6500 },
];

export function AnalyticsSection() {
  return (
    <section className="py-20 px-4 bg-white">
      <motion.div 
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-700 mb-12">
          Business Performance Overview
        </h2>

        <div className="flex flex-col lg:flex-row gap-10 justify-center items-center">
          
          {/* Pie Chart */}
          <motion.div 
            className="w-full lg:w-1/2 bg-blue-50 p-6 rounded-xl shadow-2xl"
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold text-blue-600 mb-4 text-center">Category Share</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={50}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Bar Chart */}
          <motion.div 
            className="w-full lg:w-1/2 bg-indigo-50 p-6 rounded-xl shadow-2xl"
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold text-indigo-600 mb-4 text-center">Monthly Sales</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#6366F1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default AnalyticsSection;
