import { motion } from 'framer-motion';
import { Book, Laptop, Shirt, Sofa, LucideIcon } from 'lucide-react';

interface CategoryCardProps {
  title: string;
  icon?: LucideIcon;
}

const iconMap: Record<string, LucideIcon> = {
  Books: Book,
  Electronics: Laptop,
  Clothes: Shirt,
  Furniture: Sofa,
};

export default function CategoryCard({ title }: CategoryCardProps) {
  const Icon = iconMap[title] || Book;
  
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="glass-card p-4 cursor-pointer hover:shadow-soft transition-shadow"
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
          <Icon className="w-6 h-6 text-accent" />
        </div>
        <span className="text-sm font-medium text-foreground">{title}</span>
      </div>
    </motion.div>
  );
}
