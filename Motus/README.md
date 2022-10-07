# Motus 



```mermaid
sequenceDiagram
    Client ->>+ Authentification: Credentials (Login / Password)    
    Authentification ->>+ Client: Token
    Client ->>+ Back End: API Request
    Client ->>+ Back End: word
```


## Score Management


    which server are you gone use ?
    which port are you gone use ?
    which API are you gone call ? which parameters ?
    Can we handle more than one user ?
    What data do we want to store ?


### Fichier Score
Les **scores** sont stockés dans un fichier JSON comprenant différentes information qui sont visibles sur le Diagramme d'Etat ci-dessous:  

```mermaid
    graph TD
        A[Fichier JSON - ''Score''] 
        A -->|Contient un Dict| B(Utilisateur X)
        
            B -->|Inclut un Dict| B1(Mot XX)
            B -->|Inclut un Dict| B2(Mot XY)
            B -->|Inclut un Dict| B3(...)
                B1 -->|Comporte un Dict| B11(Score / Nombre de Tentatives)
        A -->|Contient un Dict| C(Utilisateur Y)
        A -->|Contient un Dict| D(...)


        style A color:black, fill:#CDEDDA, stroke:#333,stroke-width:2px
        style B color:black, fill:#CDEDDA, stroke:#333,stroke-width:2px
        style B1 color:black, fill:#CDEDDA, stroke:#333,stroke-width:2px
        style B2 color:black, fill:#CDEDDA, stroke:#333,stroke-width:2px
        style B3 color:black, fill:#CDEDDA, stroke:#333,stroke-width:2px
        style B11 color:black, fill:#CDEDDA, stroke:#333,stroke-width:2px
        style C color:black, fill:#CDEDDA, stroke:#333,stroke-width:2px
        style D color:black, fill:#CDEDDA, stroke:#333,stroke-width:2px

```

Dans la figure ci-dessus, nous pouvons observer la configuration du fichier JSON étant composé de nested dictionnaires sur 3 niveaux avec:
-   Le niveau 1 étant le dictionnaire (JSON) avec comme clés tous les utilisateurs.
-   Le niveau 2 étant le dictionnaire d'utilisateur avec comme clés tous les mots dont l'utilisateur à essayer de deviner. 
-   Le niveau 3 étant le dictionnaire des informations avec deux clés qui sont le score et le nombre de tentatives.

---
Une amélioration serait de permettre à ce que l'utilisateur soit directement lié au Nom d'Utilisateur et Mot de Passe.
---

### API and Parameters

De multiples API peuvent être utilisé afin 

