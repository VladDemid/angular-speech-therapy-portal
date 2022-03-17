export class OrderRegistrationRequest {
    userName?: string;
    password?: string;
    orderNumber?: string;
    amount?: number;
    currency?: number;
    returnUrl?: string;
    failUrl?: string;
    dynamicCallbackUrl?: string;
}