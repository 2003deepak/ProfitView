import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useStockStore from '../store/stockStore';
import themeStore from "../store/themeStore";

const MainLayout = ({ role }) => {
    const orderUpdates = useStockStore(state => state.orderUpdates);
    const setOrderUpdates = useStockStore(state => state.setOrderUpdates);
    const { theme } = themeStore(state => state);

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

            const toastOptions = {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: theme
            };

            switch (updateType) {
                case 'Order Executed':
                    if (status === 'success') {
                        toast.success(
                            message || `${action === 'BUY' ? 'Bought' : 'Sold'} ${quantity} shares of ${stockName} at ₹${Number(executedPrice).toFixed(2)}`,
                            toastOptions
                        );
                    } else {
                        toast.error(
                            message || `Failed to execute ${action} order for ${stockName}`,
                            toastOptions
                        );
                    }
                    break;

                case 'Order Failed':
                    if (status === 'fail') {
                        toast.error(
                            message || `Order failed: Market hours are over`,
                            toastOptions
                        );
                    }
                    break;

                case 'Order Updated':
                    if (status === 'success') {
                        toast.info(
                            message || `Order updated: ${stockName} price changed from ₹${previousPrice} to ₹${newPrice}`,
                            toastOptions
                        );
                    } else {
                        toast.warning(
                            message || `Failed to update order for ${stockName}`,
                            toastOptions
                        );
                    }
                    break;

                case 'Order Deleted':
                    if (status === 'success') {
                        toast.success(
                            message || `Order for ${stockName} has been successfully deleted`,
                            { ...toastOptions, autoClose: 4000 }
                        );
                    } else {
                        toast.error(
                            message || `Failed to delete order for ${stockName}`,
                            { ...toastOptions, autoClose: 4000 }
                        );
                    }
                    break;

                default:
                    console.warn('Unknown order update type:', updateType);
                    break;
            }

            setOrderUpdates(null);
        }
    }, [orderUpdates, setOrderUpdates, theme]);

    return (
        <div className="flex">
            <div className="flex-1">
                <Outlet />
            </div>
            <ToastContainer 
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme={theme}
            />
        </div>
    );
};

export default MainLayout;