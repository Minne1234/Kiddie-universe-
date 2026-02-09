# Kiddie-universe-

Simple multi-page e-commerce demo built with plain HTML, CSS, and JavaScript.

## Pages
- Home (`index.html`)
- Products (`products.html`)
- Product page (`product.html`)
- Cart (`cart.html`)
- Checkout (`checkout.html`)

## Run locally on Windows
You can run this as static files with a local web server so the pages can share the cart data.

1. Open **Command Prompt**.
2. Change to the project folder:
   ```bat
   cd /d C:\path\to\Kiddie-universe-
   ```
3. Start a local server using Python:
   ```bat
   python -m http.server 8000
   ```
   If `python` is not recognized, try:
   ```bat
   py -m http.server 8000
   ```
4. Open a browser and go to:
   ```
   http://localhost:8000/index.html
   ```
