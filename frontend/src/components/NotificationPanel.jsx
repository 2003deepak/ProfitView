import React, { useState, useEffect } from 'react';
import { Drawer } from '@chakra-ui/react';
import { Bell, RefreshCw, X, ArrowUp, ArrowDown, Info, AlertCircle } from 'lucide-react';
import axios from 'axios';

const NotificationPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:3000/api/user/getNotifications', {
        withCredentials: true,
      });

      if (response.data.status === 'success') {
        const parsed = response.data.message.map(msg => {
          const [beforePrice, afterPrice] = msg.split(' at ₹');
          const [price, time] = afterPrice.split(' on ');

          let type = 'news';
          if (beforePrice.toLowerCase().includes('bought')) type = 'buy';
          if (beforePrice.toLowerCase().includes('sold')) type = 'sell';

          return {
            type,
            message: msg,
            stock: beforePrice.split(' ').slice(1).join(' '),
            time: time || '',
          };
        });

        setNotifications(parsed);
      }
    } catch (err) {
      setError('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type) => {
    const props = { size: 18 };
    switch (type) {
      case 'buy': return <ArrowUp {...props} className="text-emerald-600" />;
      case 'sell': return <ArrowDown {...props} className="text-rose-600" />;
      case 'news': return <Info {...props} className="text-amber-500" />;
      default: return <AlertCircle {...props} className="text-blue-500" />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case 'buy': return 'bg-emerald-50 dark:bg-emerald-900/20';
      case 'sell': return 'bg-rose-50 dark:bg-rose-900/20';
      case 'news': return 'bg-amber-50 dark:bg-amber-900/20';
      default: return 'bg-blue-50 dark:bg-blue-900/20';
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case 'buy': return 'border-emerald-200 dark:border-emerald-800';
      case 'sell': return 'border-rose-200 dark:border-rose-800';
      case 'news': return 'border-amber-200 dark:border-amber-800';
      default: return 'border-blue-200 dark:border-blue-800';
    }
  };

  useEffect(() => {
    if (isOpen) fetchNotifications();
  }, [isOpen]);

  return (
    <Drawer.Root isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <Drawer.Backdrop className="backdrop-blur-sm bg-black/30" />
      <Drawer.Trigger asChild>
        <button
          onClick={() => setIsOpen(true)}
          className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Bell className="w-5 h-5 text-gray-700 dark:text-gray-200" />
          {notifications.length > 0 && (
            <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </button>
      </Drawer.Trigger>
      <Drawer.Positioner>
        <Drawer.Content className="w-full max-w-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-xl flex flex-col">
          <Drawer.CloseTrigger asChild>
            <button className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
              <X className="h-4 w-4" />
            </button>
          </Drawer.CloseTrigger>

          <Drawer.Header className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Notifications</h2>
              
            </div>
          </Drawer.Header>

          <Drawer.Body className="flex-1 overflow-y-auto p-4 space-y-3">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-500 py-6">{error}</div>
            ) : notifications.length === 0 ? (
              <div className="text-center text-gray-500 py-6">No notifications available</div>
            ) : (
              notifications.map((n, i) => (
                <div 
                  key={i} 
                  className={`flex items-start p-4 rounded-lg shadow-sm border ${getBgColor(n.type)} ${getBorderColor(n.type)}`}
                >
                  <div className="mr-3 mt-1">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{n.stock}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                  </div>
                </div>
              ))
            )}
          </Drawer.Body>

          <Drawer.Footer className="border-t border-gray-200 dark:border-gray-700 px-6 py-3 text-sm text-gray-500 dark:text-gray-400">
            {notifications.length} notification{notifications.length !== 1 && 's'}
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
};

export default NotificationPanel;