import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface PickupDetails {
  name: string;
  location: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed';
}

export default function Pickup() {
  const [pickups, setPickups] = useState<PickupDetails[]>([
    { name: 'sakshi', location: 'subway', date: '2025-10-25', time: '06:30', status: 'upcoming' },
    { name: 'Chakshita', location: 'square 1', date: '2025-10-27', time: '13:30', status: 'upcoming' },
  ]);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handlePickupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingIndex !== null) {
      const updatedPickups = [...pickups];
      updatedPickups[editingIndex] = { ...updatedPickups[editingIndex], name, location, date, time };
      setPickups(updatedPickups);
      setEditingIndex(null);
    } else {
      setPickups([...pickups, { name, location, date, time, status: 'upcoming' }]);
    }
    setName('');
    setLocation('');
    setDate('');
    setTime('');
  };

  const handleCancel = (index: number) => {
    setPickups(pickups.filter((_, i) => i !== index));
  };

  const handleComplete = (index: number) => {
    const updatedPickups = [...pickups];
    updatedPickups[index].status = 'completed';
    setPickups(updatedPickups);
  };

  const handleEdit = (index: number) => {
    const pickup = pickups[index];
    setName(pickup.name);
    setLocation(pickup.location);
    setDate(pickup.date);
    setTime(pickup.time);
    setEditingIndex(index);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setName('');
    setLocation('');
    setDate('');
    setTime('');
  };

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Pickup Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Pickup Form */}
              <form onSubmit={handlePickupSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input id="name" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" placeholder="Enter pickup location" value={location} onChange={(e) => setLocation(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Time</Label>
                  <div className="flex gap-2">
                    <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button className="w-full" type="submit">
                    {editingIndex !== null ? 'Update Pickup' : 'Confirm Pickup'}
                  </Button>
                  {editingIndex !== null && (
                    <Button variant="outline" className="w-full" onClick={handleCancelEdit}>
                      Cancel Edit
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Upcoming Pickups */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Upcoming Pickups</h2>
            <div className="space-y-4">
              {pickups.map((pickup, index) => (
                <Card
                  key={index}
                  className={`glass-card ${pickup.status === 'completed' ? 'opacity-50' : ''}`}
                >
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <p className={`font-semibold ${pickup.status === 'completed' ? 'line-through' : ''}`}>
                        {new Date(pickup.date).toLocaleDateString()}
                      </p>
                      <p className="text-muted-foreground">{pickup.name} | {pickup.location} | {pickup.time}</p>
                    </div>
                    {pickup.status === 'upcoming' && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(index)}>Edit</Button>
                        <Button variant="default" size="sm" className="bg-green-500" onClick={() => handleComplete(index)}>Complete</Button>
                        <Button variant="destructive" size="sm" onClick={() => handleCancel(index)}>Cancel</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
