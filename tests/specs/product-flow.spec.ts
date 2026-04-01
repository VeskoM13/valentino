import { test, expect } from '@playwright/test';
import { Product } from '../pages/Products'
import { CartPage } from '../pages/Cart';
import { Checkout } from '../pages/Checkout';
import { ContactPage } from '../pages/Contact';
import { Base } from '../pages/Base';

test.use({ storageState: { cookies: [], origins: [] } });

test('Item is added to the shopping cart', async ({ page }) => {
    
    await page.goto('/products');

    const products = new Product(page)
    const addedProduct = await products.addProductToCart(1);

    const base = new Base(page)
    await base.openCart()

    const cart = new CartPage(page)
    await cart.assertProduct(addedProduct.name!)

    const subtotal = await cart.getSubTotal()

    expect(subtotal).toBe(addedProduct.price)

    await cart.proceedToCheckout()

    const checkout = new Checkout(page)
    await checkout.addContactInfo(checkout.testValues)
     await checkout.addShippingAddress(checkout.testValues)
    await checkout.addPaymentInfo(checkout.testValues)
    await checkout.placeOrder()

    // get orderId:
    const orderWrapper = page.getByText('Your Order ID is:').locator('..')
    const orderId = await orderWrapper.getByRole('paragraph').nth(1).textContent()

    // open the contact page:
    await page.getByRole('button', { name: 'Track Your Order' }).click();
    const contact = new ContactPage(page)
    await contact.fillOrderIdAndEmail(orderId!, checkout.testValues.email)
    await contact.clickTrackOrder()

    // check if ordered item is returned:
    const firstOrder = page.getByText(addedProduct.name!)
    await expect(firstOrder).toBeVisible()

})