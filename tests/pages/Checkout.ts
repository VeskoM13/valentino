import { type Page } from '@playwright/test';
import checkoutData from '../testdata/checkoutData.json';

export class Checkout {
    readonly page: Page;

    private readonly firstNameInput = '[data-test-id="checkout-firstname-input"]';
    private readonly lastNameInput = '[data-test-id="checkout-lastname-input"]';
    private readonly emailInput = '[data-test-id="checkout-email-input"]';
    private readonly addressInput = '[data-test-id="checkout-address-input"]';
    private readonly cityInput = '[data-test-id="checkout-city-input"]';
    private readonly zipInput = '[data-test-id="checkout-zipcode-input"]';
    private readonly countryInput = '[data-test-id="checkout-country-input"]';
    private readonly cardNameInput = '[data-test-id="checkout-cardname-input"]';
    private readonly cardNumberInput = '[data-test-id="checkout-cardnumber-input"]';
    private readonly cardExpiryInput = '[data-test-id="checkout-cardexpiry-input"]';
    private readonly cardCvcInput = '[data-test-id="checkout-cardcvc-input"]';
    private readonly placeOrderButton = '[data-test-id="place-order-button"]';

    readonly testValues = checkoutData;

    constructor(page: Page) {
        this.page = page;
    }

    private async fill(selector: string, value: string) {
        await this.page.locator(selector).fill(value);
    }

    private async type(selector: string, value: string) {
        await this.page.locator(selector).pressSequentially(value, { delay: 50 });
    }

    async addContactInfo(values: { firstName: string; lastName: string; email: string }) {
        await this.fill(this.firstNameInput, values.firstName);
        await this.fill(this.lastNameInput, values.lastName);
        await this.fill(this.emailInput, values.email);
    }

    async addShippingAddress(values: { address: string; city: string; zipCode: string; country: string }) {
        await this.fill(this.addressInput, values.address);
        await this.fill(this.cityInput, values.city);
        await this.fill(this.zipInput, values.zipCode);
        await this.fill(this.countryInput, values.country);
    }

    async addPaymentInfo(values: { nameOnCard: string; cardNumber: string; expiry: string; cvc: string }) {
        await this.fill(this.cardNameInput, values.nameOnCard);
        await this.type(this.cardNumberInput, values.cardNumber);
        await this.type(this.cardExpiryInput, values.expiry);
        await this.type(this.cardCvcInput, values.cvc);
    }

    async placeOrder() {
        await this.page.locator(this.placeOrderButton).click();
    }
}
