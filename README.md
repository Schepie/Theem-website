# VZW 't Heem Zonhoven - Website & Zaalverhuur

Officiële, moderne en responsieve website voor **VZW 't Heem Zonhoven** (zustervereniging van KSA Zonhoven), gebouwd volgens dezelfde architectuur, visuele editor en GitHub-integratie als de KSA Zonhoven website.

🌐 **Originele website:** [https://www.theem.be/](https://www.theem.be/)  
📍 **Locatie:** Dijkbeemdenweg 8, 3520 Zonhoven  
📞 **Contact:** 0471/25 87 78 • ksazonhoven.vzw@gmail.com  

---

## 🌟 Belangrijkste Functies

1. **Desktop & Mobile Web App:**
   - `index.html`: Volledige desktop ervaring met sticky navigatie, heldere secties, interactieve prijscalculator, foto-lightbox en direct contactformulier.
   - `mobile.html`: Snelle, app-achtige mobiele ervaring met bottom navigatiebalk (Home, Zalen, Prijzen, Foto's, Contact), touch controls en directe bel/WhatsApp/mail acties.
   - `js/device-detect.js`: Automatische intelligente routering tussen desktop en mobiel op basis van schermgrootte en user-agent, met behoud van gebruikersvoorkeur.

2. **In-Browser Visuele Edit Mode (`js/visual-editor.js`):**
   - Klik onderaan de website op **"✏️ Website Beheer (Edit Mode)"** (of de bewerkknop in het navigatiemenu).
   - **Standaard pincode:** `theem2026`.
   - **Tekst direct aanpassen:** Klik op eender welke titel, alinea, datum of prijs en pas de tekst rechtstreeks op de pagina aan.
   - **Foto's vervangen via upload:** Klik op eender welke foto om direct een nieuwe foto van je computer of smartphone te selecteren. De foto wordt automatisch geüpload naar `images/uploads/` en live bijgewerkt.
   - **Rechtstreeks opslaan naar GitHub:** Wijzigingen worden via de GitHub API direct gecommit naar `data/site-content.json` in je GitHub repository.
   - **AES-256-GCM Wachtwoordkluis:** Bewaart je GitHub Personal Access Token veilig versleuteld zodat beheer met één klik verloopt.

3. **Zalen, Tarieven & Interactieve Prijscalculator:**
   - Grote Zaal (~80 personen, € 115 / dag)
   - Kleine Zaal (~40 personen, € 70 / dag)
   - Uitgeruste Keuken (€ 65 / dag)
   - Schoonmaakoptie (€ 0 zelf poetsen / € 60 door VZW)
   - Vaste waarborg (€ 150)
   - Live berekening van het subtotaal en eindtotaal met één-klik overname naar het boekingsformulier.

4. **Reserveringen & Beschikbaarheid:**
   - Directe integratie met **YouCanBookMe** ([https://theem.youcanbook.me/](https://theem.youcanbook.me/)) voor realtime kalenderinzicht.
   - Interactief aanvraagformulier voor particulieren en verenigingen.

5. **Lokale Foto-opslag (50 foto's):**
   - Alle 50 originele foto's van de zalen, keuken, speelweide, speeltuin en overdekt terras zijn lokaal opgeslagen in `assets/images/gallery/` en werken razendsnel zonder afhankelijkheid van externe Google Sites proxies.

---

## 🚀 Publiceren naar GitHub & GitHub Pages

### 1. Repository Aanmaken op GitHub
1. Ga naar [https://github.com/new](https://github.com/new) op je account (`Schepie`).
2. Maak een nieuwe repository met de naam: **`Theem-website`**.
3. Kies **Public**.

### 2. Bestanden Pushen
Voer in deze map de volgende git-commando's uit:

```bash
git init
git add .
git commit -m "Initial commit VZW 't Heem website"
git branch -M main
git remote add origin https://github.com/Schepie/Theem-website.git
git push -u origin main
```

### 3. GitHub Pages Inschakelen
1. Ga op GitHub naar **Settings** &rarr; **Pages**.
2. Selecteer bij **Branch** de branch **`main`** en map **`/(root)`**.
3. Klik op **Save**.
4. Binnen enkele minuten is je website live op:
   **`https://schepie.github.io/Theem-website/`**

---

## ✏️ Hoe Werkt het Bewerken?

1. Open de website (lokaal of op GitHub Pages).
2. Klik in het navigatiemenu of in de footer op **"✏️ Bewerk Website"**.
3. Voer de pincode in: **`theem2026`**.
4. De pagina licht op in bewerkmodus:
   - Klik op een tekst om deze aan te passen.
   - Klik op een foto om een nieuwe foto te kiezen.
5. Klik in de zwevende balk onderaan op **"Opslaan naar GitHub"**.
6. Binnen enkele seconden staat de update live op de website!

