# SorboNexus

## Overview
La plateforme qui connecte les étudiants et anciens du campus Sciences de Sorbonne Université. Partage de conseils, parcours, ressources et entraide pour réussir ensemble.

## Project Structure
The project is organized as follows:

```
SorboNexus
├── public
│   ├── index.html          # Main page (Accueil)
│   ├── ressources.html     # Resources section
│   ├── liens-utiles.html   # Useful links section
│   ├── conseils.html       # Advice section
│   └── alumnis.html        # Alumni section
├── src
│   ├── css
│   │   └── tailwind.css    # Tailwind CSS styles
│   └── js
│       └── main.js         # JavaScript for interactivity
├── tailwind.config.js       # Tailwind CSS configuration
├── package.json             # npm configuration
└── README.md                # Project documentation
```

## Setup Instructions

1. **Clone the Repository**
   ```
   git clone <repository-url>
   cd SorboNexus
   ```

2. **Install Dependencies**
   Ensure you have Node.js installed, then run:
   ```
   npm install
   ```

3. **Build Tailwind CSS**
   To generate the Tailwind CSS file, run:
   ```
   npx tailwindcss -i ./src/css/tailwind.css -o ./public/styles.css --watch
   ```

4. **Run the Project**
   Open `public/index.html` in your web browser to view the website.

## Features
- Dark theme for an elegant look.
- Responsive navbar for easy navigation between sections.
- Each section is designed to provide relevant information and resources.

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License
This project is licensed under the MIT License.