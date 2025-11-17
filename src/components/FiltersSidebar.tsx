import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Button } from './ui/button';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { fetchListings } from '@/features/listings/listingsSlice';

export default function FiltersSidebar() {
  const dispatch = useDispatch<AppDispatch>();
  const [category, setCategory] = useState('all');
  const [condition, setCondition] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 5000]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
      </div>

      <div className="space-y-2">
        <Label>Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Books">Books</SelectItem>
            <SelectItem value="Electronics">Electronics</SelectItem>
            <SelectItem value="Clothes">Clothes</SelectItem>
            <SelectItem value="Furniture">Furniture</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Condition</Label>
        <Select value={condition} onValueChange={setCondition}>
          <SelectTrigger>
            <SelectValue placeholder="Any Condition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Condition</SelectItem>
            <SelectItem value="Like New">Like New</SelectItem>
            <SelectItem value="Excellent">Excellent</SelectItem>
            <SelectItem value="Good">Good</SelectItem>
            <SelectItem value="Fair">Fair</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label>Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}</Label>
        <Slider
          value={priceRange}
          onValueChange={(value) => setPriceRange(value as [number, number])}
          max={5000}
          step={100}
          className="w-full"
        />
      </div>

      <Button className="w-full" onClick={handleApplyFilters}>Apply Filters</Button>
    </div>
  );

  function handleApplyFilters() {
    const params: any = {};
    if (category !== 'all') {
      params.category = category;
    }
    if (condition !== 'all') {
      params.condition = condition;
    }
    if (priceRange[0] > 0) {
      params.minPrice = priceRange[0];
    }
    if (priceRange[1] < 5000) {
      params.maxPrice = priceRange[1];
    }
    dispatch(fetchListings(params));
  }
}
