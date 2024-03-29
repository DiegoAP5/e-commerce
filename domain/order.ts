export interface Order {
    id: string;
    userId: string;
    productId: string;
    quantity: number;
    totalPrice: number;
    status: 'pending' | 'completed';
}