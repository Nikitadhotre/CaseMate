import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, FileText } from 'lucide-react';
import { useState } from 'react';

export default function LawyerCalendar() {
  const [currentView, setCurrentView] = useState('month');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const events = [
    { id: 1, title: 'Johnson v. Smith - Hearing', time: '10:00 AM', location: 'Court Room 5', type: 'hearing', date: '2024-10-15' },
    { id: 2, title: 'Doe Consultation', time: '2:30 PM', location: 'Office Meeting Room', type: 'meeting', date: '2024-10-15' },
    { id: 3, title: 'Case Review Meeting', time: '4:00 PM', location: 'Conference Room A', type: 'meeting', date: '2024-10-16' },
    { id: 4, title: 'Wilson v. Brown - Hearing', time: '9:30 AM', location: 'Court Room 3', type: 'hearing', date: '2024-10-17' },
  ];

  const todayEvents = events.filter(event => event.date === '2024-10-15');

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
        <Calendar className="w-12 h-12 text-slate-600" />
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Calendar</h1>
          <p className="text-xl text-slate-600">Schedule & track court hearings</p>
        </div>
      </motion.div>

      {/* Calendar Controls */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-1">
            <button className="p-2 hover:bg-slate-100 rounded-2xl transition-colors">
              <ChevronLeft className="w-6 h-6 text-slate-600" />
            </button>
            <button className="px-6 py-3 font-bold text-xl text-slate-900 border-b-4 border-emerald-500">
              October 2024
            </button>
            <button className="p-2 hover:bg-slate-100 rounded-2xl transition-colors">
              <ChevronRight className="w-6 h-6 text-slate-600" />
            </button>
          </div>
          <div className="flex gap-2">
            <button 
              className={`px-4 py-2 rounded-2xl font-semibold transition-all ${currentView === 'month' ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              onClick={() => setCurrentView('month')}
            >
              Month
            </button>
            <button 
              className={`px-4 py-2 rounded-2xl font-semibold transition-all ${currentView === 'week' ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              onClick={() => setCurrentView('week')}
            >
              Week
            </button>
            <button 
              className={`px-4 py-2 rounded-2xl font-semibold transition-all ${currentView === 'day' ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              onClick={() => setCurrentView('day')}
            >
              Day
            </button>
          </div>
        </div>

        {/* Today's Events */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
              15
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Today</h2>
              <p className="text-slate-600">Monday, October 15</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {todayEvents.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="group bg-gradient-to-r p-6 rounded-3xl shadow-xl border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 cursor-pointer overflow-hidden hover:border-emerald-200"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-2xl shadow-lg flex-shrink-0 ${event.type === 'hearing' ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white' : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'}`}>
                    {event.type === 'hearing' ? <Clock className="w-6 h-6" /> : <Users className="w-6 h-6" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-xl text-slate-900 line-clamp-1">{event.title}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <div className="flex items-center gap-1 text-slate-600">
                        <Clock className="w-4 h-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-600">
                        <MapPin className="w-4 h-4" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all ml-4">
                    <button className="p-2 bg-white/20 backdrop-blur-sm rounded-2xl hover:bg-white/30 text-white transition-all shadow-md">
                      <FileText className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center py-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <Calendar className="w-20 h-20 text-slate-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-slate-600 mb-2">No more events today</h3>
            <button className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold shadow-2xl hover:shadow-3xl transition-all">
              + Add New Event
            </button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-2xl">
          <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
          <span className="text-sm font-semibold text-emerald-800">Court Hearing</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-2xl">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-sm font-semibold text-blue-800">Client Meeting</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-2xl">
          <div className="w-3 h-3 bg-slate-500 rounded-full"></div>
          <span className="text-sm font-semibold text-slate-700">Document Deadline</span>
        </div>
      </div>
    </div>
  );
}

