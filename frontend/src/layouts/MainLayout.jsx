import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import useStockStore from '../store/stockStore';
import themeStore from "../store/themeStore";

const MainLayout = ({ role }) => {
    const orderUpdates = useStockStore(state => state.orderUpdates);
    const setOrderUpdates = useStockStore(state => state.setOrderUpdates);
    const { theme } = themeStore(state => state);

    // Effect to show toast when orderUpdates state changes
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
                newPrice
            } = orderUpdates;

            switch (updateType) {
                case 'Order Executed':
                    if (status === 'success') {
                        toast.success(
                            message || `${action === 'BUY' ? 'Bought' : 'Sold'} ${quantity} shares of ${stockName} at ₹${Number(executedPrice).toFixed(2)}`,
                            { autoClose: 5000 }
                        );
                    } else {
                        toast.error(
                            message || `Failed to execute ${action} order for ${stockName}`,
                            { autoClose: 5000 }
                        );
                    }
                    break;

                case 'Order Failed':
                    if (status === 'fail') {
                        toast.error(
                            message || `Order failed: Market hours are over`,
                            { autoClose: 5000 }
                        );
                    }
                    break;

                case 'Order Updated':
                    if (status === 'success') {
                        toast.info(
                            message || `Order updated: ${stockName} price changed from ₹${previousPrice} to ₹${newPrice}`,
                            { autoClose: 4000 }
                        );
                    } else {
                        toast.warning(
                            message || `Failed to update order for ${stockName}`,
                            { autoClose: 4000 }
                        );
                    }
                    break;

                case 'Order Deleted':
                    if (status === 'success') {
                        toast.success(
                            message || `Order for ${stockName} has been successfully deleted`,
                            { autoClose: 4000 }
                        );
                    } else {
                        toast.error(
                            message || `Failed to delete order for ${stockName}`,
                            { autoClose: 4000 }
                        );
                    }
                    break;

                default:
                    console.warn('Unknown order update type:', updateType);
                    break;
            }

            // Clear the state after processing
            setOrderUpdates(null);
        }
    }, [orderUpdates, setOrderUpdates]);

    return (
        <div className="flex">
            <div className="flex-1">
                <Outlet /> {/* This is where your protected route content will appear */}
            </div>

            {/* Toast container placed here so it persists across routes */}
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme={theme === 'dark' ? 'dark' : 'light'}
            />
        </div>
    );
};

export default MainLayout;