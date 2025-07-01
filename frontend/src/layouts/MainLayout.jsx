import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { toaster } from "../components/ui/toaster";
import useStockStore from '../store/stockStore';

const MainLayout = () => {
  const orderUpdates = useStockStore((state) => state.orderUpdates);
  const setOrderUpdates = useStockStore((state) => state.setOrderUpdates);

  useEffect(() => {
    if (orderUpdates) {
      const {
        updateType,
        status,
        stockName,
        executedPrice,
        action,
        quantity,
        message,
        previousPrice,
        newPrice,
      } = orderUpdates;

      switch (updateType) {
        case 'Order Executed':
          if (status === 'success') {
            toaster.create({
              title:
                message ||
                `${action === 'BUY' ? 'Bought' : 'Sold'} ${quantity} shares of ${stockName} at ₹${Number(executedPrice).toFixed(2)}`,
              type: 'success',
            });
          } else {
            toaster.create({
              title: message || `Failed to execute ${action} order for ${stockName}`,
              type: 'error',
            });
          }
          break;

        case 'Order Failed':
          toaster.create({
            title: message || `Order failed: Market hours are over`,
            type: 'error',
          });
          break;

        case 'Order Updated':
          toaster.create({
            title:
              status === 'success'
                ? message || `Order updated: ${stockName} price changed from ₹${previousPrice} to ₹${newPrice}`
                : message || `Failed to update order for ${stockName}`,
            type: status === 'success' ? 'info' : 'warning',
          });
          break;

        case 'Order Deleted':
          toaster.create({
            title:
              message ||
              (status === 'success'
                ? `Order for ${stockName} has been successfully deleted`
                : `Failed to delete order for ${stockName}`),
            type: status === 'success' ? 'success' : 'error',
          });
          break;

        default:
          console.warn('Unknown order update type:', updateType);
          break;
      }

      setOrderUpdates(null);
    }
  }, [orderUpdates, setOrderUpdates]);

  return (
    <div className="flex">
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
