import { Product } from "@/types/firestore";

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Recycled Tote Bag",
    description: "Made from 100% recycled plastic bottles. Durable and eco-friendly shopping companion.",
    price: 15.99,
    category: "bags",
    ecoType: "recycled",
    imageURL: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    stock: 25,
    createdAt: Date.now() - 86400000, // 1 day ago
  },
  {
    id: "2",
    name: "Bamboo Utensil Set",
    description: "Biodegradable bamboo utensils perfect for on-the-go meals. Includes fork, knife, spoon, and chopsticks.",
    price: 12.50,
    category: "utensils",
    ecoType: "biodegradable",
    imageURL: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    stock: 40,
    createdAt: Date.now() - 172800000, // 2 days ago
  },
  {
    id: "3",
    name: "Organic Cotton T-Shirt",
    description: "Sustainable fashion made from 100% organic cotton. Soft, comfortable, and environmentally friendly.",
    price: 28.00,
    category: "clothing",
    ecoType: "sustainable",
    imageURL: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    stock: 15,
    createdAt: Date.now() - 259200000, // 3 days ago
  },
  {
    id: "4",
    name: "Recycled Plastic Building Blocks",
    description: "Educational toys made from recycled ocean plastic. Safe for children and planet-friendly.",
    price: 34.99,
    category: "toys",
    ecoType: "recycled",
    imageURL: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    stock: 20,
    createdAt: Date.now() - 345600000, // 4 days ago
  },
  {
    id: "5",
    name: "Glass Food Storage Containers",
    description: "Set of 3 glass containers with bamboo lids. Perfect for meal prep and plastic-free storage.",
    price: 42.00,
    category: "containers",
    ecoType: "sustainable",
    imageURL: "https://images.unsplash.com/photo-1584736286028-e6db3fce1be7?w=400&h=400&fit=crop",
    stock: 12,
    createdAt: Date.now() - 432000000, // 5 days ago
  },
  {
    id: "6",
    name: "Hemp Backpack",
    description: "Durable backpack made from sustainable hemp fiber. Water-resistant and long-lasting.",
    price: 89.99,
    category: "bags",
    ecoType: "sustainable",
    imageURL: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    stock: 8,
    createdAt: Date.now() - 518400000, // 6 days ago
  },
  {
    id: "7",
    name: "Biodegradable Phone Case",
    description: "Protective phone case made from biodegradable materials. Stylish protection that won't harm the planet.",
    price: 24.99,
    category: "accessories",
    ecoType: "biodegradable",
    imageURL: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=400&fit=crop",
    stock: 30,
    createdAt: Date.now() - 604800000, // 7 days ago
  },
  {
    id: "8",
    name: "Recycled Paper Notebook Set",
    description: "Set of 3 notebooks made from 100% recycled paper. Perfect for sustainable note-taking.",
    price: 18.50,
    category: "stationery",
    ecoType: "recycled",
    imageURL: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop",
    stock: 35,
    createdAt: Date.now() - 691200000, // 8 days ago
  },
];