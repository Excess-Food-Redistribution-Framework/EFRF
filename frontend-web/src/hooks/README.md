API volania ovplyvňujú stav aplikácie a súvisia s riadením stavu
API znovupoužité v rôznych častiach aplikácie
API volania, ktoré vyžadujú komplexnú logiku ako transformáciu dát a pod.
Custom hooks na správu lokálneho stavu v komponentoch, ktoré nevyžadujú globálnu správu stavu pomocou kontextu alebo Reduxu.
Custom hooks pre správu stavu a funkcionality formulárov.
Custom hooks na správu navigácie v aplikácii.
Custom hooks pre správu reakcií na rôzne udalosti v aplikácii, ako sú kliknutia, klávesové stlačenia alebo scrollovania.
Custom hooks môžu byť použité na optimalizáciu výkonu komponentov, napríklad na správu memorizácie a cache dát
Custom hook useAuth by mohol využívať kontext z AuthContext.js, aby zdieľal autentifikačné údaje s ostatnými časťami aplikácie.

# Napríklad tento useHelloWorldAPI hook to nebude, pretože je jednoduchý a používa sa len v jednom súbore nikde inde sa používať nebude. Je tu však len ako ukážka.
