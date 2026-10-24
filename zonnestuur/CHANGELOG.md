# Wijzigingen

## 0.80.1
- SPRSUN: in een goedkoop uur begon de warmtepomp soms niet, omdat het vat nog niet koud genoeg was om opnieuw te starten. Zonnestuur laat hem nu tijdens goedkope uren al bij 2 graden verschil beginnen en zet daarna jouw eigen instelling terug.
- Wifi-modules die maar één verbinding tegelijk aankunnen (zoals de SPRSUN-module) geven geen 'geen verbinding' meer als de app en de sturing tegelijk vragen.
- Verwarming: rolluiken, lampen en camera-schakelaars worden niet meer als pomp of klep aangeboden.

## 0.80.0
- Nieuw: Verwarming (Apparaten → Verwarming). Voeg per ruimte je thermostaat toe (Tado, Nest, Netatmo, Honeywell, radiatorknoppen en meer, via de koppelmotor), of een temperatuursensor met de pomp of klep van je vloerverwarming. Meerdere ruimtes kan ook.
- Je kiest hoe warm het overdag en 's nachts moet zijn en een ondergrens. Met een dynamisch contract maakt Zonnestuur het in goedkope uren iets warmer (warmte opslaan in je huis) en in dure uren iets minder, nooit onder je grens.
- Zonnestuur leert per ruimte hoe snel hij opwarmt en afkoelt, en begint 's ochtends precies op tijd, het liefst in een goedkoper uur. Zelf aan de thermostaat gedraaid? Dan wacht Zonnestuur tot de volgende dag/nacht-wissel (hoogstens 3 uur).
- SPRSUN: 'Zuiniger instellen' op de pagina van de warmtepomp: na hoeveel graden hij opnieuw start, de stooklijnen (eco-stand) voor warm water en verwarming, en meten hoe hard de compressor werkt en of het elektrische element aan staat.

## 0.79.2
- SPRSUN: is de warmtepomp niet bereikbaar, dan zegt de apparaatkaart nu wat je kunt nakijken (wifimodule aan, IP-adres, Protocol op 'Modbus').

## 0.79.1
- 'Instellen' in de instelhulp (bijv. bij SPRSUN) stuurde je terug naar stap 1. Nu opent het formulier meteen, ook als Zonnestuur nog niet klaar is ingesteld. Na het toevoegen ga je direct naar de pagina van het apparaat.
- Antwoordt de warmtepomp niet, dan zegt de bediening dat nu duidelijk en wat je kunt controleren.

## 0.79.0
- SPRSUN-warmtepomp: eigen bediening in Zonnestuur, zoals in de SPRSUN-app. Op de pagina van de warmtepomp: aan/uit, stand, temperaturen voor warm water, verwarming en koeling, ventilator en pomp, en de actuele temperaturen. Getest op een echte SPRSUN.
- Kies je zelf een warmwatertemperatuur, dan wordt dat de gewone temperatuur; Zonnestuur zet hem bij zon of goedkope stroom een paar graden hoger.

## 0.78.4
- Instelhulp: bij een SPRSUN-warmtepomp of Alfen-laadpaal staat nu een knop 'Instellen' om het IP-adres in te vullen (er stond 'zoekt hem zelf').
- Hulp op afstand kan bij een warmtepomp met Modbus meeluisteren wat er over de draad gaat (alleen lezen).

## 0.78.3
- SPRSUN toevoegen: nieuwe knop 'Controleren' leest de warmtepomp alleen uit en zegt in gewone taal wat er mis is (module niet bereikbaar, of de warmtepomp antwoordt niet).

## 0.78.2
- SPRSUN-warmtepomp: werkt nu ook met de wifi-module van SPRSUN zelf, naast de SPRSUN-app. Voeg in de module één extra verbinding toe (Tcp Server, poort 8899); verder hoeft er niets te veranderen.
- Alfen en SPRSUN toevoegen vanaf Apparaten opent nu meteen het goede formulier.

## 0.78.1
- Besparing klopt beter: bij een warmtepomp of boiler die ook zelf opwarmt, telt alleen het opwarmen dat Zonnestuur heeft verschoven. Eerder telde ook het gewone opwarmen mee, en dat gaf soms een 'besparing' onder nul.
- Geen zonnepanelen? Dan is je maanddoel altijd in euro's (er stond soms '100% zelf gebruikt').
- Valt de verbinding met de warmtepomp weg, dan zie je dat meteen. Zonnestuur probeert hem dan niet meer elke 10 seconden aan te zetten.

## 0.78.0
- Alle koppelingen nagelopen, ook op wat gebruikers melden. Werkt een koppeling bij de fabrikant even niet (zoals Kia en Hyundai sinds 22 oktober), dan staat dat er nu duidelijk bij en raadt Zonnestuur een andere manier aan.
- SolarEdge: de oude cloudkoppeling stopt op 3 november. Nieuw: koppelen via je eigen netwerk, ook voor de batterij.
- Nieuw: Zonneplan (prijzen), Sofar en my-PV via de koppelmotor.
- Marstek: zegt het nu meteen als de Open API vanzelf uitging (bekende fout in de Marstek-software), en vraagt de batterij minder vaak uit.
- HomeWizard-batterij: stond hij op 'slim' van HomeWizard zelf, dan zet Zonnestuur dat terug als hij loslaat.
- Een extra koppeling die een nieuwere koppelmotor nodig heeft, krijgt vooraf een duidelijke melding.

## 0.77.4
- Auto's van Volkswagen, Audi, Seat, Cupra en Škoda: nieuwe koppeling via het EU Data Act-portaal van de fabrikant (accupercentage en actieradius). De oude koppelingen worden sinds juni 2026 door de fabrikant geblokkeerd.

## 0.77.3
- Meekijken bij laden: is het accupercentage van de auto al lang niet bijgewerkt (bijvoorbeeld omdat Tibber niets nieuws kreeg), dan zegt Zonnestuur hoe oud het is.

## 0.77.2
- Nest Hub: de prijsblokjes per uur zijn terug. Goedkope uren zijn groen, het goedkoopste blok licht op met de tijden erboven, dure uren zijn rood.

## 0.77.1
- Nest Hub: het huis staat weer los op het scherm, zonder vierkant kader, en is groter.

## 0.77.0
- Het scherm op de Nest Hub heeft nu dezelfde stijl als de app: donkerblauw, het huis in een kader met labels (net, batterij, auto, zon) en de stroomprijs per uur als lijn met het goedkoopste blok en een stip op nu.

## 0.76.1
- Home: de kaart Dynamische tarieven laat nu de prijs per uur zien als lijn, met nu en het goedkoopste blok.
- Home: je apparaten in het kort (wat elk nu doet). Tik erop voor de knoppen.
- Laadpalen en auto's met alleen een knop "start laden" en "stop laden" (bijvoorbeeld Renault) worden nu ook gevonden en gestuurd.

## 0.76.0
- Nieuw ontwerp voor de hele app: donkerblauw, rustig en overal hetzelfde. Licht kan nog bij Meer → Weergave.
- Vijf vaste tabbladen: Home, Apparaten, Tarieven, Inzichten en Meer. Ze werken nu ook binnen de app van de koppelmotor.
- Home: je huis met zwevende labels (zon, batterij, huisverbruik, net en auto), drie tegels (opbrengst, verbruik en batterij), een kaart met de tarieven en de planning voor de komende 24 uur.
- Apparaten: elk apparaat met een gekleurd icoon, wat het nu verbruikt en een label (Actief, Laden, Wacht op zon). Tik erop voor alle knoppen. Toevoegen gaat in drie stappen: soort, merk, klaar.
- Nieuw: Tarieven (prijs per uur met de goedkoopste uren, morgen en de week) en Slimme sturing (schakelaars voor de batterij, vanzelf vinden en meldingen).
- Inzichten: de verdeling van je zonnestroom, je besparing en de CO₂-besparing per dag, week of maand. De grafieken en het logboek staan eronder.
- Instellingen is nu een overzicht met rijen. Tik op een onderdeel en je ziet alleen de instellingen daarvan. Aan/uit-vragen zijn schakelaars.

## 0.75.1
- Nest Hub: het huis staat nu los op het scherm (de lucht van het scherm is de lucht van het huis), in plaats van als plaatje in een kader.

## 0.75.0
- Je huis staat nu ook op de Nest Hub: dezelfde tekening als op Vandaag, met het weer, de zon of de maan en wat er aan staat. Uit te zetten bij Huisscherm.
- Apparaten op Vandaag zijn korter: bij de auto en de batterij zie je alleen wat nu telt. De uitleg, het uurplan en de cijfers staan onder 'Meer details tonen'.

## 0.74.0
- Nieuwe, rustigere vormgeving over de hele app: overal even grote koppen, zachte knoppen, minder lijnen en randen.
- Op de computer staan de tabbladen bovenaan in het midden, op de telefoon onderin.
- Vandaag toont alleen wat nu telt. Prijsgrafieken, wat Zonnestuur leerde en de uitleg bij de auto staan onder 'Meer details tonen'.
- Heb je al zonnepanelen ingevuld? Dan vraagt Zonnestuur niet meer of je ze hebt, maar stelt hij voor je omvormer te koppelen.
- Aanmelden als proefhuis staat nu bij Meer.

## 0.73.2
- Zonnestuur herkent meer merken in je netwerk, met de nieuwste lijst van netwerkkaarten (ook laadpalen zoals Zaptec en Alfen).
- Bosch, Siemens en Neff: Zonnestuur ziet aan de naam of het een wasmachine, vaatwasser of droger is (doet mee) of een oven of kookplaat (niet nodig).
- Apparaten laat zien hoeveel apparaten Zonnestuur in je netwerk zag en wat niet nodig is (tv, telefoon, robotmaaier …).
- 'Klopt dit?' (gezien aan je meter) staat nu bij Apparaten, met Ja en Nee.
- Ander merk toevoegen: eerst kiezen wat het is (laadpaal, warmtepomp, boiler …), dan het merk.
- Instellingen: geen dubbele lijst met apparaten meer; technische velden staan onder 'Voor gevorderden'.

## 0.73.1
- Een laadpaal die je leverancier al stuurt (Zonnestuur kijkt mee) wordt niet nog eens aangeboden.
- Duidelijkere uitleg bij gevonden merken (bijv. Bosch/Siemens: 'Start de was of vaat op zon of goedkope stroom').

## 0.73.0
- Nieuwe indeling met drie tabbladen onderin: Vandaag, Apparaten en Meer. Overal dezelfde, zodat je nooit meer zoekt.
- Apparaten: alles op één plek. Wat meedoet, wat Zonnestuur in je huis vond (met één knop: Toevoegen, Koppelen of Inloggen), je meter, zonnepanelen en stroomprijs. Een ander merk zoeken kan onderaan.
- De eerste keer opent Zonnestuur meteen Apparaten en gaat zelf zoeken.
- Op de Box doet witgoed met 'start op afstand' vanzelf mee zodra het gekoppeld is.
- Vandaag is rustiger: grafieken en logboek staan onder 'Meer details tonen'.

## 0.72.8
- Hulp op afstand kan zien wat de Box in je netwerk herkent, zodat we het zoeken naar apparaten kunnen verbeteren.

## 0.72.7
- Na het koppelen van een laadpaal biedt Zonnestuur het laadvermogen niet meer aan als meter. Alleen echte meters (zoals Tibber Pulse of HomeWizard) worden nog aangeboden, en alleen als je nog geen meter hebt.
- Gewone namen: 'Laadpaal Haardijk 3' in plaats van 'Haardijk 3 Beschikbare stroom', 'Wasmachine' in plaats van 'Wasmachine Starten'.

## 0.72.6
- Na het koppelen komen alleen apparaten waarvan zeker is dat ze bij Zonnestuur horen er meteen in: witgoed met een startknop, laadpalen en boilers of warmtepompen. Losse schakelaars kies je zelf.
- Koelkasten, vriezers en ovens worden nooit meer als warmtepomp aangeboden.

## 0.72.5
- Koppelen gaat nu in één keer door: na het inloggen zet Zonnestuur de apparaten van dat merk er meteen in. Wil je er een niet? Dan haal je hem weg bij Instellingen.
- Koppelschermen vragen eerst alleen wat echt nodig is. De rest staat ingeklapt onder 'Meer instellingen'.
- Knoppen en sensoren die een merk standaard uit zet (startknop, laadstroom, vermogen) zet Zonnestuur zelf aan.

## 0.72.4
- Miele (en andere merken die de startknop standaard uit zetten): Zonnestuur zet die knop nu zelf aan. Daarna kun je de wasmachine en droger met één tik toevoegen.

## 0.72.3
- Zaptec koppelen: alleen nog e-mailadres en wachtwoord van je Zaptec-account, de rest staat goed.
- Koppelschermen tonen de merknaam als titel en geen technische namen meer.

## 0.72.2
- Koppelen: na het koppelen zie je meteen welke apparaten Zonnestuur van dat merk kan sturen. Eén tik op Toevoegen en hij doet mee.
- Is een merk al gekoppeld? Dan krijg je geen Engelse foutmelding meer, maar meteen de keuze van je apparaten.
- De aan/uit-knop van een wasmachine of droger wordt nooit meer aangeboden (alleen 'start op afstand').
- Hulp op afstand kan nu ook meehelpen met koppelen.

## 0.72.1
- Veiligheid: Zonnestuur schakelt nooit meer de aan/uit-knop van een wasmachine, droger of vaatwasser (bijvoorbeeld Miele 'Aan/uit'). Uitzetten brak een lopend programma af. Witgoed gaat alleen via 'start op afstand'. Zo'n knop kun je ook niet meer als apparaat kiezen; oude instellingen worden genegeerd.
- Koppelen: merken staan bij hun merknaam (niet je accountnaam). Een laadpaal of ander merk dat je zelf al in de koppelmotor had, staat nu ook op 'Gekoppeld'.
- MQTT: duidelijke uitleg als verbinden niet lukt (ingebouwde broker staat uit, verkeerd adres, verkeerd wachtwoord).

## 0.72.0
- Opnieuw beginnen: bij Hulp kun je Zonnestuur terugzetten naar een kale installatie (typ WISSEN). Eerst geeft hij boiler, warmtepomp, laadpaal, batterij en omvormer terug aan hun eigen regeling. Je proefperiode en licentie blijven (de licentie kun je ook wissen). Op de Box kan ook de koppelmotor helemaal leeg.
- Koppelen: de gekoppelde merken staan nu in groepen: wat Zonnestuur gebruikt (en waarvoor), wat hij kan gebruiken (met een knop Toevoegen) en waar hij niets mee doet. Onderdelen van de koppelmotor zelf en e-mailadressen zie je niet meer. Op je eigen koppelmotor ontkoppel je niet meer vanuit Zonnestuur. 'Alles in één keer koppelen' koppelt alleen nog wat Zonnestuur kan gebruiken, geen camera's of speakers.
- Inloggen bij een merk: komt je telefoon terug uit het inlogvenster, dan kijkt Zonnestuur meteen of het gelukt is.
- Alle schermen nagelopen: overal hetzelfde logo, rustige labels zonder hoofdletters, links in de huisstijl, de testfase-balk kleiner (ook in donker), de laadbeurten-pagina in dezelfde kleuren, het overdrachtsrapport leesbaar op de telefoon, en op de telefoon staat het huis nu direct onder de kop.

## 0.71.1
- Nieuwe kaart op het dashboard: "Dit weet Zonnestuur nu van je huis". Per punt wat hij geleerd heeft (je ritme, wat er altijd aan staat, hoe je huis op het weer reageert, hoe lang je apparaten nodig hebben) en wat hij daardoor beter doet of wat het je oplevert.
- Een verband 'warmer = meer verbruik' (koelen) gebruikt Zonnestuur niet meer als rechte lijn: anders zou hij in de winter denken dat kou zuiniger is. Koelen telt nu alleen boven de koelgrens.

## 0.71.0
- Zonnestuur leert per dag hoe je huis op het weer reageert: vanaf welke temperatuur je gaat stoken (en koelen), en hoeveel kWh dat per graad kost. Eerder rekende hij met één rechte lijn; die ging mis als een huis in september koelt en in de winter stookt. Te zien bij Inzicht.
- Staat er ineens meer altijd aan (sluipverbruik deze week duidelijk hoger dan de weken ervoor)? Dan krijg je een tip met wat het per jaar kost en hoe je het vindt.
- Is je verbruik overdag al uren zo laag als 's nachts, dan vraagt Zonnestuur: "Ben je weg?" Met één tik zet je de boiler dan uit tot je terug bent. Hij zet nooit zelf iets uit op een vermoeden.

## 0.70.1
- Laadt een leverancier je auto (Zonnestuur kijkt alleen mee), dan telt dat laden niet meer mee als 'eigen verbruik van het huis'. Het geleerde verbruiksprofiel en de voorspelling kloppen daardoor beter.

## 0.70.0
- Warmtepomp (met buitenlucht): Zonnestuur kijkt nu ook naar de buitentemperatuur. Een warmer uur is zuiniger: dezelfde warmte kost dan minder stroom, ook als de prijs per kWh iets hoger is.
- Auto en boiler met een klaar-tijd: bij (bijna) gelijke prijs laadt of verwarmt Zonnestuur zo laat mogelijk. De accu staat dan korter vol (goed voor de levensduur) en de boiler verliest minder warmte.
- Verbruik voorspellen: Zonnestuur toetst elke dag welke voorspelling bij jouw huis het best werkt (je vaste ritme, vorige week of gisteren) en kiest die. Bij Inzicht zie je hoe ver de voorspelling ernaast zit.

## 0.69.0
- Zonnestuur huis: bovenaan het dashboard een tekening van jouw huis van nu. Met het echte weer (zon of maan op de goede plek, wolken, regen, wind in de bomen, dag, schemer of nacht), je zonnepanelen, de apparaten binnen die aan staan, de batterij, je auto's op de oprit (met lading) en de stroom van en naar het net. Eronder in één zin wat er gebeurt. Met de knop Schema krijg je het oude stroomschema terug.
- Geef je huis een eigen naam (potloodje onder de tekening). Zonnepanelen staan alleen op het dak als je ze hebt, de batterij hangt aan de buitenmuur, en een auto staat op de oprit zolang hij laadt of aan de laadpaal hangt.

## 0.68.2
- Vergelijken raadt pas aan om over te stappen als het minstens € 50 per jaar scheelt. Kleine verschillen: "laat het zo".
- Afwezig-stand rekent goed als de zomertijd ertussen eindigt.

## 0.68.1
- Laadpaal die op toestemming wacht (bijvoorbeeld Zaptec met 'autorisatie nodig'): Zonnestuur drukt nu zelf op 'Autoriseer het laden' of 'Hervat het opladen' als hij wil laden en de auto is aangesloten. Eerder bleef hij het opnieuw proberen zonder resultaat.

## 0.68.0
- Huisscherm (Nest Hub): bovenaan staat nu duidelijk "Goedkope stroom vanaf 23:00" of "Nu duur · goedkoop vanaf …" (in rood als stroom nu duur is).
- Nieuw op het Huisscherm: wat Zonnestuur straks regelt (bijvoorbeeld 23:00 auto laadt, 23:00 warm water). Uit te zetten bij Huisscherm.
- 's Avonds zie je wanneer het morgen het goedkoopst is (handig voor de was). De auto toont tot hoeveel procent hij laadt.
- Geen wasadvies meer midden in de nacht; bedragen breken niet meer middenin af.
- Wandscherm op een klein scherm (zoals een Nest Hub): de klok blijft netjes, zonder tekst over de rand.

## 0.67.0
- Makkelijker te lezen: betere contrasten in de hele app en op de website, en alles waar je op tikt is groot genoeg (volgens de nieuwe Europese toegankelijkheidsnorm).
- Moeilijke woorden zoals kWh, P1, omvormer en salderen hebben een stippellijn: tik erop en je krijgt de uitleg in één zin.
- Een paar dagen weg? Kies op het dashboard wanneer je thuiskomt. De boiler staat zolang uit en is weer warm als je thuiskomt.
- Huisgenoot toevoegen: bij Meldingen staat een QR-code. Je huisgenoot scant die en krijgt dezelfde meldingen.

## 0.66.0
- Zonnestuur kijkt naar het patroon van je stroomverbruik en ziet zo of je waarschijnlijk een elektrische auto, boiler, warmtepomp of zonnepanelen hebt. Op het dashboard vraagt hij dan: klopt dit? Zeg je ja, dan helpt hij je meteen koppelen.
- Heb je een FRITZ!Box? Met het wachtwoord daarvan ziet Zonnestuur alle apparaten in huis, ook die even slapen (Koppelen).
- Matter: scan de QR-code met je telefoon (een foto is genoeg), of tik de cijfers in. Een tikfout ziet Zonnestuur meteen. Een nieuw Matter-apparaat dat wacht op koppelen, wordt vanzelf gezien.

## 0.65.0
- Zonnestuur herkent nu het merk van veel meer apparaten in je netwerk, ook als ze geen eigen webpagina hebben (bijvoorbeeld laadpalen en warmtepompen die alleen een app hebben). Hij kijkt naar de netwerkkaart, de naam die het apparaat aan je router geeft en hoe het zich meldt.
- Instellen: wat gevonden is, staat bij 'Wat heb je in huis?' al aangevinkt, met het merk erbij. Je hoeft alleen te bevestigen.
- Koppelen: nieuw blok 'Ook gezien in je netwerk' met per merk een knop die meteen de juiste koppeling opent.

## 0.64.1
- Gaat een apparaat niet aan (bijvoorbeeld de auto is al vol, of de laadpaal wacht zelf), dan stuurt Zonnestuur niet meer elke 10 seconden opnieuw 'aan'. Na ± 1 minuut wacht hij 15 minuten en probeert het dan opnieuw. Gezien bij een laadpaal die vanochtend een kwartier lang elke 10 seconden een opdracht kreeg.

## 0.64.0
- Slimmer kiezen: op een dag met weinig zon gaat de zon eerst naar de thuisbatterij als dat 's avonds duidelijk meer oplevert, en draait bijvoorbeeld de boiler in een goedkoop uur. Op zonnige dagen blijven je apparaten voorgaan.
- Thuisbatterij en omvormer: rood lampje en 'Opnieuw verbinden' als ze niet bereikbaar zijn; ook te zien op de Hulp-pagina.
- Instellingen: bij elke instelling een (i) met één zin uitleg.
- Uitleg per merk nu met een plaatje van het scherm.
- Wandscherm: groter op een tv of groot scherm, beter contrast. Bij laden op het goedkoopste moment vóór je vertrek staat nu precies dat, in plaats van 'goedkoop uur'.

## 0.63.0
- Zonnestuur vindt nu zelf meer omvormers in je netwerk: SolarEdge, SMA, Kostal en andere SunSpec-omvormers, Huawei SUN2000, Hoymiles (via OpenDTU of AhoyDTU) en de Enphase IQ Gateway. Eén omvormer gevonden? Dan stelt Zonnestuur hem vanzelf in.
- Instellen: nieuwe vraag 'Wat vind je het belangrijkst?' (zoveel mogelijk besparen, zo min mogelijk terugleveren, of comfort eerst).
- Instellen in gewone taal: geen IP-adressen en technische namen meer bij de gevonden apparaten.

## 0.62.0
- Uitleg (help-centrum): zoeken in alle uitleg én op merk. Per merk een korte handleiding: wat je nodig hebt, hoe je het koppelt en wat Zonnestuur ermee doet, met een knop 'Nu koppelen'.
- Nieuwe uitleg: wat is een dynamisch contract, waarom salderen stopt, en hoe Zonnestuur beslist.
- Bij elk onderdeel van de instellingen een vraagteken naar de uitleg.
- Apparaat niet bereikbaar? Op de kaart staat nu een rood lampje met 'Opnieuw verbinden', en in gewone taal wat je kunt doen.
- De apparatenlijst in de instellingen toont geen technische adressen meer.

## 0.61.0
- Meldingen op je telefoon, zonder extra app: Instellingen → Schermen en meldingen → 'Meldingen op deze telefoon'. Werkt op Android en op de iPhone (zet Zonnestuur dan eerst op je beginscherm). Je krijgt hetzelfde als nu: storingen, hoogstens één kans per dag (zoals 'morgen is stroom extra goedkoop') en het weekrapport.
- Andere meldmanieren (ntfy, Telegram, e-mail) staan nu onder 'Andere manieren'.

## 0.60.0
- Alles samen plannen: de thuisbatterij weet nu wat de boiler, warmtepomp en auto van plan zijn. Hij rekent niet meer met zon die de boiler al opmaakt, en ziet de auto die vannacht laadt. Verandert een plan, dan rekent de batterij meteen opnieuw.
- Planning: bovenaan 'Komende 24 uur' zie je in één regel wat je verwacht van het net te halen, terug te leveren, hoeveel van je zon je zelf gebruikt en wat de stroom kost, met een kleine grafiek per uur.

## 0.59.0
- Hulp-pagina: bovenaan "Alles in orde ✓" of hoeveel punten aandacht vragen, en bij elk punt wat je kunt doen, met een knop erheen. Ook te zien of de stroomprijzen en de weersverwachting binnen zijn.
- Een knop die onverwacht misgaat, geeft nu altijd een duidelijke melding (en wij krijgen er automatisch bericht van) in plaats van te blijven hangen.
- Meldingen van de koppelmotor in gewone taal in plaats van Engels.
- Op afstand meekijken met je scherm werkt nu ook bij grote pagina's, zoals het dashboard.
- Het dashboard zegt niet meer dat de batterij zonnestroom opslaat als hij van het net laadt.
- Apparaat testen zonder adres: duidelijke melding wat je eerst moet invullen.

## 0.58.2
- Nieuw: SPRSUN-warmtepompen rechtstreeks. Met een RS485-naar-wifi-module (bijv. Elfin EW11) zet Zonnestuur bij zon of goedkope stroom de boilertemperatuur hoger en daarna weer terug, en leest hij vermogen en boilertemperatuur uit. Te vinden bij Koppelen onder SPRSUN.

## 0.58.1
- Zonnestuur vindt nu zoveel mogelijk vanzelf, zonder dat je iets hoeft te doen:
  - Nog geen meter? Hij zoekt zelf in je netwerk en kiest de meter als er precies één is (HomeWizard, YouLess, SlimmeLezer, Shelly EM, P1-kabel, of een meter uit de koppelmotor zoals de Tibber Pulse).
  - Zonnepanelen met een Fronius-omvormer worden vanzelf herkend en ingesteld.
  - Op de Box koppelt hij elk kwartier alles wat de koppelmotor in je netwerk ziet en alleen een 'OK' nodig heeft, ook als er standaardwaarden ingevuld moeten worden.
  - Op het dashboard zie je één keer wat hij vond. Zonnestuur stuurt een apparaat pas als jij dat kiest.

## 0.58.0
- Koppelen in gewone taal: geen 'Host' meer maar 'IP-adres van het apparaat' met uitleg waar je dat vindt, Engelse velden vertaald, en onvertaalde Engelse uitleg vervangen door Nederlands.
- Bij het invullen van een IP-adres kun je kiezen uit de apparaten die Zonnestuur al in je netwerk vond: één tik en het staat er.
- Is de inlogdienst van een merk even niet bereikbaar, dan zegt Zonnestuur dat en kun je het met één knop opnieuw proberen.
- Op het dashboard staat bij Apparaten een duidelijke knop '+ Apparaat toevoegen'.
- Alle 120 ingebouwde en 145 extra koppelingen nagelopen tegen de nieuwste koppelmotor en hun bron: ze bestaan allemaal en kloppen.

## 0.57.9
- Huisscherm-pagina werkte niet meer (je zag programmacode in beeld). Opgelost.
- Koppelen, Huisscherm en Hulp hebben bovenin nu ook een knop 'Dashboard'.

## 0.57.8
- Tibber, Zonneplan, Toon en andere meter-koppelingen: na het koppelen vraagt Zonnestuur meteen 'Gebruik als meter', met de stroom van dat moment erbij. Nog geen meter gekozen? Dan staat hij bovenaan Koppelen klaar.
- Instellen: altijd een knop 'Naar dashboard', 'Verder' loopt nooit meer vast als er niets gevonden is, en duidelijkere stapnamen.

## 0.57.7
- Box: de reparatie van de koppelmotor-instellingen gebeurt nu door het onderdeel dat de Box bijwerkt (dat mag het bestand aanpassen). Daarna start de koppelmotor normaal op, met al je koppelingen, en laden extra koppelingen zoals Nilan weer.

## 0.57.6
- Box: de koppelmotor weigerde elke herstart door een verouderde regel in zijn instellingen, waardoor nieuwe extra koppelingen (zoals Nilan) nooit laadden. De Box zet dat nu zelf goed en herstart de koppelmotor.
- Nog een keer op Koppelen drukken terwijl hij bezig is, begint niet meer opnieuw.

## 0.57.5
- Extra koppeling op de Box veel sneller klaar: de koppelmotor wordt meteen helemaal opnieuw gestart (meestal 1 à 2 minuten in plaats van tot 10).
- Koppelen: 'Op de achtergrond laten doorgaan' sluit het scherm nu echt; het komt vanzelf terug zodra het klaar is.

## 0.57.4
- Extra koppelingen (zoals Nilan) werken nu ook als de koppelmotor ze na het installeren nog niet kende: Zonnestuur controleert dat zelf, herstart de koppelmotor zo nodig (op de Box desnoods helemaal) en gaat daarna verder met koppelen.
- Tijdens het starten van een koppeling zie je dat de koppelmotor op de achtergrond bezig is, met de tijd erbij.
- Laadt de koppelmotor een koppeling echt niet, dan zie je waarom en krijgen wij automatisch een melding. De diagnose bevat nu ook de meldingen van de koppelmotor.

## 0.57.4
- Koppelen: tijdens het starten van een koppeling zie je dat de koppelmotor op de achtergrond bezig is, met de tijd erbij.
- De diagnose stuurt nu ook de laatste meldingen van de koppelmotor mee, zodat we kunnen zien waarom een koppeling niet laadt.

## 0.57.3
- Extra koppelingen (zoals Nilan): Zonnestuur wacht na het installeren langer tot de koppelmotor klaar is, en probeert het zelf opnieuw in plaats van meteen 'kent deze koppeling nog niet' te melden.
- Sommige extra koppelingen konden niet worden gedownload (fout 415). Opgelost.

## 0.57.2
- Nieuw: zonnestuur.nl/box brengt je thuis vanaf elke telefoon of computer direct naar je Box, ook als zonnestuur.local niet werkt.

## 0.57.1
- De laadtijdlijn heet nu 'Laadbeurten' en heeft de eigen Zonnestuur-stijl: dagen als tegels met de geladen kWh, prijsbalken per kwartier in goedkoop/normaal/duur, en de kwartieren waarin geladen is in zon-oranje.

## 0.57.0
- Nieuw: de laadtijdlijn. Per dag zie je de stroomprijs per kwartier, wanneer de auto laadde, hoeveel kWh en wat het kostte, en hoeveel goedkoper dat was dan het daggemiddelde. Met tabjes per dag blader je terug, en je schuift met je vinger over de grafiek. Werkt ook als je leverancier (bijvoorbeeld Tibber) laadt en Zonnestuur meekijkt.
- Vertrektijd per weekdag: maandag 7:30, woensdag 8:15, in het weekend niets. Op een dag zonder tijd laadt Zonnestuur rustig door tot de volgende dag dat je weg moet.
- Auto zonder app of koppeling (zoals een Seat Mii)? Voeg hem toe en vul zelf in hoe vol hij is. Wat Zonnestuur daarna laadt, telt hij er zelf bij op.

## 0.56.3
- Op de telefoon schuif je nu met je vinger over de prijsgrafiek om per uur of kwartier de prijs te zien. Een lijn volgt je vinger. Ook bij 'Vandaag' en je verbruikspatroon. Omhoog en omlaag scrollen werkt gewoon.

## 0.56.2
- Zonnestuur vindt nu vanzelf een Fronius-omvormer in je netwerk (Symo, Primo, Galvo, Eco, GEN24, en een oudere IG of IG Plus met Datamanager) en koppelt hem bij het instellen. Je ziet meteen wat je panelen opwekken, en of afknijpen bij een negatieve stroomprijs al kan.

## 0.56.1
- Apparaten die de koppelmotor vanzelf in je huis vindt, koppel je nu met één knop: 'Alles in één keer koppelen'. Alleen apparaten die iets vragen (zoals een wachtwoord) doe je nog zelf. Wil je er een niet, dan ontkoppel je hem bij Koppelen.
- Bij gevonden apparaten staat nu de juiste naam (bijvoorbeeld ESPHome in plaats van een willekeurig merk).

## 0.56.0
- Sneller koppelen: Zonnestuur begint al met zoeken terwijl je aantikt wat je in huis hebt. Op het volgende scherm staan je apparaten er dan meestal al.
- Zoeken gaat sneller: de P1-kabel wordt tegelijk met het netwerk gecontroleerd, en gevonden apparaten worden tegelijk herkend in plaats van een voor een.
- Zonnestuur vindt nu ook een YouLess en P1-lezers met ESPHome (zoals de SlimmeLezer) vanzelf als meter.
- HomeWizard P1-meter: staat 'Lokale API' uit, dan koppel je hem nu met één druk op de knop van de meter. Je hoeft niets meer in de HomeWizard-app te zoeken.
- Is er precies één meter gevonden, dan kiest Zonnestuur die meteen.
- Wat duidelijk bij je apparaten hoort (bijvoorbeeld je warmtepomp), wordt alvast aangevinkt. Klopt het niet, dan tik je het uit.
- Heb je je Shelly in de app een naam gegeven, zoals 'Boiler zolder', dan neemt Zonnestuur die naam en de soort apparaat over.

## 0.55.4
- Bovenaan elke pagina staat nu duidelijk dat Zonnestuur nog in de testfase is, met een knop om iets te melden.
- Zonnestuur Pro kost straks € 2 per maand of € 24 per jaar: bij Pro kopen kies je zelf. Tijdens de testfase blijft Pro gratis voor proefhuizen.
- Een wasmachine of droger die wacht tot je hem klaarzet, wordt niet meer als storing doorgegeven.

## 0.55.3
- Bij het zoeken naar een P1-kabel laat Zonnestuur Zigbee-, Z-Wave- en Thread-sticks voortaan met rust. Die werden ten onrechte getoond als "slimme meter via P1-kabel".

## 0.55.2
- Tijdens de proef kunnen wij standaard op afstand meekijken en helpen (ook met je scherm), zodat we problemen snel oplossen. Uitzetten kan bij Hulp onder "Zonnestuur mag op afstand meekijken". Met "Help mij instellen" laat je weten dat je op ons wacht.

## 0.55.1
- Help mij: zolang je het aan hebt en Zonnestuur open hebt, kunnen wij ook zien wat er op je scherm staat. Zo kunnen we je precies vertellen waar je moet tikken. Wachtwoorden gaan nooit mee.

## 0.55.0
- Help mij: kom je er niet uit, tik dan bij Hulp (of bij het instellen) op "Help mij instellen". Zonnestuur stelt het dan op afstand voor je in: apparaten zoeken, instellingen kiezen en klaarzetten. Alleen zolang jij het aan zet (hooguit 24 uur), en je kunt het altijd stoppen.

## 0.54.1
- Zoeken in je netwerk stopte soms halverwege als een ander apparaat in huis een vreemd antwoord gaf. Nu slaat Zonnestuur dat apparaat over en zoekt hij gewoon verder.

## 0.54.0
- Eerste keer instellen is veel eenvoudiger: je tikt aan wat je in huis hebt (zonnepanelen, boiler, warmtepomp, auto, thuisbatterij, wasmachine) en kiest het merk. Zonnestuur zegt per apparaat in gewone taal wat er moet gebeuren: hij vindt het zelf, je logt in met de app van het merk, of er is een onderdeel nodig.
- Slimme meter: kies wat er al aan je meter zit, bijvoorbeeld Tibber Pulse, Zonneplan Connect of HomeWizard.
- Uitleg hoe je een IP-adres vindt (in de app, in je modem of met de gratis app Fing).

## 0.53.4
- SmartHeat-warmtepompen staan in de koppellijst: via SG-ready (2 relais) of via een BSB-LAN-adapter op de Siemens-regelaar.
- KNX (Gira, Jung, ABB, MDT …): na het koppelen kun je bij Koppelen meteen een KNX-schakelaar toevoegen met het groepsadres.

## 0.53.3
- Zonnestuur Box kijkt nu elk uur naar een nieuwe versie (was één keer per nacht), en bij Hulp staat een knop "Nu zoeken en bijwerken".
- Meekijken op afstand (in de testfase standaard aan, uit te zetten bij Hulp): met het seintje gaat mee of de meter en je apparaten werken. Lukt er iets niet, dan kunnen wij één keer het logboek opvragen om het snel op te lossen.

## 0.53.2
- Zonnestuur Box: wat de koppelmotor zelf in je huis ziet (bijv. een P1-meter, Shelly, warmtepomp) staat nu bovenaan bij Koppelen onder "Gevonden in je huis", met één knop om te koppelen. Ook bij het eerste instellen zie je het.

## 0.53.1
- Koppelen: vond Zonnestuur niets in je netwerk, dan kon je niet verder. Nu kun je meteen een merk koppelen of eerst verder zonder apparaten; het dashboard laat dan zien hoe je je eerste apparaat koppelt.

## 0.53.0
- Huisscherm naar jouw smaak: kies een kleur, licht of donker, grotere tekst, een begroeting met je naam, een nachtstand (alleen een rustige klok), tot 4 eigen tegels (bijv. temperatuur buiten of een lamp) en de volgorde onderaan.
- Thuisbatterij leert van zichzelf: hoe ver de verwachting per uur ernaast zit, en hoeveel kWh en welk rendement je batterij echt haalt. Dat zie je op de batterijkaart.
- Instellingen doorzoeken: typ bijv. "melding" of "batterij" en je ziet meteen het juiste onderdeel.
- Zonnestuur Box: ingebouwde MQTT-broker, aan te zetten bij Koppelingen (voor Zigbee2MQTT, Tasmota, Shelly en P1-lezers).
- Opgelost: de tip van de dag kon een fout geven op het dashboard.

## 0.52.1
- Warmtepompboilers en combi-units (zoals Nilan) die niet melden dat ze opwarmen: Zonnestuur ziet het nu aan de stijgende watertemperatuur. Daardoor telt het verbruik en de besparing van warm water eindelijk mee (stond op 0).

## 0.52.0
- Heeft Zonnestuur je minstens € 10 bespaard, dan kun je het met één knop doorvertellen, of ons je ervaring mailen. Wegklikken kan; dan zie je het 60 dagen niet.
- Lukt het ophalen van de kwartierprijzen even niet, dan probeert Zonnestuur het na een kwartier opnieuw (was zes uur met uurprijzen).

## 0.51.1
- Vergelijken met Tibber (en andere leveranciers): laden wordt nu per kwartier bijgehouden en tegen de kwartierprijs gerekend, net zoals Tibber het in rekening brengt. Ook wat Zonnestuur had gedaan wordt per kwartier uitgerekend.
- Een laadbeurt loopt nu van je klaar-tijd tot de volgende klaar-tijd. Laden tussen de klaar-tijd en 12:00 viel eerder buiten de vergelijking.
- De laadgeschiedenis van de afgelopen 10 dagen wordt eenmalig per kwartier opnieuw ingelezen, zodat de vergelijking meteen klopt.

## 0.51.0
Slimmere thuisbatterij, op basis van wetenschappelijk onderzoek naar thuisbatterijen:
- Ochtendzon verkopen, later opslaan: is de batterij op een zonnige dag toch al voor de middag vol, dan laat Zonnestuur hem 's ochtends even stilstaan. De ochtendzon levert dan meer op, de middagzon (vaak goedkoop of negatief) vult de batterij, en hij staat korter vol. Aan te zetten in Instellingen > Thuisbatterij.
- Rekent mee dat een batterij bij weinig vermogen (bijvoorbeeld 's nachts) naar verhouding veel verliest, en eventueel zijn stand-by-verbruik.
- Kiest voorzichtiger: liever iets te veel dan te weinig in de batterij als verbruik of zon anders uitvalt.
- Laadt van het net zo laat als het kan: lang helemaal vol staan veroudert de batterij.
- Uitleg in Hulp > "Batterij: slim sturen".

## 0.50.2
- Telefoon: tikken op een uur in de prijsgrafiek toont weer de prijs (werkte op de iPhone niet meer). Boven de grafiek staat nu "Tik op een uur om de prijs te zien".

## 0.50.1
- Telefoon: je kunt nu rustig over de grafieken (prijzen, planning) heen scrollen. De uitleg bij een uur verschijnt pas als je er bewust op tikt; tik ergens anders om hem weer weg te halen.

## 0.50.0
- Jaaroverzicht: per maand en per apparaat wat Zonnestuur opleverde, en hoeveel van de prijs van Pro je al terugverdiende.
- Melding "morgen wordt waarschijnlijk een goedkope dag" als de prijsverwachting (wind, zon) duidelijk lager is dan de afgelopen week.
- Overdrachtsrapport voor de installateur: wat er gekoppeld is, of het werkt, een controlelijst en de gegevens van de installateur; af te drukken.
- Alfen-laadpalen rechtstreeks koppelen via Modbus TCP (laadstroom 6–32 A, zonder koppelmotor).

## 0.49.0
- Hoofdzekering bewaken: vul bij Instellingen > Meter je aansluiting in (bijv. 3 × 25 A). Zonnestuur houdt auto, warmtepomp, boiler en batterij samen onder de grens: eerst laadt de auto zachter, daarna wacht wat het minst belangrijk is.
- Op de telefoon staat het menu nu als vaste balk onderin, zoals een app.

## 0.48.0
- Auto: Zonnestuur meet hoe snel je auto echt laadt (ook dat het boven ± 80% langzamer gaat) en rekent daar de hele tijd mee. De laadkaart laat de gemeten snelheid zien.
- Vergelijken: vul per laadbeurt in wat de app van je leverancier zegt dat hij kostte (bijv. inclusief Grid Rewards van Tibber); dan telt dat bedrag. Per leverancier staat erbij waar je het vindt.
- Geeft de koppeling van je leverancier de opbrengst door (bijv. Powerplay van Zonneplan), dan telt Zonnestuur die vanzelf mee.
- De vergelijking rekent voor Zonnestuur met de echte laadsnelheid van je auto, niet met die op papier.

## 0.47.2
- Prijsverwachting: haalt eerst de recentste dagen op en leert opnieuw zodra er meer historie is, zodat hij na de installatie sneller goed voorspelt.

## 0.47.1
- Thuisbatterij, "Meer instellingen": elke instelling in een eigen blok met uitleg in gewone woorden, schakelaars in plaats van vinkjes en een samenvatting van wat er nu ingesteld staat.
- Nieuw deel "Voor de installateur" met uitleg bij de piekgrens, de verbinding en de sturing via de koppelmotor.

## 0.47.0
- Auto: "Moet de auto later klaar zijn?" Kies een dag en tijd (bijv. maandag 08:00) en hoe vol. Zonnestuur laadt dan in de goedkoopste of zonnigste uren tot dat moment, ook over meerdere dagen.
- Prijsverwachting uit het weer: veel wind of zon maakt stroom goedkoop. Zonnestuur voorspelt de prijs voor de dagen die de beurs nog niet heeft gegeven en laat per dag zien wat hij verwacht en waarom. Auto en thuisbatterij plannen daarmee.
- Prijscontrole: met de prijssensor van je leverancier (bijv. Tibber) legt Zonnestuur elk kwartier zijn eigen prijs ernaast en corrigeert zichzelf als het structureel afwijkt.
- Vergelijken: per laadbeurt zie je hoe laat, hoeveel kWh en de prijs per kWh, zodat je het naast de app van je leverancier kunt leggen.
- Thuisbatterij instellen in vijf korte vragen; alles wat je meestal niet nodig hebt staat onder "Meer instellingen".
- Instellingen opnieuw ingedeeld in vijf groepen met een vaste navigatie, en een Opslaan-knop die altijd in beeld is.

## 0.46.3
- Huisscherm (Nest Hub): onderaan zie je nu wat er draait: auto laden (ook als Tibber of een andere app laadt), de boiler of warmtepomp en de thuisbatterij.

## 0.46.2
- Laadt Tibber of een andere app je auto, dan zie je dat nu op de echte laadkaart: de auto met oplichtende laadkabel, het accupercentage en wat Zonnestuur zou doen.
- De autofoto knippert niet meer bij het verversen van het dashboard.

## 0.46.1
- Laadkaart: naast "Koppelen" nu ook "Alleen meekijken". Laadt Tibber, Jedlix of een andere app je auto, dan blijft die laden en laat Zonnestuur live zien wat er gebeurt.

## 0.46.0
- Stuurt een leverancier je batterij of het laden van je auto? Dan zie je dat nu live op het dashboard: wat hij nu doet, hoeveel er sinds 12:00 geladen is en wat het kostte, en wat Zonnestuur nu zou doen.

## 0.45.0
- Stuurt je leverancier (Zonneplan, Frank, Tibber, …) je thuisbatterij? Kies "Wie stuurt de batterij?": je leverancier (Zonnestuur kijkt mee), Zonnestuur, of afwisselend per maand.
- Nieuwe pagina Vergelijken: per maand wat je leverancier deed, wat Zonnestuur had gedaan en het verschil, met advies. Ook voor slim laden van de auto (Tibber, Jedlix, ANWB, …).
- Sessy rechtstreeks koppelen; Zonnestuur kan zelf wisselen tussen Frank en eigen sturing.
- De batterij legt elke keuze uit, bijvoorbeeld "nu geen stroom uit de batterij: bewaren voor 18:00".

## 0.44.0
- Thuisbatterij: kies je doel (slim, zelfvoorzienend of maximaal verdienen). Met een dynamisch contract kan de batterij nu ook verkopen aan het net bij een prijspiek (Marstek, Zendure, Victron en batterijen met een vermogen-instelling).
- Auto: laden op wat je rijdt. Vul je kilometers per werkdag en weekenddag in; bij kou rekent Zonnestuur met meer verbruik.
- Nettarief vanaf 2029 (voorstel van de ACM): Zonnestuur rekent vanaf dan vanzelf met de dure en goedkope uren.

## 0.43.0
- Teksten opgeschoond: koppelen via merken gaat nu overal via "de koppelmotor". Uitleg en instellingen zijn eenvoudiger, de uitlegvideo is bijgewerkt.

## 0.42.0
- Nieuwe licentiesleutels, zodat Pro straks automatisch aangaat na aanmelden of betalen. Had je al een Pro-sleutel, dan krijg je van ons een nieuwe.

## 0.41.0
- Nieuw: koppelen met Domoticz, openHAB en ioBroker (Instellingen → Andere systemen). Meters, schakelaars en thermostaten uit die systemen kun je meteen in Zonnestuur gebruiken.
- "Wat heb je nodig?" gaat nu uit van de Zonnestuur SD-kaart voor je eigen Raspberry Pi.

## 0.40.1
- Bovenaan het dashboard stond 's avonds soms "Wacht op de zon", terwijl het volgende moment een goedkoop uur is. Nu staat er "Volgende slimme stap", met de reden en de prijs.

## 0.40.0
Grote controle van alle koppelingen, met veel verbeteringen:
- Omvormer: wordt altijd weer losgelaten, ook zonder Pro, na een storing of herstart, en als je hem verwijdert. Fronius en SolarEdge lezen hun vol vermogen zelf uit. APsystems en SunSpec krijgen precies hun eigen instelling terug.
- Thuisbatterij: krijgt bij stoppen echt zijn eigen regeling terug (Zendure stond stil, Victron verloor zijn eigen grenzen), ook na een herstart. Niet meer elke 10 seconden opnieuw losgelaten. HomeWizard stopt met volladen bij loslaten.
- Auto: zonder vermogensmeting niet meer onterecht "vol" na 10 minuten. Laden op 1 fase op het juiste vermogen. Een OCPP-laadpaal ziet nu wanneer de stekker eruit gaat. Enode krijgt niet meer steeds dezelfde opdracht.
- P1-kabel: herstelt zich na eruit en erin trekken, en controleert de foutcode van elk telegram.
- Tasmota met meerdere kanalen, YouLess LS110, ESPHome (nieuwe versies), Shelly via MQTT en Bosch/Siemens via Home Connect werken nu.
- SG-ready: de warmtepomp komt bij omschakelen niet meer even in de stand "geblokkeerd".
- Merkenlijst: koppelingen die alleen met de hand in Home Assistant kunnen, krijgen uitleg in plaats van een knop die vastloopt. Een opgeheven koppeling (Panasonic) vervangen. Duidelijkere foutmeldingen bij het koppelen.

## 0.39.1
- Grote koppen zijn beter leesbaar: de woorden staan niet meer zo dicht op elkaar.
- De uitlegvideo is vernieuwd.

## 0.39.0
- Nieuw: een korte kennismaking bij de eerste start, met een uitlegvideo van één minuut. Wat Zonnestuur doet, waarom het vanaf 2027 telt, hoe het werkt en wat je ermee kunt. Later terug te vinden via Uitleg.
- Nieuw: "Wat heb je nodig?". Tik aan wat je thuis hebt, en je ziet meteen wat Zonnestuur kan en of je nog iets nodig hebt (met richtprijzen).

## 0.38.0
- Meld je aan als proefhuis vanuit Zonnestuur (Instellingen → Zonnestuur Pro): tijdens de testfase krijg je Pro dan gratis.
- Pro kopen kan straks direct vanuit Zonnestuur met iDEAL; Pro gaat na het betalen vanzelf aan.
- Zonnestuur laat een paar keer per dag weten dat het draait (zonder persoonlijke gegevens). Zo kunnen we je proefperiode verlengen. Uit te zetten bij Hulp.

## 0.37.1
- Zonnestuur wordt voortaan geleverd als afgeschermd pakket, zonder leesbare broncode. Voor jou werkt alles hetzelfde.

## 0.37.0
- Voorbereiding op een beter beschermde versie: de Box kan voortaan updates in een nieuwe, afgeschermde vorm ontvangen. Voor jou verandert er niets.

## 0.36.1
- Het stroomschema op het scherm Nu past weer helemaal in beeld op de telefoon: de naam en het vermogen onder het net-icoon en de pauzeknop vielen half buiten het blok.

## 0.36.0
- Nieuw: knop **Feedback geven** bovenaan het scherm (het tekstwolkje). Kies of er iets misgaat, of je een idee hebt of een vraag. Bij een idee of vraag gaat alleen je tekst mee; bij een probleem ook de gegevens die nodig zijn om het op te lossen.

## 0.35.3
- De datum bovenaan het scherm Nu valt niet meer half in de ronde hoek van het blok; er zit weer netjes ruimte omheen, op telefoon en computer.
- Pro is gratis tijdens de testfase: na de 30 proefdagen krijg je via info@zonnestuur.nl een gratis Pro-sleutel.

## 0.35.2
- Zonnestuur heeft een eigen plek op GitHub: github.com/zonnestuur/zonnestuur-ha. Het oude adres stuurt vanzelf door; je hoeft niets te doen.

## 0.35.1
- Huisscherm hapert niet meer: na een korte internetstoring kon het scherm op een Nest Hub Home Assistant niet meer bereiken. Het bleef staan, maar sprong elke 30 seconden even weg. Zonnestuur ziet dat nu (drie keer kort na elkaar weg) en zet het scherm netjes opnieuw neer. Eén losse onderbreking, zoals een herstart, laat het met rust.
- Bestaande huisschermen worden na de update vanzelf bijgewerkt.

## 0.35.0
- Nieuwe huisstijl, gelijk aan zonnestuur.nl: koel daglicht-grijs, strakke witte vlakken, vette koppen met een lijn eronder, zwarte hoofdknoppen en omlijnde tweede knoppen. Geldt voor het dashboard, Instellingen, Koppelen, Huisscherm, Hulp en de uitleg, in licht en donker.

## 0.34.1
- Koppelen zonder Enode: Enode (betaald) staat niet meer in de standaardlijst. Elke auto kan gratis via de laadpaal (Zonnestuur leert hoe lang laden duurt en begint op tijd), en waar het kan via de gratis koppeling van het automerk of evcc. Nieuw: Volkswagen ID en Audi via hun eigen koppeling.
- Heb je zelf een Enode-account, dan vul je dat in onder Instellingen; het koppelscherm toont de Enode-route dan weer.

## 0.34.0
- **Nieuwe laadkaart**: eerst wat er met je auto gebeurt. Welke auto, klaar om, wanneer hij laadt, wat het kost, en één knop "Nu laden". De laadinstellingen staan ingeklapt eronder. Met een foto van een auto aan de laadpaal; bij stekker eruit vervaagt de laadpaal, tijdens het laden licht hij op.
- **Hulp en diagnose** (Instellingen → Hulp en problemen): zie in één oogopslag of meter, Home Assistant en apparaten werken, en meld een probleem met één knop. Zonnestuur stuurt een diagnose mee, zonder wachtwoorden, adressen of tokens.
- **Fouten automatisch melden**: fouten in Zonnestuur en in het scherm gaan gefilterd en ontdubbeld naar de Zonnestuur-server, zodat ze opgelost kunnen worden voordat je ze merkt. Uit te zetten op de hulppagina.
- **Testkanaal voor de Box**: proefhuizen krijgen nieuwe versies als eerste; de rest pas als de versie stabiel is.

## 0.33.2
- Apparaten: na een afgeronde wasbeurt verdwenen de wasmachine en de apparaten daarna uit het overzicht. Opgelost, en één kaart met een fout houdt de andere niet meer tegen.
- Koppellijst: Nilan (Compact P, Compact P GEO, VPL) en Genvex toegevoegd, met de lokale koppeling via de Nilan Gateway of via Modbus.

## 0.33.1
- Huisscherm: zenders die in de lijst alleen een onbeveiligd adres hebben (zoals NPO en 538) probeert Zonnestuur via https, zodat ze ook op het scherm spelen.
- Twee apparaten met dezelfde naam zijn uit elkaar te houden.

## 0.33.0
- **Huisscherm** (Instellingen → Huisscherm en radio): kies een Google Nest Hub, Chromecast of tv, vink aan wat erop staat (stroomprijs, weer, afval, witgoed, agenda, auto, besparing, nieuws) en kies een radiozender met tijden, dagen en volume. Zonnestuur maakt het dashboard, de radio-knop en de automatisering in Home Assistant zelf aan.
- Zenders zoeken in de open zenderlijst van radio-browser.info, met luisteren voordat je kiest; of vul zelf een streamadres in.
- Nest Mini, Nest Audio en Google Home: alleen radio op vaste tijden.
- Op de Box koppelt Zonnestuur Google Cast met één knop.

## 0.32.2
- In de Home Assistant-app: bovenaan doorslepen in Zonnestuur ververst niet meer per ongeluk de hele app (en vraagt dus ook niet meer om opnieuw in te loggen).

## 0.32.1
- Huisscherm (Nest Hub): grote knop **Radio aan / Radio uit** naast de klok. Uit blijft uit tot de volgende dag; aan start de zender weer (`radio_stream`, anders de laatst gespeelde).
- Dashboard: verloop van vandaag toont weer het netverbruik bij de prijsstand (zonder zonnepanelen); dat werd een tijd niet bewaard.
- Dashboard laadt zichzelf binnen 5 seconden opnieuw als iets mislukte (bijv. tijdens een herstart van Home Assistant) en ververst meteen als je terugkomt in de app. Eén kapotte grafiek houdt de rest niet meer tegen.

## 0.32.0 – Alle merken koppelen
- Nieuw scherm **Koppelen**: zoek je merk (424 merken en apparaten in Nederlandse huishoudens) en zie per route wat je nodig hebt. Met één knop start je de koppeling.
- Home Assistant-integraties koppel je nu vanuit Zonnestuur: formulieren, keuzes en inloggen bij de fabrikant verschijnen in het Zonnestuur-scherm, met de Nederlandse teksten van de integratie.
- Integraties van buiten Home Assistant (HACS) installeert Zonnestuur zelf vanaf GitHub, daarna herstart Home Assistant één keer.
- Matter-apparaten koppelen met de Matter-code, en Zigbee-apparaten laten aanmelden (ZHA).
- Zonnestuur Box: ingebouwde koppelmotor (Home Assistant en Matter-server; Thread-grensrouter en evcc wanneer nodig). Daarmee werken op de Box alle merken uit de lijst. Box: Raspberry Pi 4 of 5 met 4 GB, microSD van 16 GB. Bestaande Boxen met genoeg geheugen krijgen de motor bij deze update.
- Auto's van merken die hun koppeling hebben dichtgezet (Volkswagen-groep, Ford, BYD e.a.) via Enode, en laadpalen en auto's die evcc kent (ook EEBUS, zoals EVBox Livo en Elli).
- Thuisbatterij ook via Enode.

## 0.31.0 – Omvormers rechtstreeks
- Omvormer koppelen zonder Home Assistant (ook op de Box): Fronius, SMA, SolarEdge, Huawei, GoodWe (hybride), Sungrow, Kostal, Hoymiles via OpenDTU of AhoyDTU, APsystems EZ1, Victron en elk merk met SunSpec Modbus. Enphase en SolaX alleen uitlezen.
- Zonnestuur leest de opwek dan zelf uit de omvormer en begrenst bij een negatieve terugleverprijs. Met knop Test verbinding en per merk wat je moet aanzetten.
- Veilig loslaten: een eigen exportgrens van de installateur komt precies terug, bij stoppen laat hij de omvormer los, en na een onverwachte herstart ook. Waar onbekend is of een instelling naar het geheugen van de omvormer gaat, schrijft hij hoogstens eens per 5 minuten.
- Instellingen: velden staan op de telefoon nu netjes onder elkaar over de hele breedte.

## 0.30.10 – Zonvoorspelling hersteld
- In 0.30.9 werd de zonvoorspelling niet meer opgehaald (fout in de vraag aan Open-Meteo). Hersteld; het weer van de afgelopen maand komt nu ook binnen.

## 0.30.9 – Weer, huishoudprofiel en batterijen rechtstreeks
- Zonnestuur haalt nu ook temperatuur, bewolking, regen en wind op en bewaart die per uur. Hij leert hoeveel meer stroom jouw huis gebruikt als het kouder is en schat daarmee het verbruik van vandaag en morgen. Te zien onder Geleerd.
- Het plan voor apparaten en de thuisbatterij gebruikt die weerafhankelijke verbruiksverwachting.
- Thuisbatterij rechtstreeks, zonder Home Assistant: HomeWizard Plug-In Battery, Marstek Venus, Zendure SolarFlow/Hyper en Victron (ESS). Met koppelknop voor HomeWizard en een knop Test verbinding. Werkt ook op de Box.
- Het HomeWizard-token wordt niet naar de app gestuurd.
- Uitleg over de Nest Hub bijgewerkt: één keer casten, niet steeds opnieuw.

## 0.30.8 – Groot scherm licht genoeg voor een Nest Hub
- Op een Nest Hub (of met licht: true) staat het grote scherm in een lichte stand: geen bewegende achtergrond en geen animaties. Een te zware pagina liet de Hub na een paar minuten terugvallen op de fotolijst.
- Bij een nieuwe nieuwskop wordt alleen de nieuwsbalk vervangen, niet het hele scherm.

## 0.30.7 – Scherm blijft in beeld bij radio (proef)
- De radio in het grote scherm speelt nu via een klein video-element. Een Nest Hub zet bij alleen geluid na een paar minuten de fotolijst over het scherm; zo hopen we dat het scherm blijft staan. Uit te zetten met radio_als_video: false.
- Uitleg: een Nest Hub haalt een gecast scherm na ongeveer 10 minuten weg; laat het elke 8 minuten opnieuw sturen.

## 0.30.6 – Rustiger radio, duidelijker nieuws
- De radio in het grote scherm komt zacht op (in 6 seconden) in plaats van in één keer. Optie radio_volume (0–1) voor het niveau binnen het scherm.
- Nieuws in een eigen balk: grotere kop over maximaal twee regels, de bron als label, hoe lang geleden, en een dun balkje dat laat zien wanneer de volgende kop komt.
- Staand scherm (tablet): blokjes over twee rijen.

## 0.30.5 – Het grote scherm als huisscherm
- Wasmachine, droger en vaatwasser: "klaar om 18:30" tijdens het programma, en een oplichtend "Was is klaar" als hij klaar is (Miele en andere integraties met een status en eindtijd).
- Regen: "droog tot 15:00" of "regen tot 16:00" bij het weer, uit de verwachting per uur.
- Agenda: de eerstvolgende afspraak van vandaag.
- Auto: accu en laadstatus van gekoppelde auto's.
- Besparing van deze maand bovenin, naast Zonnestuur.
- Nieuws uit meerdere bronnen tegelijk, elk met een eigen label (bijv. GLD en NOS).
- Wat het dringendst is staat vooraan; wat niet meer past valt weg, zodat het scherm rustig blijft.

## 0.30.4 – Nieuws op het grote scherm
- Optie nieuws: koppen van een nieuwsfeed (integratie Feedreader) als rustige regel onderaan het grote scherm, wisselend elke 15 seconden. Bijvoorbeeld Omroep Gelderland: nieuws: event.nieuws, nieuws_label: GLD.

## 0.30.3 – Afval en weer op het grote scherm
- Het grote scherm toont welke afvalcontainer deze week aan de weg moet, als bakje in de kleur van de container (GFT groen, papier blauw, PMD oranje, rest grijs). De avond ervoor licht hij op: "vanavond buiten zetten". Werkt vanzelf met de integratie Afvalbeheer; of geef zelf op: afval: [{entity, naam, kleur}].
- Ook het weer van nu (temperatuur en een icoon).

## 0.30.2 – Radio in het grote scherm
- Het grote scherm kan zelf de radio afspelen (optie radio_entity: een tekst-helper met de stream). Zo blijft de muziek doorspelen terwijl Zonnestuur op je Nest Hub in beeld is. Rechtsboven staat welke zender speelt.

## 0.30.1 – Groot scherm voor je Nest Hub
- Nieuwe kaart "Zonnestuur: groot scherm": schermvullend voor een Google Nest Hub of wandtablet. Is stroom goedkoop, dan groot "tot 14:00", hoe lang nog, de prijs nu en de prijs per uur met het goedkope blok oplichtend. Anders: wanneer het volgende goedkope blok begint.
- Nieuwe sensor "Zonnestuur: stroom goedkoop" (aan/uit, met tot hoe laat en het volgende blok): handig als trigger om het scherm op je Hub te zetten of een melding te sturen.
- Uitleg: zo zet je het scherm op je Nest Hub terwijl er muziek speelt.

## 0.30.0 – Kaarten voor je dashboard en widgets voor je telefoon
- Vijf Zonnestuur-kaarten voor het Home Assistant-dashboard: nu (oordeel, besparing, tips), besparing, prijs en planning, auto laden (lijntekening met oplichtende kabel) en apparaten. Zonnestuur zet ze zelf klaar: Bewerken → Kaart toevoegen → zoek op "Zonnestuur". Ze volgen het licht of donker thema en werken op een wandtablet.
- Nieuwe sensoren voor widgets in de Home Assistant-app (iPhone en Android): Zonnestuur nu, en per auto de accu met laadstatus.
- Uitleg: hoe je de kaarten en telefoonwidgets toevoegt.
- De add-on krijgt schrijfrecht op de map van Home Assistant, alleen om de kaarten in /config/www/zonnestuur te zetten.

## 0.29.8 – Laadkaart als lijntekening
- De auto op de laadkaart is nu een strakke lijntekening: één dunne lijn, met de laadpaal en een grondlijn. Zit de stekker erin, dan kleurt de kabel geel en lopen tijdens het laden de stippen naar de auto. De accu is een dunne lijn langs de dorpel; tijdens het laden licht hij op. Zit de stekker eruit, dan ligt hij naast de laadpaal.

## 0.29.6 – Eerlijk oordeel
- "Goed moment" alleen als er vandaag niet duidelijk iets goedkopers meer komt. Komt er binnenkort ≥ 3 ct per kWh goedkopere stroom, dan staat er "Kan, beter om …".

## 0.29.5 – Strak op de telefoon
- Het hele dashboard opnieuw ingedeeld voor de telefoon: compacte kop, besparing en tips bovenaan, planning op één kolom, geen zijwaarts schuiven meer (ook bij Instellingen).
- Op de telefoon start het dashboard eenvoudig (alleen wat nu telt); "Uitgebreid" toont alles en wordt onthouden.
- Kaart "Auto laden" vernieuwd: auto met laadpaal, per auto het percentage en het model, één knop Koppelen, en een waarschuwing om slim laden in een andere app eerst uit te zetten.
- Uitleg: onderwerpen als schuifbare knoppen bovenaan. Telefoonwidget in de nieuwe stijl.

## 0.29.4 – Geen dubbele meldingen
- Opgelost: na een update of herstart, of als de verbinding met de machine even wegviel, kwam de melding "Wasmachine staat klaar" opnieuw. Zonnestuur onthoudt nu wat hij al gemeld heeft.

## 0.29.1 – Duidelijk als de machine niet bereikbaar is
- Valt de verbinding met de wasmachine of droger weg (bijv. de Miele-cloud), dan zegt Zonnestuur dat, in plaats van "wacht tot je hem klaarzet". Het plan blijft staan.

## 0.29.0 – Nieuw dashboard
- Strakker en rustiger: één accentkleur, grote koppen en bedragen, geen overbodige tekst.
- Bovenaan: het oordeel, wat je deze maand bespaarde (met vandaag, dit jaar en het tempo per jaar) en hooguit drie tips met hun opbrengst.
- Nieuwe laadkaart voor de auto: laadpaal, kabel en auto. Zit de stekker erin, dan lichten kabel en puntjes op; tijdens het laden lopen de puntjes naar de auto. De accu staat als band in de auto, met doel en minimum.
- Nieuwe pagina Uitleg (vraagteken rechtsboven en bij elke kaart): alle uitleg op één plek, ook hoe de besparing berekend wordt.

## 0.28.4 – Programma gekozen in de Miele-app wordt herkend
- Opgelost: koos je het programma in de Miele-app, dan zei Zonnestuur toch "kies nog een programma". Een startknop die nog nooit is ingedrukt heeft in Home Assistant de toestand 'onbekend'; dat telt nu als klaar. Staat de machine op 'geprogrammeerd', dan ook.

## 0.28.3 – Voorwaarden uit Home Assistant
- Per apparaat: "niet opwarmen zolang deze aan staat" (bijv. ontvochtigen) en "alleen 's nachts zolang deze aan staat" (bijv. koelseizoen), met schakelaars uit Home Assistant.
- Lager tijdens dure stroom: tot 15 °C, en instelbaar vanaf welk deel van de dag het 'duur' is.

## 0.28.2 – Wasbeurten zichtbaar
- Opgelost: een wasbeurt die Zonnestuur startte, werd niet afgesloten. Er stond alleen "Aan om …" in het logboek, zonder verbruik en zonder verslag op de kaart. Zonnestuur volgt de wasbeurt nu via de machine zelf (Miele, Home Connect): wanneer hij draait, wanneer hij klaar is en hoeveel kWh hij gebruikte (Miele-energiemeter).
- Bij klaar: een regel in het logboek ("Wasmachine klaar om 14:59, na 1 u 59 min: 0,5 kWh") en het verslag op de kaart.
- Liep er een wasbeurt af tijdens een herstart of update, dan haalt Zonnestuur het verbruik achteraf uit Home Assistant en boekt het alsnog.

## 0.28.1 – Eerlijkere uitleg
- Moest een apparaat op een duur moment aan om op tijd klaar te zijn, dan stond er "bij de goedkoopste 96% van vandaag". Nu staat er dat het niet goedkoop is, maar wel het goedkoopste moment dat er vóór de klaar-tijd nog was.

## 0.28.0 – Per kwartier plannen, slimmere voorspelling, telefoonwidget
- Opgelost: de kwartierprijzen van morgen werden niet opgehaald (alleen die van vandaag), waardoor 's avonds niet over de nacht heen gepland kon worden.
- De auto, elektrische boilers en de batterij plannen nu per kwartier in plaats van per uur: binnen een uur verschilt de prijs per kwartier. De batterij rekent de eerste 12 uur per kwartier, daarna per uur. Warmtepompen, boilers met een temperatuur-instelling en witgoed blijven per uur of blok (niet te vaak aan en uit).
- Verbruiksvoorspelling volgt veranderingen sneller: naast het geleerde profiel tellen dezelfde dag vorige week en gisteren mee.
- Zonvoorspelling: de voorzichtige (P10) en zonnige kant (P90) worden per uur van de dag geleerd. Komt er veel zon, dan laadt de batterij 's nachts niet zo vol van het net dat die zon straks naar het net moet.
- Batterij: vul aankoopprijs en aantal cycli in, dan rekent Zonnestuur de slijtage per kWh zelf uit. In de zomer laadt hij alleen van het net als het duidelijk loont.
- Telefoonwidget: een kleine pagina (Zonnestuur → Telefoonwidget) voor op je beginscherm, en nieuwe sensoren in Home Assistant voor de widgets van de Home Assistant-app: prijs nu, beste moment, wat er hierna gebeurt, tip van vandaag.
- Geplande batterijstand als stippellijn in de prijsgrafiek.
- Contractvergelijking: per leverancier ook wat je de afgelopen 30 dagen had betaald, naast je eigen kosten.
- Leesbaarheid: grafiekkleuren minstens 3:1, dure uren ook gestreept (kleurenblind), knoppen minstens 44 px op aanraakschermen, wandscherm sterker contrast.

## 0.27.0 – Weer, kwartierprijzen en slimmer warmte en laden
- Weertip: is vandaag duidelijk zonniger dan de komende dagen, dan zegt Zonnestuur 's ochtends "doe vandaag de was, laat de auto vandaag laden" (op het dashboard, op de kaart van het apparaat en als melding). Zonder panelen: een tip als vandaag goedkoper is dan morgen.
- Weer en zon voor vandaag en de komende dagen in de planningskaart; de verwachte zon staat ook in de prijsgrafiek.
- Kwartierprijzen: de grafiek toont de prijs per kwartier en witgoed start op het goedkoopste kwartier binnen het geplande uur.
- Voorzichtiger zonvoorspelling: de garantie rekent met een slechte dag (P10) die Zonnestuur uit je eigen panelen leert, en stelt de voorspelling van vandaag bij met wat je panelen nu echt leveren.
- Auto op zon: wisselt (als je laadpaal dat kan) tussen 1 fase (vanaf ± 1,4 kW zon) en 3 fasen; kies hoeveel zon er minimaal in moet (bijv. 50% bij wisselend weer).
- Warm water en verwarming: alleen verschuiven als het prijsverschil het rendementsverlies dekt; optioneel een wekelijkse legionellaronde op het zonnigste of goedkoopste uur; optioneel 1 °C lager in de duurste uren.
- Sturingsprofiel: zelfconsumptie, prijs of netvriendelijk (niets inplannen tussen 17 en 21 uur of in dure nettarief-tijdvakken).
- Terugleverkosten per kWh, als staffel of als vast bedrag; nettarief per tijdvak (vanaf 2028) instelbaar. De planning rekent ermee.
- Wat het begrenzen van de panelen bij een negatieve prijs scheelde, telt mee in de opbrengst.
- Verslag van de laatste keer op elke apparaatkaart (kWh, aandeel zon, wat het scheelde).
- Knop "Eenvoudig": alleen wat nu belangrijk is. De stroom-animatie kan op pauze; betere leesbaarheid van grijze tekst.

## 0.26.0 – Duidelijk wat nu slim is, en wat er komt
- Bovenaan een helder oordeel in drie stappen (goed moment, neutraal, liever wachten), met icoon en tekst, en het goedkoopste blok of de volgende zon.
- Nieuwe kaart "Wat Zonnestuur de komende 24 uur doet": per apparaat en batterij wanneer, waarom en wat het ongeveer kost.
- Rustigere bediening op de apparaatkaarten: Automatisch is de standaard, ingrijpen is een tweede keuze.

## 0.25.2 – Dashboard rustig
- Opgelost: de apparaatkaarten werden elke 4 seconden opnieuw opgebouwd, met de verschijn-animatie erbij. Daardoor leek het dashboard steeds opnieuw te laden. Nu alleen bijwerken als er iets verandert, en zonder animatie.

## 0.25.1 – Geen haperingen meer, TwinDos-niveau
- Opgelost: tussen 12:00 en het verschijnen van de prijzen van morgen haalde Zonnestuur elke 10 seconden de prijzen opnieuw op. Dat liet de regeling en het dashboard haperen. Nu hoogstens eens per kwartier, en altijd op de achtergrond.
- Reageert Home Assistant even niet, dan wacht Zonnestuur niet meer per apparaat 5 seconden, maar probeert het na 30 seconden opnieuw.
- Het dashboard blijft altijd reageren: is een regelronde nog bezig, dan toont het de vorige stand. Keuzelijsten op een kaart klappen niet meer dicht tijdens het kiezen.
- Wasmachine: het niveau van de TwinDos-reservoirs op de kaart, en een waarschuwing in de 'staat klaar'-melding als er een leeg is.

## 0.25.0 – Programma kiezen in Zonnestuur
- Kies het wasprogramma op de kaart van de machine (Miele en Home Connect): Zonnestuur zet het programma op het goedkoopste moment en start hem. Alleen voor deze wasbeurt, of 'altijd dit programma'.
- Programmanamen in het Nederlands; de meldingen noemen het programma.

## 0.24.1 – Melding als de was klaarstaat
- Zet je de was- of droogmachine op 'start op afstand', dan krijg je meteen een melding hoe laat Zonnestuur hem start en wat de stroom dan kost, en een melding als hij gestart is.
- Staat start op afstand aan maar is er geen programma gekozen, dan zegt Zonnestuur dat (op de kaart en na 10 minuten met een melding).
- Aan of uit bij Instellingen → Meldingen ("Witgoed").

## 0.24.0 – Slimmer batterijladen voor elk merk, laden via elke auto
- Batterij: elk kwartier een nieuw plan over de bekende prijzen (tot 48 uur), met vasthouden, laden op vermogensstappen, verlies per richting, slijtage en schakelkosten. Laadt tot wat de dure uren nodig hebben (van het net hoogstens 95%) en doet niets als het minder dan € 0,03 oplevert.
- Batterij: laadsessie stopt bij het doel en houdt dan vast; vasthouden stopt als er zon naar het net gaat.
- Batterij: winterreserve, piekgrens (capaciteitstarief), werkdag en weekend apart geleerd, onmogelijke uitlezingen genegeerd, seintje als hij 14 dagen niet vol was.
- Batterij: veilig terug naar zijn eigen regeling bij stoppen, zonder Pro of bij een andere instelling.
- Meer batterijmerken herkend (o.a. Marstek via Modbus met RS485 en 'force mode', Huawei, SolarEdge, GoodWe, Growatt, Sungrow, Victron, Tesla), met standaardwaarden per merk. Eigen scripts voor elk ander merk.
- Auto: ruim 45 modellen, en laden via de auto zelf als de laadpaal niet te sturen is (schakelaar, laadstroom of start/stop-knoppen). De laadlimiet in de auto volgt je doel.
- Dashboard logischer: Nu, Planning (vooruit), Apparaten (bedienen, met de batterij als kaart en het logboek) en Inzicht (terugkijken). Nieuwe batterijkaart met het plan voor 24 uur.
- Wandscherm toont ook de thuisbatterij.

## 0.23.0 – Auto's koppelen en laden tot een percentage
- Auto's uit Home Assistant (bijvoorbeeld via Tibber, SEAT/Volkswagen, Stellantis, Tesla, Kia/Hyundai) koppelen aan de laadpaal, met hun accupercentage.
- Laden tot een percentage in plaats van een schatting per kilometer; tussen twee metingen schat Zonnestuur het percentage zelf bij.
- Per auto: laden tot (doel), altijd minstens (direct laden als de accu leger is), model, accu en lader in de auto.
- Meerdere auto's aan één laadpaal: Zonnestuur herkent welke eraan hangt, of je tikt hem aan.
- Nu vol laden met één tik, en een maximumprijs per kWh.
- Plan en kosten van het laden, vergeleken met meteen laden. Past het niet meer vóór de vertrektijd, dan zegt Zonnestuur hoeveel procent het wél wordt.
- Laadvermogen per auto: een auto die op één of twee fasen laadt krijgt de juiste stroom.
- Waarschuwing als het percentage van een auto oud is of de auto geen verbinding heeft.
- Herkennen van apparaten werkte niet als er ook een thuisbatterij gevonden werd. Opgelost.

## 0.22.0 – Auto laden en nieuw wandscherm
- Auto laden in twee tikken: Zonnestuur vindt je laadpaal en auto in Home Assistant, herkent 1 of 3 fasen en vraagt alleen hoe laat hij vol moet zijn en hoeveel je rijdt.
- Vertrektijd en klaar-tijd met − en + direct op de apparaatkaart.
- Nieuw wandscherm: de stroomklok met de prijs (of zon) van de komende 24 uur, het advies van nu, bediening per apparaat en instellingen per scherm (dag/nacht, dimmen, welke apparaten).
- Zonder zonnepanelen geeft het 'goed moment' de goedkope uren aan.
- Waarschuwing als 'zonnepanelen' aan staat terwijl je nooit teruglevert.
- Verbruik van een warmtepomp meten via zijn aan/uit-sensor als er geen vermogensmeting is.

## 0.21.0 – Laten zien wat het doet en oplevert
- Logboek: bij elke schakeling waarom, en achteraf wat het gebruikte, hoeveel uit eigen zon en wat het opleverde. Ook op elke apparaatkaart.
- Betrouwbaarheid: controle of schakelen echt lukte (met één nieuwe poging), live/lokaal-status en een melding als het misgaat.
- Tarieven 2027: vaste kosten, netbeheer en belastingvermindering, voor een geschatte rekening die klopt met je factuur. Terugleverkosten 2027 bijgewerkt.
- Eerlijkere besparing: bij een dynamisch contract vergeleken met de gemiddelde prijs van de dag. Uitleg onder "Zo rekenen we".
- Meldingen ook zonder Home Assistant (ntfy, Telegram, e-mail), met vaste regels: storingen direct, kansen hoogstens één per dag, rust 's nachts.
- Weekrapport op zondag, ook als pagina.
- Eigen doel in de Zonnecoach, gerekend als "beter dan zonder Zonnestuur", en een korte kennismaking.
- Ingrijpen met één tik: nu aan of vandaag overslaan, zichtbaar in de planning. Per apparaat "nooit vóór" een tijd.
- Meetdagen zonder sturing, met export van de meetgegevens.
- Traploze vermogensregelaar via Home Assistant (boiler volgt precies het overschot).
- Wandscherm met stoplicht "goed moment nu", en sensoren in Home Assistant.
- Zonnecoach: eerst tips om iets te koppelen, de thuisbatterij pas als de goedkopere stappen gezet zijn.
- Contractcheck 2027: welk contract met jouw verbruik het goedkoopst is.
- Plan naast werkelijk in de grafiek van vandaag.

## 0.20.1
- Welkomstscherm van de koppel-assistent noemt ook de P1-kabel van de Zonnestuur Box.

## 0.20.0 – Zonnestuur Box
- Kant-en-klaar SD-kaartbeeld voor de Zonnestuur Box, gebouwd door GitHub Actions.
- Wifi instellen zonder kabel: de Box maakt zelf de wifi "Zonnestuur-instellen" met een instelpagina.
- Automatische updates op de Box, met controle en terugval naar de vorige versie.
- Warmwater-vangnet: een script op de Shelly verwarmt de boiler zelf als de Box een paar uur stil is (ook voor de add-on).

## 0.19.0 – P1-kabel
- Slimme meter rechtstreeks uitlezen via een P1-kabel (USB), zonder HomeWizard of andere dongel. De koppel-assistent vindt de kabel zelf.

## 0.18.0 – Overzichtelijker dashboard
- Indeling in Nu, Planning, Apparaten en Inzicht, met een vaste navigatiebalk bovenaan.
- Nieuwe kaart "Wat Zonnestuur je oplevert": deze maand, vandaag, dit jaar en sinds de start, inclusief de thuisbatterij, met de opbrengst per dag.
- Dubbele adviezen samengevoegd in de Zonnecoach; op de telefoon staat de opbrengst direct onder 'Nu'.

## 0.17.0 – Koppelen met (bijna) alles
- MQTT: Zigbee2MQTT-stekkers, Tasmota, Shelly en eigen topics; als add-on automatisch de Mosquitto-broker van Home Assistant.
- Homey Pro: meter, schakelaars en thermostaten.
- Meters: YouLess, DSMR-reader, ESPHome (SlimmeLezer), MQTT en Homey.
- SG-ready warmtepompen via twee relais.
- Laadpalen via OCPP 1.6J (Alfen, Peblar, Wallbox en andere): traploos laden zonder Home Assistant.

## 0.16.0 – Zonnecoach
- Nieuw kerncijfer: hoeveel van je zonnestroom je zelf gebruikt (vandaag en deze week), plus hoeveel van je verbruik uit eigen zon komt.
- Zonnecoach op het dashboard: je score met de laatste 14 dagen, het zonnevenster van vandaag of morgen, en persoonlijke tips met stappen en wat ze per jaar opleveren.
- Zonder zonnepanelen: welk deel van je stroom je in goedkope uren gebruikt, met tips.
- Ochtendmelding op zonnige dagen: "Tussen 11:00 en 15:00 ± 9 kWh over" (met meldingen aan).

## 0.15.0 – Zelflerend
- Zonnestuur leert je huis kennen: eigen verbruik per uur (werkdag en weekend apart, zonder de gestuurde apparaten en de batterij), sluipverbruik en piekmomenten.
- Leert per apparaat hoe lang het echt nodig heeft en plant daarmee (uit te zetten per apparaat).
- Met een opwek-sensor stelt Zonnestuur de zonvoorspelling bij voor jouw dak.
- Zon-, prijs- en batterijplanning rekenen met het geleerde huis in plaats van vaste aannames.
- Nieuwe kaart "Wat Zonnestuur over je huis weet".
- Alles per apparaat in te stellen: meerdere klaar-tijden, weekdagen, garantie, looptijd, drempels en tijden.
- Mooier op grote schermen.

## 0.14.1
- Dashboard terug naar het vertrouwde ontwerp van 0.13.
- Klaar-tijden kunnen nu per weekdag gelden (bijvoorbeeld alleen op werkdagen).

## 0.13.0 – Zonnestuur Pro
- 30 dagen alles proberen; daarna Zonnestuur Basis (gratis) of Pro (€ 49 per jaar). Zie PRO.md.
- Licentiesleutel activeren onder Instellingen → Zonnestuur Pro. Controle gebeurt lokaal, zonder account of internet.

## 0.12.0 – Thuisbatterij en nieuw dashboard
- **Thuisbatterij sturen**: HomeWizard Plug-In Battery, Zendure, Marstek, Sessy, Victron en andere batterijen in Home Assistant. Zonnestuur plant elk uur wanneer de batterij zelf gebruikt, spaart voor de dure uren of goedkoop laadt, op basis van je eigen verbruik, de zonvoorspelling en de uurprijzen. Zon-overschot gaat eerst naar je apparaten.
- **Nieuw dashboard**: in één zin wat er nu gebeurt, live energiestroom met batterij, en een dagplanning per apparaat en batterij onder de prijsgrafiek.
- Zonder zonnepanelen kloppen alle teksten; lege grafieken tonen uitleg; storingen in gewone taal en alleen zolang ze spelen.

## 0.11.1
- Teruglevering-kaart toont zonder teruglevering je afname per uur en gemiddelde prijs.

## 0.11.0 – Minder terugleveren
- Nieuwe dashboardkaart **Teruglevering**: hoeveel en op welke uren je teruglevert, wat dat per jaar kost, persoonlijk advies en een batterijsimulatie op je eigen uurdata.
- Haalt bij de eerste start het afgelopen jaar op uit de statistieken van Home Assistant.
- Alle apparaten plannen samen: niet meer twee apparaten op hetzelfde zonne-overschot.
- Omvormer begrenzen als terugleveren geld kost (negatieve prijs); weggeknepen zon gaat eerst naar je apparaten.
- Meldingen op je telefoon: veel teruglevering terwijl alles al draait, negatieve prijzen morgen, apparaat reageert niet.

## 0.10.0
- Prijsgrafiek per uur (dynamisch) of je vaste tarieven, en je verbruik per dag, week, maand en jaar.
